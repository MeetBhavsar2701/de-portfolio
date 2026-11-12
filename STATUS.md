# Status & Checklist

## Progress
- [x] 1 Scaffold
- [x] 2 World and vehicle
- [x] 3 Stations and content
- [x] 4 Mobile, performance and fallback
- [x] 5 Tests and hardening
- [x] 6 Deploy
- [ ] 7 Final QA

## Decisions
- Completed Step 1 (Scaffolding): Vite + React 18 + TypeScript with Three.js, R3F, Rapier, Zustand, Vitest, Playwright, ESLint 9 flat config.
- Reference study completed in `docs/REFERENCE_NOTES.md` analyzing Bruno Simon's 2025 folio architecture (MIT License).
- Completed Step 2 (World and Vehicle): Created responsive low-poly rover with pulsing cyan data core, WASD/arrows drive & steer, auto-righting mechanism, third-person dampened camera follow, dark navy grid pipeline world with 120 streaming instanced cyan/amber data packets, 6 circular stations with sensor colliders, glassmorphism HUD with live teleport controls, audio toggle, and `window.__portfolio` test hooks.
- Completed Step 3 (Stations and Content): Built 6 procedural station set pieces, interactive accessible cards, SQL console with in-memory execution, Web Audio synthesizer, and comprehensive unit/e2e test coverage.
- Completed Step 4 (Mobile, Performance, Fallback, PDF): Touch joystick, `/resume/` accessible 2D fallback, automated build-time PDF & OG image generation, WebGL capability check, vendor code-splitting (under 3.3 MB transfer), axe-core accessibility tests.
- Completed Step 5 (Tests and Hardening): Canvas error boundary, WebGL context loss recovery, window blur input release, automated visitor playthrough test suite with zero console errors and zero failed requests.
- Completed Step 6 (Deploy):
  - Configured GitHub Pages workflow `.github/workflows/deploy.yml` with `actions/upload-pages-artifact` and `actions/deploy-pages`.
  - Configured repository base path `BASE_PATH=/de-portfolio/` and site URL `https://meetbhavsar2701.github.io/de-portfolio`.
  - Added live production smoke test suite in `tests/e2e/live.spec.ts`.

## Placeholders to replace
- Name: `Alex Rivera` (in `src/content/profile.ts`)
- Headline: `Data Engineer Intern` (in `src/content/profile.ts`)
- City/Country: `San Francisco, CA` (in `src/content/profile.ts`)
- Email: `alex.rivera.de@example.com` (in `src/content/profile.ts`)
- GitHub: `https://github.com/alexrivera-de` (in `src/content/profile.ts`)
- LinkedIn: `https://linkedin.com/in/alexrivera-de` (in `src/content/profile.ts`)
- About: `Aspiring Data Engineer with a focus on high-throughput stream ingestion and scalable distributed transformations...` (in `src/content/profile.ts`)
- Education: `B.S. in Computer Science, State University, 2025` (in `src/content/profile.ts`)
- Projects: `StreamPulse`, `LakeForge`, `TelemetrySync` (in `src/content/profile.ts`)
- Internship/experience: `Data Platform Intern`, `Nexus Data Labs` (in `src/content/profile.ts`)
- Certificates/achievements: `AWS Certified Data Engineer - Associate`, `1st Place - University Hackathon: Big Data Analytics Track`, `Dean’s Honor List: 2023 - 2024` (in `src/content/profile.ts`)

## Known issues
- None.

## Live URL
- **Production URL**: https://meetbhavsar2701.github.io/de-portfolio/
- **2D Accessible Resume**: https://meetbhavsar2701.github.io/de-portfolio/resume/
- **Automated Resume PDF**: https://meetbhavsar2701.github.io/de-portfolio/resume.pdf
- **Repository**: https://github.com/MeetBhavsar2701/de-portfolio
