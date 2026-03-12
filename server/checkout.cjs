// checkout.js - helper for session/order management
const path = require('path');
const { readJson, writeJson } = require('./storage.cjs');

// simple RFC4122 v4 uuid generator (same as frontend tracking)
function uidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const SESSIONS_FILE = path.resolve(__dirname, 'sessions.json');
const ORDERS_FILE = path.resolve(__dirname, 'orders.json');

async function createSession(planId, tracking = {}) {
  const sessionId = `sess_${uidv4()}`;
  const now = new Date().toISOString();
  const session = {
    session_id: sessionId,
    planId,
    amount: null,           // caller may fill after looking up plan table
    tracking,
    status: 'pending',
    created_at: now,
    order_id: null,
    charge_id: null,
    payment_method: null,
  };
  const all = await readJson(SESSIONS_FILE, {});
  all[sessionId] = session;
  await writeJson(SESSIONS_FILE, all);
  return session;
}

async function updateSession(sessionId, patch) {
  const all = await readJson(SESSIONS_FILE, {});
  if (!all[sessionId]) throw new Error('session_not_found');
  Object.assign(all[sessionId], patch);
  await writeJson(SESSIONS_FILE, all);
  return all[sessionId];
}

async function getSession(sessionId) {
  const all = await readJson(SESSIONS_FILE, {});
  return all[sessionId] || null;
}

async function persistOrder(order) {
  const all = await readJson(ORDERS_FILE, {});
  all[order.order_id] = order;
  await writeJson(ORDERS_FILE, all);
  return all[order.order_id];
}

module.exports = {
  createSession,
  updateSession,
  getSession,
  persistOrder,
};
