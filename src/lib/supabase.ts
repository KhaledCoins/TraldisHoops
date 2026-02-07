import { createClient } from '@supabase/supabase-js';

// Verificar se as variáveis de ambiente estão definidas
const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || '';
  }
  // Fallback para process.env (caso esteja rodando em Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Criar cliente apenas se as credenciais estiverem disponíveis
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// TIPOS DO BANCO DE DADOS
// ==========================================

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  status: 'upcoming' | 'active' | 'paused' | 'finished';
  is_paused: boolean;
  max_players: number;
  created_at?: string;
  updated_at?: string;
}

export interface QueuePlayer {
  id: string;
  event_id: string;
  name: string;
  phone: string;
  instagram?: string;
  player_type: 'solo' | 'team';
  team_id?: string;
  status: 'waiting' | 'playing' | 'played';
  position?: number;
  checked_in_at: string;
  created_at: string;
}

export interface Team {
  id: string;
  event_id: string;
  name: string;
  type: 'team' | 'random';
  status: 'waiting' | 'playing' | 'played';
  position?: number;
  created_at: string;
}

export interface Match {
  id: string;
  event_id: string;
  team_a_id: string;
  team_b_id: string;
  status: 'in_progress' | 'finished';
  started_at: string;
  finished_at?: string;
  created_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
  read?: boolean;
}

// Helper para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// ==========================================
// FUNÇÕES HELPER PARA O BANCO
// ==========================================

// Buscar evento por ID
export const getEvent = async (eventId: string): Promise<Event | null> => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  if (error) {
    console.error('Erro ao buscar evento:', error);
    return null;
  }
  
  return data;
};

// Atualizar status do evento
export const updateEventStatus = async (
  eventId: string, 
  status: Event['status'],
  isPaused?: boolean
): Promise<boolean> => {
  if (!supabase) return false;
  
  const updateData: any = { status, updated_at: new Date().toISOString() };
  if (isPaused !== undefined) {
    updateData.is_paused = isPaused;
  }
  
  const { error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', eventId);
  
  if (error) {
    console.error('Erro ao atualizar evento:', error);
    return false;
  }
  
  return true;
};

// Buscar fila de jogadores avulsos
export const getSoloQueue = async (eventId: string): Promise<QueuePlayer[]> => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('queue_players')
    .select('*')
    .eq('event_id', eventId)
    .eq('player_type', 'solo')
    .eq('status', 'waiting')
    .is('team_id', null)
    .order('checked_in_at', { ascending: true });
  
  if (error) {
    console.error('Erro ao buscar fila de avulsos:', error);
    return [];
  }
  
  return data || [];
};

// Buscar fila de times
export const getTeamsQueue = async (eventId: string): Promise<Team[]> => {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('event_id', eventId)
    .in('status', ['waiting', 'playing'])
    .order('position', { ascending: true });
  
  if (error) {
    console.error('Erro ao buscar fila de times:', error);
    return [];
  }
  
  return data || [];
};

// Buscar partida em andamento
export const getCurrentMatch = async (eventId: string): Promise<Match | null> => {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('event_id', eventId)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
    console.error('Erro ao buscar partida atual:', error);
    return null;
  }
  
  return data;
};

// Subscribe para mudanças em tempo real
export const subscribeToQueue = (
  eventId: string,
  onUpdate: () => void
) => {
  if (!supabase) return () => {};
  
  const channel = supabase
    .channel(`queue-${eventId}`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'queue_players',
        filter: `event_id=eq.${eventId}`
      },
      () => {
        onUpdate();
      }
    )
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'teams',
        filter: `event_id=eq.${eventId}`
      },
      () => {
        onUpdate();
      }
    )
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'matches',
        filter: `event_id=eq.${eventId}`
      },
      () => {
        onUpdate();
      }
    )
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'events',
        filter: `id=eq.${eventId}`
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();
  
  // Retornar função de unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
};
