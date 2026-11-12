# PROJECT SPECIFICATION

## GOAL
A free-hosted, interactive 3D portfolio and resume site in the spirit of bruno-simon.com, themed for a Data Engineer intern. The visitor drives a small vehicle (a "data packet carrier") through a pipeline-shaped world. Each station holds a section of my resume.

## MY PROFILE (use these values; if a value is blank, write realistic placeholder text and list it in STATUS.md under "Placeholders to replace")
- Name: [YOUR NAME]
- Headline: Data Engineer Intern
- City/Country: [CITY, COUNTRY]
- Email: [EMAIL]
- GitHub: [GITHUB URL]
- LinkedIn: [LINKEDIN URL]
- About (2-3 sentences): [ABOUT]
- Education: [DEGREE, COLLEGE, YEAR]
- Skills: Python, SQL, Spark, Kafka, Airflow, dbt, Docker, AWS/GCP basics, Git (edit to match [YOUR SKILLS])
- Projects (name, one line, stack, link): [PROJECT 1], [PROJECT 2], [PROJECT 3]
- Internship/experience: [ROLE, ORG, DATES, 2-3 bullets]
- Certificates/achievements: [LIST]

## TECH STACK (free only, no backend, no API keys, no paid services)
- Vite, React 18, TypeScript
- three, @react-three/fiber, @react-three/drei, @react-three/rapier (physics), zustand (state)
- Vitest for unit tests, Playwright for end-to-end and screenshot tests, ESLint
- All 3D content must be built procedurally from primitives, shaders and instancing, or come from CC0 sources. No copyrighted models, textures, music or logos. Record any third-party asset and its license in CREDITS.md.
- Output is a fully static site (dist folder).

## WORLD AND STATIONS (drive left to right along a pipeline)
1. **SOURCE**: database cylinders and API gates. Content: About me and education.
2. **INGEST**: a conveyor belt with Kafka-style message crates. Content: Skills, shown as crates the vehicle can bump.
3. **TRANSFORM**: a forge/furnace with glowing gears labelled Spark and dbt. Content: Projects, one card each.
4. **WAREHOUSE**: a tall lakehouse tower with data layers (bronze/silver/gold). Content: Internship and experience.
5. **DASHBOARD**: a wall of animated chart screens. Content: Certificates and achievements.
6. **OUTPUT**: an API gateway. Content: Contact links and a Download Resume (PDF) button.

*Extras*: a hidden SQL console (open with the backtick key or a button) that answers a few queries such as `SELECT * FROM experience`; a night-city/control-room look with a dark navy ground, cyan and amber glowing data packets travelling along rails; ambient synthesized sound generated in code with a mute toggle (off by default).

## CONTROLS
WASD or arrow keys to drive, space to brake/jump, touch joystick on mobile, a station menu to teleport, a reset-vehicle button, a mute button, and a Skip to 2D resume link always visible.

## QUALITY BARS (the project is done only when all are true)
- `npm run build`, `npm run lint`, `npm run typecheck`, `npm run test` and `npm run e2e` all pass with zero errors.
- Desktop: about 60 fps; mobile mid-range: at least 30 fps. Cap device pixel ratio at 2 (1.5 on mobile). Total first-load transfer under 8 MB.
- A plain 2D accessible resume page at `/resume` that works without WebGL, plus an automatic fallback to it when WebGL is unavailable or the device is very weak.
- Keyboard accessible UI overlays, readable contrast, prefers-reduced-motion respected.
- Page title, description and Open Graph tags set. No console errors.
- Deployed to a free host (decided in a later prompt) with a working public URL.

## WORKING RULES
- Keep all resume text in one file, `src/content/profile.ts`, so I can edit it later.
- Commit after every logical step with conventional commit messages.
- After finishing each prompt, update `STATUS.md`: tick finished items, note decisions, list known issues.
- Never commit secrets. Never ask me to run commands. If a tool is missing, install it yourself.
- Before starting any later prompt, read `PROJECT_SPEC.md` and `STATUS.md` first and continue from the first unchecked item.
