# Eco Explorers — SCORM/xAPI HTML5 Game
Eco Explorers is a kids’ learning game (6 short levels) built with vanilla HTML/CSS/JS.
It runs on the open web (GitHub Pages) and inside an LMS via SCORM 1.2; it can optionally send xAPI statements to an LRS.

# Table of contents

Live Demo

What’s inside

Project structure

Roadmap

Useful commands

Contributing

License

Why SCORM and xAPI?

# Live Demo

Web: https://kofijoo.github.io/scorm-testing/

LMS entry file: scorm/scorm-launch.html (packaged by imsmanifest.xml)

# What’s inside

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

# Project structure
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


# Roadmap

Polish game feel (sounds, micro-animations).

Deeper accessibility checks (screen-reader flows).

Per-level badges & end-of-course certificate.

CI step to auto-build SCORM zip on release.

# Useful commands
// reset tracking state (wipes localStorage and reloads)
// button exists in the UI as well
localStorage.removeItem('eco-explorers-v1'); location.reload();

# package SCORM 1.2
$dest = "eco-explorers-scorm12.zip"
if (Test-Path $dest) { Remove-Item $dest }
Compress-Archive -Path scorm\* -DestinationPath $dest

# Contributing

Issues and PRs are welcome. Keep the stack vanilla (no frameworks) and preserve LMS compatibility.

# License

MIT — see LICENSE. You are responsible for any third-party assets you add.

# Why SCORM and xAPI?

SCORM 1.2: runs in legacy LMSs (status, score, completion).

xAPI: modern analytics; this repo emits common verbs if configured.

Both layers no-op in plain web mode to keep the project simple.