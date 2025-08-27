<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>Eco Explorers — SCORM/xAPI HTML5 Game (README)</title>
  <meta name="description" content="Eco Explorers is a kids’ learning game built with vanilla HTML/CSS/JS, with SCORM 1.2 and optional xAPI tracking. Runs on the open web and in LMSs." />
  <meta name="theme-color" content="#0ea5e9" />
  <style>
    :root{
      --bg:#0b1220;        /* page background */
      --panel:#0f172a;     /* content card */
      --ink:#e2e8f0;       /* text */
      --muted:#94a3b8;     /* secondary text */
      --brand:#0ea5e9;     /* accents */
      --ok:#22c55e;
      --violet:#7c3aed;
      --radius:14px;
    }

    *{ box-sizing:border-box; }
    html,body{ height:100%; }
    body{
      margin:0;
      font: 16px/1.55 system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
      color:var(--ink);
      background:
        radial-gradient(1200px 700px at 10% -10%, #0b5fb6 0%, transparent 60%),
        radial-gradient(1200px 700px at 110% 110%, #0d9488 0%, transparent 60%),
        var(--bg);
      padding: 32px 20px 60px;
    }

    .wrap{
      width:min(980px, 96vw);
      margin-inline:auto;
    }

    header{
      display:grid;
      gap: 12px;
      margin-bottom: 18px;
    }
    h1{
      margin:0;
      font-size: clamp(28px, 4vw, 40px);
      letter-spacing:.2px;
    }
    .lede{ color: var(--muted); margin: 2px 0 0; }

    .card{
      background: var(--panel);
      border: 1px solid rgba(148,163,184,.18);
      border-radius: var(--radius);
      padding: 22px;
      box-shadow: 0 6px 28px rgba(0,0,0,.25);
    }

    .badges{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      align-items:center;
      margin: 2px 0 6px;
    }
    .badges img{
      height: 20px;
      border-radius: 6px;
      background:#111827;
      border:1px solid rgba(255,255,255,.06);
    }

    nav.toc{
      margin: 14px 0 18px;
      padding: 12px 14px;
      background: rgba(148,163,184,.08);
      border-radius: var(--radius);
      border: 1px dashed rgba(148,163,184,.25);
    }
    nav.toc a{ color: #cbd5e1; text-decoration: none; }
    nav.toc a:hover{ color: #fff; text-decoration: underline; }
    nav.toc ul{ margin: 8px 0 0 18px; }

    h2{
      margin: 28px 0 10px;
      font-size: clamp(20px, 3vw, 28px);
      border-bottom: 1px solid rgba(148,163,184,.2);
      padding-bottom: 6px;
    }
    h3{ margin: 18px 0 8px; }

    p{ margin: 10px 0; color: var(--ink); }
    .muted{ color: var(--muted); }

    a{ color: #7dd3fc; }
    a:hover{ color: #38bdf8; }

    ul, ol{ margin: 8px 0 12px 22px; }

    .grid{
      display:grid;
      gap: 12px;
    }
    .grid.two{ grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }

    pre{
      position: relative;
      background: #0a0f1a;
      color: #e5e7eb;
      border: 1px solid rgba(148,163,184,.2);
      border-radius: 12px;
      padding: 14px 12px;
      overflow: auto;
      line-height: 1.45;
    }
    code, pre code{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; font-size: 0.95rem; }

    .copy{
      position:absolute; top:8px; right:8px;
      padding:6px 9px; font-size:.8rem;
      border-radius: 8px; border:1px solid rgba(148,163,184,.3);
      background:#0b1526; color:#cbd5e1; cursor:pointer;
    }
    .copy:hover{ filter:brightness(1.1); }

    .kbd{ font-family: ui-monospace, monospace; border:1px solid rgba(148,163,184,.35); padding:2px 6px; border-radius:6px; background: rgba(148,163,184,.12); }

    footer{
      margin-top: 30px;
      color: var(--muted);
      text-align:center;
    }
  </style>
</head>
<body>
  <main class="wrap">
    <header>
      <h1>Eco Explorers — SCORM/xAPI HTML5 Game</h1>
      <p class="lede">A kids’ learning game (6 levels) in <strong>vanilla HTML/CSS/JS</strong>. Runs on the open web (GitHub Pages) and in LMSs via <strong>SCORM&nbsp;1.2</strong>, with optional <strong>xAPI</strong> analytics.</p>
      <div class="badges card">
        <a href="https://github.com/Kofijoo/scorm-testing/actions" target="_blank" rel="noopener">
          <img alt="Pages deploy" src="https://img.shields.io/github/actions/workflow/status/Kofijoo/scorm-testing/pages.yml?branch=main&label=pages%20deploy">
        </a>
        <a href="https://kofijoo.github.io/scorm-testing/" target="_blank" rel="noopener">
          <img alt="Live – GitHub Pages" src="https://img.shields.io/website?url=https%3A%2F%2Fkofijoo.github.io%2Fscorm-testing%2F&label=live%20demo">
        </a>
        <img alt="Stack" src="https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20Vanilla%20JS-0ea5e9">
        <img alt="SCORM 1.2" src="https://img.shields.io/badge/SCORM-1.2-7c3aed">
        <img alt="xAPI enabled" src="https://img.shields.io/badge/xAPI-enabled-22c55e">
        <img alt="Accessibility" src="https://img.shields.io/badge/accessible-keyboard%20%26%20ARIA-059669">
        <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-green">
        <img alt="Last commit" src="https://img.shields.io/github/last-commit/Kofijoo/scorm-testing">
        <a href="https://github.com/Kofijoo/scorm-testing/issues" target="_blank" rel="noopener">
          <img alt="Issues" src="https://img.shields.io/github/issues/Kofijoo/scorm-testing?label=issues">
        </a>
      </div>
    </header>

    <nav class="toc card">
      <strong>Table of contents</strong>
      <ul>
        <li><a href="#live-demo">Live demo</a></li>
        <li><a href="#whats-inside">What’s inside</a></li>
        <li><a href="#structure">Project structure</a></li>
        <li><a href="#run-locally">Run locally</a></li>
        <li><a href="#deploy">Deploy to GitHub Pages</a></li>
        <li><a href="#scorm">LMS (SCORM 1.2) packaging</a></li>
        <li><a href="#xapi">xAPI (optional)</a></li>
        <li><a href="#accessibility">Controls & accessibility</a></li>
        <li><a href="#performance">Performance (avatars)</a></li>
        <li><a href="#roadmap">Roadmap</a></li>
        <li><a href="#commands">Useful commands</a></li>
        <li><a href="#contributing">Contributing</a></li>
        <li><a href="#license">License</a></li>
        <li><a href="#why-both">Why SCORM and xAPI?</a></li>
      </ul>
    </nav>

    <section id="live-demo" class="card">
      <h2>🔗 Live Demo</h2>
      <p><strong>Web:</strong> <a href="https://kofijoo.github.io/scorm-testing/" target="_blank" rel="noopener">https://kofijoo.github.io/scorm-testing/</a></p>
      <p><strong>LMS entry:</strong> <code>scorm/scorm-launch.html</code> (packaged by <code>imsmanifest.xml</code>)</p>
    </section>

    <section id="whats-inside" class="card">
      <h2>✨ What’s inside</h2>
      <ul>
        <li><strong>6 levels</strong> with a friendly <em>“Good luck!”</em> intro card and avatar:</li>
      </ul>
      <div class="grid two">
        <div class="card">
          <ul>
            <li>L1 — Sort the Leaves (drag &amp; keyboard)</li>
            <li>L2 — Bug Count (number selection)</li>
            <li>L3 — Recycle Sorter (drag items to bins)</li>
          </ul>
        </div>
        <div class="card">
          <ul>
            <li>L4 — Eco Quiz (True/False)</li>
            <li>L5 — Greener Choice (A/B)</li>
            <li>L6 — Final Challenge (summary/finish)</li>
          </ul>
        </div>
      </div>
      <ul>
        <li><strong>SCORM 1.2</strong> wrapper that safely no-ops outside an LMS.</li>
        <li><strong>xAPI</strong> lightweight sender (no-ops until configured).</li>
        <li><strong>Unified tracking</strong> of attempts, scores, pass/fail per level + course score.</li>
        <li><strong>Accessibility</strong>: focus rings, keyboard alternatives, ARIA labels, ≥44px targets.</li>
        <li><strong>Zero build tools</strong>: open <code>index.html</code> directly or deploy as static files.</li>
        <li><strong>GitHub Actions</strong> workflow that deploys to GitHub Pages.</li>
      </ul>
    </section>

    <section id="structure" class="card">
      <h2>📁 Project structure</h2>
      <pre data-copy><button class="copy" title="Copy">Copy</button><code>.
├─ index.html                 # Web entry
├─ css/
│  └─ styles.css
├─ js/
│  ├─ app.js                  # Router + intro scenes + level launcher
│  ├─ ui.js                   # UI helpers + progress dots
│  ├─ util.js                 # tiny DOM/misc helpers
│  ├─ levels/
│  │  ├─ level1.js … level6.js
│  └─ tracking/
│     ├─ scorm.js             # SCORM 1.2 safe wrapper
│     ├─ xapi.js              # xAPI sender (no-op until configured)
│     └─ tracking.js          # single state + stats
├─ assets/
│  └─ images/                 # character avatars (png + optional webp)
└─ scorm/
   ├─ scorm-launch.html       # LMS entry page
   ├─ imsmanifest.xml         # SCORM 1.2 manifest
   ├─ css/, js/, assets/      # mirrored runtime files for the LMS package
</code></pre>
    </section>

    <section id="run-locally" class="card">
      <h2>🧪 Run locally (no tooling)</h2>
      <p>Open <code>index.html</code> in a modern browser. SCORM/xAPI calls <strong>no-op</strong> outside an LMS or without LRS config.</p>
      <p class="muted">Optional static server:</p>
      <pre data-copy><button class="copy" title="Copy">Copy</button><code># any static server works
npx http-server .
# open http://127.0.0.1:8080
</code></pre>
    </section>

    <section id="deploy" class="card">
      <h2>🚀 Deploy to GitHub Pages</h2>
      <p>This repo includes <code>.github/workflows/pages.yml</code>.</p>
      <ol>
        <li>Push to <code>main</code>.</li>
        <li>Check <strong>Actions</strong> → “Deploy static site to Pages”.</li>
        <li>Visit the Live Demo link.</li>
      </ol>
      <p class="muted">If you don’t want Actions, add a <code>.nojekyll</code> file and publish from the branch root.</p>
    </section>

    <section id="scorm" class="card">
      <h2>🎓 LMS (SCORM 1.2) packaging</h2>
      <p>Create a SCORM 1.2 zip from the <em>contents</em> of <code>/scorm</code>:</p>
      <pre data-copy><button class="copy" title="Copy">Copy</button><code class="language-powershell">$dest = "eco-explorers-scorm12.zip"
if (Test-Path $dest) { Remove-Item $dest }
Compress-Archive -Path scorm\* -DestinationPath $dest
</code></pre>
      <p>Upload to your LMS. Entry point: <code>scorm-launch.html</code>.</p>
      <p class="muted"><strong>Note:</strong> Outside an LMS, the SCORM API isn’t available; all SCORM calls safely no-op.</p>
    </section>

    <section id="xapi" class="card">
      <h2>📡 xAPI (optional)</h2>
      <p>Configure your LRS <em>before</em> the tracking scripts load (snippet in <code>index.html</code>):</p>
      <pre data-copy><button class="copy" title="Copy">Copy</button><code>&lt;script&gt;
  window.XAPI_ENDPOINT = "https://your-lrs.example/xapi/";
  window.XAPI_AUTH = "Basic base64(username:password)";
  window.XAPI_ACTOR = { mbox: "mailto:you@example.com", name: "Your Name" };
&lt;/script&gt;
</code></pre>
      <p class="muted">Emitted verbs (examples): <code>initialized</code>, <code>interacted</code>, <code>answered</code>, <code>completed</code> (level and course).</p>
    </section>

    <section id="accessibility" class="card">
      <h2>⌨️ Controls &amp; accessibility</h2>
      <ul>
        <li>Drag &amp; drop where appropriate; keyboard alternatives exist (e.g., L1 supports <span class="kbd">1</span>/<span class="kbd">2</span>/<span class="kbd">3</span>).</li>
        <li>Clear focus indicators via <code>:focus-visible</code>.</li>
        <li>High-contrast CTAs; True/False choices styled uniformly to avoid color bias.</li>
      </ul>
    </section>

    <section id="performance" class="card">
      <h2>🖼️ Performance (avatars)</h2>
      <p>The level intro avatar uses <code>&lt;picture&gt;</code> with <strong>WebP</strong> + PNG fallback (when WebP exists). Convert PNG → WebP locally with ImageMagick:</p>
      <pre data-copy><button class="copy" title="Copy">Copy</button><code class="language-powershell">winget install ImageMagick.ImageMagick   # or: choco install imagemagick
Get-ChildItem assets\images\pic*.png | ForEach-Object {
  magick $_.FullName -quality 82 "assets/images/$($_.BaseName).webp"
}
Copy-Item assets\images\pic*.webp scorm\assets\images\ -Force
</code></pre>
      <p class="muted">Not required for functionality—PNG works fine. WebP is a bandwidth/perf win.</p>
    </section>

    <section id="roadmap" class="card">
      <h2>🗺️ Roadmap</h2>
      <ul>
        <li>Polish game feel (sounds, micro-animations).</li>
        <li>Deeper accessibility checks (screen-reader flows).</li>
        <li>Per-level badges &amp; end-of-course certificate.</li>
        <li>CI step to auto-build SCORM zip on release.</li>
      </ul>
    </section>

    <section id="commands" class="card">
      <h2>🧰 Useful commands</h2>
      <pre data-copy><button class="copy" title="Copy">Copy</button><code class="language-powershell"># reset tracking state (localStorage) then reload
localStorage.removeItem('eco-explorers-v1'); location.reload();

# package SCORM 1.2
$dest = "eco-explorers-scorm12.zip"
if (Test-Path $dest) { Remove-Item $dest }
Compress-Archive -Path scorm\* -DestinationPath $dest
</code></pre>
    </section>

    <section id="contributing" class="card">
      <h2>🤝 Contributing</h2>
      <p>Issues and PRs are welcome. Please keep the stack vanilla (no frameworks) and preserve LMS compatibility.</p>
    </section>

    <section id="license" class="card">
      <h2>📄 License</h2>
      <p>MIT — see <code>LICENSE</code>. You’re responsible for any third-party assets you add.</p>
    </section>

    <section id="why-both" class="card">
      <h2>🧭 Why SCORM <em>and</em> xAPI?</h2>
      <ul>
        <li><strong>SCORM 1.2</strong> ensures the package runs in legacy LMSs (status, score, completion).</li>
        <li><strong>xAPI</strong> supports modern analytics; this repo sends common verbs if configured.</li>
        <li>Both layers <strong>no-op</strong> in plain web mode to keep the project simple.</li>
      </ul>
      <p class="muted">Built to be simple, inspectable, and LMS-friendly with a clear learning path for new contributors.</p>
    </section>

    <footer>
      <p>© Eco Explorers — HTML/CSS/JS • SCORM 1.2 • xAPI</p>
    </footer>
  </main>

  <script>
    // Copy-to-clipboard for all code blocks with a .copy button
    document.querySelectorAll('pre[data-copy]').forEach(pre => {
      const btn = pre.querySelector('.copy');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const text = pre.textContent.replace(/^Copy$/m, '').trim();
        navigator.clipboard.writeText(text).then(() => {
          const old = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = old, 1200);
        });
      });
    });
  </script>
</body>
</html>
