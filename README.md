````markdown
# Eco Explorers — SCORM/xAPI HTML5 Game

[![Pages deploy](https://img.shields.io/github/actions/workflow/status/Kofijoo/scorm-testing/pages.yml?branch=main&label=pages)](https://github.com/Kofijoo/scorm-testing/actions)
[![Live demo](https://img.shields.io/website?url=https%3A%2F%2Fkofijoo.github.io%2Fscorm-testing%2F&label=demo)](https://kofijoo.github.io/scorm-testing/)
![Stack](https://img.shields.io/badge/HTML%20%7C%20CSS%20%7C%20Vanilla%20JS-0ea5e9)
![SCORM 1.2](https://img.shields.io/badge/SCORM-1.2-7c3aed)
![xAPI](https://img.shields.io/badge/xAPI-optional-22c55e)
[![License](https://img.shields.io/github/license/Kofijoo/scorm-testing)](LICENSE)
![Last commit](https://img.shields.io/github/last-commit/Kofijoo/scorm-testing)

**Direct:** vanilla HTML/CSS/JS game with **6 short levels**.  
**Portable:** runs on the open web (GitHub Pages) and inside an LMS via **SCORM 1.2**.  
**Optional analytics:** emits **xAPI** statements when an LRS is configured.

---

## 🔗 Live
- Web: **https://kofijoo.github.io/scorm-testing/**
- LMS entry: **`scorm/scorm-launch.html`** (packaged by `imsmanifest.xml`)

---

## 📦 What you get
- 🎮 **6 levels** with a clean “Good luck!” intro per level  
  | L1 🍃 Sort | L2 🐞 Count | L3 ♻️ Sorter | L4 ✅ T/F | L5 🔀 A/B | L6 🏁 Final |
  |---|---|---|---|---|---|
- 🧩 **SCORM 1.2** wrapper (safe no-ops outside an LMS)
- 📡 **xAPI** sender (no-ops until configured)
- 📊 Unified tracking (attempts, per-level scores, pass/fail, course average)
- ♿ Accessibility (keyboard paths, focus styles, ARIA; ≥44px targets)
- 🚀 Static hosting (no build tools). GitHub Actions deploys to Pages.

---

## 🧪 Run locally
Open `index.html` in a modern browser.  
Optional static server:
```bash
npx http-server .
# http://127.0.0.1:8080
````

---

## 🛠️ xAPI (optional)

Add **before** tracking scripts (snippet already scaffolded in `index.html`):

```html
<script>
  window.XAPI_ENDPOINT = "https://your-lrs.example/xapi/";
  window.XAPI_AUTH    = "Basic base64(username:password)";
  window.XAPI_ACTOR   = { mbox: "mailto:you@example.com", name: "Your Name" };
</script>
```

Emits: `initialized`, `interacted`, `answered`, `completed` (level + course).

---

## 🚀 Deploy to GitHub Pages

Already configured via `.github/workflows/pages.yml`:

1. Push to `main`.
2. Check **Actions → Deploy static site to Pages**.
3. Visit the demo link above.

*No Actions?* Add a `.nojekyll` at repo root and publish from branch root.

---

## 🎓 Package for LMS (SCORM 1.2)

Zip the **contents of `/scorm`**:

```powershell
$dest = "eco-explorers-scorm12.zip"
if (Test-Path $dest) { Remove-Item $dest }
Compress-Archive -Path scorm\* -DestinationPath $dest
```

Entry point inside LMS: **`scorm-launch.html`**.
Outside an LMS the SCORM API isn’t available; calls no-op.

---

## 🗂️ Structure

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

## ⚙️ Useful

Reset local progress:

```js
localStorage.removeItem('eco-explorers-v1'); location.reload();
```

(Optional) convert avatars to WebP (smaller), then mirror to `/scorm`:

```powershell
# requires ImageMagick
Get-ChildItem assets\images\pic*.png | ForEach-Object {
  magick $_.FullName -quality 82 "assets/images/$($_.BaseName).webp"
}
Copy-Item assets\images\pic*.webp scorm\assets\images\ -Force
```

---

## 🤝 Contributing

Issues and PRs welcome. Keep the stack **vanilla** and preserve **LMS compatibility**.

## 📄 License

MIT (you are responsible for any third-party assets you add).

```
```
