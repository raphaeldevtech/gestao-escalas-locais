/**
 * Adaptador de fileManager para Electron
 * Integra as funcionalidades nativas do Electron para salvar/abrir arquivos
 */

declare global {
  interface Window {
    electronAPI?: {
      saveFile: (fileName: string, content: string, filters?: any[], encoding?: string) => Promise<any>;
      openFile: (filters?: any[]) => Promise<any>;
      isElectron: boolean;
    };
  }
}

export const electronFileManager = {
  /**
   * Verifica se está rodando no Electron
   */
  isElectron: (): boolean => {
    return typeof window !== 'undefined' && window.electronAPI?.isElectron === true;
  },

  /**
   * Salva arquivo PDF no Electron
   */
  savePDF: async (fileName: string, pdfData: string): Promise<void> => {
    if (!electronFileManager.isElectron()) {
      throw new Error('Esta função só funciona no Electron');
    }

    // Converter dataURL para base64 puro
    let base64Data = pdfData;
    if (pdfData.includes(',')) {
      base64Data = pdfData.split(',')[1];
    }

    const result = await window.electronAPI!.saveFile(
      fileName,
      base64Data,
      [
        { name: 'PDF', extensions: ['pdf'] },
        { name: 'Todos os arquivos', extensions: ['*'] }
      ],
      'base64'
    );

    if (!result.success && !result.canceled) {
      throw new Error(result.error || 'Erro ao salvar PDF');
    }
  },

  /**
   * Salva arquivo CSV no Electron
   */
  saveCSV: async (fileName: string, csvContent: string): Promise<void> => {
    if (!electronFileManager.isElectron()) {
      throw new Error('Esta função só funciona no Electron');
    }

    const csvWithBOM = '\ufeff' + csvContent;
    
    const result = await window.electronAPI!.saveFile(
      fileName,
      csvWithBOM,
      [
        { name: 'CSV', extensions: ['csv'] },
        { name: 'Excel', extensions: ['xlsx', 'xls'] },
        { name: 'Todos os arquivos', extensions: ['*'] }
      ]
    );

    if (!result.success && !result.canceled) {
      throw new Error(result.error || 'Erro ao salvar CSV');
    }
  },

  /**
   * Salva arquivo JSON no Electron
   */
  saveJSON: async (fileName: string, jsonData: any): Promise<void> => {
    if (!electronFileManager.isElectron()) {
      throw new Error('Esta função só funciona no Electron');
    }

    const jsonString = JSON.stringify(jsonData, null, 2);
    
    const result = await window.electronAPI!.saveFile(
      fileName,
      jsonString,
      [
        { name: 'JSON', extensions: ['json'] },
        { name: 'Todos os arquivos', extensions: ['*'] }
      ]
    );

    if (!result.success && !result.canceled) {
      throw new Error(result.error || 'Erro ao salvar JSON');
    }
  },

  /**
   * Abre e lê arquivo JSON no Electron
   */
  openJSON: async (): Promise<any> => {
    if (!electronFileManager.isElectron()) {
      throw new Error('Esta função só funciona no Electron');
    }

    const result = await window.electronAPI!.openFile([
      { name: 'JSON', extensions: ['json'] },
      { name: 'Todos os arquivos', extensions: ['*'] }
    ]);

    if (result.success) {
      return JSON.parse(result.content);
    } else if (!result.canceled) {
      throw new Error(result.error || 'Erro ao abrir arquivo');
    }
    
    return null;
  },
};

