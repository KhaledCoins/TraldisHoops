import React, { useState, useEffect } from 'react';
import { Activity, Users, Trophy, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { useQueue } from '../hooks/useQueue';
import { getActiveEvent } from '../lib/supabase';
import { Button } from '../components/Button';

interface FilaAoVivoAnimatedProps {
  eventId?: string;
  onNavigate: (page: string, eventId?: string) => void;
}

export function FilaAoVivoAnimated({ eventId: eventIdProp, onNavigate }: FilaAoVivoAnimatedProps) {
  const [resolvedEventId, setResolvedEventId] = useState<string | null>(eventIdProp || null);
  const [noActiveEvent, setNoActiveEvent] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDebug, setShowDebug] = useState(false);

  // Resolver eventId: prop ou evento ativo do Supabase
  useEffect(() => {
    if (eventIdProp) {
      setResolvedEventId(eventIdProp);
      setNoActiveEvent(false);
      return;
    }
    let cancelled = false;
    getActiveEvent().then((event) => {
      if (cancelled) return;
      if (event) {
        setResolvedEventId(event.id);
        setNoActiveEvent(false);
      } else {
        setResolvedEventId(null);
        setNoActiveEvent(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [eventIdProp]);

  const { event, soloQueue, teamsQueue, currentMatch, loading, error, refresh } = useQueue(resolvedEventId || '');

  // Atualizar lastUpdate quando os dados mudarem (realtime)
  useEffect(() => {
    if (resolvedEventId && (teamsQueue.length > 0 || currentMatch)) {
      setLastUpdate(new Date());
    }
  }, [resolvedEventId, teamsQueue.length, currentMatch?.id]);

  // Tempo decorrido do jogo atual
  useEffect(() => {
    if (!currentMatch?.started_at) {
      setElapsedTime(0);
      return;
    }
    const interval = setInterval(() => {
      const start = new Date(currentMatch.started_at).getTime();
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentMatch?.id, currentMatch?.started_at]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playingTeams = teamsQueue.filter((t) => t.status === 'playing');
  const waitingTeams = teamsQueue.filter((t) => t.status === 'waiting').sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const teamA = currentMatch ? teamsQueue.find((t) => t.id === currentMatch.team_a_id) : null;
  const teamB = currentMatch ? teamsQueue.find((t) => t.id === currentMatch.team_b_id) : null;

  // Sem evento definido: carregando ou nenhum ativo
  if (!resolvedEventId) {
    if (!noActiveEvent) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Carregando evento...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Nenhum evento com fila ativa</h2>
          <p className="text-gray-400 mb-6">
            Quando o admin ativar a fila de um evento, a fila ao vivo aparecerá aqui. Escaneie o QR Code no evento para entrar na fila.
          </p>
          <Button variant="primary" onClick={() => onNavigate('eventos')}>
            Ver eventos
          </Button>
        </div>
      </div>
    );
  }

  // Loading do useQueue
  if (loading && teamsQueue.length === 0 && !currentMatch) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando fila...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">Erro ao carregar a fila</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <Button variant="secondary" onClick={refresh}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 md:py-12">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-8 h-8 text-green-500" />
            <h1 className="text-white">Fila ao Vivo</h1>
          </div>
          <p className="text-gray-400 text-lg md:text-xl mb-2">
            {event?.title}
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border-2 border-green-500 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-green-500 font-semibold">
              Ao vivo • Atualização automática
            </span>
          </div>
        </div>

        {/* Jogando agora - só quando há partida em andamento */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-7 h-7 text-white" />
            <h2 className="text-white">JOGANDO AGORA</h2>
          </div>

          {teamA && teamB ? (
            <div className="card p-6 md:p-10 border-white bg-gradient-to-br from-gray-900 to-black">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-lg">
                  Tempo: <span className="text-white font-semibold">{formatElapsedTime(elapsedTime)}</span>
                </span>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 md:p-8 border-2 border-gray-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center w-full">
                    <div className="text-white font-black text-2xl md:text-4xl mb-2 leading-tight">
                      {teamA.name}
                    </div>
                    <div className="text-gray-400 text-lg">
                      {teamA.type === 'random' ? 'Time aleatório' : 'Time pronto'}
                    </div>
                  </div>
                  <div
                    className="flex-shrink-0 text-white font-black text-3xl md:text-5xl px-6 py-3 bg-gray-700 rounded-lg"
                    style={{ fontFamily: 'Impact, "Arial Black", sans-serif', letterSpacing: '0.1em' }}
                  >
                    VS
                  </div>
                  <div className="flex-1 text-center w-full">
                    <div className="text-white font-black text-2xl md:text-4xl mb-2 leading-tight">
                      {teamB.name}
                    </div>
                    <div className="text-gray-400 text-lg">
                      {teamB.type === 'random' ? 'Time aleatório' : 'Time pronto'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 md:p-8 bg-gray-900 border-2 border-gray-800 rounded-xl text-center">
              <p className="text-gray-400">
                {waitingTeams.length >= 2
                  ? 'Aguardando o admin iniciar a partida.'
                  : 'Aguardando times na fila. Faça seu check-in pelo QR Code no evento.'}
              </p>
            </div>
          )}
        </div>

        {/* Próximos na fila - apenas times reais cadastrados */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-white" />
            <h3 className="text-white">PRÓXIMOS NA FILA</h3>
            <span className="text-gray-500 text-sm">
              ({waitingTeams.length} {waitingTeams.length === 1 ? 'time' : 'times'} aguardando)
            </span>
          </div>

          {waitingTeams.length === 0 ? (
            <div className="card p-8 border-2 border-gray-800 rounded-xl text-center">
              <p className="text-gray-400">
                Nenhum time na fila ainda. Os times aparecem aqui conforme forem se cadastrando (check-in no evento).
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {waitingTeams.map((team, index) => (
                <div
                  key={team.id}
                  className={`card p-4 md:p-6 hover:border-white transition-colors ${
                    index === 0 ? 'border-gray-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gray-700 rounded-lg flex-shrink-0">
                      <span className="text-white font-black text-xl md:text-2xl">
                        {team.position ?? index + 1}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <span className="text-white font-semibold text-lg md:text-xl">
                          {team.name}
                        </span>
                        {team.type === 'random' && (
                          <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500 rounded text-yellow-500 text-xs font-semibold">
                            Aleatório
                          </span>
                        )}
                      </div>
                      {index === 0 && (
                        <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500 rounded text-yellow-500 text-sm font-semibold">
                          Próximo jogo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avulsos formando time */}
        {soloQueue.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white mb-3">Formando time ({soloQueue.length}/5 avulsos)</h3>
            <div className="card p-4 border-gray-800">
              <p className="text-gray-400 text-sm">
                Quando completar 5 avulsos, um novo time aleatório entra na fila automaticamente.
              </p>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="card p-6 bg-gray-900/50 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <p className="mb-2">
                <strong className="text-white">Ordem justa. Sem furo de fila.</strong>
              </p>
              <p>
                Após jogar, o time volta para o final da fila. A ordem é controlada pelo sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mb-6">
          Última atualização: {formatTime(lastUpdate)}
        </div>

        {/* Debug (opcional) */}
        <div>
          <button
            type="button"
            onClick={() => setShowDebug(!showDebug)}
            className="w-full p-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-left hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="text-white font-semibold">Status</span>
                <span className="text-xs text-gray-500">(Clique para {showDebug ? 'ocultar' : 'mostrar'})</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${showDebug ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {showDebug && (
            <div className="mt-4 card p-4 bg-gray-950">
              <h4 className="text-white font-semibold mb-3">Monitoramento</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Evento:</span>
                  <span className="text-white">{event?.title ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Times na fila:</span>
                  <span className="text-white">{teamsQueue.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Aguardando:</span>
                  <span className="text-white">{waitingTeams.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avulsos:</span>
                  <span className="text-white">{soloQueue.length}</span>
                </div>
                <Button variant="ghost" onClick={refresh} className="mt-2 text-sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
