@echo off
echo ====================================
echo  Gestao de Escalas - Build Windows
echo ====================================
echo.

REM Desabilitar code signing
set CSC_IDENTITY_AUTO_DISCOVERY=false
set WIN_CSC_LINK=

echo Code signing desabilitado
echo.

echo [1/4] Verificando dependencias...
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/4] Construindo aplicacao web...
call npm run build
if errorlevel 1 (
    echo ERRO: Falha ao construir aplicacao
    pause
    exit /b 1
)

echo.
echo [3/4] Criando instalador Windows...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call electron-builder --win --config.win.sign=null
if errorlevel 1 (
    echo ERRO: Falha ao criar instalador
    pause
    exit /b 1
)

echo.
echo [4/4] Concluido!
echo.
echo ====================================
echo Instalador criado com sucesso!
echo Localizacao: dist-electron\
echo ====================================
echo.

pause

