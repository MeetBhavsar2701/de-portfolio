# Status & Checklist

## Progress
- [x] 1 Scaffold
- [x] 2 World and vehicle
- [x] 3 Stations and content
- [ ] 4 Mobile, performance and fallback
- [ ] 5 Tests
- [ ] 6 Deploy
- [ ] 7 Final QA

## Decisions
- Completed Step 1 (Scaffolding): Vite + React 18 + TypeScript with Three.js, R3F, Rapier, Zustand, Vitest, Playwright, ESLint 9 flat config.
- Reference study completed in `docs/REFERENCE_NOTES.md` analyzing Bruno Simon's 2025 folio architecture (MIT License).
- Completed Step 2 (World and Vehicle): Created responsive low-poly rover with pulsing cyan data core, WASD/arrows drive & steer, auto-righting mechanism, third-person dampened camera follow, dark navy grid pipeline world with 120 streaming instanced cyan/amber data packets, 6 circular stations with sensor colliders, glassmorphism HUD with live teleport controls, audio toggle, and `window.__portfolio` test hooks.
- Completed Step 3 (Stations and Content):
  - Built procedural set pieces for all 6 stations:
    1. **Source**: Database cylinders and high-tech API arch with glowing holographic gyro rings.
    2. **Ingest**: Conveyor belt with rotating rollers, billboard, and bumpable dynamic Kafka message crates (with rigid body sleeping for physics performance and collision blip audio).
    3. **Transform**: Industrial forge furnace with glowing amber chamber, rotating Spark and dbt gears, rising spark particles, and floating interactive project cards with external GitHub links.
    4. **Warehouse**: 3-tiered Medallion Lakehouse tower (Bronze, Silver, Gold glowing layers) and floating internship experience panel.
    5. **Dashboard**: Wall of telemetry screens with live animated bar charts, rotating donut gauge, and achievements billboard.
    6. **Output**: Monumental API gateway portal with direct links for GitHub, LinkedIn, and Download Resume (PDF).
  - Built accessible `StationModal` card overlay with `Esc` to close and `E` to reopen, respecting `prefers-reduced-motion`.
  - Implemented lightweight SQL interpreter in `src/lib/sql.ts` with terminal HUD overlay (toggled via `~`/`` ` `` or HUD button) supporting `HELP`, `SHOW TABLES`, `SELECT *`, specific column projection, `WHERE`, and `LIMIT` across `profile`, `skills`, `projects`, `experience`, `education`, and `certificates`.
  - Created procedural Web Audio synthesizer in `src/audio/SoundController.ts` generating ambient hum, speed-tracked engine tone, bump impacts, and station entry chords with persistent localStorage mute toggle.
  - Verified full test suite (`npm run verify`: 27 Vitest unit tests + Playwright E2E testing stations, SQL console, and vehicle navigation) with zero console errors.

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
- Repository: https://github.com/MeetBhavsar2701/de-portfolio
- Live Deployment: TBD (Configured in Step 6)
