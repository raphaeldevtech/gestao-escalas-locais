import { storageService } from './storage';
import { fileManager } from './fileManager';
import { format } from 'date-fns';

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    obreiros: any[];
    locais: any[];
    escalas: any[];
  };
}

export const backupService = {
  /**
   * Cria um backup completo de todos os dados
   */
  exportData: async (): Promise<void> => {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const fileName = `backup_escalas_${timestamp}.json`;

    const backupData: BackupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        obreiros: storageService.getObreiros(),
        locais: storageService.getLocais(),
        escalas: storageService.getEscalas(),
      },
    };

    await fileManager.saveJSON(fileName, backupData);
  },

  /**
   * Restaura dados de um arquivo de backup
   */
  importData: async (file: File): Promise<void> => {
    try {
      const backupData: BackupData = await fileManager.readJSONFile(file);

      // Validar estrutura do backup
      if (!backupData.version || !backupData.data) {
        throw new Error('Arquivo de backup inválido');
      }

      // Validar os dados
      const { obreiros, locais, escalas } = backupData.data;
      
      if (!Array.isArray(obreiros) || !Array.isArray(locais) || !Array.isArray(escalas)) {
        throw new Error('Dados do backup estão corrompidos');
      }

      // Restaurar dados
      storageService.saveObreiros(obreiros);
      storageService.saveLocais(locais);
      storageService.saveEscalas(escalas);

    } catch (error) {
      console.error('Erro ao importar backup:', error);
      throw error;
    }
  },

  /**
   * Valida se um arquivo é um backup válido
   */
  validateBackupFile: async (file: File): Promise<boolean> => {
    try {
      const data = await fileManager.readJSONFile(file);
      return (
        data.version &&
        data.data &&
        Array.isArray(data.data.obreiros) &&
        Array.isArray(data.data.locais) &&
        Array.isArray(data.data.escalas)
      );
    } catch {
      return false;
    }
  },

  /**
   * Obtém estatísticas do backup
   */
  getBackupStats: () => {
    return {
      obreiros: storageService.getObreiros().length,
      locais: storageService.getLocais().length,
      escalas: storageService.getEscalas().length,
    };
  },
};


