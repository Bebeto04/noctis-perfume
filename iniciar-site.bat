@echo off
chcp 65001 >nul
title NOCTIS - site no seu computador
cd /d "%~dp0"

echo.
echo   NOCTIS - iniciando o site no seu computador
echo   ------------------------------------------------
echo.

rem --- 1. Node.js instalado? -------------------------------------------------
where node >nul 2>nul
if errorlevel 1 goto sem_node

for /f "tokens=1 delims=v." %%a in ('node -v') do set NODE_MAJOR=%%a
if %NODE_MAJOR% LSS 20 goto node_antigo

rem --- 2. Dependências (rápido quando já estão instaladas) -------------------
echo   [1/3] Instalando ou conferindo as dependencias...
echo         Na primeira vez pode levar alguns minutos.
call npm install --no-audit --no-fund
if errorlevel 1 goto erro

rem --- 3. Versão otimizada ----------------------------------------------------
echo.
echo   [2/3] Preparando a versao otimizada do site...
call npm run build
if errorlevel 1 goto erro

rem --- 4. Sobe o site e abre o navegador quando estiver pronto ----------------
echo.
echo   [3/3] Site no ar em http://localhost:3000
echo.
echo   DEIXE ESTA JANELA ABERTA enquanto usa o site.
echo   Para desligar, feche esta janela.
echo.
if not defined NOCTIS_NO_BROWSER (
  start "" /min cmd /c "for /l %%i in (1,1,90) do (curl -s -o nul http://localhost:3000 && (start "" http://localhost:3000 & exit) || timeout /t 1 >nul)"
)
call npm start -- --port 3000
goto fim

:sem_node
echo   [!] O Node.js nao esta instalado neste computador.
echo.
echo       1. Na pagina que vai abrir, baixe e instale a versao LTS.
echo       2. Depois, de dois cliques neste arquivo de novo.
echo.
start "" https://nodejs.org/pt-br/download
pause
exit /b 1

:node_antigo
echo   [!] A versao do Node.js deste computador e muito antiga: %NODE_MAJOR%.
echo       O site precisa da versao 20 ou mais nova.
echo       Instale a versao LTS na pagina que vai abrir e rode este arquivo de novo.
echo.
start "" https://nodejs.org/pt-br/download
pause
exit /b 1

:erro
echo.
echo   [!] Algo deu errado. Leia a mensagem acima.
echo       Verifique a conexao com a internet e tente de novo.
echo.
pause
exit /b 1

:fim
