import { Obreiro, LocalCulto, Escala, Periodo } from '@/types';
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

export const generateEscala = (
  mes: Date,
  obreiros: Obreiro[],
  locais: LocalCulto[],
  periodosAtivos: Periodo[]
): Escala[] => {
  const escalas: Escala[] = [];
  const inicio = startOfMonth(mes);
  const fim = endOfMonth(mes);
  
  // Contador de escalas por obreiro na semana e no mês
  const contadorSemanal = new Map<string, number>();
  const contadorMensal = new Map<string, number>();
  
  let currentDate = inicio;
  let currentWeekStart = inicio;
  
  while (currentDate <= fim) {
    const diaSemana = DIAS_SEMANA[currentDate.getDay()];
    
    // Reset contador semanal toda segunda-feira
    if (currentDate.getDay() === 1 && currentDate !== inicio) {
      contadorSemanal.clear();
      currentWeekStart = currentDate;
    }
    
    // Para cada período ativo no dia
    periodosAtivos.forEach((periodo) => {
      if (periodo.dia.toLowerCase() === diaSemana) {
        // Para cada local ativo
        locais.filter(l => l.ativo).forEach((local) => {
          // Encontrar obreiros disponíveis
          const obrejrosDisponiveis = obreiros.filter((obreiro) => {
            const disp = obreiro.disponibilidade[diaSemana as keyof typeof obreiro.disponibilidade];
            const dispPeriodo = disp[periodo.periodo];
            const contagemSemanal = contadorSemanal.get(obreiro.id) || 0;
            const contagemMensal = contadorMensal.get(obreiro.id) || 0;
            
            // Verificar preferência de dias do mês do obreiro
            const diaDoMes = currentDate.getDate();
            const ehDiaImpar = diaDoMes % 2 !== 0;
            const ehDiaPar = diaDoMes % 2 === 0;
            const atendePreferenciaDia = 
              obreiro.preferenciasDiasMes === 'todos' ||
              (obreiro.preferenciasDiasMes === 'impares' && ehDiaImpar) ||
              (obreiro.preferenciasDiasMes === 'pares' && ehDiaPar);
            
            return (
              dispPeriodo &&
              atendePreferenciaDia &&
              contagemSemanal < obreiro.frequenciaMaxima &&
              contagemMensal < obreiro.frequenciaMaximaMensal &&
              (obreiro.locaisPreferidos.length === 0 || 
               obreiro.locaisPreferidos.includes(local.id))
            );
          });
          
          if (obrejrosDisponiveis.length > 0) {
            // Selecionar aleatoriamente
            const obreiroSelecionado = obrejrosDisponiveis[
              Math.floor(Math.random() * obrejrosDisponiveis.length)
            ];
            
            escalas.push({
              id: `${currentDate.getTime()}-${periodo.periodo}-${local.id}`,
              data: format(currentDate, 'dd/MM/yyyy'),
              diaSemana: format(currentDate, 'EEEE', { locale: ptBR }),
              periodo: periodo.periodo,
              obreiroId: obreiroSelecionado.id,
              obreiroNome: obreiroSelecionado.nome,
              localId: local.id,
              localNome: local.nome,
              codigoCulto: local.codigo,
            });
            
            // Atualizar contadores
            contadorSemanal.set(
              obreiroSelecionado.id,
              (contadorSemanal.get(obreiroSelecionado.id) || 0) + 1
            );
            contadorMensal.set(
              obreiroSelecionado.id,
              (contadorMensal.get(obreiroSelecionado.id) || 0) + 1
            );
          }
        });
      }
    });
    
    currentDate = addDays(currentDate, 1);
  }
  
  return escalas;
};

export const exportToExcel = (escalas: Escala[], mes: string) => {
  // Criar CSV simples para download
  const headers = ['DATA', 'DIA', 'PERÍODO', 'OBREIRO', 'CÓDIGO', 'LOCAL'];
  const rows = escalas.map(e => [
    e.data,
    e.diaSemana,
    e.periodo.toUpperCase(),
    e.obreiroNome,
    e.codigoCulto,
    e.localNome,
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `escala_${mes}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
