'use strict';

(function refineRoadmapCopy() {
  function setText(root, selector, text) {
    const el = root && root.querySelector(selector);
    if (el) el.textContent = text;
  }

  function setSnapshot(card, label, strongText, smallText) {
    if (!card) return;
    const span = card.querySelector('span');
    const strong = card.querySelector('strong');
    const small = card.querySelector('small');
    if (span) span.textContent = label;
    if (strong) strong.textContent = strongText;
    if (small) small.textContent = smallText;
  }

  function setPhase(phase, status, title, copy, gateLabel, gate) {
    if (!phase) return;
    phase.classList.toggle('active', /active/i.test(status));
    const statusEl = phase.querySelector('.phase-status');
    const strong = phase.querySelector('.phase-copy strong');
    const p = phase.querySelector('.phase-copy p');
    const gateEl = phase.querySelector('.phase-gate');
    if (statusEl) statusEl.textContent = status;
    if (strong) strong.textContent = title;
    if (p) p.innerHTML = copy;
    if (gateEl) gateEl.innerHTML = `<b>${gateLabel}</b>${gate}`;
  }

  function apply() {
    const workflow = document.getElementById('engineering-workflow');
    const roadmap = document.getElementById('roadmap');

    if (workflow) {
      setText(workflow, '.section-index', '08 / Engineering controls');
      setText(workflow, '.section-head h2', 'Review-driven engineering.');
      setText(workflow, '.section-head p', 'Scout development separates product direction, implementation, verification, and release authority. Changes advance only when source state, tests, deployment provenance, and human evaluation support them.');

      const grid = workflow.querySelector('.engineering-loop-grid');
      if (grid) {
        grid.innerHTML = `
          <article class="engineering-role"><span class="role-kicker">Product direction + acceptance</span><h3>Bradley Matera</h3><p>Defines product goals, architecture requirements, behavior constraints, and the standard a change has to meet before it moves forward.</p><ul><li>product direction and architecture requirements</li><li>behavior constraints and acceptance criteria</li><li>human conversation evaluation</li><li>integration and production authorization</li></ul></article>
          <article class="engineering-role"><span class="role-kicker">Implementation workspace</span><h3>Local repository + Devin/Windsurf</h3><p>Scoped engineering tasks are implemented against the real workspace, then exercised through tests, evaluation harnesses, staging, and development deployment where required.</p><ul><li>source edits in the working repository</li><li>unit, regression, browser, and conversation tests</li><li>development/staging deployment when required</li><li>commits and implementation evidence for review</li></ul></article>
          <article class="engineering-role"><span class="role-kicker">Research + independent verification</span><h3>GitHub + ChatGPT review</h3><p>Architecture decisions and reports are checked against repository state, branch heads, PR history, test evidence, staging markers, runtime behavior, and external technical sources when needed.</p><ul><li>source, branch, PR, and deployment inspection</li><li>architecture and failure analysis</li><li>implementation planning and review criteria</li><li>independent verification before the next gate</li></ul></article>`;
      }

      const loop = workflow.querySelector('.engineering-loop');
      if (loop) loop.innerHTML = '<strong>Review loop</strong><code>Requirement → scoped implementation → local code/test cycle → source + deployment review → human behavior review → accept / revise → integration or release gate</code>';
      const rule = workflow.querySelector('.verification-rule');
      if (rule) rule.innerHTML = '<strong>Evidence gate:</strong> no completion report, test count, branch name, or model output advances code on its own. Source state, tests, deployment provenance, and human evaluation are checked before integration or release.';
    }

    if (!roadmap) return;

    setText(roadmap, '.section-head h2', 'Released source first. Active work stays separate.');
    setText(roadmap, '.section-head p', 'The August 27 roadmap showed Phase 02 as active branch work. That iteration has since been merged, staged, and released. A newer discourse-frame branch is now two commits ahead of develop and remains explicitly unmerged while system-truth cleanup continues.');

    const snapshot = roadmap.querySelectorAll('.roadmap-current-snapshot article');
    setSnapshot(snapshot[0], 'production', 'master · b071e4e4', 'September 5 source release · Git tree a0066cc.');
    setSnapshot(snapshot[1], 'integration', 'develop · 4f5ee971', 'Protected integration source · same Git tree a0066cc.');
    setSnapshot(snapshot[2], 'staging source', '4f5ee971', 'ProjectHub-dev main 6d36433c records this exact develop source.');
    setSnapshot(snapshot[3], 'active unmerged work', 'feat/generic-conversation-sets · 5bd9437', '2 commits ahead · 0 behind develop at audit recheck; no Actions run exposed.');

    const active = roadmap.querySelector('.roadmap-active-note');
    if (active) {
      const label = active.querySelector('.roadmap-band-label');
      const h3 = active.querySelector('h3');
      const p = active.querySelector('p');
      if (label) label.textContent = 'CURRENT ENGINEERING STATE';
      if (h3) h3.textContent = 'Released tree + active post-release discourse work';
      if (p) p.innerHTML = 'Production <code>b071e4e4</code>, protected integration <code>4f5ee971</code>, and the current staging marker all agree on the released source tree. Separately, <code>feat/generic-conversation-sets@5bd9437</code> is two commits ahead of develop with generic server-owned discourse frames and a <code>CLARIFICATION</code> control mode. That branch has not crossed integration, staging, or release gates. Phase 06 system-truth cleanup also remains active because current self-knowledge and public documentation still have known drift to eliminate.';
      const metrics = active.querySelectorAll('.metric-line span');
      if (metrics[0]) metrics[0].textContent = 'production · b071e4e4';
      if (metrics[1]) metrics[1].textContent = 'develop/staging source · 4f5ee971';
      if (metrics[2]) metrics[2].textContent = 'active branch · 5bd9437 · +2 / -0';
      if (metrics[3]) metrics[3].textContent = 'released-tree tests · 1019/1019';
    }

    const phases = roadmap.querySelectorAll('.roadmap-phase');
    setPhase(phases[0], '01 · released', 'Working Scout foundation', 'Preserve the RAG-first retrieval, hosted generation, validation, state, provider, telemetry, and release foundations already in the system.', 'Invariant', 'Later work must not silently regress the working foundation.');
    setPhase(phases[1], '02 · released + continuation', 'Conversation quality gate', 'The accepted Phase 7/8 iteration was merged through PR #23 and released. The last pre-release live checkpoint was <strong>94/132 turns</strong> and <strong>21/33 conversations</strong>. New discourse-frame work on <code>5bd9437</code> continues this area but is not integrated.', 'Continuation rule', 'Keep residual failures classified, preserve open-world/grounding behavior, and require the new branch to cross normal test/integration/release gates.');
    setPhase(phases[2], '03 · released iteration complete', 'Integrate accepted conversation work', 'The released Phase 7/8/widget/hardening iteration is integrated in <code>develop@4f5ee971</code>. The new <code>feat/generic-conversation-sets</code> branch has not crossed this gate.', 'Current boundary', 'Active branch is 2 ahead / 0 behind develop at recheck and has no exposed Actions run or PR yet.');
    setPhase(phases[3], '04 · released iteration complete', 'Staging truth + parity', 'ProjectHub-dev records <code>develop@4f5ee971</code> in <code>STAGING-SOURCE.json</code>. The active discourse branch is not represented by staging.', 'Boundary', 'A source marker proves provenance; browser/backend runtime behavior remains a separate check.');
    setPhase(phases[4], '05 · released Sep 5', 'Production source release', 'PR #29 promoted an ancestry-preserving release commit whose Git tree exactly matches qualified <code>develop@4f5ee971</code>. Current <code>master@b071e4e4</code> and develop share tree <code>a0066cc</code>.', 'Boundary', 'The newer discourse branch is not production. Git source release and external production-host verification remain separate facts.');
    setPhase(phases[5], '06 · active', 'System truth cleanup', 'Align executable behavior, runtime self-knowledge, telemetry semantics, deployment provenance, documentation, historical test claims, and active-branch status before the larger portability refactor.', 'Current gate', 'Fix or label stale truth such as the runtime-neuron self-description; keep historical scores dated; keep active branch capabilities separate from released capabilities.');

    const bands = roadmap.querySelectorAll('.roadmap-band');
    if (bands[0]) {
      const h3 = bands[0].querySelector('h3');
      const p = bands[0].querySelector(':scope > p');
      if (h3) h3.textContent = 'Phases 01–06 · engine/release truth';
      if (p) p.textContent = 'The current recruiter implementation crossed integration, staging, and production source gates for the September 5 iteration. New conversation work is again on a separate branch, while Phase 06 keeps code, provenance, evaluation, and documentation claims aligned.';
    }
    if (bands[1]) {
      const p = bands[1].querySelector(':scope > p');
      if (p) p.textContent = 'A refactor only succeeds if Scout still works afterward. ProjectHub Recruiter Alpha must remain a real configuration of the same core, not become a discarded prototype beside a second rewrite.';
    }

    const sourceLinks = roadmap.querySelector('.roadmap-source-links');
    if (sourceLinks) {
      sourceLinks.innerHTML = `
        <a href="https://github.com/BradleyMatera/ProjectHub/commit/b071e4e4f0bb69faeecd811f31514af30d2e1f61" target="_blank" rel="noopener">Production master · b071e4e4 ↗</a>
        <a href="https://github.com/BradleyMatera/ProjectHub/commit/4f5ee971488e433ebdf66280cce82e163c5c7688" target="_blank" rel="noopener">Develop · 4f5ee971 ↗</a>
        <a href="https://github.com/BradleyMatera/ProjectHub/compare/develop...feat/generic-conversation-sets" target="_blank" rel="noopener">Active branch diff · 5bd9437 ↗</a>
        <a href="https://github.com/BradleyMatera/ProjectHub-dev/blob/main/STAGING-SOURCE.json" target="_blank" rel="noopener">Staging provenance ↗</a>
        <a href="https://github.com/BradleyMatera/ProjectHub/pull/29" target="_blank" rel="noopener">PR #29 release evidence ↗</a>
        <a href="./SCOUT-ROADMAP.md">Full roadmap source ↗</a>
        <a href="./SCOUT-SOURCE-AUDIT.md">September branch audit ↗</a>`;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
})();
