# sejamais2

## Pagar.me — preparação para produção

Passos recomendados antes de colocar em produção:

1. No painel do Pagar.me, crie UM Payment Link por plano (valor/descrição corretos).
   - Anote os IDs (começam com `pl_...`).
2. No servidor, copie `server/.env.example` → `server/.env` e configure:
   - `PAGARME_API_KEY` (chave de produção)
   - `PAYMENTLINK_EXPERIENCE` com o `pl_...` do plano 1
   - `PAYMENTLINK_TRANSFORMATION` com o `pl_...` do plano 2
3. Configure domínio e restrinja CORS no servidor (não usar origin: '\*').
4. Teste o checkout em sandbox antes do go-live.

> Nota: instruções sobre webhooks foram removidas a pedido — webhooks são opcionais e podem ser adicionados depois, se desejar.

Observações técnicas:

- O servidor primeiro verifica se existe um `PAYMENTLINK_*` configurado e usa esse link — evita duplicações.
- Se não houver link pré-criado, o servidor criará/reutilizará links via API do Pagar.me.

> Webhooks: (opcional) — não há implementação ativa de webhook neste repositório. Se quiser que eu adicione webhooks com validação HMAC, eu posso implementar e documentar.
