@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist .git (
    echo Inicializando repositorio Git...
    git init
    git branch -M main
)

echo Configurando remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/KhaledCoins/TraldisHoops.git
if errorlevel 1 (
    git remote set-url origin https://github.com/KhaledCoins/TraldisHoops.git
)

echo Adicionando arquivos...
git add -A
git status

echo.
echo Commitando...
git commit -m "Traldis Hoops - Fila digital, Painel Admin, Painel TV, Supabase" || echo Nada para commitar ou ja commitado.

echo.
echo Enviando para GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo Se pedir login, use seu usuario GitHub e um Personal Access Token como senha.
    echo Ou configure SSH: https://docs.github.com/en/authentication
)

echo.
echo Concluido: https://github.com/KhaledCoins/TraldisHoops
pause
