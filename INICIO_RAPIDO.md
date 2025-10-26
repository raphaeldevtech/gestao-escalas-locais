# 🚀 Início Rápido - Gestão de Escalas

## Para Usuários

### Android (Mobile)
1. Instale o APK no seu celular
2. Abra o app "Gestão de Escalas"
3. Cadastre obreiros e locais
4. Gere escalas
5. Exporte PDF/CSV (abrirá menu de compartilhamento)

### Windows (Desktop)
1. Execute o instalador `Gestao-de-Escalas-Setup.exe`
2. Siga o assistente de instalação
3. Abra o aplicativo
4. Use normalmente - salvamento de arquivos via diálogo nativo!

### Transferir Dados
**De um dispositivo para outro:**
1. Dispositivo origem: Aba "Dados" → "Exportar Dados"
2. Compartilhe/envie o arquivo JSON
3. Dispositivo destino: Aba "Dados" → "Importar Dados"

---

## Para Desenvolvedores

### Setup Inicial
```bash
# 1. Clonar e instalar
git clone <repositorio>
cd gestao-escalas-locais
npm install

# 2. Rodar em desenvolvimento
npm run dev  # Web
```

### Build Android
```bash
# Sincronizar código
npm run android:sync

# Abrir Android Studio
npm run android:open

# No Android Studio:
# Build > Build Bundle(s)/APK(s) > Build APK(s)
```

### Build Windows
```bash
# Opção 1: Script automático
build-windows.bat

# Opção 2: Manual
npm install
npm run build
npm run electron:build:win

# Instalador estará em: dist-electron/
```

### Estrutura Importante
```
src/lib/
├── fileManager.ts          ← Gerencia download/save em TODAS plataformas
├── electronFileManager.ts  ← Específico para Windows
├── backupService.ts        ← Export/Import de dados
├── pdfGenerator.ts         ← Gera PDFs
└── storage.ts              ← LocalStorage wrapper

android/app/src/main/
└── AndroidManifest.xml     ← Permissões Android

electron/
├── main.js                 ← Electron main process
└── preload.js              ← Bridge seguro
```

### Comandos Úteis
```bash
# Desenvolvimento
npm run dev                  # Web dev server (port 5173)
npm run electron:dev         # Electron + hot reload

# Build
npm run build                # Build web apenas
npm run electron:build:win   # Build instalador Windows
npm run android:sync         # Sync para Android

# Linter
npm run lint                 # ESLint check
```

### Debug

**Mobile (Android):**
```bash
# Ver logs do app
adb logcat | grep Capacitor
# ou use Chrome DevTools: chrome://inspect
```

**Electron (Windows):**
- DevTools abre automaticamente em modo dev
- Logs no console do terminal

**Web:**
- F12 para abrir DevTools do navegador

### Troubleshooting Rápido

**Problema: Downloads não funcionam no mobile**
- ✅ Já corrigido! Permissões adicionadas
- Teste: npm run android:sync e rebuild APK

**Problema: Erro ao buildar Windows**
- Solução: Execute como administrador
- Ou: Adicione exceção no antivírus

**Problema: Electron não abre**
- Verifique: `npm list electron`
- Reinstale: `npm install electron --save-dev`

**Problema: Android Studio não abre**
- Verifique: Tem Android SDK instalado?
- Path correto em variáveis de ambiente?

---

## Tecnologias Principais

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Mobile**: Capacitor 7
- **Desktop**: Electron 33
- **PDF**: jsPDF + jspdf-autotable
- **Storage**: LocalStorage (offline-first)

## Links Úteis

📚 **Documentação Completa**: [README_COMPLETO.md](README_COMPLETO.md)  
🔨 **Como Criar Instalador**: [COMO_CRIAR_INSTALADOR.md](COMO_CRIAR_INSTALADOR.md)  
📖 **Manual do Usuário**: [MANUAL_WINDOWS.md](MANUAL_WINDOWS.md)  
📱 **Instruções APK**: [INSTRUCOES_APK.md](INSTRUCOES_APK.md)

## Suporte

**Igreja Evangélica Assembleia de Deus**  
Av. Cruz Cabugá, 29 – Santo Amaro – Recife PE  
Fone: 3084-1537

---

**Desenvolvido com ❤️ para a igreja**

