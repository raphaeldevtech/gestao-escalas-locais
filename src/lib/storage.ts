import { Obreiro, LocalCulto, Escala } from '@/types';

const STORAGE_KEYS = {
  OBREIROS: 'escalas_obreiros',
  LOCAIS: 'escalas_locais',
  ESCALAS: 'escalas_geradas',
};

export const storageService = {
  // Obreiros
  getObreiros: (): Obreiro[] => {
    const data = localStorage.getItem(STORAGE_KEYS.OBREIROS);
    return data ? JSON.parse(data) : [];
  },

  saveObreiros: (obreiros: Obreiro[]) => {
    localStorage.setItem(STORAGE_KEYS.OBREIROS, JSON.stringify(obreiros));
  },

  addObreiro: (obreiro: Obreiro) => {
    const obreiros = storageService.getObreiros();
    obreiros.push(obreiro);
    storageService.saveObreiros(obreiros);
  },

  updateObreiro: (id: string, obreiro: Partial<Obreiro>) => {
    const obreiros = storageService.getObreiros();
    const index = obreiros.findIndex((o) => o.id === id);
    if (index !== -1) {
      obreiros[index] = { ...obreiros[index], ...obreiro };
      storageService.saveObreiros(obreiros);
    }
  },

  deleteObreiro: (id: string) => {
    const obreiros = storageService.getObreiros().filter((o) => o.id !== id);
    storageService.saveObreiros(obreiros);
  },

  // Locais
  getLocais: (): LocalCulto[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOCAIS);
    return data ? JSON.parse(data) : [];
  },

  saveLocais: (locais: LocalCulto[]) => {
    localStorage.setItem(STORAGE_KEYS.LOCAIS, JSON.stringify(locais));
  },

  addLocal: (local: LocalCulto) => {
    const locais = storageService.getLocais();
    locais.push(local);
    storageService.saveLocais(locais);
  },

  updateLocal: (id: string, local: Partial<LocalCulto>) => {
    const locais = storageService.getLocais();
    const index = locais.findIndex((l) => l.id === id);
    if (index !== -1) {
      locais[index] = { ...locais[index], ...local };
      storageService.saveLocais(locais);
    }
  },

  deleteLocal: (id: string) => {
    const locais = storageService.getLocais().filter((l) => l.id !== id);
    storageService.saveLocais(locais);
  },

  // Escalas
  getEscalas: (): Escala[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ESCALAS);
    return data ? JSON.parse(data) : [];
  },

  saveEscalas: (escalas: Escala[]) => {
    localStorage.setItem(STORAGE_KEYS.ESCALAS, JSON.stringify(escalas));
  },

  clearEscalas: () => {
    localStorage.removeItem(STORAGE_KEYS.ESCALAS);
  },
};
