# Script PowerShell para build do instalador Windows (sem assinatura)
Write-Host "====================================" -ForegroundColor Cyan
Write-Host " Gestao de Escalas - Build Windows" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Desabilitar code signing completamente
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:WIN_CSC_LINK = ""

Write-Host "Code signing desabilitado" -ForegroundColor Yellow
Write-Host ""

# Passo 1: Instalar dependências
Write-Host "[1/4] Verificando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependencias" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Passo 2: Build da aplicação
Write-Host ""
Write-Host "[2/4] Construindo aplicacao web..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao construir aplicacao" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Passo 3: Build do Electron (SEM code signing)
Write-Host ""
Write-Host "[3/4] Criando instalador Windows..." -ForegroundColor Yellow
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
electron-builder --win --config.win.sign=null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao criar instalador" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Passo 4: Conclusão
Write-Host ""
Write-Host "[4/4] Concluido!" -ForegroundColor Green
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Instalador criado com sucesso!" -ForegroundColor Green
Write-Host "Localizacao: dist-electron\" -ForegroundColor White
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Pressione Enter para sair"

