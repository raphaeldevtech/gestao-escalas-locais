import { Obreiro, LocalCulto, Escala } from '@/types';
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

export const generateEscala = (
  mes: Date,
  obreiros: Obreiro[],
  locais: LocalCulto[]
): Escala[] => {
  const escalas: Escala[] = [];
  const inicio = startOfMonth(mes);
  const fim = endOfMonth(mes);
  
  // Contador de escalas por obreiro na semana e no mês
  const contadorSemanal = new Map<string, number>();
  const contadorMensal = new Map<string, number>();
  
  let currentDate = inicio;
  let currentWeekStart = inicio;
  
  // Períodos fixos: Círculo de Oração (manhã e tarde) e Ponto de Pregação (noite)
  const periodosCirculo: ('manha' | 'tarde')[] = ['manha', 'tarde'];
  const periodoPregacao: 'noite' = 'noite';
  
  while (currentDate <= fim) {
    const diaSemana = DIAS_SEMANA[currentDate.getDay()];
    
    // Reset contador semanal toda segunda-feira
    if (currentDate.getDay() === 1 && currentDate !== inicio) {
      contadorSemanal.clear();
      currentWeekStart = currentDate;
    }
    
    // Para cada local ativo
    locais.filter(l => l.ativo).forEach((local) => {
      // Gerar escalas para Círculo de Oração (manhã e tarde)
      periodosCirculo.forEach((periodo) => {
        // Encontrar obreiros disponíveis
        const obrejrosDisponiveis = obreiros.filter((obreiro) => {
          const disp = obreiro.disponibilidade[diaSemana as keyof typeof obreiro.disponibilidade];
          const dispPeriodo = disp[periodo];
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
            id: `${currentDate.getTime()}-${periodo}-${local.id}`,
            data: format(currentDate, 'dd/MM/yyyy'),
            diaSemana: format(currentDate, 'EEEE', { locale: ptBR }),
            periodo: periodo,
            tipo: 'circulo',
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
      
      // Gerar escalas para Ponto de Pregação (noite)
      const obrejrosDisponiveisNoite = obreiros.filter((obreiro) => {
        const disp = obreiro.disponibilidade[diaSemana as keyof typeof obreiro.disponibilidade];
        const dispPeriodo = disp[periodoPregacao];
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
      
      if (obrejrosDisponiveisNoite.length > 0) {
        const obreiroSelecionado = obrejrosDisponiveisNoite[
          Math.floor(Math.random() * obrejrosDisponiveisNoite.length)
        ];
        
        escalas.push({
          id: `${currentDate.getTime()}-${periodoPregacao}-${local.id}`,
          data: format(currentDate, 'dd/MM/yyyy'),
          diaSemana: format(currentDate, 'EEEE', { locale: ptBR }),
          periodo: periodoPregacao,
          tipo: 'pregacao',
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
    
    currentDate = addDays(currentDate, 1);
  }
  
  return escalas;
};

export const exportToExcel = async (escalas: Escala[], mes: string) => {
  // Importar fileManager localmente para evitar dependência circular
  const { fileManager } = await import('./fileManager');
  
  // Criar CSV simples para download
  const headers = ['DATA', 'DIA', 'PERÍODO', 'TIPO', 'OBREIRO', 'CÓDIGO', 'LOCAL'];
  const rows = escalas.map(e => [
    e.data,
    e.diaSemana,
    e.periodo.toUpperCase(),
    e.tipo === 'circulo' ? 'Círculo de Oração' : 'Ponto de Pregação',
    e.obreiroNome,
    e.codigoCulto,
    e.localNome,
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Salvar usando fileManager (funciona em mobile e desktop)
  const fileName = `escala_${mes}.csv`;
  await fileManager.saveCSV(fileName, csv);
};
