# NutriScan

App web instalable para escanear codigos de barras y recibir recomendaciones nutricionales personalizadas segun tu perfil de salud.

## Run Locally

**Prerequisite:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## PWA and GitHub Pages

The app uses `vite-plugin-pwa` and can be installed on Android from Chrome after it is served over HTTPS.

For this repository, production builds use the GitHub Pages base path `/NutriScan/` automatically:

`npm run build`

If you deploy with a custom domain or another path, override it before building:

`VITE_BASE_PATH=/ npm run build`
