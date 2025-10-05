export interface Obreiro {
  id: string;
  nome: string;
  disponibilidade: {
    segunda: { manha: boolean; tarde: boolean; noite: boolean };
    terca: { manha: boolean; tarde: boolean; noite: boolean };
    quarta: { manha: boolean; tarde: boolean; noite: boolean };
    quinta: { manha: boolean; tarde: boolean; noite: boolean };
    sexta: { manha: boolean; tarde: boolean; noite: boolean };
    sabado: { manha: boolean; tarde: boolean; noite: boolean };
    domingo: { manha: boolean; tarde: boolean; noite: boolean };
  };
  frequenciaMaxima: number; // máximo de escalas por semana
  frequenciaMaximaMensal: number; // máximo de escalas por mês
  locaisPreferidos: string[]; // IDs dos locais que prefere
  observacoes?: string;
}

export interface LocalCulto {
  id: string;
  nome: string;
  codigo: string;
  endereco?: string;
  ativo: boolean;
}

export interface Escala {
  id: string;
  data: string;
  diaSemana: string;
  periodo: 'manha' | 'tarde' | 'noite';
  obreiroId: string;
  obreiroNome: string;
  localId: string;
  localNome: string;
  codigoCulto: string;
}

export interface Periodo {
  dia: string;
  periodo: 'manha' | 'tarde' | 'noite';
  label: string;
}
