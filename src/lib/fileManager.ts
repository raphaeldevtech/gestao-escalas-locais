import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { electronFileManager } from './electronFileManager';

/**
 * Gerenciador de arquivos multiplataforma
 * Funciona no mobile (Android/iOS), browser e Electron (Windows)
 */

export const fileManager = {
  /**
   * Verifica se está rodando em plataforma nativa (mobile)
   */
  isNativePlatform: (): boolean => {
    return Capacitor.isNativePlatform();
  },

  /**
   * Verifica se está rodando no Electron (Windows desktop)
   */
  isElectron: (): boolean => {
    return electronFileManager.isElectron();
  },

  /**
   * Salva arquivo PDF
   */
  savePDF: async (fileName: string, pdfData: string): Promise<void> => {
    // Prioridade: Electron > Mobile > Browser
    if (fileManager.isElectron()) {
      await electronFileManager.savePDF(fileName, pdfData);
    } else if (fileManager.isNativePlatform()) {
      try {
        // Converter dataurlstring para base64 puro
        let base64Data = pdfData;
        if (pdfData.includes(',')) {
          base64Data = pdfData.split(',')[1];
        }

        // Salvar no mobile usando Filesystem API
        const result = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true,
        });

        console.log('PDF salvo com sucesso:', result.uri);

        // Compartilhar arquivo após salvar
        const shareResult = await Share.share({
          title: 'Escala PDF',
          text: 'Compartilhar escala em PDF',
          url: result.uri,
          dialogTitle: 'Compartilhar PDF',
        });

        console.log('Compartilhamento:', shareResult);
      } catch (error) {
        console.error('Erro detalhado ao salvar PDF no mobile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        throw new Error(`Não foi possível salvar o PDF: ${errorMessage}`);
      }
    } else {
      // Browser tradicional - usar download via link
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = fileName;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  /**
   * Salva arquivo CSV/Excel
   */
  saveCSV: async (fileName: string, csvContent: string): Promise<void> => {
    // Prioridade: Electron > Mobile > Browser
    if (fileManager.isElectron()) {
      await electronFileManager.saveCSV(fileName, csvContent);
    } else if (fileManager.isNativePlatform()) {
      try {
        // Adicionar BOM para UTF-8 e converter para base64
        const csvWithBOM = '\ufeff' + csvContent;
        // Usar TextEncoder para garantir UTF-8 correto
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(csvWithBOM);
        // Converter Uint8Array para base64
        let binary = '';
        uint8Array.forEach(byte => binary += String.fromCharCode(byte));
        const base64Data = btoa(binary);
        
        const result = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true,
        });

        console.log('CSV salvo com sucesso:', result.uri);

        // Compartilhar arquivo
        const shareResult = await Share.share({
          title: 'Escala CSV',
          text: 'Compartilhar escala em formato Excel/CSV',
          url: result.uri,
          dialogTitle: 'Compartilhar CSV',
        });

        console.log('Compartilhamento:', shareResult);
      } catch (error) {
        console.error('Erro detalhado ao salvar CSV no mobile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        throw new Error(`Não foi possível salvar o CSV: ${errorMessage}`);
      }
    } else {
      // Browser tradicional
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },

  /**
   * Salva arquivo JSON (para backup de dados)
   */
  saveJSON: async (fileName: string, jsonData: any): Promise<void> => {
    const jsonString = JSON.stringify(jsonData, null, 2);
    
    // Prioridade: Electron > Mobile > Browser
    if (fileManager.isElectron()) {
      await electronFileManager.saveJSON(fileName, jsonData);
    } else if (fileManager.isNativePlatform()) {
      try {
        const base64Data = btoa(unescape(encodeURIComponent(jsonString)));
        
        const result = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true,
        });

        console.log('JSON/Backup salvo com sucesso:', result.uri);

        const shareResult = await Share.share({
          title: 'Backup de Dados',
          text: 'Compartilhar backup dos dados do aplicativo',
          url: result.uri,
          dialogTitle: 'Compartilhar Backup',
        });

        console.log('Compartilhamento:', shareResult);
      } catch (error) {
        console.error('Erro detalhado ao salvar JSON no mobile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        throw new Error(`Não foi possível salvar o backup: ${errorMessage}`);
      }
    } else {
      // Browser tradicional
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },

  /**
   * Lê arquivo JSON (para restaurar backup)
   */
  readJSONFile: async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          resolve(json);
        } catch (error) {
          reject(new Error('Arquivo JSON inválido'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  },
};

