# sejamais2

## Arquitetura de Pagamento (nova)

A aplicação passou de _Payment Links_ do Pagar.me para um **checkout próprio** que
cria sessões na nossa API e, em seguida, gera orders/charges via [Pagar.me
Core API v5](https://docs.pagar.me). O tracking do Meta Pixel e da Conversions
API continua funcionando com deduplicação por eventId.

### Variáveis de ambiente importantes

Copie server/.env.example → server/.env e defina:

- PAGARME*API_KEY – chave secreta (use sk_test*… em sandbox).
- PAGARME_PUBLIC_API_KEY – chave pública para tokenização no browser.
- PAGARME_WEBHOOK_SECRET – utilizado para validar assinatura HMAC dos
  webhooks (sempre rotacione se vazado).
- META_PIXEL_ID, META_ACCESS_TOKEN, META_API_VERSION – para enviar eventos
  CAPI.
- (opcional) PAYMENTLINK\_\* – somente necessário enquanto a rota legada /api/checkout
  estiver ativa. Podem ser removidas depois da migração.
- REACT_APP_USE_CHECKOUT_SESSION=true – ativa o fluxo novo no frontend.

### Endpoints de pagamento

| Rota                    | Método | Descrição                                    |
| ----------------------- | ------ | -------------------------------------------- |
| /api/plans              | GET    | lista de planos e valores                    |
| /api/checkout/session   | POST   | cria sessão nova (vazia)                     |
| /api/checkout/session   | GET    | retorna sessão existente (usa sessionId).    |
| /api/checkout/pay       | POST   | executa pagamento (ordem/charge)             |
| /api/checkout           | POST   | **legado**: cria / reusa payment link        |
| /api/paymentlink-lookup | GET    | consulta mapeamento (mantém compatibilidade) |
| /api/webhook/pagarme    | POST   | recebe eventos Pagar.me e envia Meta CAPI    |

### Dados persistidos

Uso momentâneo de JSON em server/sessions.json e server/orders.json.
Estas tabelas contêm sessionId, orderId, tracking Meta e status; elas são
nossas fontes de verdade e podem ser migradas para um DB quando necessário.

### Fluxo do cliente

1. Usuário clica em um plano; frontend chama POST /api/checkout/session.
2. Redireciona para /checkout?session=<id> ou abre modal com formulário.
3. Dados de cartão são tokenizados com a chave pública via script do Pagar.me.
4. O browser envia POST /api/checkout/pay com o card_token.
5. Em paralelo, pixel InitiateCheckout, AddPaymentInfo e Purchase são
   disparados com eventID obtido do cookie.
6. O servidor cria order/charge, armazena sessão e responde ao cliente.
7. Webhook charge.paid atualiza status e dispara evento para Meta CAPI.

### Webhooks e Meta

O servidor valida o header x-hub-signature e busca session_id, order_id
ou charge_id no payload. Ele monta meta_events.json local e tenta enviá‑lo à
API de conversões (configurada via env). O event_id é o mesmo gerado no
navegador para evitar duplicações.

### Testes

Rodar
pm run test executa testes de unidade e integração novos:

- storage.test.ts verifica operações atômicas de JSON.
- checkout.test.ts valida criação de sessão, pagamento simulado e webhook.

### Notas de segurança

- **Não** armazene dados de cartão em banco ou logs.
- Tokens sensíveis devem ser mascarados em astify.log.
- Chaves no histórico git devem ser rotacionadas imediatamente.

### Migração gradual

1. Deployar backend e frontend com ambos os flows habilitados.
2. Ajustar REACT_APP_USE_CHECKOUT_SESSION para rue em staging.
3. Monitorar sessions.json e meta_events.json para garantir tracking.
4. Após confirmar funcionamento em produção, remova rota /api/checkout e
   variáveis PAYMENTLINK\_\*.

> Para rollback rápido, basta reverter o commit que modifica OfertasSection
> e desfazer quaisquer alterações de backend; o flow legados continua operando
> com payment links pré‑criados.
> ementar e documentar.
