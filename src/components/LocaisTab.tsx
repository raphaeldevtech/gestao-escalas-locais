import { useState } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LocalCulto } from '@/types';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface LocaisTabProps {
  locais: LocalCulto[];
  onUpdate: () => void;
}

export const LocaisTab = ({ locais, onUpdate }: LocaisTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingLocal, setEditingLocal] = useState<LocalCulto | null>(null);
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [endereco, setEndereco] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim() || !codigo.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Nome e código são obrigatórios',
      });
      return;
    }

    const novoLocal: LocalCulto = {
      id: editingLocal?.id || `local-${Date.now()}`,
      nome: nome.trim(),
      codigo: codigo.trim(),
      endereco: endereco.trim(),
      ativo: true,
    };

    if (editingLocal) {
      storageService.updateLocal(editingLocal.id, novoLocal);
      toast({
        title: 'Local atualizado',
        description: 'As informações foram salvas com sucesso.',
      });
    } else {
      storageService.addLocal(novoLocal);
      toast({
        title: 'Local cadastrado',
        description: 'Novo local adicionado ao sistema.',
      });
    }

    resetForm();
    onUpdate();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingLocal(null);
    setNome('');
    setCodigo('');
    setEndereco('');
  };

  const handleEdit = (local: LocalCulto) => {
    setEditingLocal(local);
    setNome(local.nome);
    setCodigo(local.codigo);
    setEndereco(local.endereco || '');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este local?')) {
      storageService.deleteLocal(id);
      onUpdate();
      toast({
        title: 'Local excluído',
        description: 'O local foi removido com sucesso.',
      });
    }
  };

  const toggleAtivo = (local: LocalCulto) => {
    storageService.updateLocal(local.id, { ativo: !local.ativo });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Locais de Culto</h2>
          <p className="text-muted-foreground">
            {locais.length} {locais.length === 1 ? 'local' : 'locais'} cadastrados
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Local
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle>
              {editingLocal ? 'Editar Local' : 'Novo Local'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Local *</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Mustardinha 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ex: 02"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Ex: Rua Principal, 123"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLocal ? 'Salvar Alterações' : 'Cadastrar Local'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locais.map((local) => (
          <Card key={local.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{local.nome}</span>
                  {!local.ativo && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">Inativo</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(local)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(local.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Código:</span> {local.codigo}
              </div>
              {local.endereco && (
                <div className="text-sm text-muted-foreground">
                  {local.endereco}
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t">
                <Label htmlFor={`ativo-${local.id}`} className="text-sm">
                  Local ativo
                </Label>
                <Switch
                  id={`ativo-${local.id}`}
                  checked={local.ativo}
                  onCheckedChange={() => toggleAtivo(local)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {locais.length === 0 && !showForm && (
        <Card className="p-12 text-center">
          <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum local cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Adicione os locais de culto da sua igreja
          </p>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Local
          </Button>
        </Card>
      )}
    </div>
  );
};
