import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ded30e1726964eed909c73fafc70c85b',
  appName: 'gestao-escalas-locais',
  webDir: 'dist',
  server: {
    url: 'https://ded30e17-2696-4eed-909c-73fafc70c85b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
