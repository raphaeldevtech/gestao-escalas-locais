# Instalação e Execução no Windows

## Sistema de Gestão de Escalas Locais
### Igreja Evangélica Assembleia de Deus

---

## 📋 Pré-requisitos

Antes de executar o aplicativo, você precisa ter instalado:

### 1. Node.js (Obrigatório)
- **Download**: https://nodejs.org/
- **Versão recomendada**: LTS (Long Term Support)
- **Como instalar**:
  1. Baixe o instalador do site oficial
  2. Execute o instalador
  3. Siga as instruções (deixe as opções padrão marcadas)
  4. Reinicie o computador após a instalação

### 2. Git (Opcional - apenas se for clonar o repositório)
- **Download**: https://git-scm.com/download/win
- Necessário apenas se você estiver clonando o projeto do GitHub

---

## 🚀 Métodos de Execução

### Método 1: Usando o arquivo .bat (Mais Simples)

1. **Localize o arquivo** `start-windows.bat` na pasta do projeto
2. **Dê um duplo clique** no arquivo
3. Uma janela de comando será aberta
4. Aguarde o carregamento (pode demorar na primeira vez)
5. O navegador abrirá automaticamente com o aplicativo

**Dica**: Você pode criar um atalho do arquivo .bat na área de trabalho para facilitar o acesso!

### Método 2: Usando PowerShell

1. Clique com o botão direito na pasta do projeto
2. Selecione "Abrir no Terminal" ou "Abrir janela do PowerShell aqui"
3. Execute o comando:
   ```powershell
   .\start-windows.ps1
   ```
4. O navegador abrirá automaticamente

### Método 3: Linha de Comando (Avançado)

1. Abra o Prompt de Comando ou PowerShell
2. Navegue até a pasta do projeto:
   ```cmd
   cd caminho\para\gestao-escalas-locais
   ```
3. Execute um dos seguintes comandos:
   ```cmd
   npm run dev
   ```
   ou
   ```cmd
   npm run preview
   ```

---

## 📦 Primeira Execução

Na primeira vez que você executar o aplicativo, o processo pode demorar um pouco mais porque:

1. **Instalação de dependências**: O sistema vai baixar todas as bibliotecas necessárias
2. **Compilação do projeto**: O código será preparado para execução

**Isso é normal!** Nas próximas execuções será muito mais rápido.

---

## 🌐 Acessando o Aplicativo

Após iniciar o servidor, o aplicativo estará disponível em:

- **Endereço**: http://localhost:5173
- **Navegador recomendado**: Chrome, Edge ou Firefox

Se o navegador não abrir automaticamente:
1. Abra seu navegador manualmente
2. Digite na barra de endereços: `localhost:5173`
3. Pressione Enter

---

## 🛑 Como Fechar o Aplicativo

Para encerrar o servidor:

1. Vá até a janela do terminal/prompt que está rodando o aplicativo
2. Pressione `Ctrl + C`
3. Confirme com `S` (Sim) se solicitado
4. Feche a janela do terminal

---

## 📱 Versão Mobile (Android)

Para gerar o APK para Android:

1. Abra o terminal na pasta do projeto
2. Execute os comandos:
   ```cmd
   npm run build
   npx cap sync android
   npx cap open android
   ```
3. O Android Studio será aberto
4. Compile e gere o APK pelo Android Studio

Consulte o arquivo `INSTRUCOES_APK.md` para mais detalhes.

---

## 🔧 Solução de Problemas

### Problema: "Node.js não foi encontrado"
**Solução**: Instale o Node.js conforme os pré-requisitos acima

### Problema: "Erro ao instalar dependências"
**Solução**: 
1. Verifique sua conexão com a internet
2. Execute: `npm cache clean --force`
3. Tente novamente: `npm install`

### Problema: "Porta 5173 já está em uso"
**Solução**: 
1. Feche qualquer instância anterior do aplicativo
2. Ou use outra porta: `npm run dev -- --port 3000`

### Problema: O navegador não abre automaticamente
**Solução**: Abra manualmente e acesse `http://localhost:5173`

### Problema: Página em branco após abrir
**Solução**:
1. Aguarde alguns segundos (pode estar compilando)
2. Pressione F5 para atualizar a página
3. Verifique se há erros no console do navegador (F12)

---

## 💾 Backup e Dados

Os dados do aplicativo são armazenados no navegador (LocalStorage). Para fazer backup:

1. Acesse a aba "Dados" no aplicativo
2. Clique em "Exportar Todos os Dados"
3. Salve o arquivo JSON em local seguro
4. Para restaurar, use o botão "Importar Dados"

**Importante**: Faça backups regulares para não perder seus dados!

---

## 📞 Suporte

Se você encontrar problemas:

1. Verifique se seguiu todos os passos corretamente
2. Leia a seção "Solução de Problemas" acima
3. Verifique os logs no terminal para mensagens de erro
4. Consulte a documentação do projeto

---

## 📝 Notas Adicionais

- **Segurança**: Este aplicativo roda localmente no seu computador
- **Internet**: Necessária apenas para instalação inicial
- **Dados**: Armazenados localmente no navegador
- **Atualizações**: Execute `git pull` para obter novas versões
- **Performance**: Recomendado mínimo de 4GB RAM

---

## ✅ Checklist Rápido

- [ ] Node.js instalado
- [ ] Projeto baixado/clonado
- [ ] Executou o arquivo .bat ou script
- [ ] Aguardou a instalação na primeira vez
- [ ] Navegador abriu com o aplicativo
- [ ] Testou criar obreiros, locais e escalas

---

**Desenvolvido para a Igreja Evangélica Assembleia de Deus**

Versão: 1.0  
Última atualização: Outubro 2025


