import { useState } from 'react';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Obreiro, LocalCulto, Periodo } from '@/types';
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

const PERIODOS_DISPONIVEIS: Periodo[] = [
  { dia: 'Segunda', periodo: 'manha', label: 'Segunda - Manhã' },
  { dia: 'Segunda', periodo: 'tarde', label: 'Segunda - Tarde' },
  { dia: 'Segunda', periodo: 'noite', label: 'Segunda - Noite' },
  { dia: 'Terça', periodo: 'manha', label: 'Terça - Manhã' },
  { dia: 'Terça', periodo: 'tarde', label: 'Terça - Tarde' },
  { dia: 'Terça', periodo: 'noite', label: 'Terça - Noite' },
  { dia: 'Quarta', periodo: 'manha', label: 'Quarta - Manhã' },
  { dia: 'Quarta', periodo: 'tarde', label: 'Quarta - Tarde' },
  { dia: 'Quarta', periodo: 'noite', label: 'Quarta - Noite' },
  { dia: 'Quinta', periodo: 'manha', label: 'Quinta - Manhã' },
  { dia: 'Quinta', periodo: 'tarde', label: 'Quinta - Tarde' },
  { dia: 'Quinta', periodo: 'noite', label: 'Quinta - Noite' },
  { dia: 'Sexta', periodo: 'manha', label: 'Sexta - Manhã' },
  { dia: 'Sexta', periodo: 'tarde', label: 'Sexta - Tarde' },
  { dia: 'Sexta', periodo: 'noite', label: 'Sexta - Noite' },
  { dia: 'Sábado', periodo: 'manha', label: 'Sábado - Manhã' },
  { dia: 'Sábado', periodo: 'tarde', label: 'Sábado - Tarde' },
  { dia: 'Sábado', periodo: 'noite', label: 'Sábado - Noite' },
  { dia: 'Domingo', periodo: 'manha', label: 'Domingo - Manhã' },
  { dia: 'Domingo', periodo: 'tarde', label: 'Domingo - Tarde' },
  { dia: 'Domingo', periodo: 'noite', label: 'Domingo - Noite' },
];

export const GerarEscalaTab = ({ obreiros, locais, onEscalaGerada }: GerarEscalaTabProps) => {
  const [mesSelecionado, setMesSelecionado] = useState(0);
  const [periodosAtivos, setPeriodosAtivos] = useState<string[]>([]);
  const [gerando, setGerando] = useState(false);
  const { toast } = useToast();

  const togglePeriodo = (periodo: string) => {
    setPeriodosAtivos((prev) =>
      prev.includes(periodo)
        ? prev.filter((p) => p !== periodo)
        : [...prev, periodo]
    );
  };

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

    if (periodosAtivos.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione pelo menos um período para gerar a escala.',
      });
      return;
    }

    setGerando(true);
    
    setTimeout(() => {
      const mesData = addMonths(new Date(), mesSelecionado);
      const periodosSelecionados = PERIODOS_DISPONIVEIS.filter((p) =>
        periodosAtivos.includes(`${p.dia}-${p.periodo}`)
      );

      const escalasGeradas = generateEscala(
        mesData,
        obreiros,
        locais,
        periodosSelecionados
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
          <CardTitle>Períodos dos Cultos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PERIODOS_DISPONIVEIS.map((periodo) => {
              const id = `${periodo.dia}-${periodo.periodo}`;
              const isAtivo = periodosAtivos.includes(id);
              return (
                <div
                  key={id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isAtivo
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => togglePeriodo(id)}
                >
                  <Checkbox
                    id={id}
                    checked={isAtivo}
                    onCheckedChange={() => togglePeriodo(id)}
                  />
                  <Label htmlFor={id} className="cursor-pointer font-medium">
                    {periodo.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Pronto para gerar?</h3>
              <p className="text-sm text-muted-foreground">
                {obreiros.length} obreiros • {locais.filter(l => l.ativo).length} locais ativos • {periodosAtivos.length} períodos
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
