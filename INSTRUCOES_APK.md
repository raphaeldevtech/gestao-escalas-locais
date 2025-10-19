# 📱 Como Gerar o APK Android

Este guia explica como gerar o arquivo APK do aplicativo para instalar no Android.

## 🚀 Passo a Passo

### 1. Exportar o Projeto para o GitHub
- Clique no botão "Export to Github" no topo direito do Lovable
- Conecte sua conta GitHub se ainda não tiver conectado
- O código será transferido para seu repositório GitHub

### 2. Baixar o Projeto no Seu Computador
```bash
git clone [URL-DO-SEU-REPOSITORIO]
cd gestao-escalas-locais
```

### 3. Instalar as Dependências
```bash
npm install
```

**⚠️ Se aparecer erro "could not determine executable to run":**
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 4. Adicionar a Plataforma Android
```bash
npx cap add android
```

### 5. Atualizar as Dependências Nativas
```bash
npx cap update android
```

### 6. Compilar o Projeto
```bash
npm run build
```

### 7. Sincronizar com o Capacitor
```bash
npx cap sync
```

### 8. Abrir no Android Studio
```bash
npx cap open android
```

### 9. Gerar o APK no Android Studio

1. No Android Studio, vá em: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Aguarde a compilação (pode demorar alguns minutos na primeira vez)
3. Quando terminar, clique em "locate" para encontrar o APK gerado
4. O arquivo APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

### 10. Instalar no Android

Você pode:
- **Transferir via USB**: Copie o APK para o celular e instale
- **Compartilhar**: Envie o APK por WhatsApp, email, etc.
- **Instalar direto**: Se o celular estiver conectado via USB, o Android Studio pode instalar automaticamente

## ⚙️ Requisitos

- **Node.js** instalado (versão 16 ou superior)
- **Android Studio** instalado
- **Java JDK** instalado (versão 11 ou superior)
- Aproximadamente **5-10 GB** de espaço livre em disco

## 📄 Exportação de PDF

O aplicativo agora exporta relatórios em PDF no formato oficial da igreja, incluindo:
- Cabeçalho da igreja completo
- Legenda e data
- Lista de congregações e pontos de pregação
- Escalas organizadas por data e período
- Diferenciação entre Círculo de Oração e Pontos de Pregação

## 🔧 Desenvolvimento Local

Para testar as alterações durante o desenvolvimento:

1. **Modo de desenvolvimento web** (recomendado para testes rápidos):
```bash
npm run dev
```

2. **Modo Android com hot-reload**:
```bash
npx cap run android
```

## 📱 Recursos do App

✅ Funciona **100% offline** (dados salvos localmente)
✅ Cadastro de obreiros com disponibilidade
✅ Cadastro de locais de culto
✅ Geração automática de escalas
✅ Exportação em **PDF** (formato oficial da igreja)
✅ Exportação em **CSV** (para Excel)
✅ Interface responsiva para celular

## ❓ Dúvidas?

Se encontrar problemas durante o processo:
1. Verifique se todas as ferramentas estão instaladas corretamente
2. Certifique-se de que o Android Studio está atualizado
3. Tente limpar o cache: `npx cap sync --clean`

## 🎯 Após Qualquer Mudança no Código

Sempre que fizer mudanças no código e quiser atualizar o app:
```bash
git pull                    # Baixar últimas alterações
npm install                 # Atualizar dependências
npm run build              # Compilar o projeto
npx cap sync               # Sincronizar com Android
```

Depois é só gerar um novo APK no Android Studio!
