// Lightweight tracking helpers: leadId, fbclid, fbp, fbc
function uidv4() {
  // simple RFC4122 v4 UUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function setCookie(name: string, value: string, days = 90) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax;` +
      (location.protocol === "https:" ? " Secure" : "");
  } catch (e) {
    // ignore in non-browser
  }
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([.$?*|{}()\\[\\]\/+^])/g, "\\$1") +
        "=([^;]*)",
    ),
  );
  return m ? decodeURIComponent(m[1]) : null;
}

export function ensureLeadId() {
  let lead = getCookie("sejamais_lead");
  if (!lead) {
    lead = uidv4();
    setCookie("sejamais_lead", lead, 365);
  }
  return lead;
}

export function saveFbclidIfPresent() {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get("fbclid");
    if (fbclid) {
      setCookie("sejamais_fbclid", fbclid, 90);
      return fbclid;
    }
  } catch (e) {}
  return null;
}

export function getTracking() {
  if (typeof window === "undefined") return null;
  const leadId = getCookie("sejamais_lead") || null;
  const fbclid = getCookie("sejamais_fbclid") || null;
  // common FB cookie names
  const fbp = getCookie("_fbp") || null;
  const fbc = getCookie("_fbc") || null;
  // collect some utm params if present
  let utm = {} as Record<string, string>;
  try {
    const params = new URLSearchParams(window.location.search);
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ].forEach((k) => {
      const v = params.get(k);
      if (v) utm[k] = v;
    });
  } catch (e) {}

  return {
    leadId,
    fbclid,
    fbp,
    fbc,
    utm: Object.keys(utm).length ? utm : undefined,
  };
}

export default {
  ensureLeadId,
  saveFbclidIfPresent,
  getTracking,
};
