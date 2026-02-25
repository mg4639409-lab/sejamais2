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
      "Frete Grátis — Sedex",
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
      "Frete Grátis — Sedex",
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
      "Frete Grátis — Sedex",
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
    // strip BOM if present and safely parse
    const cleaned = (raw || "{}").replace(/^\uFEFF/, "");
    persistedLinks = JSON.parse(cleaned || "{}");
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

// Helper: load mapping file (paymentlinks.json) safely
function loadPaymentLinkMapping() {
  try {
    const mappingPath = path.resolve(__dirname, "paymentlinks.json");
    if (!fs.existsSync(mappingPath)) return {};
    const raw = fs.readFileSync(mappingPath, "utf8") || "{}";
    const cleaned = String(raw).replace(/^\uFEFF/, "");
    return JSON.parse(cleaned || "{}");
  } catch (e) {
    fastify.log.warn({ err: e }, "failed to load payment link mapping");
    return {};
  }
}

// Helper: persist meta event locally for review instead of sending to Meta
async function persistMetaEvent(event) {
  try {
    const outPath = path.resolve(__dirname, "meta_events.json");
    let arr = [];
    if (fs.existsSync(outPath)) {
      try {
        arr = JSON.parse(fs.readFileSync(outPath, "utf8") || "[]");
      } catch (e) {
        arr = [];
      }
    }
    arr.push(event);
    await fs.promises.writeFile(
      outPath,
      JSON.stringify(arr.slice(-1000), null, 2),
      "utf8",
    );
  } catch (e) {
    fastify.log.warn({ err: e }, "failed to persist meta event");
  }
}

// Send event to Meta Conversions API (only if PIXEL_ID and ACCESS_TOKEN set)
async function sendToMetaConversionsAPI(metaEvent) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const apiVersion = process.env.META_API_VERSION || "v17.0";
  if (!pixelId || !accessToken) {
    fastify.log.info(
      "META_PIXEL_ID or META_ACCESS_TOKEN not set — skipping send to Meta",
    );
    return { ok: false, reason: "missing_credentials" };
  }

  // Build payload according to Meta Conversions API
  const payload = {
    data: [
      {
        event_name: metaEvent.event_name || "Purchase",
        event_time: metaEvent.event_time || Math.floor(Date.now() / 1000),
        event_source_url:
          metaEvent.event_source_url || metaEvent.raw_webhook?.source || null,
        action_source: metaEvent.action_source || "website",
        event_id: metaEvent.event_id,
        user_data: {},
        custom_data: metaEvent.custom_data || {},
      },
    ],
  };

  // user_data: include fbp/fbc/raw PII if present (hash emails/phones)
  const ud = {};
  if (metaEvent.user_data) {
    if (metaEvent.user_data.fbp) ud.fbp = String(metaEvent.user_data.fbp);
    if (metaEvent.user_data.fbc) ud.fbc = String(metaEvent.user_data.fbc);
    if (metaEvent.user_data.client_ip_address)
      ud.client_ip_address = metaEvent.user_data.client_ip_address;
    if (metaEvent.user_data.client_user_agent)
      ud.client_user_agent = metaEvent.user_data.client_user_agent;
    // If email/phone present, hash using SHA256 lowercase trim
    const cryptoHash = (v) => {
      try {
        return crypto
          .createHash("sha256")
          .update(String(v).trim().toLowerCase())
          .digest("hex");
      } catch (e) {
        return null;
      }
    };
    if (metaEvent.user_data.email)
      ud.em = cryptoHash(metaEvent.user_data.email);
    if (metaEvent.user_data.phone)
      ud.ph = cryptoHash(metaEvent.user_data.phone);
  }

  // attach user_data if not empty
  if (Object.keys(ud).length) payload.data[0].user_data = ud;

  const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${accessToken}`;

  // send with simple retry logic
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        fastify.log.info({ res: json }, "meta conversions api sent");
        return { ok: true, response: json };
      }
      fastify.log.warn(
        { status: res.status, body: json },
        `meta api responded non-OK (attempt ${attempt})`,
      );
    } catch (err) {
      fastify.log.warn({ err }, `meta api send failed (attempt ${attempt})`);
    }
    // wait before retrying
    await new Promise((r) => setTimeout(r, attempt * 500));
  }

  return { ok: false, reason: "failed_after_retries" };
}

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

// GET /api/paymentlink-lookup?payment_link_id=pl_xxx or ?order_code=sejamais2_xxx
fastify.get("/api/paymentlink-lookup", async (request, reply) => {
  const q = request.query || {};
  const payment_link_id = q.payment_link_id || q.paymentLinkId || null;
  const order_code = q.order_code || q.orderCode || null;

  const mapping = loadPaymentLinkMapping();
  if (!mapping || Object.keys(mapping).length === 0) {
    return reply.status(404).send({ ok: false, error: "no_mappings" });
  }

  // direct lookup by payment_link_id key
  if (payment_link_id && mapping[payment_link_id]) {
    return reply.send({ ok: true, mapping: mapping[payment_link_id] });
  }

  // try to find by order_code inside mappings
  if (order_code) {
    for (const v of Object.values(mapping)) {
      if (v && v.order_code === order_code) {
        return reply.send({ ok: true, mapping: v });
      }
    }
  }

  // fallback: try to match any key that endsWith provided id (useful when url passed)
  if (payment_link_id) {
    for (const [k, v] of Object.entries(mapping)) {
      if (String(k).endsWith(String(payment_link_id))) {
        return reply.send({ ok: true, mapping: v });
      }
    }
  }

  return reply.status(404).send({ ok: false, error: "not_found" });
});

// POST /api/checkout — Phase 2: cria / reusa Payment Link via Pagar.me
fastify.post("/api/checkout", async (request, reply) => {
  const { planId } = request.body || {};
  const tracking = request.body?.tracking || null;
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
            // persist mapping for env link when tracking provided
            try {
              if (tracking) {
                const mappingPath = path.resolve(
                  __dirname,
                  "paymentlinks.json",
                );
                let map = {};
                if (fs.existsSync(mappingPath)) {
                  try {
                    map = JSON.parse(
                      fs.readFileSync(mappingPath, "utf8") || "{}",
                    );
                  } catch (e) {
                    map = {};
                  }
                }
                const id = envLinkRaw;
                map[id] = {
                  payment_link_id: id,
                  url,
                  tracking: tracking || null,
                  ts: new Date().toISOString(),
                };
                fs.writeFileSync(
                  mappingPath,
                  JSON.stringify(map, null, 2),
                  "utf8",
                );
              }
            } catch (err) {
              request.log.warn(
                { err },
                "failed to persist env paymentlink mapping",
              );
            }

            return reply.send({
              ok: true,
              url,
              reused: true,
              shippingCarrier: "Sedex",
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
      // persist mapping for env link when tracking provided
      try {
        if (tracking) {
          const mappingPath = path.resolve(__dirname, "paymentlinks.json");
          let map = {};
          if (fs.existsSync(mappingPath)) {
            try {
              map = JSON.parse(fs.readFileSync(mappingPath, "utf8") || "{}");
            } catch (e) {
              map = {};
            }
          }
          map[envLinkRaw] = {
            payment_link_id: envLinkRaw,
            url,
            tracking: tracking || null,
            ts: new Date().toISOString(),
          };
          fs.writeFileSync(mappingPath, JSON.stringify(map, null, 2), "utf8");
        }
      } catch (err) {
        request.log.warn({ err }, "failed to persist env paymentlink mapping");
      }

      return reply.send({
        ok: true,
        url,
        reused: true,
        shippingCarrier: "Sedex",
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
          shippingCarrier: "Sedex",
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
            name: `${plan.name} — Envio: Sedex`,
            // descrição usada pelo checkout do Pagar.me
            description: `EU+ — suplemento rejuvenescedor — Frete Grátis (Envio via Sedex)`,
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
                title: `${plan.name} — Frete Grátis (Sedex)`,
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

      // also persist mapping createdId -> tracking for correlation with webhooks
      try {
        if (createdId && tracking) {
          const mappingPath = path.resolve(__dirname, "paymentlinks.json");
          let map = {};
          if (fs.existsSync(mappingPath)) {
            try {
              map = JSON.parse(fs.readFileSync(mappingPath, "utf8") || "{}");
            } catch (e) {
              map = {};
            }
          }
          map[createdId] = {
            order_code: payload.order_code,
            payment_link_id: createdId,
            url,
            tracking: tracking || null,
            ts: new Date().toISOString(),
          };
          fs.writeFileSync(mappingPath, JSON.stringify(map, null, 2), "utf8");
        }
      } catch (err) {
        request.log.warn({ err }, "failed to persist paymentlink mapping");
      }
    } catch (err) {
      request.log.warn({ err }, "unable to persist created payment link");
    }

    return reply.send({
      ok: true,
      url,
      shippingCarrier: "Sedex",
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
    // Attempt to correlate webhook to tracking data saved earlier
    try {
      const body = request.body || {};
      // heuristics to find payment link id / order code in webhook payload
      function findKey(obj) {
        if (!obj || typeof obj !== "object") return null;
        if (obj.payment_link_id) return obj.payment_link_id;
        if (obj.payment_link) return obj.payment_link;
        if (obj.order_code) return obj.order_code;
        if (obj.id && String(obj.id).startsWith("pl_")) return obj.id;
        // dive into common containers
        const candidates = [
          "data",
          "checkout",
          "order",
          "payment_link",
          "payment_link_data",
          "attributes",
          "object",
        ];
        for (const k of candidates) {
          if (obj[k]) {
            const res = findKey(obj[k]);
            if (res) return res;
          }
        }
        // scan all keys shallow for payment link-looking values
        for (const v of Object.values(obj)) {
          if (typeof v === "string" && v.startsWith("pl_")) return v;
        }
        return null;
      }

      const key =
        findKey(body) ||
        findKey(body?.data) ||
        findKey(body?.data?.object) ||
        null;
      const mapping = loadPaymentLinkMapping();
      let match = null;
      if (key && mapping[key]) match = mapping[key];
      // also try to match by order_code value inside mapping objects
      if (!match && body && mapping) {
        const orderCode =
          body.order_code ||
          body.data?.order_code ||
          body?.data?.object?.order_code;
        if (orderCode) {
          for (const [k, v] of Object.entries(mapping)) {
            if (v && v.order_code === orderCode) {
              match = v;
              break;
            }
          }
        }
      }

      if (match) {
        // build a minimal Conversions API-like payload and persist locally
        const tracking = match.tracking || {};
        const eventTime = Math.floor(Date.now() / 1000);
        // Prefer event id generated by client (for deduplication) when available
        const eventId =
          (match && match.tracking && match.tracking.eventId) ||
          body.id ||
          body?.data?.id ||
          match.order_code ||
          `pagarme_${event}_${eventTime}`;

        // try to extract amount from webhook body
        function extractAmount(obj) {
          if (!obj || typeof obj !== "object") return null;
          const numericKeys = [
            "amount",
            "value",
            "total",
            "unit_price",
            "unit_amount",
            "gross_amount",
            "paid_amount",
          ];
          for (const k of numericKeys) {
            if (obj[k] && typeof obj[k] === "number")
              return obj[k] / 100 || obj[k];
            if (obj[k] && typeof obj[k] === "string" && !isNaN(Number(obj[k])))
              return Number(obj[k]);
          }
          for (const v of Object.values(obj)) {
            const found = extractAmount(v);
            if (found) return found;
          }
          return null;
        }

        const amount = extractAmount(body) || null;

        const metaEvent = {
          received_at: new Date().toISOString(),
          source_event: event,
          event_name:
            event === "order.paid" || event === "charge.paid"
              ? "Purchase"
              : "Other",
          event_time: eventTime,
          event_id: eventId,
          action_source: "website",
          user_data: {
            fbp: tracking.fbp || null,
            fbc: tracking.fbc || null,
            lead_id: tracking.leadId || null,
          },
          custom_data: {
            currency: "BRL",
            value: amount,
            payment_link_id: match.payment_link_id || null,
            order_code: match.order_code || null,
          },
          raw_webhook: body,
        };

        await persistMetaEvent(metaEvent);
        request.log.info(
          { metaEvent },
          "prepared meta event and persisted locally",
        );
        // attempt to send to Meta Conversions API (env gated)
        try {
          const sendResult = await sendToMetaConversionsAPI(metaEvent);
          request.log.info({ sendResult }, "sendToMetaConversionsAPI result");
        } catch (e) {
          request.log.warn({ err: e }, "error sending to Meta Conversions API");
        }
      } else {
        request.log.info({ event }, "no mapping found for this webhook");
      }
    } catch (e) {
      request.log.warn({ err: e }, "failed to correlate webhook to tracking");
    }
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
