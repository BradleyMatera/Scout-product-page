(() => {
  'use strict';

  // Historical compatibility marker only.
  //
  // This file previously mutated Overview/Docs/API/Changelog with an August 23
  // "current" snapshot. That behavior became unsafe once later source audits
  // existed because two different scripts could both claim to own current state.
  // Current cross-page source state is maintained by snapshot-refresh.js.
  // Historical August evidence remains in the dated snapshot/report files.
  const HISTORICAL_SNAPSHOT = Object.freeze({
    audited: 'August 23, 2026',
    status: 'superseded',
    currentStateOwner: 'snapshot-refresh.js'
  });

  window.__SCOUT_HISTORICAL_FRESHNESS_SNAPSHOT__ = HISTORICAL_SNAPSHOT;
})();
