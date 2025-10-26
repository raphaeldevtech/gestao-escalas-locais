# Script PowerShell para iniciar o aplicativo no Windows
# Gestao de Escalas Locais

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Gestao de Escalas Locais" -ForegroundColor Green
Write-Host "  Igreja Evangelica Assembleia de Deus" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js esta instalado
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeExists) {
    Write-Host "ERRO: Node.js nao foi encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Node.js em: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "Node.js versao:" -NoNewline
node --version
Write-Host ""

# Verificar se as dependencias estao instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias pela primeira vez..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO ao instalar dependencias!" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
}

# Construir o projeto se nao existir a pasta dist
if (-not (Test-Path "dist")) {
    Write-Host "Construindo o projeto pela primeira vez..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERRO ao construir o projeto!" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
}

# Abrir o navegador
Write-Host "Abrindo o aplicativo no navegador..." -ForegroundColor Green
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

# Iniciar o servidor de desenvolvimento
Write-Host ""
Write-Host "O aplicativo esta rodando!" -ForegroundColor Green
Write-Host "Acesse: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para fechar" -ForegroundColor Yellow
Write-Host ""

npm run dev


