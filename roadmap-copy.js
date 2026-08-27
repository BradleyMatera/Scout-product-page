'use strict';

(function refineRoadmapCopy() {
  function setText(root, selector, text) {
    const el = root && root.querySelector(selector);
    if (el) el.textContent = text;
  }

  function apply() {
    const workflow = document.getElementById('engineering-workflow');
    const roadmap = document.getElementById('roadmap');

    if (workflow) {
      setText(workflow, '.section-index', '08 / Engineering controls');
      setText(workflow, '.section-head h2', 'Review-driven engineering.');
      setText(
        workflow,
        '.section-head p',
        'Scout development separates product direction, implementation, verification, and release authority. Changes advance only when source state, tests, deployed behavior, and human evaluation support them.'
      );

      const grid = workflow.querySelector('.engineering-loop-grid');
      if (grid) {
        grid.innerHTML = `
          <article class="engineering-role">
            <span class="role-kicker">Product direction + acceptance</span>
            <h3>Bradley Matera</h3>
            <p>Defines the product goals, architecture requirements, behavior constraints, and the standard a change has to meet before it moves forward.</p>
            <ul>
              <li>product direction and architecture requirements</li>
              <li>behavior constraints and acceptance criteria</li>
              <li>human conversation evaluation</li>
              <li>integration and production authorization</li>
            </ul>
          </article>
          <article class="engineering-role">
            <span class="role-kicker">Implementation workspace</span>
            <h3>Local repository + Devin/Windsurf</h3>
            <p>Scoped engineering tasks are implemented against the real local workspace, then exercised through tests, evaluation harnesses, and development deployments where required.</p>
            <ul>
              <li>source edits in the local repository</li>
              <li>unit, regression, and conversation test execution</li>
              <li>development deployment when the task requires it</li>
              <li>commits and implementation reports for review</li>
            </ul>
          </article>
          <article class="engineering-role">
            <span class="role-kicker">Research + independent verification</span>
            <h3>GitHub + ChatGPT review</h3>
            <p>Architecture decisions and implementation reports are checked against repository state, branch history, test evidence, deployment markers, runtime behavior, and external technical sources when needed.</p>
            <ul>
              <li>source, branch, and deployment inspection</li>
              <li>architecture and failure analysis</li>
              <li>implementation planning and review criteria</li>
              <li>independent verification before the next gate</li>
            </ul>
          </article>
        `;
      }

      const loop = workflow.querySelector('.engineering-loop');
      if (loop) {
        loop.innerHTML = `
          <strong>Review loop</strong>
          <code>Requirement → scoped implementation → local code/test cycle → independent source and deployment review → human behavior review → accept / revise → integration or release gate</code>
        `;
      }

      const rule = workflow.querySelector('.verification-rule');
      if (rule) {
        rule.innerHTML = '<strong>Evidence gate:</strong> no completion report, test count, or model output advances code on its own. Source state, test evidence, deployed behavior, and human evaluation are checked before integration or release.';
      }
    }

    if (roadmap) {
      setText(
        roadmap,
        '.section-head p',
        'This roadmap separates active branch work, integration, staging, production release, system-truth cleanup, and the later Scout Core portability work. Passing unit tests is evidence, not a release decision.'
      );

      const snapshotCards = roadmap.querySelectorAll('.roadmap-current-snapshot article');
      if (snapshotCards[2]) {
        const strong = snapshotCards[2].querySelector('strong');
        const small = snapshotCards[2].querySelector('small');
        if (strong) strong.textContent = 'fix/phase7-8-conversation-gate';
        if (small) small.textContent = 'f02a659 · 16 commits ahead of develop, 0 behind. Dev backend code is deployed from e70b117; f02a659 changes the local evaluation harness only.';
      }
      if (snapshotCards[3]) {
        const small = snapshotCards[3].querySelector('small');
        if (small) small.textContent = 'ProjectHub-dev records d1da87b; develop 2c140ba was 16 commits ahead of that marker at verification.';
      }

      const activeCopy = roadmap.querySelector('.roadmap-active-note p');
      if (activeCopy) {
        activeCopy.innerHTML = 'Phase 02 focuses on real multi-turn failures in classification, response contracts, referent/context handling, relationship grounding, open-world claims, repair behavior, and answer quality. Branch <code>f02a659</code> reports <strong>963/963 unit tests</strong> and a <strong>92/132</strong> conversation run, but that gate result remains under review because the current evidence-term matcher can accept unrelated prefix matches. The branch is development work, not integrated or production behavior.';
      }

      const metrics = roadmap.querySelectorAll('.roadmap-active-note .metric-line span');
      if (metrics[0]) metrics[0].textContent = 'reported branch suite · 92/132 · under review';
      if (metrics[1]) metrics[1].textContent = 'reported conversations · 19/33';
      if (metrics[2]) metrics[2].textContent = 'provider failures in run · 5';
      if (metrics[3]) metrics[3].textContent = 'reported unit suite · 963/963';

      const productizationIntro = roadmap.querySelectorAll('.roadmap-band')[1];
      if (productizationIntro) {
        const p = productizationIntro.querySelector(':scope > p');
        if (p) p.textContent = 'A refactor only succeeds if Scout still works afterward. ProjectHub Recruiter Alpha must remain a real configuration of the same core, not become a discarded prototype beside a second rewrite.';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
