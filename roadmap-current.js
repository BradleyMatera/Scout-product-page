'use strict';

(function renderCurrentScoutRoadmap() {
  function injectStyles() {
    if (document.getElementById('scout-roadmap-current-styles')) return;
    const style = document.createElement('style');
    style.id = 'scout-roadmap-current-styles';
    style.textContent = `
      .engineering-loop-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:28px}
      .engineering-role{border:1px solid rgba(111,166,205,.18);background:linear-gradient(145deg,rgba(10,21,32,.94),rgba(5,12,20,.92));border-radius:8px;padding:22px;min-height:230px}
      .engineering-role .role-kicker,.roadmap-band-label,.roadmap-phase .phase-status{font-family:var(--mono);font-size:.66rem;letter-spacing:.09em;text-transform:uppercase}
      .engineering-role .role-kicker{color:var(--green);display:block;margin-bottom:10px}
      .engineering-role h3{margin:0 0 10px;font-size:1.15rem}
      .engineering-role p,.engineering-role li{color:var(--muted);line-height:1.65;font-size:.88rem}
      .engineering-role ul{margin:12px 0 0;padding-left:18px}
      .engineering-loop{margin-top:14px;border:1px solid rgba(121,234,179,.2);background:linear-gradient(90deg,rgba(121,234,179,.055),rgba(109,169,255,.035));border-radius:8px;padding:20px}
      .engineering-loop strong{display:block;margin-bottom:10px}
      .engineering-loop code{display:block;white-space:normal;line-height:1.7;color:#c7d7e2}
      .verification-rule{margin-top:14px;padding:16px 18px;border-left:3px solid var(--green);background:rgba(121,234,179,.035);color:#b7c6d0;line-height:1.65}
      .roadmap-current-snapshot{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:28px 0 18px}
      .roadmap-current-snapshot article{border:1px solid rgba(111,166,205,.18);background:rgba(8,16,25,.76);border-radius:7px;padding:16px;min-width:0}
      .roadmap-current-snapshot span{display:block;color:#718494;font-family:var(--mono);font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:7px}
      .roadmap-current-snapshot strong{display:block;font-size:.86rem;word-break:break-word}
      .roadmap-current-snapshot small{display:block;color:var(--muted);margin-top:7px;line-height:1.45}
      .roadmap-active-note{border:1px solid rgba(121,234,179,.27);background:linear-gradient(135deg,rgba(121,234,179,.07),rgba(32,158,255,.04));border-radius:9px;padding:22px;margin:0 0 26px}
      .roadmap-active-note .roadmap-band-label{color:var(--green)}
      .roadmap-active-note h3{margin:8px 0 10px;font-size:1.25rem}
      .roadmap-active-note p{margin:0;color:var(--muted);line-height:1.7}
      .roadmap-active-note .metric-line{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}
      .roadmap-active-note .metric-line span{border:1px solid rgba(111,166,205,.18);background:rgba(4,12,19,.7);border-radius:5px;padding:8px 10px;font-family:var(--mono);font-size:.68rem;color:#aebdca}
      .roadmap-band{margin-top:30px}
      .roadmap-band+.roadmap-band{margin-top:42px;padding-top:34px;border-top:1px solid rgba(111,166,205,.14)}
      .roadmap-band-label{color:var(--cyan,#32dcd2);display:block;margin-bottom:8px}
      .roadmap-band h3{font-size:1.55rem;margin:0 0 8px}
      .roadmap-band>p{color:var(--muted);max-width:900px;line-height:1.7;margin:0 0 18px}
      .roadmap-phases{display:grid;gap:10px}
      .roadmap-phase{display:grid;grid-template-columns:92px minmax(0,1fr) minmax(220px,.55fr);gap:18px;align-items:start;border:1px solid rgba(111,166,205,.16);background:linear-gradient(145deg,rgba(9,19,29,.9),rgba(5,12,20,.9));border-radius:8px;padding:18px}
      .roadmap-phase.active{border-color:rgba(121,234,179,.34);box-shadow:0 0 30px rgba(121,234,179,.025)}
      .roadmap-phase .phase-status{color:#718494;padding-top:3px}
      .roadmap-phase.active .phase-status{color:var(--green)}
      .roadmap-phase .phase-copy strong{display:block;font-size:1rem;margin-bottom:6px}
      .roadmap-phase .phase-copy p{margin:0;color:var(--muted);line-height:1.58;font-size:.86rem}
      .roadmap-phase .phase-gate{border-left:1px solid rgba(111,166,205,.16);padding-left:18px;color:#8fa2b0;font-size:.76rem;line-height:1.55}
      .roadmap-phase .phase-gate b{display:block;color:#c7d5df;font-family:var(--mono);font-size:.61rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px}
      .roadmap-source-links{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}
      .roadmap-source-links a{border:1px solid rgba(111,166,205,.2);border-radius:5px;padding:9px 11px;color:#9fb1bd;text-decoration:none;font-family:var(--mono);font-size:.68rem}
      .roadmap-source-links a:hover{border-color:rgba(121,234,179,.4);color:var(--green)}
      @media(max-width:980px){.engineering-loop-grid{grid-template-columns:1fr}.roadmap-current-snapshot{grid-template-columns:repeat(2,minmax(0,1fr))}.roadmap-phase{grid-template-columns:78px minmax(0,1fr)}.roadmap-phase .phase-gate{grid-column:2;border-left:0;border-top:1px solid rgba(111,166,205,.14);padding:12px 0 0}}
      @media(max-width:620px){.roadmap-current-snapshot{grid-template-columns:1fr}.roadmap-phase{grid-template-columns:1fr;gap:8px}.roadmap-phase .phase-gate{grid-column:1}.engineering-role{min-height:0}}
    `;
    document.head.appendChild(style);
  }

  function addRoadmapNav() {
    const nav = document.querySelector('.nav-links');
    if (!nav || nav.querySelector('a[href="#roadmap"]')) return;
    const link = document.createElement('a');
    link.href = '#roadmap';
    link.textContent = 'Roadmap';
    nav.appendChild(link);
  }

  function renderWorkflow(roadmap) {
    if (document.getElementById('engineering-workflow')) return;
    const section = document.createElement('section');
    section.className = 'section-pad';
    section.id = 'engineering-workflow';
    section.innerHTML = `
      <div class="shell">
        <header class="section-head">
          <div class="section-index">08 / Engineering workflow</div>
          <div>
            <h2>How Scout is actually being built.</h2>
            <p>Scout is developed through a repeatable Bradley + ChatGPT + Devin/Windsurf loop. Planning, implementation, verification, and release authority are deliberately separated.</p>
          </div>
        </header>
        <div class="engineering-loop-grid">
          <article class="engineering-role">
            <span class="role-kicker">Product owner</span>
            <h3>Bradley Matera</h3>
            <p>Defines what Scout should become and decides whether the behavior is actually acceptable.</p>
            <ul>
              <li>product direction and architecture requirements</li>
              <li>behavior constraints and acceptance criteria</li>
              <li>human conversation testing</li>
              <li>integration and production authorization</li>
            </ul>
          </article>
          <article class="engineering-role">
            <span class="role-kicker">Research + independent audit</span>
            <h3>ChatGPT</h3>
            <p>Inspects the actual repositories and external technical sources, works through the architecture with Bradley, and turns the agreed goal into a scoped implementation plan.</p>
            <ul>
              <li>GitHub/source/branch/deployment inspection</li>
              <li>architecture and failure analysis</li>
              <li>Devin implementation prompts</li>
              <li>independent verification of Devin reports</li>
            </ul>
          </article>
          <article class="engineering-role">
            <span class="role-kicker">Local implementation</span>
            <h3>Devin in Windsurf</h3>
            <p>Works in Bradley's real local workspace and executes the scoped engineering task.</p>
            <ul>
              <li>edits the local repository</li>
              <li>runs tests and evaluation harnesses</li>
              <li>deploys development/staging when instructed</li>
              <li>commits and reports exactly what changed</li>
            </ul>
          </article>
        </div>
        <div class="engineering-loop">
          <strong>Working loop</strong>
          <code>Bradley goal/problem → Bradley + ChatGPT analysis → repository/source verification → ChatGPT implementation prompt → Devin/Windsurf implementation + tests → Devin report → ChatGPT independent verification → Bradley + ChatGPT accept / reject / revise → repeat</code>
        </div>
        <div class="verification-rule"><strong>Rule:</strong> no agent completion report is treated as proof. Repository state, test evidence, deployed behavior, and human evaluation are checked independently before work advances to the next gate.</div>
      </div>
    `;
    roadmap.parentNode.insertBefore(section, roadmap);
  }

  function renderRoadmap(roadmap) {
    roadmap.innerHTML = `
      <div class="shell">
        <header class="section-head">
          <div class="section-index">09 / Roadmap</div>
          <div>
            <h2>Stabilize the engine first. Productize it second.</h2>
            <p>The roadmap now separates active branch work, integration, staging, production release, system-truth cleanup, and the later Scout Core portability work. Passing unit tests is evidence, not a release decision.</p>
          </div>
        </header>

        <div class="roadmap-current-snapshot" aria-label="Current Scout source state">
          <article><span>production</span><strong>master · 4a1eee7</strong><small>Released production line.</small></article>
          <article><span>integration</span><strong>develop · 2c140ba</strong><small>Protected integration line.</small></article>
          <article><span>active work</span><strong>fix/phase7-8-conversation-gate</strong><small>76e7df5 · 14 commits ahead of develop, 0 behind when verified.</small></article>
          <article><span>staging marker</span><strong>d1da87b</strong><small>ProjectHub-dev currently records a source point 16 commits behind current develop.</small></article>
        </div>

        <div class="roadmap-active-note">
          <span class="roadmap-band-label">CURRENT ACTIVE GATE</span>
          <h3>Phase 02 · Conversation quality</h3>
          <p>The current engineering focus is not adding broad new features. It is closing real multi-turn failures in classification, response contracts, referent/context handling, relationship grounding, open-world claims, repair behavior, and answer quality. The latest Devin/Windsurf branch report showed the exact problem this gate exists to catch: <strong>962/962 unit tests</strong> could coexist with only <strong>87/132 human-style conversation turns</strong> passing. That branch result is development evidence, not an integrated or production quality claim.</p>
          <div class="metric-line"><span>reported branch suite · 87/132</span><span>reported recruiter sequence · 27/40</span><span>reported COBOL/frustration · 5/6</span><span>unit suite · 962/962</span></div>
        </div>

        <section class="roadmap-band">
          <span class="roadmap-band-label">ENGINE HARDENING + RELEASE TRUTH</span>
          <h3>Phases 01–06</h3>
          <p>Make the Scout that already exists trustworthy before extracting it into a broader product framework.</p>
          <div class="roadmap-phases">
            <article class="roadmap-phase"><div class="phase-status">01 · built</div><div class="phase-copy"><strong>Working Scout foundation</strong><p>Preserve the RAG-first retrieval, generation, validation, state, provider, telemetry, and release foundations already in the system.</p></div><div class="phase-gate"><b>Invariant</b>Later work must not silently regress the working foundation.</div></article>
            <article class="roadmap-phase active"><div class="phase-status">02 · active</div><div class="phase-copy"><strong>Conversation quality gate</strong><p>Fix real human conversation failures without benchmark-cheating deterministic prose or weakened grounding/safety semantics.</p></div><div class="phase-gate"><b>Exit gate</b>132-turn suite completed, harness defects separated from product defects, visible answers manually reviewed, legitimate failures converted into generic regressions, Bradley accepts behavior.</div></article>
            <article class="roadmap-phase"><div class="phase-status">03 · next</div><div class="phase-copy"><strong>Integrate accepted conversation work</strong><p>Review the active branch and move only accepted Phase 7/8 changes into protected <code>develop</code>.</p></div><div class="phase-gate"><b>Exit gate</b>Diff reviewed, tests pass, no validator/safety weakening, remote develop SHA verified.</div></article>
            <article class="roadmap-phase"><div class="phase-status">04 · next</div><div class="phase-copy"><strong>Staging truth + parity</strong><p>Regenerate ProjectHub-dev from the accepted integration state so staging actually represents current develop.</p></div><div class="phase-gate"><b>Exit gate</b>STAGING-SOURCE matches develop, frontend/backend revisions align, browser QA and telemetry checks pass.</div></article>
            <article class="roadmap-phase"><div class="phase-status">05 · next</div><div class="phase-copy"><strong>Production release gate</strong><p>Promote a proven integration state through the explicit production authorization boundary.</p></div><div class="phase-gate"><b>Exit gate</b>Bradley release approval, coordinated deploy, production SHA/runtime verified, smoke + conversation checks pass.</div></article>
            <article class="roadmap-phase"><div class="phase-status">06 · next</div><div class="phase-copy"><strong>System truth cleanup</strong><p>Make code, telemetry, runtime facts, staging markers, documentation, and the public Scout explanation agree before the portability refactor.</p></div><div class="phase-gate"><b>Exit gate</b>Stale facts are corrected or historical, unknown never becomes zero, estimates never become actuals, current docs match current executable behavior.</div></article>
          </div>
        </section>

        <section class="roadmap-band">
          <span class="roadmap-band-label">PRODUCTIZATION BOUNDARY</span>
          <h3>Phases 07–12</h3>
          <p>A refactor only succeeds if Scout still works afterward. The current recruiter implementation must remain a real configuration of the same core, not become a discarded prototype beside a second rewrite.</p>
          <div class="roadmap-phases">
            <article class="roadmap-phase"><div class="phase-status">07 · later</div><div class="phase-copy"><strong>Scout Core extraction</strong><p>Separate reusable orchestration from Bradley/recruiter knowledge, identity assumptions, policies, tools, and workflows while ProjectHub continues to run on that same core.</p></div><div class="phase-gate"><b>Exit gate</b>Recruiter-specific behavior sits outside core boundaries; normal specialization needs no customer-specific core branches.</div></article>
            <article class="roadmap-phase"><div class="phase-status">08 · later</div><div class="phase-copy"><strong>General Scout / no-KB mode</strong><p>Prove Scout Core exists without a customer knowledge package. Knowledge specializes Scout; it does not create Scout.</p></div><div class="phase-gate"><b>Exit gate</b><code>Scout Core + no domain package → General Scout</code> is an intentional tested configuration.</div></article>
            <article class="roadmap-phase"><div class="phase-status">09 · later</div><div class="phase-copy"><strong>Domain package contracts</strong><p>Define stable knowledge, configuration, identity, policy, workflow, tool, and controlled-extension interfaces.</p></div><div class="phase-gate"><b>Exit gate</b>A new domain specializes Scout through defined contracts instead of scattered core edits.</div></article>
            <article class="roadmap-phase"><div class="phase-status">10 · later</div><div class="phase-copy"><strong>Cross-domain portability proof</strong><p>Run deliberately unrelated domains such as recruiter, inventory/fruit-store, and IT support against the same Scout Core.</p></div><div class="phase-gate"><b>Pass condition</b>Same Scout Core SHA, different domain packages. Core edits needed only to satisfy one domain mean the portability test failed.</div></article>
            <article class="roadmap-phase"><div class="phase-status">11 · later</div><div class="phase-copy"><strong>Extension + agent platform</strong><p>Add richer customer tools, workflows, integrations, and agent-to-agent capabilities behind permissioned contracts instead of turning Scout into an unrestricted tool shell.</p></div><div class="phase-gate"><b>Exit gate</b>Schemas, permissions, timeouts, validation, side-effect classes, failure isolation, logging, and tests exist.</div></article>
            <article class="roadmap-phase"><div class="phase-status">12 · later</div><div class="phase-copy"><strong>Commercial/operator handoff</strong><p>Make Scout installable, configurable, testable, deployable, operable, troubleshootable, and extensible by another competent developer without hidden Bradley-only knowledge.</p></div><div class="phase-gate"><b>Exit gate</b>Deployment docs, ADRs, operator runbooks, configuration validation, security/licensing review, limitations, and handoff docs are sufficient for an independent operator.</div></article>
          </div>
        </section>

        <div class="roadmap-source-links">
          <a href="https://github.com/BradleyMatera/Scout-product-page/blob/main/SCOUT-ROADMAP.md" target="_blank" rel="noopener">canonical roadmap ↗</a>
          <a href="https://github.com/BradleyMatera/ProjectHub/tree/fix/phase7-8-conversation-gate" target="_blank" rel="noopener">active conversation branch ↗</a>
          <a href="https://github.com/BradleyMatera/ProjectHub/tree/develop" target="_blank" rel="noopener">develop ↗</a>
          <a href="https://github.com/BradleyMatera/ProjectHub-dev/blob/main/STAGING-SOURCE.json" target="_blank" rel="noopener">staging source marker ↗</a>
        </div>
      </div>
    `;
  }

  function run() {
    const roadmap = document.getElementById('roadmap');
    if (!roadmap) return;
    injectStyles();
    addRoadmapNav();
    renderWorkflow(roadmap);
    renderRoadmap(roadmap);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
})();
