````markdown
# Eco Explorers — SCORM/xAPI HTML5 Game

Vanilla **HTML/CSS/JS** learning game with **6 short levels**.  
Runs on the open web (GitHub Pages) and inside an LMS via **SCORM 1.2**.  
Optionally emits **xAPI** statements when an LRS is configured.

---

## Live
- Web: https://kofijoo.github.io/scorm-testing/
- LMS entry (in SCORM package): `scorm/scorm-launch.html`

---

## Features
- 6 levels: L1 🍃 Sort • L2 🐞 Count • L3 ♻️ Sorter • L4 ✅ T/F • L5 🔀 A/B • L6 🏁 Final
- SCORM 1.2 wrapper (safe no-ops outside an LMS)
- Optional xAPI sender (`initialized`, `interacted`, `answered`, `completed`)
- Tracking: attempts, per-level scores, pass/fail, course average
- Accessibility: keyboard paths, focus styles, ARIA; targets ≥44px
- Static site; GitHub Actions workflow for Pages deploy

---

## Run locally
Open `index.html` in a modern browser.

## Deploy to GitHub Pages

Already configured via `.github/workflows/pages.yml`:

1. Push to `main`.
2. Check **Actions → Deploy static site to Pages**.
3. Visit the live link.

*No Actions?* Add a `.nojekyll` at repo root and publish from branch root.

---

## Package for LMS (SCORM 1.2)

Zip the **contents of `/scorm`** (not the folder itself):

```powershell
$dest = "eco-explorers-scorm12.zip"
if (Test-Path $dest) { Remove-Item $dest }
Compress-Archive -Path scorm\* -DestinationPath $dest
```

* Entry point in LMS: `scorm-launch.html`.
* Outside an LMS, SCORM API calls no-op (expected).

---

## Structure

```
.
├─ index.html
├─ css/            styles.css
├─ js/
│  ├─ app.js       router + intro + launcher
│  ├─ ui.js        UI helpers + progress
│  ├─ util.js      small DOM/misc utils
│  ├─ levels/      level1.js … level6.js
│  └─ tracking/    scorm.js · xapi.js · tracking.js
├─ assets/images/  avatars (png + optional webp)
└─ scorm/          LMS entry + mirrored runtime + imsmanifest.xml
```

---

## Useful

Reset local progress:

```js
localStorage.removeItem('eco-explorers-v1'); location.reload();
```

(Optional) convert avatars to WebP, then mirror to `/scorm`:

```powershell
# requires ImageMagick
Get-ChildItem assets\images\pic*.png | ForEach-Object {
  magick $_.FullName -quality 82 "assets/images/$($_.BaseName).webp"
}
Copy-Item assets\images\pic*.webp scorm\assets\images\ -Force
```

---

## Contributing

PRs and issues welcome. Keep the stack vanilla; preserve LMS compatibility.

## License

MIT. You are responsible for any third-party assets you add.