# Push Traldi's Hoops to GitHub - KhaledCoins/TraldisHoops
# Execute no PowerShell: .\push-to-github.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path .git)) {
    Write-Host "Inicializando repositório Git..."
    git init
    git branch -M main
}

$remote = "origin"
$url = "https://github.com/KhaledCoins/TraldisHoops.git"

if ((git remote 2>$null) -notcontains $remote) {
    Write-Host "Adicionando remote $remote..."
    git remote add $remote $url
} else {
    git remote set-url $remote $url
    Write-Host "Remote $remote configurado."
}

Write-Host "Adicionando arquivos..."
git add -A
Write-Host "Status:"
git status --short

Write-Host "`nCommitando..."
git commit -m "Traldis Hoops - Fila digital, Painel Admin, Painel TV, integração Supabase"

Write-Host "`nEnviando para GitHub (main)..."
git push -u origin main

Write-Host "`nConcluído! Repositório: https://github.com/KhaledCoins/TraldisHoops"
