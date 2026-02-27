const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");

// CORS básico para desenvolvimento (ajuste em produção)
fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
});

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
      "Frete Grátis — Envio Grátis para todo Brasil",
      "Garantia de 90 dias",
      "Acesso ao grupo VIP",
    ],
    featured: false,
    cta: "Comprar 1 unidade",
    badge: "1ª compra",
    // amount em centavos — corresponde ao link de 1ª compra (R$ 399,99)
    amount: 39999,
    payment_link: process.env.PAYMENTLINK_EXPERIENCE
      ? `https://payment-link-v3.pagar.me/${process.env.PAYMENTLINK_EXPERIENCE}`
      : "https://payment-link-v3.pagar.me/pl_pg04ke1QGO2R8XDLIou18PK7DqJ6M3wj",
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
      "Frete Grátis — Envio Grátis para todo Brasil",
      "Garantia 90 dias",
    ],
    featured: false,
    cta: "Comprar 2 unidades",
    amount: 75998,
    payment_link: process.env.PAYMENTLINK_LAST_OPTION
      ? `https://payment-link-v3.pagar.me/${process.env.PAYMENTLINK_LAST_OPTION}`
      : "https://payment-link-v3.pagar.me/pl_WeM5d2G7bQrk4Y5ImQir8vYXxEoVKg3P",
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
      "Frete Grátis — Envio Grátis para todo Brasil",
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
      : "https://payment-link-v3.pagar.me/pl_LXARPNW4kJqoB2cm8FY4oM6jYEpBgO75",
  },
};

// helper to validate environment links at startup. if the price encoded in a
// payment link doesn't match the plan amount, try to automatically swap the
// two links so the app continues to work even when the vars are inverted.
async function verifyEnvLinks() {
  const pagarmeKey = process.env.PAGARME_API_KEY;
  if (!pagarmeKey) return;
  const apiBase = "https://api.pagar.me/core/v5";
  const authHeader =
    "Basic " + Buffer.from(`${pagarmeKey}:`).toString("base64");

  for (const planId of Object.keys(PLANS)) {
    const rawLink = PRECREATED_LINKS[planId];
    if (!rawLink) continue;
    let linkId = rawLink;
    if (linkId.startsWith("http")) {
      const m = linkId.match(/pl_[A-Za-z0-9]+/);
      if (m) linkId = m[0];
    }
    try {
      const res = await fetch(
        `${apiBase}/paymentlinks/${encodeURIComponent(linkId)}`,
        { headers: { Authorization: authHeader, Accept: "application/json" } },
      );
      if (!res.ok) continue;
      const json = await res.json();
      const amount =
        json.amount ||
        (json.order && json.order.items && json.order.items[0]?.unit_price) ||
        null;
      if (amount && PLANS[planId] && amount !== PLANS[planId].amount) {
        const other = Object.values(PLANS).find((p) => p.amount === amount);
        if (other) {
          fastify.log.warn(
            { planId, other: other.id, envLink: rawLink },
            "env payment link amount mismatches expected plan; swapping",
          );
          const tmp = PRECREATED_LINKS[planId];
          PRECREATED_LINKS[planId] = PRECREATED_LINKS[other.id];
          PRECREATED_LINKS[other.id] = tmp;
        } else {
          fastify.log.warn(
            { planId, amount, envLink: rawLink },
            "env payment link amount does not match any known plan",
          );
        }
      }
    } catch (err) {
      fastify.log.warn(
        { err, planId, link: rawLink },
        "error checking env link",
      );
    }
  }
}

verifyEnvLinks().catch((err) => {
  fastify.log.warn({ err }, "could not verify env payment links");
});

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

// helper that returns the appropriate env payment link for a plan
function getEnvLink(planId) {
  // ignore env links for problematic plans to force fresh link generation
  if (planId === "last_option" || planId === "transformation") {
    fastify.log.warn(
      { planId },
      "ignoring env link for plan, will create/ reuse dynamically",
    );
    return null;
  }
  let link = PRECREATED_LINKS[planId];
  // user override to invert mapping
  if (process.env.INVERT_LINKS === "true") {
    const other = planId === "last_option" ? "transformation" : "last_option";
    const candidate = PRECREATED_LINKS[other];
    if (candidate) {
      fastify.log.warn(
        { planId, candidate, reason: "invert_flag" },
        "INVERT_LINKS set – swapping link",
      );
      link = candidate;
    }
  }
  // pattern-based detection
  const patterns = { last_option: "WeM5d2G7", transformation: "LXARPNW" };
  const expected = patterns[planId];
  if (expected && link && !link.includes(expected)) {
    const other = planId === "last_option" ? "transformation" : "last_option";
    const candidate = PRECREATED_LINKS[other];
    if (candidate && candidate.includes(expected)) {
      fastify.log.warn(
        { planId, link, swappedWith: candidate, reason: "pattern_mismatch" },
        "link pattern did not match expected substring; swapping",
      );
      link = candidate;
    }
  }
  return link;
}

// POST /api/checkout — Phase 2: cria / reusa Payment Link via Pagar.me
fastify.post("/api/checkout", async (request, reply) => {
  const { planId } = request.body || {};
  const tracking = request.body?.tracking || null;
  fastify.log.info({ planId, body: request.body }, "checkout request received");
  if (!planId) {
    return reply.status(400).send({ error: "planId is required" });
  }

  const plan = PLANS[planId];
  if (!plan) {
    return reply.status(404).send({ error: "Plano não encontrado" });
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
        return reply.send({ ok: true, url: maybeArray[0].url, reused: true });
      }
    }

    // 2) criar novo Payment Link
    const payload = {
      type: "order",
      name: linkName,
      order_code: `sejamais2_${plan.id}_${Date.now()}`,
      payment_settings: {
        credit_card_settings: {
          installments_setup: { interest_type: "simple" },
        },
      },
      cart_settings: {
        items: [
          {
            name: plan.name,
            amount: plan.amount,
            quantity: 1,
          },
        ],
        shipping: {
          amount: 0,
          description: "Frete Grátis — Envio Grátis para todo Brasil",
          type: "Standard",
        },
      },
      layout_settings: { hide_shipping_selector: true },
    };

    // attach minimal metadata for correlation (Pagar.me may ignore unknown fields)
    if (tracking) {
      try {
        const meta = {};
        if (tracking.leadId) meta.lead_id = String(tracking.leadId);
        if (tracking.fbclid) meta.fbclid = String(tracking.fbclid);
        if (tracking.fbp) meta.fbp = String(tracking.fbp);
        if (Object.keys(meta).length) payload.metadata = meta;
      } catch (e) {
        // ignore
      }
    }

    const createRes = await fetch(`${apiBase}/paymentlinks`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const createJson = await createRes.json();
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

    // persist local mapping: order_code or created id -> tracking
    try {
      const createdId =
        createJson.id ||
        createJson.data?.id ||
        createJson.payment_link_id ||
        createJson.data?.payment_link_id ||
        payload.order_code;
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
    } catch (err) {
      request.log.warn({ err }, "failed to persist paymentlink mapping");
    }

    return reply.send({ ok: true, url, raw: createJson });
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

const start = async () => {
  try {
    const port = process.env.PORT || 4000;
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
