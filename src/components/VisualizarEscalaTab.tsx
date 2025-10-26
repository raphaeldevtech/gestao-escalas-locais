import { Download, Trash2, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Escala } from '@/types';
import { exportToExcel } from '@/lib/escalaGenerator';
import { generatePDF } from '@/lib/pdfGenerator';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface VisualizarEscalaTabProps {
  escalas: Escala[];
  onUpdate: () => void;
}

export const VisualizarEscalaTab = ({ escalas, onUpdate }: VisualizarEscalaTabProps) => {
  const { toast } = useToast();

  const handleExportCSV = async () => {
    if (escalas.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nada para exportar',
        description: 'Gere uma escala primeiro.',
      });
      return;
    }

    try {
      const primeirData = escalas[0]?.data || '';
      const mes = primeirData.split('/').slice(1).join('-');
      await exportToExcel(escalas, mes);
      
      toast({
        title: 'Exportado!',
        description: 'Escala exportada para CSV com sucesso.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao exportar',
        description: 'Não foi possível exportar o CSV.',
      });
    }
  };

  const handleExportPDF = async () => {
    if (escalas.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nada para exportar',
        description: 'Gere uma escala primeiro.',
      });
      return;
    }

    try {
      const locais = storageService.getLocais();
      const primeirData = escalas[0]?.data || '';
      const mes = primeirData.split('/').slice(1).join('/');
      await generatePDF(escalas, locais, mes);
      
      toast({
        title: 'PDF Gerado!',
        description: 'Escala exportada em PDF no formato da igreja.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao exportar',
        description: 'Não foi possível gerar o PDF.',
      });
    }
  };

  const handleLimpar = () => {
    if (confirm('Deseja realmente limpar todas as escalas geradas?')) {
      storageService.clearEscalas();
      onUpdate();
      toast({
        title: 'Escalas limpas',
        description: 'Todas as escalas foram removidas.',
      });
    }
  };

  if (escalas.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Visualizar Escala</h2>
          <p className="text-muted-foreground">Nenhuma escala gerada ainda</p>
        </div>
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma escala disponível</h3>
          <p className="text-muted-foreground mb-4">
            Vá para a aba "Gerar Escala" para criar uma nova escala
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Visualizar Escala</h2>
          <p className="text-muted-foreground">
            {escalas.length} {escalas.length === 1 ? 'escala' : 'escalas'} geradas
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleLimpar} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Limpar
          </Button>
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button onClick={handleExportPDF} className="gap-2">
            <FileText className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Dia</TableHead>
                  <TableHead className="font-semibold">Período</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Obreiro</TableHead>
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Local</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escalas.map((escala) => (
                  <TableRow key={escala.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{escala.data}</TableCell>
                    <TableCell className="capitalize">{escala.diaSemana}</TableCell>
                    <TableCell className="capitalize">{escala.periodo}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        escala.tipo === 'circulo' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        {escala.tipo === 'circulo' ? 'Círculo de Oração' : 'Ponto de Pregação'}
                      </span>
                    </TableCell>
                    <TableCell>{escala.obreiroNome}</TableCell>
                    <TableCell>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-mono">
                        {escala.codigoCulto}
                      </span>
                    </TableCell>
                    <TableCell>{escala.localNome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
