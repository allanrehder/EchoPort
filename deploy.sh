#!/bin/bash

echo "🚀 EchoPort - Script de Deploy"
echo "================================"
echo ""

# Verificar se há mudanças não commitadas
if [[ -n $(git status -s) ]]; then
    echo "📝 Mudanças detectadas. Fazendo commit..."
    git add .
    read -p "Digite a mensagem do commit: " commit_msg
    git commit -m "$commit_msg"
else
    echo "✅ Nenhuma mudança para commitar"
fi

# Push para GitHub
echo ""
echo "📤 Enviando para GitHub..."
git push origin main

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Backend será atualizado automaticamente no Render (2-5 min)"
echo "2. Frontend será atualizado no GitHub Pages (1-2 min)"
echo ""
echo "🌐 URLs:"
echo "   Frontend: https://allanrehder.github.io/EchoPort/"
echo "   Backend: https://echoport-api.onrender.com"
echo ""
