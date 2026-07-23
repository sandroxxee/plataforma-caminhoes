@echo off
echo ====================================
echo 1. Executando a Build do Next.js...
echo ====================================
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ====================================
    echo ❌ ERRO NA BUILD! O PUSH FOI CANCELADO.
    echo ====================================
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ====================================
echo 2. Adicionando arquivos alterados...
echo ====================================
git add .

echo.
echo ====================================
echo 3. Criando o commit de atualizacoes...
echo ====================================
git commit -m "feat: modulo de seguranca, auditoria, rastreamento de sessoes e alertas no painel admin"

echo.
echo ====================================
echo 4. Enviando para o GitHub...
echo ====================================
git push

echo.
echo ====================================
echo ✅ BUILD E PUSH CONCLUIDOS COM SUCESSO!
echo Pressione qualquer tecla para fechar esta janela.
echo ====================================
pause
