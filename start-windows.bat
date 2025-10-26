@echo off
title Gestao de Escalas Locais
echo ========================================
echo   Gestao de Escalas Locais
echo   Igreja Evangelica Assembleia de Deus
echo ========================================
echo.
echo Iniciando o servidor...
echo.

:: Verificar se Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao foi encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

:: Verificar se as dependencias estao instaladas
if not exist "node_modules\" (
    echo Instalando dependencias pela primeira vez...
    call npm install
    if %errorlevel% neq 0 (
        echo ERRO ao instalar dependencias!
        pause
        exit /b 1
    )
)

:: Construir o projeto se nao existir a pasta dist
if not exist "dist\" (
    echo Construindo o projeto pela primeira vez...
    call npm run build
    if %errorlevel% neq 0 (
        echo ERRO ao construir o projeto!
        pause
        exit /b 1
    )
)

:: Abrir o navegador
echo Abrindo o aplicativo no navegador...
timeout /t 2 /nobreak >nul
start http://localhost:5173

:: Iniciar o servidor de desenvolvimento
echo.
echo O aplicativo esta rodando!
echo Acesse: http://localhost:5173
echo.
echo Pressione Ctrl+C para fechar
echo.
call npm run dev

pause


