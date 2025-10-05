import { Calendar } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Escalas</h1>
            <p className="text-primary-foreground/80 text-sm">
              Sistema de gerenciamento de obreiros
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
