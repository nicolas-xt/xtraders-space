
# 🔥 Guia de Configuração do Firebase

## ⚠️ Problema Comum: Domínio Não Autorizado

Se o login do Google redireciona mas não autentica, provavelmente o domínio do Replit não está autorizado no Firebase.

## ✅ Solução: Adicionar Domínio Autorizado

1. **Identifique o domínio do seu Repl**
   - Olhe a URL da sua aplicação
   - Exemplo: `seu-projeto-abc123.replit.dev`

2. **Acesse o Firebase Console**
   - Vá para: https://console.firebase.google.com
   - Selecione o projeto: `xtraders-space`

3. **Configure o Authentication**
   - No menu lateral, clique em **Authentication**
   - Vá na aba **Sign-in method**
   - **Verifique se o Google está ATIVADO** (toggle verde)

4. **Adicione o Domínio Autorizado**
   - Na mesma página, role até **Authorized domains**
   - Clique em **Add domain**
   - Adicione: `[SEU-REPL].replit.dev` (substitua pelo domínio real)
   - Clique em **Add**

5. **Teste Novamente**
   - Recarregue a aplicação
   - Tente fazer login novamente

## 🔍 Como Verificar se Está Funcionando

Após adicionar o domínio, abra o console do navegador e procure por:

✅ **Sucesso:**
```
✅ Sign-in successful!
User: Seu Nome
Email: seu@email.com
```

❌ **Erro de domínio:**
```
Error code: auth/unauthorized-domain
```

❌ **Erro de configuração:**
```
Error code: auth/operation-not-allowed
```

## 📋 Checklist Final

- [ ] Domínio do Repl adicionado em "Authorized domains"
- [ ] Provedor Google está ATIVADO em "Sign-in method"
- [ ] As 3 variáveis de ambiente estão configuradas nos Secrets
- [ ] Página foi recarregada após as mudanças

## 🆘 Se Ainda Não Funcionar

Verifique os logs do console e me envie:
1. A mensagem de erro completa
2. O domínio atual (window.location.hostname)
3. Se o provedor Google aparece como habilitado no Firebase Console
