# 📱 Sistema de Gestão de Escalas Locais

Sistema completo para gerenciamento de escalas de obreiros em locais de culto da Igreja Evangélica Assembleia de Deus.

## ✨ Funcionalidades

- ✅ Cadastro de obreiros
- ✅ Cadastro de locais de culto (Círculos de Oração e Pontos de Pregação)
- ✅ Geração automática de escalas mensais
- ✅ Exportação para PDF (formato oficial da igreja)
- ✅ Exportação para CSV/Excel
- ✅ **Backup e Restauração de Dados**
- ✅ **Compatível com Mobile (Android)**
- ✅ **Compatível com Desktop (Windows)**
- ✅ **Sincronização entre dispositivos via exportação/importação**

---

## 🚀 Instalação e Uso

### 📊 Para Windows (Desktop)

#### Opção 1: Execução Rápida (Recomendado)

1. **Duplo clique** no arquivo `start-windows.bat`
2. Aguarde o carregamento (pode demorar na primeira vez)
3. O navegador abrirá automaticamente

#### Opção 2: PowerShell

```powershell
.\start-windows.ps1
```

#### Opção 3: Terminal/Prompt

```bash
npm install
npm run dev
```

📖 **Guia completo**: Consulte o arquivo `INSTALACAO_WINDOWS.md` para instruções detalhadas.

---

### 📱 Para Android (Mobile)

#### Pré-requisitos
- Android Studio instalado
- Java JDK 17+
- Variáveis de ambiente configuradas

#### Comandos

```bash
# 1. Construir o projeto web
npm run build

# 2. Sincronizar com Android
npm run android:sync

# 3. Abrir no Android Studio
npm run android:open
```

📖 **Guia completo**: Consulte o arquivo `INSTRUCOES_APK.md` para mais detalhes.

---

## 💾 Backup e Sincronização de Dados

### Exportar Dados (Backup)

1. Acesse a aba **"Dados"** no aplicativo
2. Clique em **"Exportar Todos os Dados"**
3. Salve o arquivo JSON em local seguro
4. No mobile, você pode compartilhar via WhatsApp, Email, Drive, etc.

### Importar Dados (Restaurar)

1. Acesse a aba **"Dados"** no aplicativo
2. Clique em **"Selecionar Arquivo de Backup"**
3. Escolha o arquivo JSON exportado anteriormente
4. Confirme a importação

⚠️ **Atenção**: Importar dados irá **substituir** todos os dados atuais!

### Transferir entre Dispositivos

1. **No dispositivo de origem**:
   - Exporte os dados (gera arquivo JSON)
   - Envie o arquivo para outro dispositivo (email, drive, whatsapp)

2. **No dispositivo de destino**:
   - Receba o arquivo
   - Importe usando a funcionalidade de importação

---

## 📥 Download de Arquivos no Mobile

### Problema Resolvido ✅

O sistema agora **funciona corretamente no mobile** para:
- ✅ Exportar PDF
- ✅ Exportar CSV/Excel
- ✅ Exportar Backup de Dados

### Como Funciona

No **mobile**, ao clicar em exportar:
1. O arquivo é salvo na pasta Documents do dispositivo
2. Uma tela de compartilhamento é aberta automaticamente
3. Você pode escolher onde salvar ou compartilhar (WhatsApp, Email, Drive, etc.)

No **desktop**, ao clicar em exportar:
1. O arquivo é baixado diretamente na pasta de Downloads
2. Funciona como um download normal do navegador

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **UI**: Shadcn/ui + Tailwind CSS
- **Mobile**: Capacitor
- **PDF**: jsPDF + autoTable
- **Storage**: LocalStorage (navegador)
- **Backup**: Sistema próprio de exportação/importação JSON

---

## 📋 Estrutura de Dados

### Obreiros
```typescript
{
  id: string;
  nome: string;
  ativo: boolean;
}
```

### Locais de Culto
```typescript
{
  id: string;
  nome: string;
  codigo: string;
  tipo: 'circulo' | 'pregacao';
  ativo: boolean;
}
```

### Escalas
```typescript
{
  id: string;
  data: string;
  diaSemana: string;
  periodo: 'manha' | 'tarde' | 'noite';
  tipo: 'circulo' | 'pregacao';
  obreiroId: string;
  obreiroNome: string;
  localId: string;
  localNome: string;
  codigoCulto: string;
}
```

---

## 📁 Estrutura do Projeto

```
gestao-escalas-locais/
├── src/
│   ├── components/          # Componentes React
│   │   ├── DadosTab.tsx     # Nova aba de Backup/Restore
│   │   ├── ObreirosTab.tsx
│   │   ├── LocaisTab.tsx
│   │   ├── GerarEscalaTab.tsx
│   │   └── VisualizarEscalaTab.tsx
│   ├── lib/
│   │   ├── fileManager.ts      # Gerenciador de arquivos multiplataforma
│   │   ├── backupService.ts    # Sistema de backup/restore
│   │   ├── pdfGenerator.ts     # Geração de PDF
│   │   ├── escalaGenerator.ts  # Geração de escalas
│   │   └── storage.ts          # LocalStorage
│   └── types/
├── android/                 # Projeto Android (Capacitor)
├── start-windows.bat       # Script de inicialização Windows
├── start-windows.ps1       # Script PowerShell
├── INSTALACAO_WINDOWS.md   # Guia de instalação Windows
├── INSTRUCOES_APK.md       # Guia de build Android
└── README_INSTALACAO.md    # Este arquivo
```

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Construir para produção
npm run preview          # Visualizar build de produção

# Windows
npm run start:windows    # Build + Preview (produção local)

# Android
npm run android:sync     # Sincronizar com Android
npm run android:open     # Abrir no Android Studio

# Linter
npm run lint             # Verificar código
```

---

## 🐛 Solução de Problemas

### No Mobile

**Problema**: Botão de download não funciona  
**Solução**: Atualizado! Agora usa Capacitor Filesystem + Share ✅

**Problema**: Arquivos não aparecem na galeria  
**Solução**: Os arquivos ficam em Documents e podem ser compartilhados

### No Desktop

**Problema**: Porta 5173 ocupada  
**Solução**: `npm run dev -- --port 3000`

**Problema**: Página em branco  
**Solução**: Limpe o cache do navegador (Ctrl+Shift+Del)

### Geral

**Problema**: Perdi meus dados  
**Solução**: Importe o último backup da aba "Dados"

**Problema**: Como transferir dados do celular para PC?  
**Solução**: Exporte no celular, envie o arquivo para o PC via email/drive, importe no PC

---

## 📊 Formato de Exportação

### PDF
- Formato oficial da Igreja Evangélica Assembleia de Deus
- Cabeçalho com informações da igreja
- Tabela de locais (Congregações e Pontos de Pregação)
- Escalas organizadas por data e período
- Rodapé com área e mês/ano

### CSV
- Formato compatível com Excel e Google Sheets
- Colunas: Data, Dia, Período, Tipo, Obreiro, Código, Local
- Codificação UTF-8 com BOM

### JSON (Backup)
- Formato completo com todos os dados
- Inclui: obreiros, locais, escalas
- Metadados: versão e timestamp
- Pode ser importado em qualquer dispositivo

---

## 🔐 Segurança e Privacidade

- ✅ Todos os dados são armazenados **localmente** no dispositivo
- ✅ Nenhum dado é enviado para servidores externos
- ✅ Você tem controle total sobre seus backups
- ✅ Funciona **offline** após a primeira instalação

---

## 📱 Requisitos do Sistema

### Windows
- Windows 7 ou superior
- Node.js 16+ (necessário para desenvolvimento)
- Navegador moderno (Chrome, Edge, Firefox)
- 4GB RAM mínimo

### Android
- Android 7.0 (API 24) ou superior
- 100MB espaço livre
- Permissões: Armazenamento (para exportação)

---

## 🎯 Roadmap Futuro

- [ ] Dark mode automático
- [ ] Notificações de lembrete
- [ ] Impressão direta (sem PDF)
- [ ] Multi-idiomas
- [ ] Sincronização em nuvem (opcional)
- [ ] Versão iOS

---

## 👨‍💻 Desenvolvimento

Para contribuir ou customizar:

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

---

## 📄 Licença

Este projeto foi desenvolvido para uso interno da Igreja Evangélica Assembleia de Deus.

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte este README
2. Consulte INSTALACAO_WINDOWS.md ou INSTRUCOES_APK.md
3. Verifique a seção de Solução de Problemas
4. Entre em contato com o desenvolvedor

---

**Desenvolvido com ❤️ para a Igreja Evangélica Assembleia de Deus**

Versão: 1.0  
Última atualização: Outubro 2025


