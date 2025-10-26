import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Escala, LocalCulto } from '@/types';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fileManager } from './fileManager';

export const generatePDF = async (escalas: Escala[], locais: LocalCulto[], mesAno: string) => {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  
  // Cabeçalho
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('LISTA LOCAL DE CULTOS', 105, 22, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Av. Cruz Cabugá, 29 – Santo Amaro – Recife PE CEP: 50040-000', 105, 28, { align: 'center' });
  doc.text('Fone: 3084-1537 Fax: 3084-1500', 105, 33, { align: 'center' });
  
  // Legenda
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Legenda: CC é o Código do Culto', 14, 42);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`DE: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 48);
  
  // Pontos de Pregação
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PONTOS DE PREGAÇÕES', 14, 56);
  
  // Separar locais por tipo (congregações vs pontos de pregação)
  const congregacoes = locais.filter(l => l.ativo && !l.nome.includes('P. PREG'));
  const pontosPregacao = locais.filter(l => l.ativo && l.nome.includes('P. PREG'));
  
  let yPos = 62;
  
  // Criar tabela de locais
  const locaisData = [];
  const maxRows = Math.max(congregacoes.length, pontosPregacao.length);
  
  for (let i = 0; i < maxRows; i++) {
    locaisData.push([
      congregacoes[i] ? `${congregacoes[i].nome} (${congregacoes[i].codigo})` : '',
      pontosPregacao[i] ? `${pontosPregacao[i].nome} (${pontosPregacao[i].codigo})` : ''
    ]);
  }
  
  autoTable(doc, {
    startY: yPos,
    head: [['CONGREGAÇÕES', 'PONTOS DE PREGAÇÕES']],
    body: locaisData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 90 }
    }
  });
  
  // Escalas/Cultos
  yPos = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CULTOS:', 14, yPos);
  
  yPos += 6;
  
  // Agrupar escalas por data e período
  const escalasPorData = escalas.reduce((acc, escala) => {
    const key = `${escala.data}-${escala.periodo}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(escala);
    return acc;
  }, {} as Record<string, Escala[]>);
  
  // Ordenar por data
  const datasOrdenadas = Object.keys(escalasPorData).sort((a, b) => {
    const [dataA] = a.split('-');
    const [dataB] = b.split('-');
    const dateA = parse(dataA, 'dd/MM/yyyy', new Date());
    const dateB = parse(dataB, 'dd/MM/yyyy', new Date());
    return dateA.getTime() - dateB.getTime();
  });
  
  // Criar dados da tabela de escalas
  const escalasData: any[] = [];
  
  datasOrdenadas.forEach(key => {
    const [data, periodo] = key.split('-');
    const escalasDoDia = escalasPorData[key];
    const dateObj = parse(data, 'dd/MM/yyyy', new Date());
    const diaSemana = format(dateObj, 'EEEE', { locale: ptBR }).toUpperCase();
    const periodoLabel = periodo === 'manha' ? 'MANHÃ' : periodo === 'tarde' ? 'TARDE' : 'NOITE';
    
    // Linha de cabeçalho do dia/período
    escalasData.push([
      { content: data, styles: { fontStyle: 'bold' } },
      '',
      { content: `${diaSemana} – ${periodoLabel}`, colSpan: 2, styles: { fontStyle: 'bold', halign: 'center' } },
      ''
    ]);
    
    // Linhas de escalas
    escalasDoDia.forEach(escala => {
      const tipo = escala.tipo === 'circulo' ? '' : 'P. PREG.';
      escalasData.push([
        escala.obreiroNome,
        escala.codigoCulto,
        `${tipo}${escala.localNome}`,
        '00'
      ]);
    });
  });
  
  autoTable(doc, {
    startY: yPos,
    head: [['ESCALADO', 'CC', 'LOCAL', 'CL']],
    body: escalasData,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 90 },
      3: { cellWidth: 15, halign: 'center' }
    }
  });
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Área 38 - ${mesAno}`, 14, doc.internal.pageSize.height - 10);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
  }
  
  // Salvar PDF usando fileManager (funciona em mobile e desktop)
  const fileName = `Escala_${mesAno.replace('/', '_')}.pdf`;
  const pdfData = doc.output('dataurlstring');
  await fileManager.savePDF(fileName, pdfData);
};
