import { useState, useRef } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { backupService } from '@/lib/backupService';

interface DadosTabProps {
  onUpdate: () => void;
}

export const DadosTab = ({ onUpdate }: DadosTabProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const stats = backupService.getBackupStats();

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await backupService.exportData();
      toast({
        title: 'Backup criado!',
        description: 'Seus dados foram exportados com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao exportar',
        description: 'Não foi possível criar o backup dos dados.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      // Validar arquivo antes de importar
      const isValid = await backupService.validateBackupFile(file);
      if (!isValid) {
        throw new Error('Arquivo de backup inválido');
      }

      // Confirmar antes de sobrescrever
      const confirmar = window.confirm(
        'Atenção! Importar um backup irá substituir todos os dados atuais. Deseja continuar?'
      );

      if (!confirmar) {
        setIsImporting(false);
        return;
      }

      await backupService.importData(file);
      onUpdate();
      
      toast({
        title: 'Dados importados!',
        description: 'O backup foi restaurado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao importar',
        description: error instanceof Error ? error.message : 'Não foi possível importar os dados.',
      });
    } finally {
      setIsImporting(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Gerenciar Dados</h2>
        <p className="text-muted-foreground">
          Exporte ou importe seus dados para fazer backup ou transferir entre dispositivos
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Use a funcionalidade de exportação para criar backups regulares dos seus dados.
          O arquivo exportado pode ser usado em qualquer dispositivo.
        </AlertDescription>
      </Alert>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Dados Armazenados
          </CardTitle>
          <CardDescription>
            Informações sobre os dados atualmente salvos no aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{stats.obreiros}</div>
              <div className="text-sm text-muted-foreground">Obreiros</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{stats.locais}</div>
              <div className="text-sm text-muted-foreground">Locais</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{stats.escalas}</div>
              <div className="text-sm text-muted-foreground">Escalas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exportar Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Dados
          </CardTitle>
          <CardDescription>
            Crie um backup completo de todos os seus dados (obreiros, locais e escalas)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-semibold mb-1">O que será exportado:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Todos os obreiros cadastrados</li>
                  <li>Todos os locais de culto</li>
                  <li>Todas as escalas geradas</li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={handleExportData} 
              disabled={isExporting}
              className="w-full"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar Todos os Dados'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Importar Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Dados
          </CardTitle>
          <CardDescription>
            Restaure um backup ou transfira dados de outro dispositivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção!</strong> Importar dados irá <strong>substituir</strong> todos os dados atuais.
                Recomendamos fazer um backup antes de importar.
              </AlertDescription>
            </Alert>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="w-full"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Importando...' : 'Selecionar Arquivo de Backup'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


