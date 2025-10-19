import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Obreiro } from '@/types';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ObreiroFormProps {
  obreiro: Obreiro | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DIAS = [
  { key: 'segunda', label: 'Segunda' },
  { key: 'terca', label: 'Terça' },
  { key: 'quarta', label: 'Quarta' },
  { key: 'quinta', label: 'Quinta' },
  { key: 'sexta', label: 'Sexta' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

const PERIODOS = [
  { key: 'manha', label: 'Manhã' },
  { key: 'tarde', label: 'Tarde' },
  { key: 'noite', label: 'Noite' },
];

export const ObreiroForm = ({ obreiro, onClose, onSuccess }: ObreiroFormProps) => {
  const { toast } = useToast();
  const [nome, setNome] = useState(obreiro?.nome || '');
  const [frequenciaMaxima, setFrequenciaMaxima] = useState(
    obreiro?.frequenciaMaxima || 3
  );
  const [frequenciaMaximaMensal, setFrequenciaMaximaMensal] = useState(
    obreiro?.frequenciaMaximaMensal || 12
  );
  const [preferenciasDiasMes, setPreferenciasDiasMes] = useState<'todos' | 'impares' | 'pares'>(
    obreiro?.preferenciasDiasMes || 'todos'
  );
  const [observacoes, setObservacoes] = useState(obreiro?.observacoes || '');
  const [disponibilidade, setDisponibilidade] = useState(
    obreiro?.disponibilidade || {
      segunda: { manha: false, tarde: false, noite: false },
      terca: { manha: false, tarde: false, noite: false },
      quarta: { manha: false, tarde: false, noite: false },
      quinta: { manha: false, tarde: false, noite: false },
      sexta: { manha: false, tarde: false, noite: false },
      sabado: { manha: false, tarde: false, noite: false },
      domingo: { manha: false, tarde: false, noite: false },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Nome é obrigatório',
      });
      return;
    }

    const novoObreiro: Obreiro = {
      id: obreiro?.id || `obreiro-${Date.now()}`,
      nome: nome.trim(),
      disponibilidade,
      frequenciaMaxima,
      frequenciaMaximaMensal,
      preferenciasDiasMes,
      locaisPreferidos: obreiro?.locaisPreferidos || [],
      observacoes: observacoes.trim(),
    };

    if (obreiro) {
      storageService.updateObreiro(obreiro.id, novoObreiro);
      toast({
        title: 'Obreiro atualizado',
        description: 'As informações foram salvas com sucesso.',
      });
    } else {
      storageService.addObreiro(novoObreiro);
      toast({
        title: 'Obreiro cadastrado',
        description: 'Novo obreiro adicionado ao sistema.',
      });
    }

    onSuccess();
    onClose();
  };

  const toggleDisponibilidade = (dia: string, periodo: string) => {
    setDisponibilidade((prev) => {
      const diaKey = dia as keyof typeof prev;
      const periodoKey = periodo as keyof (typeof prev)[typeof diaKey];
      return {
        ...prev,
        [dia]: {
          ...prev[diaKey],
          [periodo]: !prev[diaKey][periodoKey],
        },
      };
    });
  };

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-center">
          <CardTitle>
            {obreiro ? 'Editar Obreiro' : 'Novo Obreiro'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Obreiro *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequencia">Máximo por Semana *</Label>
              <Input
                id="frequencia"
                type="number"
                min="1"
                max="21"
                value={frequenciaMaxima}
                onChange={(e) => setFrequenciaMaxima(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequenciaMensal">Máximo por Mês *</Label>
              <Input
                id="frequenciaMensal"
                type="number"
                min="1"
                max="31"
                value={frequenciaMaximaMensal}
                onChange={(e) => setFrequenciaMaximaMensal(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Preferência por Dias do Mês</Label>
            <RadioGroup value={preferenciasDiasMes} onValueChange={(value) => setPreferenciasDiasMes(value as 'todos' | 'impares' | 'pares')}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="todos" id="dias-todos" />
                  <Label htmlFor="dias-todos" className="font-normal cursor-pointer">
                    Todos os dias
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="impares" id="dias-impares" />
                  <Label htmlFor="dias-impares" className="font-normal cursor-pointer">
                    Apenas dias ímpares
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pares" id="dias-pares" />
                  <Label htmlFor="dias-pares" className="font-normal cursor-pointer">
                    Apenas dias pares
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Disponibilidade por Dia da Semana</Label>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-muted text-sm font-medium">
                <div className="p-2 border-r">Dia</div>
                {PERIODOS.map((p) => (
                  <div key={p.key} className="p-2 border-r last:border-r-0 text-center">
                    {p.label}
                  </div>
                ))}
              </div>
              {DIAS.map((dia) => (
                <div key={dia.key} className="grid grid-cols-4 border-t hover:bg-muted/50">
                  <div className="p-3 border-r font-medium">{dia.label}</div>
                  {PERIODOS.map((periodo) => (
                    <div key={periodo.key} className="p-3 border-r last:border-r-0 flex justify-center">
                      <Checkbox
                        checked={
                          disponibilidade[dia.key as keyof typeof disponibilidade][
                            periodo.key as keyof (typeof disponibilidade)[keyof typeof disponibilidade]
                          ]
                        }
                        onCheckedChange={() =>
                          toggleDisponibilidade(dia.key, periodo.key)
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Prefere cultos noturnos, não pode às quintas"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {obreiro ? 'Salvar Alterações' : 'Cadastrar Obreiro'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
