/**
 * Mock client para Fila ao Vivo (demonstração sem Supabase).
 * Em produção, substituir por subscription real do Supabase.
 */

export interface QueueTeam {
  id: string;
  name: string;
  players: Array<{ name: string }>;
  type?: 'pronto' | 'aleatorio';
}

export interface QueueState {
  agora: {
    teamA: QueueTeam | null;
    teamB: QueueTeam | null;
    startedAt?: string;
  };
  proximos: QueueTeam[];
  totalTeams: number;
}

type EventType =
  | 'connection_status'
  | 'queue_updated'
  | 'team_joined'
  | 'game_started'
  | 'game_ended';

type EventCallback = (event: { type: EventType; payload: unknown }) => void;

const initialQueueState: QueueState = {
  agora: {
    teamA: {
      id: 'team-1',
      name: 'Time Relâmpago',
      players: Array.from({ length: 5 }, (_, i) => ({ name: `Jogador ${i + 1}` })),
      type: 'pronto',
    },
    teamB: {
      id: 'team-2',
      name: 'Time Thunder',
      players: Array.from({ length: 5 }, (_, i) => ({ name: `Jogador ${i + 1}` })),
      type: 'pronto',
    },
    startedAt: new Date().toISOString(),
  },
  proximos: [
    { id: 'team-3', name: 'Time Street Ballers', players: Array(5).fill({ name: '-' }), type: 'pronto' },
    { id: 'team-4', name: 'Time Warriors', players: Array(5).fill({ name: '-' }), type: 'pronto' },
    { id: 'team-5', name: 'Time Aleatório 1', players: Array(5).fill({ name: '-' }), type: 'aleatorio' },
  ],
  totalTeams: 5,
};

export function getMockRealtimeClient() {
  const listeners: EventCallback[] = [];
  let state: QueueState = JSON.parse(JSON.stringify(initialQueueState));
  let connected = false;

  const emit = (type: EventType, payload: unknown) => {
    listeners.forEach((cb) => cb({ type, payload }));
  };

  return {
    on(_channel: 'all', callback: EventCallback) {
      listeners.push(callback);
    },

    connect() {
      setTimeout(() => {
        connected = true;
        emit('connection_status', { status: 'connected' });
        emit('queue_updated', state);
      }, 500);
    },

    disconnect() {
      connected = false;
      emit('connection_status', { status: 'disconnected' });
    },

    getQueueState(): QueueState {
      return JSON.parse(JSON.stringify(state));
    },

    triggerGameEnd() {
      const winner = state.agora.teamA ?? state.agora.teamB;
      if (winner) {
        emit('game_ended', { winner });
      }
      // Simula próximo jogo
      const [nextA, nextB, ...rest] = state.proximos;
      if (nextA && nextB) {
        state = {
          ...state,
          agora: {
            teamA: nextA,
            teamB: nextB,
            startedAt: new Date().toISOString(),
          },
          proximos: [...rest, state.agora.teamA!, state.agora.teamB!].filter(Boolean),
          totalTeams: state.totalTeams,
        };
        emit('queue_updated', state);
        emit('game_started', { agora: state.agora });
      }
    },
  };
}
