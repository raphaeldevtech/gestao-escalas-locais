# 📦 Instalação de Dependências

Após as alterações realizadas, é necessário instalar as novas dependências do Electron.

## ⚡ Instalação Rápida

### Windows (Recomendado)

**Opção 1: PowerShell**
```powershell
# Abra o PowerShell na pasta do projeto
npm install
```

**Opção 2: CMD**
```cmd
# Abra o Prompt de Comando na pasta do projeto
npm install
```

### Estimativa de Tempo
- **Primeira instalação**: 5-10 minutos (depende da internet)
- **Downloads**: ~300-500 MB (Electron, dependências, etc.)

## 🔍 O que será instalado

### Novas Dependências (devDependencies)
```json
{
  "electron": "^33.3.1",           // Framework desktop
  "electron-builder": "^25.1.8",   // Criador de instaladores
  "concurrently": "^9.1.2",        // Executar múltiplos comandos
  "cross-env": "^7.0.3",           // Variáveis de ambiente cross-platform
  "wait-on": "^8.0.1"              // Esperar servidores iniciarem
}
```

## ✅ Verificar Instalação

Após o `npm install`, verifique se tudo está OK:

```bash
# Verificar se Electron foi instalado
npm list electron

# Deve mostrar algo como:
# └── electron@33.3.1

# Verificar Electron Builder
npm list electron-builder

# Deve mostrar:
# └── electron-builder@25.1.8
```

## 🧪 Testar Instalação

### Teste 1: Build Web
```bash
npm run build
```
✅ Deve criar pasta `dist/` com sucesso

### Teste 2: Electron Dev Mode
```bash
npm run electron:dev
```
✅ Deve abrir:
- Servidor web em http://localhost:5173
- Janela do Electron automaticamente

**Pressione Ctrl+C para parar**

### Teste 3: Build Windows (Opcional - demora mais)
```bash
npm run electron:build:win
```
✅ Deve criar `dist-electron/Gestao-de-Escalas-Setup-0.0.0.exe`

## ❌ Problemas Comuns

### Erro: "Cannot find module 'electron'"
**Causa**: Electron não foi instalado corretamente

**Solução**:
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erro: "EPERM: operation not permitted"
**Causa**: Permissões de escrita ou arquivos bloqueados

**Solução**:
1. Feche o aplicativo se estiver aberto
2. Execute o terminal como Administrador
3. Tente novamente

### Erro: "Python not found" ou "node-gyp"
**Causa**: Algumas dependências do Electron precisam de ferramentas de build

**Solução Windows**:
```bash
# Instalar ferramentas de build do Windows
npm install --global windows-build-tools

# Ou instalar manualmente:
# 1. Python 3.x (https://www.python.org/)
# 2. Visual Studio Build Tools (https://visualstudio.microsoft.com/downloads/)
```

### Instalação muito lenta
**Causa**: Electron é grande (~150MB) e electron-builder também

**Solução**:
- Normal na primeira vez
- Use boa conexão de internet
- Adicione exceção no antivírus para node_modules/

### Windows Defender bloqueando
**Causa**: Falso positivo em arquivos do Electron

**Solução**:
1. Adicione a pasta do projeto às exceções do Windows Defender
2. Ou temporariamente desative proteção em tempo real
3. Reinstale: `npm install`

## 📂 Estrutura Após Instalação

```
gestao-escalas-locais/
├── node_modules/
│   ├── electron/           ← ~200 MB
│   ├── electron-builder/   ← ~100 MB
│   └── ... outras deps
├── package.json
├── package-lock.json       ← Atualizado
└── ...
```

## 🔄 Rebuild APK Android

Como foram adicionadas permissões no AndroidManifest.xml, você também precisa:

```bash
# Sincronizar código para Android
npm run android:sync

# Abrir Android Studio
npm run android:open

# No Android Studio:
# Build > Build Bundle(s)/APK(s) > Build APK(s)
```

## 🎯 Próximos Passos

Após instalar com sucesso:

1. ✅ **Testar no modo dev**
   ```bash
   npm run electron:dev
   ```

2. ✅ **Criar instalador Windows**
   ```bash
   npm run electron:build:win
   # ou
   build-windows.bat
   ```

3. ✅ **Rebuild APK Android**
   ```bash
   npm run android:sync
   # Abrir Android Studio e gerar APK
   ```

## 📊 Espaço em Disco

### Estimativa de uso:
- `node_modules/`: ~1.5 GB (inclui Electron)
- `dist/`: ~5 MB (build web)
- `dist-electron/`: ~200 MB (instalador Windows)
- `android/`: ~100 MB (projeto Android)

**Total aproximado**: ~1.8 GB

## 🆘 Suporte

Se ainda tiver problemas:

1. Verifique versão do Node.js:
   ```bash
   node --version
   # Deve ser >= 18.0.0
   ```

2. Atualize o NPM:
   ```bash
   npm install -g npm@latest
   ```

3. Consulte os logs de erro completos

4. Verifique a documentação:
   - [COMO_CRIAR_INSTALADOR.md](COMO_CRIAR_INSTALADOR.md)
   - [README_COMPLETO.md](README_COMPLETO.md)

---

**Após a instalação, tudo estará pronto para desenvolver e criar os instaladores!** 🚀

