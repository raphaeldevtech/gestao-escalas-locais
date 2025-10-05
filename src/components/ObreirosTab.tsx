import { useState } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ObreiroForm } from './ObreiroForm';
import { Obreiro } from '@/types';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ObreirosTabProps {
  obreiros: Obreiro[];
  onUpdate: () => void;
}

export const ObreirosTab = ({ obreiros, onUpdate }: ObreirosTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingObreiro, setEditingObreiro] = useState<Obreiro | null>(null);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este obreiro?')) {
      storageService.deleteObreiro(id);
      onUpdate();
      toast({
        title: 'Obreiro excluído',
        description: 'O obreiro foi removido com sucesso.',
      });
    }
  };

  const handleEdit = (obreiro: Obreiro) => {
    setEditingObreiro(obreiro);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingObreiro(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Obreiros Cadastrados</h2>
          <p className="text-muted-foreground">
            {obreiros.length} {obreiros.length === 1 ? 'obreiro' : 'obreiros'} no sistema
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Obreiro
        </Button>
      </div>

      {showForm && (
        <ObreiroForm
          obreiro={editingObreiro}
          onClose={handleCloseForm}
          onSuccess={onUpdate}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {obreiros.map((obreiro) => (
          <Card key={obreiro.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span className="text-lg">{obreiro.nome}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(obreiro)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(obreiro.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Máximo por semana:</span>{' '}
                {obreiro.frequenciaMaxima}x
              </div>
              {obreiro.observacoes && (
                <div className="text-muted-foreground italic">
                  {obreiro.observacoes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {obreiros.length === 0 && !showForm && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum obreiro cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece adicionando obreiros ao sistema
          </p>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Obreiro
          </Button>
        </Card>
      )}
    </div>
  );
};
