<section class="hara-home-section hara-home-intro">
  <p class="hara-label">01 / MAKE SOMETHING LIVE</p>
  <div>
    <img class="hara-home-mark" src="assets/hara-mark.svg" alt="Hara">
    <h2>Code, see, change, repeat.</h2>
    <p>Hara is for projects that stay live while you make them. Work in a browser, a Chrome DevTools panel, or VS Code; evaluate a form, inspect its result, and move between source and visual views without losing the project underneath.</p>
  </div>
</section>

<section class="hara-home-section">
  <p class="hara-label">02 / THE WORKSPACE</p>
  <div class="hara-feature-grid">
    <article>
      <span>01</span>
      <h3>Live evaluation</h3>
      <p>Keep a running kernel close to your source and test ideas one form at a time.</p>
    </article>
    <article>
      <span>02</span>
      <h3>Visual workspaces</h3>
      <p>Use code, visual, patch, inspector, and REPL views as different ways to understand one project.</p>
    </article>
    <article>
      <span>03</span>
      <h3>Projects that travel</h3>
      <p>Move between the Studio, Hara Chrome, VS Code, and purpose-built hosts with explicit project boundaries.</p>
    </article>
    <article>
      <span>04</span>
      <h3>A small portable core</h3>
      <p>Hara keeps effects explicit so the same project can meet browser, JVM, Rust, and WebAssembly hosts clearly.</p>
    </article>
  </div>
</section>

<section class="hara-home-section hara-quickstart">
  <div>
    <p class="hara-label">03 / FIRST PROJECT</p>
    <h2>Make a browser game.</h2>
    <p>Start with a small scene, run it live, and use the REPL to change its behaviour while it is open.</p>
  </div>
  <pre><code>; starter game loop
(def state (atom {:x 40 :score 0}))
(defn tick []
  (swap! state update :x + 2))

; evaluate, observe, adjust</code></pre>
</section>

<section class="hara-home-section hara-paths">
  <p class="hara-label">04 / CHOOSE A PATH</p>
  <div class="hara-path-grid">
    <a href="learn-programming/">
      <span>Learn</span>
      <strong>Learn to program</strong>
      <p>Start with values, decisions, functions, and live feedback.</p>
    </a>
    <a href="create/first-game/">
      <span>Create</span>
      <strong>First browser game</strong>
      <p>Build a small interactive project around Hara's live workflow.</p>
    </a>
    <a href="create/chrome-project/">
      <span>Workspace</span>
      <strong>Hara Chrome project</strong>
      <p>Use the DevTools panel, a project directory, spaces, and the REPL.</p>
    </a>
    <a href="create/vscode-project/">
      <span>Editor</span>
      <strong>Hara VS Code project</strong>
      <p>Connect to a live Hara server and develop in an isolated session.</p>
    </a>
    <a href="projects/publish-greenways/">
      <span>Share</span>
      <strong>Greenways Spaces</strong>
      <p>See the planned publishing journey and what is available today.</p>
    </a>
  </div>
</section>
