// Legacy entrypoint kept for backwards compatibility. The real server
// logic now lives in index.cjs and is loaded by the start:api script. This
// file simply re-exports that implementation so any accidental require('./')
// still works. Remove after thorough cleanup.

module.exports = require('./index.cjs');
