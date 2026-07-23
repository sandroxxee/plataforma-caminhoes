@echo off
echo ====================================
echo 1. Adicionando arquivos alterados...
echo ====================================
git add .

echo.
echo ====================================
echo 2. Criando o commit de atualizacoes...
echo ====================================
git commit -m "fix(header): usar PublicHeader em vez de PublicHeaderClient para resolver build no Vercel"

echo.
echo ====================================
echo 3. Enviando para o GitHub...
echo ====================================
git push

echo.
echo ====================================
echo PUSH CONCLUIDO COM SUCESSO!
echo Pressione qualquer tecla para fechar esta janela.
echo ====================================
pause
