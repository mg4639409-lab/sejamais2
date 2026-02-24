const crypto = require("crypto");
const fetch = globalThis.fetch || require("node-fetch");
(async () => {
  const body = JSON.stringify({
    event: "order.paid",
    data: {
      id: "evt_test_1",
      order_code: "sejamais2_experience_1610000000000",
      payment_link_id: "pl_pg04ke1QGO2R8XDLIou18PK7DqJ6M3wj",
      amount: 39999,
    },
  });
  const secret =
    process.env.PAGARME_WEBHOOK_SECRET || "hookset_XrvG6BofkH45Zbq3";
  const h = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const res = await fetch("http://localhost:4000/api/webhook/pagarme", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hub-signature": "sha256=" + h,
    },
    body,
  });
  const text = await res.text();
  console.log("status", res.status);
  console.log(text);
})();
