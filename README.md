# HiveQuest — The Nectar Adventure

A cross-platform-ready 2D side-scrolling pixel-art adventure built with Phaser 3 + Vite. Runs in modern desktop and mobile browsers; can be packaged for Android/iOS with Capacitor (instructions below).

## Included
- Playable side-scrolling platformer with movement, jumping, flower/coin collection, enemy collisions, hearts, score, level transitions and touch controls.
- Data-driven 100-level progression: 20 themed worlds × 5 levels. New world theme unlocks after each fifth level.
- Generated pixel-art game textures and theme palettes.
- Optional Firebase anonymous authentication + Firestore live top-10 leaderboard.
- Firestore security rules.

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and fill Firebase values (optional for offline play).
3. In this folder run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local Vite URL. For a production build use `npm run build`.

Without Firebase credentials, gameplay works locally and the UI clearly indicates the online leaderboard is not configured. A real global leaderboard cannot be activated until you create/configure your Firebase project.

## Enable the real leaderboard
1. Create a Firebase project at https://console.firebase.google.com/
2. Add a Web app and copy its config into `.env`.
3. In Authentication → Sign-in method, enable **Anonymous**.
4. Create a Cloud Firestore database.
5. Publish `firebase/firestore.rules`.
6. Restart Vite. The leaderboard subscribes to the top 10 scores in real time and scores are submitted after a completed level.

For a public production game, add App Check, rate limiting / anti-cheat validation via a trusted server or Cloud Functions, and moderation for display names. The current rules constrain score fields but cannot prove that a submitted score was legitimately earned.

## Cross-platform packaging
The same Phaser/Vite build works in desktop and mobile browsers. To ship store apps, add Capacitor:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init Honeybound com.example.honeybound --web-dir=dist
npm install @capacitor/android @capacitor/ios
npm run build
npx cap add android
npx cap add ios
npx cap sync
```
Open the Android project in Android Studio. iOS packaging requires macOS and Xcode. Test touch controls, safe areas, performance and offline behavior on real devices before release.

## Architecture
- `src/levels.js`: all 20 world narratives and deterministic level metadata for 100 levels.
- `src/main.js`: Phaser scene, procedural platforms/collectibles/enemies, gameplay and progression.
- `src/firebase.js`: Firebase auth, Firestore leaderboard subscription and score submission.
- `firebase/firestore.rules`: basic score write validation.

## Important current scope
This is a playable vertical-slice foundation, not a finished commercial release. The 20 themes have distinct palettes and narrative descriptions; unique hand-authored art, per-world NPC quest chains, boss encounters, audio, save syncing, and full per-level bespoke layouts remain production work. The leaderboard is live only after Firebase is configured.


## HiveQuest branded screens
The UI includes a HiveMart-inspired landing screen, world map, gameplay HUD, leaderboard, player profile and settings. The HiveMart wordmark treatment is text-based pending receipt of an approved transparent logo asset. Replace the placeholder developer credit with the contributor's preferred name before submission.
