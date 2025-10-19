import { useState } from 'react';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Obreiro, LocalCulto } from '@/types';
import { generateEscala } from '@/lib/escalaGenerator';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GerarEscalaTabProps {
  obreiros: Obreiro[];
  locais: LocalCulto[];
  onEscalaGerada: () => void;
}

export const GerarEscalaTab = ({ obreiros, locais, onEscalaGerada }: GerarEscalaTabProps) => {
  const [mesSelecionado, setMesSelecionado] = useState(0);
  const [gerando, setGerando] = useState(false);
  const { toast } = useToast();

  const handleGerar = () => {
    if (obreiros.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Cadastre pelo menos um obreiro antes de gerar a escala.',
      });
      return;
    }

    if (locais.filter(l => l.ativo).length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ative pelo menos um local antes de gerar a escala.',
      });
      return;
    }

    setGerando(true);
    
    setTimeout(() => {
      const mesData = addMonths(new Date(), mesSelecionado);

      const escalasGeradas = generateEscala(
        mesData,
        obreiros,
        locais
      );

      storageService.saveEscalas(escalasGeradas);
      
      setGerando(false);
      toast({
        title: 'Escala gerada!',
        description: `${escalasGeradas.length} escalas criadas para ${format(mesData, 'MMMM/yyyy', { locale: ptBR })}.`,
      });
      
      onEscalaGerada();
    }, 1000);
  };

  const mesesOpcoes = Array.from({ length: 6 }, (_, i) => {
    const data = addMonths(new Date(), i);
    return {
      valor: i,
      label: format(data, 'MMMM/yyyy', { locale: ptBR }),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Gerar Nova Escala</h2>
        <p className="text-muted-foreground">
          Configure os parâmetros e gere automaticamente a escala
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Selecionar Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mesesOpcoes.map((mes) => (
              <Button
                key={mes.valor}
                variant={mesSelecionado === mes.valor ? 'default' : 'outline'}
                onClick={() => setMesSelecionado(mes.valor)}
                className="capitalize"
              >
                {mes.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Escalas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Círculo de Oração</h4>
                <p className="text-sm text-muted-foreground">
                  Escalas geradas para os períodos de <strong>manhã</strong> e <strong>tarde</strong> todos os dias do mês
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Ponto de Pregação</h4>
                <p className="text-sm text-muted-foreground">
                  Escalas geradas para o período da <strong>noite</strong> todos os dias do mês
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Pronto para gerar?</h3>
              <p className="text-sm text-muted-foreground">
                {obreiros.length} obreiros • {locais.filter(l => l.ativo).length} locais ativos
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleGerar}
              disabled={gerando}
              className="gap-2 min-w-[200px]"
            >
              <Sparkles className="w-5 h-5" />
              {gerando ? 'Gerando...' : 'Gerar Escala'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
