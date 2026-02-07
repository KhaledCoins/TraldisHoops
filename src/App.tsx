import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Eventos } from './pages/Eventos';
import { Evento } from './pages/Evento';
import { Fila } from './pages/Fila';
import { FilaAoVivoAnimated } from './pages/FilaAoVivoAnimated';
import { PainelTV } from './pages/PainelTV';
import { PainelAdmin } from './pages/PainelAdmin';
import { Projeto } from './pages/Projeto';
import { Parceiros } from './pages/Parceiros';
import { Contato } from './pages/Contato';
import { Memorias } from './pages/Memorias';

type Page = 
  | 'home' 
  | 'eventos' 
  | 'evento' 
  | 'fila'
  | 'fila-ao-vivo'
  | 'painel-tv' 
  | 'painel-admin'
  | 'projeto'
  | 'parceiros'
  | 'contato'
  | 'memorias';

function parseHash(hash: string): { page: Page; eventId: string | null } | null {
  if (!hash || hash === '#') return null;
  const clean = hash.replace(/^#/, '').split('/').filter(Boolean);
  if (clean.length === 0) return null;
  const page = clean[0] as string;
  const eventId = clean[1] || null;
  const allPages: Page[] = ['home', 'eventos', 'evento', 'fila', 'fila-ao-vivo', 'painel-tv', 'painel-admin', 'projeto', 'parceiros', 'contato', 'memorias'];
  if (allPages.includes(page as Page)) {
    const needsEventId = ['fila', 'evento', 'painel-tv', 'painel-admin'].includes(page);
    if (needsEventId && !eventId) return null;
    return { page: page as Page, eventId };
  }
  return null;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [hashChecked, setHashChecked] = useState(false);

  useEffect(() => {
    const applyHash = () => {
      const parsed = parseHash(window.location.hash);
      if (parsed) {
        setCurrentPage(parsed.page);
        if (parsed.eventId) setCurrentEventId(parsed.eventId);
      }
      setHashChecked(true);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const handleNavigate = (page: string, eventId?: string) => {
    setCurrentPage(page as Page);
    if (eventId !== undefined) {
      setCurrentEventId(eventId || null);
    }
    const needEventId = ['fila', 'evento', 'painel-tv', 'painel-admin'].includes(page);
    const id = eventId ?? (needEventId ? currentEventId : null);
    const newHash = needEventId && id ? `#${page}/${id}` : page === 'home' ? '' : `#${page}`;
    const path = (window.location.pathname || '/').replace(/\/$/, '') || '';
    const wantUrl = `${window.location.origin}${path || '/'}${newHash || ''}`;
    if (window.location.hash !== (newHash || '')) {
      window.history.replaceState(null, '', wantUrl);
    }
    window.scrollTo(0, 0);
  };

  // Páginas sem Header/Footer (painéis de TV e admin)
  const fullscreenPages: Page[] = ['painel-tv', 'painel-admin'];
  const isFullscreen = fullscreenPages.includes(currentPage);

  // Renderizar página atual
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      
      case 'eventos':
        return <Eventos onNavigate={handleNavigate} />;
      
      case 'evento':
        return currentEventId ? (
          <Evento eventId={currentEventId} onNavigate={handleNavigate} />
        ) : (
          <Eventos onNavigate={handleNavigate} />
        );
      
      case 'fila':
        return currentEventId ? (
          <Fila eventId={currentEventId} onNavigate={handleNavigate} />
        ) : (
          <Eventos onNavigate={handleNavigate} />
        );
      
      case 'fila-ao-vivo':
        return <FilaAoVivoAnimated onNavigate={handleNavigate} />;
      
      case 'painel-tv':
        return currentEventId ? (
          <PainelTV eventId={currentEventId} />
        ) : (
          <Eventos onNavigate={handleNavigate} />
        );
      
      case 'painel-admin':
        return currentEventId ? (
          <PainelAdmin eventId={currentEventId} onNavigate={handleNavigate} />
        ) : (
          <Eventos onNavigate={handleNavigate} />
        );
      
      case 'projeto':
        return <Projeto onNavigate={handleNavigate} />;
      
      case 'parceiros':
        return <Parceiros onNavigate={handleNavigate} />;
      
      case 'contato':
        return <Contato />;
      
      case 'memorias':
        return <Memorias onNavigate={handleNavigate} />;
      
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  if (isFullscreen) {
    return <div className="min-h-screen">{renderPage()}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
      />
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}