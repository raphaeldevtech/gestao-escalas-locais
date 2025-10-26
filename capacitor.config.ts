import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.igreja.escalaslocais',
  appName: 'Gestão de Escalas',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  }
};

export default config;
