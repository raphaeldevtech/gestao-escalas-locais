# Como Criar o Instalador Windows

Este guia explica como compilar o aplicativo e criar o instalador do Windows.

## Pré-requisitos

### Softwares Necessários
1. **Node.js 18 ou superior**
   - Download: https://nodejs.org/
   - Verifique a instalação: `node --version`

2. **NPM** (vem com Node.js)
   - Verifique a instalação: `npm --version`

3. **Git** (opcional, para clonar o repositório)
   - Download: https://git-scm.com/

### Verificar Instalação
Abra o PowerShell ou Prompt de Comando e execute:
```bash
node --version
npm --version
```

## Métodos de Build

### Método 1: Script Automático (Recomendado)

#### Usando Batch (CMD):
1. Abra o Prompt de Comando como Administrador
2. Navegue até a pasta do projeto:
   ```cmd
   cd C:\caminho\para\gestao-escalas-locais
   ```
3. Execute o script:
   ```cmd
   build-windows.bat
   ```

#### Usando PowerShell:
1. Abra o PowerShell como Administrador
2. Navegue até a pasta do projeto:
   ```powershell
   cd C:\caminho\para\gestao-escalas-locais
   ```
3. Execute o script:
   ```powershell
   .\build-windows.ps1
   ```

### Método 2: Comandos Manuais

Abra o terminal na pasta do projeto e execute:

```bash
# 1. Instalar dependências
npm install

# 2. Construir o aplicativo web
npm run build

# 3. Criar o instalador Windows
npm run electron:build:win
```

## Resultado

Após a conclusão, você encontrará o instalador em:
```
dist-electron/
  ├── Gestao-de-Escalas-Setup-0.0.0.exe (instalador NSIS)
  └── win-unpacked/ (versão portátil)
```

### Tipos de Distribuição

1. **Setup Completo (NSIS)**:
   - `Gestao-de-Escalas-Setup-{versao}.exe`
   - Instalador tradicional do Windows
   - Cria atalhos e entrada no menu iniciar
   - Permite desinstalação via Painel de Controle

2. **Versão Portátil**:
   - Pasta `win-unpacked/`
   - Não requer instalação
   - Execute `Gestao-de-Escalas.exe` diretamente
   - Ideal para usar em pendrive

## Desenvolvimento e Testes

### Modo Desenvolvimento
Para testar o aplicativo Electron em modo desenvolvimento:

```bash
npm run electron:dev
```

Isso abrirá:
- Servidor de desenvolvimento (http://localhost:5173)
- Aplicativo Electron com hot-reload
- DevTools aberto automaticamente

### Executar Versão Construída
Para testar a versão de produção sem criar instalador:

```bash
# 1. Construir
npm run build

# 2. Executar Electron
npm run electron:start
```

## Problemas Comuns e Soluções

### Erro: "electron-builder não encontrado"
**Solução**: Execute `npm install` novamente

### Erro: "Cannot find module 'electron'"
**Solução**: 
```bash
npm install electron --save-dev
```

### Erro: Windows Defender bloqueia o build
**Solução**: 
1. Adicione a pasta do projeto às exceções do Windows Defender
2. Ou temporariamente desative a proteção em tempo real

### Erro: "EPERM: operation not permitted"
**Solução**: 
1. Execute o terminal como Administrador
2. Feche o aplicativo se estiver aberto
3. Tente novamente

### Build muito lento
**Solução**: 
- Normal na primeira vez (baixa dependências do Electron)
- Builds subsequentes serão mais rápidos
- Considere adicionar exceção no antivírus para a pasta node_modules

### Erro: "Package.json not found"
**Solução**: Certifique-se de estar na pasta raiz do projeto:
```bash
dir package.json  # Windows CMD
ls package.json   # PowerShell/Bash
```

## Personalização do Instalador

### Alterar Ícone
1. Substitua `dist/favicon.ico` por seu ícone
2. Formato: ICO, múltiplos tamanhos (16x16, 32x32, 48x48, 256x256)

### Alterar Nome do Aplicativo
Edite `package.json`:
```json
{
  "build": {
    "productName": "Seu Nome Aqui"
  }
}
```

### Alterar Versão
Edite `package.json`:
```json
{
  "version": "1.0.0"
}
```

### Configurações Avançadas
Todas as configurações estão em `package.json` na seção `"build"`.

Documentação completa: https://www.electron.build/

## Build para 32 bits e 64 bits

O script atual cria instaladores para ambas as arquiteturas:
- `Gestao-de-Escalas-Setup-{versao}.exe` (universal)
- Funciona em Windows 32 bits e 64 bits

Para criar apenas uma arquitetura, edite `package.json`:
```json
"win": {
  "target": [{
    "target": "nsis",
    "arch": ["x64"]  // Apenas 64 bits
    // ou
    "arch": ["ia32"]  // Apenas 32 bits
  }]
}
```

## Distribuição

### Testando o Instalador
1. Execute `Gestao-de-Escalas-Setup-{versao}.exe`
2. Siga o assistente de instalação
3. Execute o aplicativo
4. Teste todas as funcionalidades

### Compartilhando
O arquivo `.exe` pode ser:
- Enviado por email
- Hospedado em servidor/nuvem
- Distribuído via pendrive
- Compartilhado em rede local

### Tamanho do Arquivo
- Instalador: ~150-200 MB (contém Chromium e Node.js)
- Normal para aplicativos Electron
- Após instalado: ~250-300 MB

## Atualizações Futuras

Para criar uma nova versão:
1. Atualize a versão em `package.json`
2. Execute o build novamente
3. Distribua o novo instalador
4. Usuários precisam desinstalar a versão antiga e instalar a nova
   (ou sobrescrever instalando na mesma pasta)

**Nota**: Para auto-update automático, seria necessário configurar um servidor de atualizações (não incluído neste setup básico).

## Suporte

Para problemas não listados aqui, verifique:
- Logs do terminal durante o build
- Documentação do Electron Builder: https://www.electron.build/
- Documentação do Electron: https://www.electronjs.org/

---

**Desenvolvido para Igreja Evangélica Assembleia de Deus**

