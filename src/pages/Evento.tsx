import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { LiveQueue } from '../components/LiveQueue';
import { Calendar, MapPin, Users, Clock, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import eventImage from 'figma:asset/a23cc00b238b423d14e83ad1b9b9728017127f40.png';

interface EventoProps {
  eventId: string;
  onNavigate: (page: string, eventId?: string) => void;
}

export function Evento({ eventId, onNavigate }: EventoProps) {
  const EVENT_ID_TARDEZINHA = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
  const EVENT_ID_NATAL = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
  const EVENT_ID_INAUGURAL = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  const eventsDatabase: Record<string, any> = {
    [EVENT_ID_TARDEZINHA]: {
      id: EVENT_ID_TARDEZINHA,
      title: "Tardezinha Traldi's Hoops",
      date: "Sábado, 7 Fev • 15:30",
      dateFormatted: "07/02/2026",
      time: "15:30",
      location: "Rua Icatú, 951",
      address: "Rua Icatú, 951 - Parque Industrial, São José dos Campos - SP",
      playersInQueue: 0,
      status: 'active',
      description: 'Basquete 5x5 com fila digital. Tardezinha especial com muito streetball e diversão. Sistema transparente sem furo de fila.',
      image: eventImage,
      rules: [
        'Check-in abre às 15:00 no dia do evento',
        'Traga documento com foto',
        'Use o QR Code para acessar a fila digital',
        'Respeite a ordem da fila - sistema automático',
        'Após jogar, você volta para o final da fila',
        'Evento sujeito a condições climáticas'
      ]
    },
    [EVENT_ID_INAUGURAL]: {
      id: EVENT_ID_INAUGURAL,
      title: "Traldi's Hoops - Inaugural",
      date: "Sábado, 16 Nov • 09:30",
      dateFormatted: "16/11/2025",
      time: "09:30",
      location: "Quadra do Grêmio",
      address: "Rua dos Amores Perfeitos, 93 - São José dos Campos - SP",
      playersInQueue: 0,
      status: 'finished',
      description: 'Primeira edição do Traldi\'s Hoops. Evento inaugural de basquete 5x5 com fila digital.',
      rules: []
    },
    [EVENT_ID_NATAL]: {
      id: EVENT_ID_NATAL,
      title: "Traldi's Hoops Especial Natal",
      date: "Sábado, 21 Dez • 09:30",
      dateFormatted: "21/12/2025",
      time: "09:30",
      location: "Quadra do 31 de Março",
      address: "Rua Icatú, 951 - Parque Industrial, São José dos Campos - SP",
      playersInQueue: 0,
      status: 'finished',
      description: 'Edição especial de Natal com muito basquete e confraternização.',
      rules: []
    }
  };

  const event = eventsDatabase[eventId] || eventsDatabase[EVENT_ID_TARDEZINHA];

  const features = [
    {
      icon: Users,
      title: 'Fila digital',
      description: 'Sistema em tempo real, todos veem a ordem'
    },
    {
      icon: Clock,
      title: 'Sem espera perdida',
      description: 'Acompanhe de qualquer lugar e chegue na hora'
    },
    {
      icon: CheckCircle2,
      title: 'Zero furo de fila',
      description: 'Ordem garantida por sistema automático'
    }
  ];

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container-narrow">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('eventos')}
          className="mb-8"
        >
          ← Voltar para eventos
        </Button>

        {/* Event Header */}
        <div className="text-center mb-12">
          <h1 className="text-white mb-6">{event.title}</h1>
          
          {/* Event Image */}
          {event.image && (
            <div className="mb-8 rounded-lg overflow-hidden max-w-3xl mx-auto">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="flex flex-col gap-3 items-center mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">{event.date}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-5 h-5" />
              <div className="text-center">
                <div className="text-lg font-semibold">{event.location}</div>
                <div className="text-sm text-gray-500">{event.address}</div>
              </div>
            </div>

            {event.status === 'active' && (
              <div className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5" />
                <span className="text-lg font-bold">{event.playersInQueue} na fila agora</span>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {event.description}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 text-center">
                <Icon className="w-8 h-8 text-white mx-auto mb-3" />
                <h5 className="text-white mb-2">{feature.title}</h5>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Event Details Card */}
        <Card className="p-8 mb-8">
          <h3 className="text-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Informações do Evento
          </h3>
          
          <div className="space-y-4 text-gray-400">
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="font-semibold">Data:</span>
              <span className="text-white">{event.dateFormatted}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="font-semibold">Horário de Início:</span>
              <span className="text-white">{event.time}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="font-semibold">Local:</span>
              <span className="text-white text-right">{event.location}</span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="font-semibold">Status:</span>
              <span className={`font-bold ${
                event.status === 'active' ? 'text-green-500' :
                event.status === 'upcoming' ? 'text-yellow-500' :
                'text-gray-500'
              }`}>
                {event.status === 'active' ? '🟢 Ao vivo' :
                 event.status === 'upcoming' ? '🟡 Em breve' :
                 '⚪ Encerrado'}
              </span>
            </div>
          </div>
        </Card>

        {/* Rules */}
        {event.rules && event.rules.length > 0 && (
          <Card className="p-8 mb-8 bg-gray-900/50">
            <h3 className="text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Regras e Orientações
            </h3>
            
            <ul className="space-y-3">
              {event.rules.map((rule: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* CTA Section */}
        <div className="text-center">
          {event.status === 'active' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Button 
                  variant="accent" 
                  className="w-full md:w-auto text-lg px-12 py-4"
                  onClick={() => onNavigate('fila', event.id)}
                >
                  Entrar na fila agora
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full md:w-auto text-lg px-8 py-4"
                  onClick={() => onNavigate('painel-admin', event.id)}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Painel Admin
                </Button>
              </div>
              <p className="text-gray-500 text-sm">
                Sistema de check-in digital sem furo de fila
              </p>
            </div>
          )}
          
          {event.status === 'upcoming' && (
            <div className="space-y-4">
              <Card className="p-6 bg-yellow-500/10 border-yellow-500">
                <p className="text-yellow-500 font-semibold mb-2">
                  ⏱️ Check-in ainda não disponível
                </p>
                <p className="text-gray-400 text-sm">
                  O check-in abre no dia {event.dateFormatted} às {event.time.split(':')[0]}:00
                </p>
              </Card>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Button 
                  variant="secondary" 
                  onClick={() => onNavigate('eventos')}
                  className="w-full md:w-auto"
                >
                  Ver outros eventos
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('painel-admin', event.id)}
                  className="w-full md:w-auto"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Painel Admin
                </Button>
              </div>
            </div>
          )}
          
          {event.status === 'finished' && (
            <div className="space-y-4">
              <Card className="p-6 bg-gray-800/50">
                <p className="text-gray-400 mb-2">
                  Este evento já foi encerrado
                </p>
                <p className="text-gray-500 text-sm">
                  Confira os próximos eventos para participar
                </p>
              </Card>
              <Button 
                variant="primary" 
                onClick={() => onNavigate('eventos')}
                className="w-full md:w-auto"
              >
                Ver eventos disponíveis
              </Button>
            </div>
          )}
        </div>

        {/* Queue Preview (only for active events) */}
        {event.status === 'active' && (
          <div className="mt-12">
            <LiveQueue 
              eventId={event.id}
              onJoinQueue={() => onNavigate('fila', event.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}