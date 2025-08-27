Eco Explorers — SCORM/xAPI HTML5 Game


















Eco Explorers is a kids’ learning game (6 short levels) built with vanilla HTML/CSS/JS.
It runs on the open web (GitHub Pages) and inside an LMS via SCORM 1.2; it can optionally send xAPI statements to an LRS.

🔗 Live Demo

Web: https://kofijoo.github.io/scorm-testing/

LMS entry file: scorm/scorm-launch.html (packaged via imsmanifest.xml)

✨ What’s inside

6 levels with a friendly “Good luck!” intro card and character avatar on each level.

L1 — Sort the Leaves (drag & keyboard)

L2 — Bug Count (number selection)

L3 — Recycle Sorter (drag items to bins)

L4 — Eco Quiz (True/False)

L5 — Greener Choice (A/B)

L6 — Final Challenge (summary/finish)

SCORM 1.2 wrapper that no-ops outside an LMS.

xAPI lightweight sender (no-ops until configured).

Unified tracking of attempts, scores, pass/fail per level + course score.

Accessibility: focus rings, keyboard alternatives, ARIA labels, ≥44px targets.

Zero build tools: open index.html directly or deploy as static files.

GitHub Actions workflow that deploys to GitHub Pages.

📁 Project structure
.
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

🧪 Run locally (no tooling)

Just open index.html in a modern browser.
No server required. SCORM/xAPI calls no-op outside an LMS or without LRS config.

Optional local server:

# any static server works
npx http-server .
# open http://127.0.0.1:8080

🚀 Deploy to GitHub Pages

This repo already includes a Pages workflow (.github/workflows/pages.yml).

Push to main.

Check Actions → “Deploy static site to Pages”.

Visit the Live Demo link above.

If you don’t want Actions, add a .nojekyll file and publish from branch root.

🎓 LMS (SCORM 1.2) packaging

Create a SCORM 1.2 zip from the contents of /scorm:

$dest = "eco-explorers-scorm12.zip"
if (Test-Path $dest) { Remove-Item $dest }
Compress-Archive -Path scorm\* -DestinationPath $dest


Upload the zip to your LMS. Entry point is scorm-launch.html.

Outside an LMS, the SCORM API isn’t available; all SCORM calls safely no-op.

📡 xAPI (optional)

Configure your LRS before the tracking scripts load (the snippet is in index.html):

<script>
  window.XAPI_ENDPOINT = "https://your-lrs.example/xapi/";
  window.XAPI_AUTH = "Basic base64(username:password)";
  window.XAPI_ACTOR = { mbox: "mailto:you@example.com", name: "Your Name" };
</script>


What we send (examples): initialized, interacted, answered, completed (level and course).

⌨️ Controls & accessibility

Drag & drop where appropriate; keyboard alternatives exist (e.g., L1 uses 1/2/3 keys).

Clear focus indicators via :focus-visible.

High-contrast CTAs; True/False choices styled uniformly to avoid color bias.

🖼️ Performance (avatars)

The level intro avatar uses <picture> with WebP + PNG fallback (when WebP is present).
You can convert PNG → WebP locally with ImageMagick:

winget install ImageMagick.ImageMagick   # or choco install imagemagick
Get-ChildItem assets\images\pic*.png | ForEach-Object {
  magick $_.FullName -quality 82 "assets/images/$($_.BaseName).webp"
}
Copy-Item assets\images\pic*.webp scorm\assets\images\ -Force


Don’t want to install anything? Keep PNGs; the site works fine.

🗺️ Roadmap

Polish game feel (sounds, micro-animations).

Deeper accessibility checks (screen-reader flows).

Per-level badges & end-of-course certificate.

CI step to auto-build SCORM zip on release.

🧰 Useful commands
# reset tracking state
# (wipes localStorage and reloads)
# button exists in the UI as well
# but you can also call:
localStorage.removeItem('eco-explorers-v1'); location.reload();

# package SCORM 1.2
$dest = "eco-explorers-scorm12.zip"
if (Test-Path $dest) { Remove-Item $dest }
Compress-Archive -Path scorm\* -DestinationPath $dest

🤝 Contributing

Issues and PRs are welcome. Please keep the stack vanilla (no frameworks) and preserve LMS compatibility.

📄 License

MIT — see LICENSE (you are responsible for any third-party assets you add).

🧭 Why SCORM and xAPI?

SCORM 1.2 ensures the package runs in legacy LMSs (status, score, completion).

xAPI supports modern analytics; this repo sends common verbs if configured.

Both layers no-op in plain web mode to keep the project simple.