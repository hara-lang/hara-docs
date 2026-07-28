---
template: home.html
hide:
  - navigation
  - toc
---

<section class="hara-launch">
  <div class="hara-launch__head">
    <p class="hara-label">Start with a working project</p>
    <h1>What do you want to make?</h1>
    <p>Choose an outcome and open the workspace, guide, or project structure that gets you there.</p>
  </div>

  <div class="hara-outcome-grid">
    <a class="hara-outcome-card hara-outcome-card--primary" href="studio/">
      <span class="hara-card-kicker">No installation · Browser</span>
      <h2>Try Hara live</h2>
      <p>Open a real Hara workspace, evaluate forms, edit source, and see visual output without leaving the browser.</p>
      <small>Open the Studio <b>↗</b></small>
    </a>
    <a class="hara-outcome-card" href="create/first-game/">
      <span class="hara-card-kicker">Create · Beginner</span>
      <h2>Build a browser game</h2>
      <p>Start with a running scene and change its state, rules, and rendering while it stays open.</p>
      <small>Start building <b>→</b></small>
    </a>
    <a class="hara-outcome-card" href="work-visually/">
      <span class="hara-card-kicker">Visual · Workspace</span>
      <h2>Make a visual workspace</h2>
      <p>Connect source, canvas, REPL, inspector, and node views around one project.</p>
      <small>Explore visual work <b>→</b></small>
    </a>
    <a class="hara-outcome-card" href="create/chrome-project/">
      <span class="hara-card-kicker">Chrome · DevTools</span>
      <h2>Program a web page</h2>
      <p>Use Hara from Chrome DevTools against the page you are already inspecting.</p>
      <small>Set up Hara Chrome <b>→</b></small>
    </a>
    <a class="hara-outcome-card" href="create/vscode-project/">
      <span class="hara-card-kicker">Editor · Project</span>
      <h2>Work from VS Code</h2>
      <p>Connect your project directory to a live, isolated Hara runtime session.</p>
      <small>Set up VS Code <b>→</b></small>
    </a>
    <a class="hara-outcome-card" href="learn-programming/">
      <span class="hara-card-kicker">Learn · First principles</span>
      <h2>Learn programming</h2>
      <p>Learn values, decisions, functions, and changing state through immediate feedback.</p>
      <small>Start learning <b>→</b></small>
    </a>
  </div>
</section>

<section class="hara-section hara-live">
  <div class="hara-section__head">
    <p class="hara-label">See Hara in action</p>
    <h2>Write. Evaluate. See what changed.</h2>
    <p>Hara keeps the program running while you work. Evaluate one form, inspect the result, and keep useful changes in the project.</p>
    <a class="hara-inline-link" href="studio/">Open this workflow in the Studio <b>↗</b></a>
  </div>

  <div class="hara-code-card hara-live-card" data-hara-live aria-label="An editable Hara form changing live state">
    <div class="hara-code-card__head">
      <span>player.hal</span>
      <span data-hara-live-status>WASM · booting</span>
    </div>
    <label class="hara-live-card__source">
      <span class="visually-hidden">Editable Hara source</span>
      <textarea data-hara-live-source spellcheck="false" aria-label="Editable Hara source">; source remains editable
(def player
  (atom {:x 40 :score 0}))

(defn move-right [amount]
  (swap! player update :x + amount))

(move-right 2)</textarea>
    </label>
    <output class="hara-live-card__result" data-hara-live-result aria-live="polite">⇒ waiting for the live kernel…</output>
    <div class="hara-code-card__foot">
      <button type="button" data-hara-live-run>Evaluate</button>
      <span>Ctrl-E · evaluates as you edit</span>
    </div>
  </div>
</section>

<section class="hara-section">
  <div class="hara-section__head">
    <p class="hara-label">Choose where you work</p>
    <h2>One project, different surfaces.</h2>
  </div>
  <div class="hara-surface-grid">
    <a href="studio/">
      <span>01 / Browser Studio</span>
      <h3>Start immediately</h3>
      <p>Edit, evaluate, and see visual output without installing an editor.</p>
    </a>
    <a href="create/chrome-project/">
      <span>02 / Chrome DevTools</span>
      <h3>Work with the page</h3>
      <p>Keep the browser and its live state next to the Hara project.</p>
    </a>
    <a href="create/vscode-project/">
      <span>03 / VS Code</span>
      <h3>Work from source</h3>
      <p>Use a project directory and connect it to an isolated live runtime.</p>
    </a>
  </div>
</section>

<section class="hara-section hara-about">
  <div class="hara-section__head">
    <p class="hara-label">What is Hara?</p>
    <h2>A live language and project workspace.</h2>
    <p>Hara lets you evaluate code while a program is running, connect source to visual output, and use the same project from the browser, Chrome DevTools, or VS Code.</p>
  </div>
  <div class="hara-fact-grid">
    <article>
      <span>Live</span>
      <p>Change a running program one form at a time.</p>
    </article>
    <article>
      <span>Visual</span>
      <p>Connect code to canvases, nodes, inspectors, and project views.</p>
    </article>
    <article>
      <span>Project-based</span>
      <p>Keep source, workspace layout, capabilities, and extensions together.</p>
    </article>
  </div>
</section>

<section class="hara-section hara-explore">
  <div class="hara-section__head">
    <p class="hara-label">Go deeper</p>
    <h2>Build and understand Hara.</h2>
  </div>
  <nav class="hara-explore-grid" aria-label="Hara documentation">
    <a href="learn/">Language guide <b>→</b></a>
    <a href="projects/">Project structure <b>→</b></a>
    <a href="kernel/">Kernel and REPL <b>→</b></a>
    <a href="reference/rust-runtime/">Rust and WebAssembly <b>→</b></a>
    <a href="reference/runtime-libraries/">Runtime libraries <b>→</b></a>
    <a href="reference/">Specifications and reference <b>→</b></a>
  </nav>
</section>
