export type CheckoutResponse = {
  ok?: boolean;
  url?: string;
  fallback?: boolean;
  message?: string;
  raw?: any;
  shippingCarrier?: string;
};

export async function createCheckout(
  planId: string,
): Promise<CheckoutResponse> {
  try {
    // Dev -> chama servidor local na porta 4000, Prod -> rota relativa
    const base =
      typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:4000"
        : "";
    const res = await fetch(`${base}/api/checkout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ planId }),
    });

    const json = await res.json().catch(() => null);
    // normalizar resposta para incluir shippingCarrier quando disponível
    return json
      ? {
          ...(json as any),
          shippingCarrier: json.shippingCarrier ?? "Melhor Envio",
        }
      : { ok: false, message: `status:${res.status}` };
  } catch (err) {
    return { ok: false, message: String(err) };
  }
}
