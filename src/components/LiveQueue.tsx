import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Activity, Users, Trophy, Clock } from 'lucide-react';

interface Team {
  name: string;
  players: number;
}

interface Match {
  teamA: Team;
  teamB: Team;
}

export function LiveQueue() {
  const [currentMatch, setCurrentMatch] = useState<Match>({
    teamA: { name: 'Time Relâmpago', players: 5 },
    teamB: { name: 'Time Thunder', players: 5 }
  });

  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([
    {
      teamA: { name: 'Time Street Ballers', players: 5 },
      teamB: { name: 'Time Warriors', players: 5 }
    },
    {
      teamA: { name: 'Time Rucker Park', players: 5 },
      teamB: { name: 'Time Legacy', players: 5 }
    },
    {
      teamA: { name: 'Time Concrete', players: 5 },
      teamB: { name: 'Time Hustle', players: 5 }
    },
    {
      teamA: { name: 'Time Downtown', players: 5 },
      teamB: { name: 'Time Grind', players: 5 }
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simular atualização em tempo real (a cada 30 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular mudança de jogo (15% de chance a cada 30s)
      if (Math.random() < 0.15) {
        // Move o jogo atual para o final da fila
        const nextMatch = upcomingMatches[0];
        const remainingMatches = upcomingMatches.slice(1);
        
        setCurrentMatch(nextMatch);
        setUpcomingMatches([...remainingMatches, currentMatch]);
        setLastUpdate(new Date());
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [currentMatch, upcomingMatches]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header com status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white mb-2">Fila em tempo real</h3>
          <p className="text-gray-400">Ordem justa. Sem furo de fila.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-2 border-green-500 rounded-lg">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <span className="text-green-500 font-semibold text-sm">Fila ativa</span>
        </div>
      </div>

      {/* Jogando agora */}
      <Card className="p-6 border-white">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-white" />
          <h4 className="text-white">JOGANDO AGORA</h4>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <div className="text-white font-black text-xl mb-1">{currentMatch.teamA.name}</div>
              <div className="text-gray-400 text-sm">{currentMatch.teamA.players} jogadores</div>
            </div>
            
            <div className="text-white text-2xl font-black px-4">VS</div>
            
            <div className="flex-1 text-center">
              <div className="text-white font-black text-xl mb-1">{currentMatch.teamB.name}</div>
              <div className="text-gray-400 text-sm">{currentMatch.teamB.players} jogadores</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Próximos na fila */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-white" />
          <h4 className="text-white">PRÓXIMOS NA FILA</h4>
        </div>
        
        <div className="space-y-3">
          {upcomingMatches.map((match, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 transition-all hover:bg-gray-700"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-lg flex-shrink-0">
                <span className="text-white font-black">{index + 1}</span>
              </div>
              
              <div className="flex-1 flex items-center justify-between gap-2 text-sm">
                <span className="text-white font-semibold">{match.teamA.name}</span>
                <span className="text-gray-500">vs</span>
                <span className="text-white font-semibold">{match.teamB.name}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Última atualização */}
      <div className="text-center text-gray-500 text-sm">
        Última atualização: {formatTime(lastUpdate)}
      </div>
    </div>
  );
}