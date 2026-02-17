const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");

// CORS básico para desenvolvimento (ajuste em produção)
fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
});

// Preserva rawBody para validar assinaturas de webhook (X-Hub-Signature)
// Substitui o parser JSON padrão apenas para armazenar o raw body — evita dependências extras.
fastify.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (req, body, done) {
    try {
      // body vem como string aqui; guardamos para validação HMAC e então parseamos
      req.rawBody = body;
      done(null, JSON.parse(body));
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
  },
);

// Phase 1: stub dos planos (usa os mesmos payment-links já presentes no frontend)
const PLANS = {
  experience: {
    id: "experience",
    name: "1 unidade",
    subtitle: "Primeira compra",
    originalPrice: "R$ 499,99",
    price: "R$ 399,99",
    installments: "ou 6x de R$ 66,67",
    features: [
      "1 pote EU+ (30 porções)",
      "Frete Grátis — Melhor Envio",
      "Garantia de 90 dias",
      "Acesso ao grupo VIP",
    ],
    featured: false,
    cta: "Comprar 1 unidade",
    badge: "1ª compra",
    amount: 39999,
    payment_link: process.env.PAYMENTLINK_EXPERIENCE
      ? `https://payment-link-v3.pagar.me/${process.env.PAYMENTLINK_EXPERIENCE}`
      : "https://payment-link-v3.pagar.me/pl_zl8mvbaRwpMqnzYs2SlA5e4ZKVjo3Qr0",
  },
  last_option: {
    id: "last_option",
    name: "2 unidades",
    subtitle: "Melhor custo",
    originalPrice: "R$ 999,98",
    price: "R$ 759,98 (R$ 379,99/unidade)",
    installments: "ou 6x de R$ 126,66",
    features: [
      "2 potes EU+ (60 porções)",
      "Frete Grátis — Melhor Envio",
      "Garantia 90 dias",
    ],
    featured: false,
    cta: "Comprar 2 unidades",
    amount: 75998,
    payment_link: process.env.PAYMENTLINK_LAST_OPTION
      ? `https://payment-link-v3.pagar.me/${process.env.PAYMENTLINK_LAST_OPTION}`
      : "https://payment-link-v3.pagar.me/pl_okertjn0DjM2v1mWp31SW3hwnvfubv56GHFSVD7r",
  },
  transformation: {
    id: "transformation",
    name: "3 unidades",
    subtitle: "Maior economia",
    originalPrice: "R$ 1.499,97",
    price: "R$ 1.079,97 (R$ 359,99/unidade)",
    installments: "ou 6x de R$ 180,00",
    features: [
      "3 potes EU+ (90 porções)",
      "Frete Grátis — Melhor Envio",
      "Garantia 90 dias",
      "E-book: Guia da Juventude Funcional",
      "Acesso ao grupo VIP",
    ],
    featured: true,
    cta: "Comprar 3 unidades",
    badge: "Mais Vendido",
    amount: 107997,
    payment_link: process.env.PAYMENTLINK_TRANSFORMATION
      ? `https://payment-link-v3.pagar.me/${process.env.PAYMENTLINK_TRANSFORMATION}`
      : "https://payment-link-v3.pagar.me/pl_zygDjM2v1mWp31SW3hw74dPbZwAJVEle",
  },
};

const fs = require("fs");
const crypto = require("crypto");

// Suporte a links pré-criados (defina PAYMENTLINK_EXPERIENCE, PAYMENTLINK_LAST_OPTION e PAYMENTLINK_TRANSFORMATION em produção)
const PRECREATED_LINKS = {
  experience:
    process.env.PAYMENTLINK_EXPERIENCE ||
    process.env.PAGARME_PAYMENTLINK_EXPERIENCE ||
    null,
  last_option:
    process.env.PAYMENTLINK_LAST_OPTION ||
    process.env.PAGARME_PAYMENTLINK_LAST_OPTION ||
    null,
  transformation:
    process.env.PAYMENTLINK_TRANSFORMATION ||
    process.env.PAGARME_PAYMENTLINK_TRANSFORMATION ||
    null,
};

// Persistência local (opção B) — arquivo que guarda o first-created link quando ENV não existe
const PERSISTED_LINKS_PATH = path.resolve(__dirname, "paymentlinks.json");
let persistedLinks = {};
try {
  if (fs.existsSync(PERSISTED_LINKS_PATH)) {
    const raw = fs.readFileSync(PERSISTED_LINKS_PATH, "utf-8");
    persistedLinks = JSON.parse(raw || "{}");
    // preencher PRECREATED_LINKS com valores persistidos caso ENV não tenha sido setada
    PRECREATED_LINKS.experience =
      PRECREATED_LINKS.experience || persistedLinks.experience || null;
    PRECREATED_LINKS.transformation =
      PRECREATED_LINKS.transformation || persistedLinks.transformation || null;
  }
} catch (e) {
  // não interromper a inicialização por erro de leitura do arquivo
  console.warn("Could not read persisted payment links file", e);
}

async function persistPaymentLink(planId, paymentLinkId) {
  try {
    persistedLinks = { ...(persistedLinks || {}), [planId]: paymentLinkId };
    await fs.promises.writeFile(
      PERSISTED_LINKS_PATH,
      JSON.stringify(persistedLinks, null, 2),
      { encoding: "utf8" },
    );
    // also update runtime PRECREATED_LINKS so subsequent requests reuse immediately
    PRECREATED_LINKS[planId] = paymentLinkId;
    fastify.log.info(
      { planId, paymentLinkId },
      "persisted payment link to disk",
    );
  } catch (err) {
    fastify.log.error({ err }, "failed to persist payment link");
  }
}

fastify.get("/health", async () => ({ status: "ok" }));

// GET /api/plans — retorna lista de planos (source of truth centralizado)
fastify.get("/api/plans", async () => {
  const out = Object.values(PLANS).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle || p.name,
    originalPrice: p.originalPrice || null,
    price: p.price || null,
    installments: p.installments || null,
    features: p.features || [],
    featured: p.featured || false,
    cta: p.cta || "Comprar",
    badge: p.badge || null,
    hrefButton: p.payment_link || null,
    amount: p.amount,
  }));
  return { ok: true, plans: out };
});

// POST /api/checkout — Phase 2: cria / reusa Payment Link via Pagar.me
fastify.post("/api/checkout", async (request, reply) => {
  const { planId } = request.body || {};
  if (!planId) {
    return reply.status(400).send({ error: "planId is required" });
  }

  const plan = PLANS[planId];
  if (!plan) {
    return reply.status(404).send({ error: "Plano não encontrado" });
  }

  // 1) Se houver link pré-criado via ENV, reutilizamos imediatamente (não criamos novo link)
  const envLinkRaw = PRECREATED_LINKS[planId];
  if (envLinkRaw) {
    const url = envLinkRaw.startsWith("http")
      ? envLinkRaw
      : `https://payment-link-v3.pagar.me/${envLinkRaw}`;

    // Se tivermos chave da API, validamos se o link existe/está ativo — não é obrigatório
    const pagarmeKey = process.env.PAGARME_API_KEY;
    if (pagarmeKey) {
      try {
        const id = envLinkRaw.startsWith("pl_")
          ? envLinkRaw
          : envLinkRaw.split("/").pop();
        const apiBase = "https://api.pagar.me/core/v5";
        const authHeader =
          "Basic " + Buffer.from(`${pagarmeKey}:`).toString("base64");
        const checkRes = await fetch(
          `${apiBase}/paymentlinks/${encodeURIComponent(id)}`,
          {
            headers: { Authorization: authHeader, Accept: "application/json" },
          },
        );
        if (checkRes.ok) {
          const checkJson = await checkRes.json();
          if (checkJson.status === "active") {
            return reply.send({
              ok: true,
              url,
              reused: true,
              shippingCarrier: "Melhor Envio",
              source: "env",
            });
          }
          request.log.warn(
            { planId, envLink: id, status: checkJson.status },
            "precreated payment link not active",
          );
        } else {
          request.log.warn(
            { planId, envLink: envLinkRaw, status: checkRes.status },
            "failed to validate precreated payment link",
          );
        }
      } catch (err) {
        request.log.warn({ err }, "error validating precreated payment link");
      }
    } else {
      // sem chave da API, retornamos o link conforme informado no ENV
      return reply.send({
        ok: true,
        url,
        reused: true,
        shippingCarrier: "Melhor Envio",
        source: "env",
      });
    }
  }

  const pagarmeKey = process.env.PAGARME_API_KEY;
  if (!pagarmeKey) {
    // fallback para link estático se não houver chave
    return reply.send({
      ok: false,
      error: "PAGARME_API_KEY not configured on server",
      url: plan.payment_link,
      fallback: true,
    });
  }

  const linkName = `sejamais2-${plan.id}-${plan.amount}`; // nome determinístico para evitar duplicações
  const apiBase = "https://api.pagar.me/core/v5";
  const authHeader =
    "Basic " + Buffer.from(`${pagarmeKey}:`).toString("base64");

  try {
    // 1) tentar reusar link existente com mesmo name e status active
    const listRes = await fetch(
      `${apiBase}/paymentlinks?name=${encodeURIComponent(linkName)}&status=active`,
      {
        headers: { Authorization: authHeader, Accept: "application/json" },
      },
    );

    if (listRes.ok) {
      const listJson = await listRes.json();
      const maybeArray = Array.isArray(listJson)
        ? listJson
        : listJson?.data || [];
      if (maybeArray.length > 0 && maybeArray[0].url) {
        return reply.send({
          ok: true,
          url: maybeArray[0].url,
          reused: true,
          shippingCarrier: "Melhor Envio",
        });
      }
    }

    // 2) criar novo Payment Link
    const payload = {
      type: "order",
      name: linkName,
      order_code: `sejamais2_${plan.id}_${Date.now()}`,
      payment_settings: {
        accepted_payment_methods: ["pix", "credit_card"],
        credit_card_settings: {
          operation_type: "auth_and_capture",
          max_installments: 6,
          installments: Array.from({ length: 6 }, (_, i) => ({
            number: i + 1,
            total: plan.amount,
          })),
          use_brand_interest_rate: false,
          customer_fee: false,
        },
        pix_settings: {
          expires_in: 86400,
          discount: 0,
          discount_percentage: 0,
        },
      },
      cart_settings: {
        items: [
          {
            // incluir transportadora no nome do item para que apareça no checkout
            name: `${plan.name} — Envio: Melhor Envio`,
            // descrição usada pelo checkout do Pagar.me
            description: `EU+ — suplemento rejuvenescedor — Frete Grátis (Envio via Melhor Envio)`,
            amount: plan.amount,
            default_quantity: 1,
            shipping_cost: 0,
          },
        ],
        shipping_cost: 0,
        shipping_total_cost: 0,
      },
      layout_settings: { hide_shipping_selector: true },
    };

    // tentativa 1: payload "payment_settings" (já montado)
    let createRes = await fetch(`${apiBase}/paymentlinks`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    let createJson = await createRes.json();

    // se validação falhar, tentar um payload alternativo compatível com SDK (payment_config)
    if (!createRes.ok) {
      const shouldTryAlternate =
        createJson &&
        createJson.errors &&
        (createJson.errors.PaymentSettings || createJson.errors.CartSettings);

      if (shouldTryAlternate) {
        const altPayload = {
          name: linkName,
          type: "order",
          order_code: `sejamais2_${plan.id}_${Date.now()}`,
          cart_settings: {
            items: [
              {
                id: plan.id,
                // título curto exibido no checkout — acrescenta transportadora
                title: `${plan.name} — Frete Grátis (Melhor Envio)`,
                unit_price: plan.amount,
                quantity: 1,
                tangible: true,
              },
            ],
            shipping_cost: 0,
          },
          payment_config: {
            credit_card: { enabled: true, max_installments: 6 },
            boleto: { enabled: true, expires_in: 3 },
            default_payment_method: "credit_card",
          },
        };

        request.log.info(
          { altPayload },
          "trying alternate payment_config payload",
        );
        const altRes = await fetch(`${apiBase}/paymentlinks`, {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(altPayload),
        });

        createJson = await altRes.json();
        createRes = altRes;
      }
    }

    if (!createRes.ok) {
      // fallback: retornar link estático guardado no PLANS
      request.log.error(
        { status: createRes.status, body: createJson },
        "pagarme create link failed",
      );
      return reply.status(502).send({
        ok: false,
        error: "Pagar.me error",
        details: createJson,
        url: plan.payment_link,
        fallback: true,
      });
    }

    // extrair URL de resposta (compatível com formatos possíveis)
    const url =
      createJson.url ||
      createJson.short_url ||
      (createJson?.data &&
        (createJson.data.url || createJson.data.short_url)) ||
      plan.payment_link;

    // Persistir o link criado apenas se não houver um link pré-criado via ENV
    try {
      const createdId =
        createJson.id ||
        (createJson?.data && createJson.data.id) ||
        (url && url.split("/").pop());
      if (
        createdId &&
        !process.env[`PAYMENTLINK_${planId.toUpperCase()}`] &&
        !persistedLinks[planId]
      ) {
        // grava em server/paymentlinks.json para reutilização futura
        await persistPaymentLink(planId, createdId);
      }
    } catch (err) {
      request.log.warn({ err }, "unable to persist created payment link");
    }

    return reply.send({
      ok: true,
      url,
      shippingCarrier: "Melhor Envio",
      raw: createJson,
    });
  } catch (err) {
    request.log.error(err);
    // fallback para link estático
    return reply.status(500).send({
      ok: false,
      error: "internal_error",
      message: String(err),
      url: plan.payment_link,
      fallback: true,
    });
  }
});

// POST /api/webhook/pagarme — valida assinatura HMAC SHA256 em X-Hub-Signature
fastify.post("/api/webhook/pagarme", async (request, reply) => {
  const raw = request.rawBody || JSON.stringify(request.body || {});
  const signatureHeader =
    request.headers["x-hub-signature"] ||
    request.headers["x-hub-signature-256"] ||
    request.headers["x-signature"];

  const webhookSecret = process.env.PAGARME_WEBHOOK_SECRET;

  if (webhookSecret) {
    if (!signatureHeader) {
      request.log.warn("missing x-hub-signature header on webhook");
      return reply.status(401).send({ ok: false, error: "missing_signature" });
    }

    const received = String(signatureHeader)
      .replace(/^sha256=/i, "")
      .trim();
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(raw)
      .digest("hex");

    try {
      const valid = crypto.timingSafeEqual(
        Buffer.from(received, "hex"),
        Buffer.from(expected, "hex"),
      );
      if (!valid) {
        request.log.warn(
          { received, expected: expected.substring(0, 8) },
          "invalid webhook signature",
        );
        return reply
          .status(401)
          .send({ ok: false, error: "invalid_signature" });
      }
    } catch (err) {
      request.log.warn({ err }, "signature verification failed");
      return reply
        .status(401)
        .send({ ok: false, error: "invalid_signature_format" });
    }
  } else {
    request.log.warn(
      "PAGARME_WEBHOOK_SECRET not set — skipping signature validation (NOT for production)",
    );
  }

  const event = request.body?.event || request.body?.type || "unknown";
  request.log.info({ event }, "pagar.me webhook received");

  // Persist webhook events locally for troubleshooting (no DB)
  try {
    const webhooksPath = path.resolve(__dirname, "webhooks.json");
    const entry = {
      ts: new Date().toISOString(),
      event,
      payload: request.body,
    };
    let arr = [];
    if (fs.existsSync(webhooksPath)) {
      arr = JSON.parse(fs.readFileSync(webhooksPath, "utf8") || "[]");
    }
    arr.push(entry);
    // keep last 200 events
    await fs.promises.writeFile(
      webhooksPath,
      JSON.stringify(arr.slice(-200), null, 2),
      "utf8",
    );
  } catch (err) {
    request.log.warn({ err }, "failed to persist webhook locally");
  }

  // Basic handling — log important events; user can extend to notify/email/etc.
  if (["checkout.closed", "order.paid", "charge.paid"].includes(event)) {
    request.log.info(
      { body: request.body },
      "important event received (consider fulfill/notify)",
    );
  }

  return reply.code(200).send({ ok: true });
});

const start = async () => {
  try {
    // Preflight: avisos de produção para evitar deploy mal configurado
    if (process.env.NODE_ENV === "production") {
      const missing = [];
      if (!process.env.PAGARME_API_KEY) missing.push("PAGARME_API_KEY");
      if (!PRECREATED_LINKS.experience) missing.push("PAYMENTLINK_EXPERIENCE");
      if (!PRECREATED_LINKS.transformation)
        missing.push("PAYMENTLINK_TRANSFORMATION");
      if (missing.length) {
        fastify.log.warn(
          `Possíveis variáveis ausentes em production: ${missing.join(", ")}. Recomendo definir PAYMENTLINK_* e PAGARME_API_KEY em produção.`,
        );
      }
    }

    const port = process.env.PORT || 4000;
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
