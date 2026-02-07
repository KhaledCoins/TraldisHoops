import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay para melhor UX
    setTimeout(() => {
      const success = onLogin(password);
      
      if (!success) {
        setError('Senha incorreta');
        setPassword('');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">PAINEL ADMIN</h1>
          <p className="text-gray-400">Traldi's Hoops</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-white mb-2">
              SENHA DE ACESSO
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-4 py-3 bg-[#0A0A0A] border-2 border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4">
              <p className="text-red-500 font-bold text-center">{error}</p>
            </div>
          )}

          {/* Botão de login */}
          <Button
            type="submit"
            variant="accent"
            className="w-full py-3"
            disabled={!password || isLoading}
          >
            {isLoading ? 'VERIFICANDO...' : 'ENTRAR'}
          </Button>
        </form>

        {/* Informação */}
        <div className="mt-8 pt-6 border-t-2 border-gray-800">
          <p className="text-gray-500 text-xs text-center">
            Acesso restrito aos organizadores do evento
          </p>
        </div>
      </Card>
    </div>
  );
}