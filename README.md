# Eco Explorers — SCORM/xAPI HTML5 Game (Starter)

Vanilla **HTML/CSS/JS** scaffold for a 6-level kids game with **SCORM 1.2** and **xAPI** hooks. No build tools required.

## Project structure
```

.
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  ├─ app.js
│  ├─ ui.js
│  ├─ util.js
│  ├─ levels/
│  │  └─ level1.js
│  └─ tracking/
│     ├─ scorm.js
│     ├─ tracking.js
│     └─ xapi.js
├─ assets/
├─ docs/
└─ scorm/
├─ scorm-launch.html
└─ imsmanifest.xml

````

## Run locally
Open `index.html` in a modern browser (double-click is fine).  
- Outside an LMS, **SCORM calls no-op** (safe).  
- **xAPI** also no-ops unless you set config values (below).

## Optional: xAPI configuration
If you have an LRS (Learning Record Store), set the following **before** the tracking scripts load. You can uncomment and edit the snippet inside `index.html`:

```html
<script>
  window.XAPI_ENDPOINT = "https://your-lrs.example/xapi/";
  window.XAPI_AUTH = "Basic base64(username:password)";
  window.XAPI_ACTOR = { mbox: "mailto:player@example.com", name: "Player Name" };
</script>
````

## SCORM 1.2 package

Use the `/scorm` subtree for the LMS version (single SCO).

* **Entry point:** `scorm/scorm-launch.html`
* **Manifest:** `scorm/imsmanifest.xml`

Create a zip containing the **contents of `/scorm`** (not the parent folder). PowerShell example from the repo root:

```powershell
$dest = "eco-explorers-scorm12.zip"
if (Test-Path $dest) { Remove-Item $dest }
Compress-Archive -Path scorm\* -DestinationPath $dest
```

Upload the zip to your LMS.

## Deploy to GitHub Pages

1. Push this repo to GitHub (you already did).
2. In GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
   Set **Branch: `main`** and **Folder: `/root`** (or `/docs` if you move files there).
3. Visit `https://<your-username>.github.io/<repo>/`.

## Controls & accessibility

* Keyboard focus styles enabled; Level 1 supports number keys **1/2/3** as an alternative to drag/drop.
* Target size ≥ 44×44px.
* Basic ARIA labels for interactive items.

## Next milestones

* M2: Implement Level 2 and refine Level 1 feedback.
* M3: Fill Levels 3–6.
* M4: Accessibility polish (ARIA roles, focus order), asset compression.
* M5: CI to auto-attach SCORM zip on release.

## License

MIT for this scaffold. You are responsible for any third-party assets you add.

