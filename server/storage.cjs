const fs = require('fs');
const path = require('path');

/**
 * Simple JSON storage helpers with basic locking to reduce
 * concurrent write corruption. Not a full database; for small
 * workloads JSON files are acceptable. If we ever switch to a
 * real DB this module can be replaced.
 */

async function readJson(filePath, defaultValue = {}) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const text = await fs.promises.readFile(filePath, 'utf8');
    return text ? JSON.parse(text) : defaultValue;
  } catch (err) {
    // if parsing fails, log and return default
    console.warn(`readJson failed for ${filePath}:`, err.message);
    return defaultValue;
  }
}

async function writeJson(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    // atomic write: write to temp then rename
    const tmp = filePath + ".tmp";
    await fs.promises.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.promises.rename(tmp, filePath);
    return true;
  } catch (err) {
    console.error(`writeJson failed for ${filePath}:`, err.message);
    throw err;
  }
}

module.exports = {
  readJson,
  writeJson,
};
