import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Calendar, MapPin, Users, Monitor } from 'lucide-react';

interface EventosProps {
  onNavigate: (page: string, eventId?: string) => void;
}

export function Eventos({ onNavigate }: EventosProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'finished'>('all');

  // IDs alinhados ao seed do Supabase (002_schema) para Fila/Painel funcionarem
  const EVENT_ID_TARDEZINHA = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
  const EVENT_ID_NATAL = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
  const EVENT_ID_INAUGURAL = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  const events = [
    {
      id: EVENT_ID_TARDEZINHA,
      title: "Tardezinha Traldi's Hoops",
      date: '07/02/2026',
      time: '15:30',
      location: 'Rua Icatú, 951 - Parque Industrial',
      city: 'São José dos Campos - SP',
      status: 'active' as const,
      spotsLeft: 40
    },
    {
      id: EVENT_ID_NATAL,
      title: "Traldi's Hoops Especial Natal",
      date: '21/12/2025',
      time: '09:30',
      location: 'Rua Icatú, 951 - Parque Industrial',
      city: 'São José dos Campos - SP',
      status: 'finished' as const,
      spotsLeft: 0
    },
    {
      id: EVENT_ID_INAUGURAL,
      title: "Traldi's Hoops - Inaugural",
      date: '16/11/2025',
      time: '09:30',
      location: 'Rua dos Amores Perfeitos, 93',
      city: 'São José dos Campos - SP',
      status: 'finished' as const,
      spotsLeft: 0
    }
  ];

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-white mb-4">Eventos</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Todos os eventos Traldi's Hoops. Entre na fila dos eventos ativos.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            onClick={() => setFilter('active')}
          >
            Ativos
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'primary' : 'secondary'}
            onClick={() => setFilter('upcoming')}
          >
            Próximos
          </Button>
          <Button
            variant={filter === 'finished' ? 'primary' : 'secondary'}
            onClick={() => setFilter('finished')}
          >
            Encerrados
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id}
              variant={event.status === 'active' ? 'hover' : 'default'}
              className="p-6"
              onClick={event.status !== 'finished' ? () => onNavigate('evento', event.id) : undefined}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-white flex-1">{event.title}</h4>
                  {event.status === 'active' && (
                    <Badge variant="playing">Ao vivo</Badge>
                  )}
                  {event.status === 'upcoming' && (
                    <Badge variant="waiting">Em breve</Badge>
                  )}
                  {event.status === 'finished' && (
                    <Badge variant="solo">Encerrado</Badge>
                  )}
                </div>

                {/* Event Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{event.date} • {event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{event.location}, {event.city}</span>
                  </div>

                  {event.status === 'active' && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{event.spotsLeft} vagas</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t-2 border-gray-800 space-y-2">
                  {event.status === 'active' && (
                    <>
                      <Button 
                        variant="accent" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('evento', event.id);
                        }}
                      >
                        Entrar na fila
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('painel-tv', event.id);
                        }}
                      >
                        <Monitor className="w-4 h-4" />
                        Ver Painel TV
                      </Button>
                    </>
                  )}
                  
                  {event.status === 'upcoming' && (
                    <p className="text-gray-500 text-sm text-center py-2">
                      Check-in abre no dia do evento
                    </p>
                  )}
                  
                  {event.status === 'finished' && (
                    <p className="text-gray-600 text-sm text-center py-2">
                      Evento encerrado
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum evento encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}