# EchoPort - Script de Deploy (PowerShell)
# Execute com: .\deploy.ps1

Write-Host "🚀 EchoPort - Script de Deploy" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se há mudanças não commitadas
$status = git status --short
if ($status) {
    Write-Host "📝 Mudanças detectadas. Fazendo commit..." -ForegroundColor Yellow
    git add .
    $commitMsg = Read-Host "Digite a mensagem do commit"
    git commit -m $commitMsg
} else {
    Write-Host "✅ Nenhuma mudança para commitar" -ForegroundColor Green
}

# Push para GitHub
Write-Host ""
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Backend será atualizado automaticamente no Render (2-5 min)"
Write-Host "2. Frontend será atualizado no GitHub Pages (1-2 min)"
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: https://allanrehder.github.io/EchoPort/"
Write-Host "   Backend: https://echoport-api.onrender.com"
Write-Host ""
