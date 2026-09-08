# PIXN project instructions

## Product intent

- Maintain PIXN as a student-owned personal blog about security, cryptography, development, study, and life.
- Preserve the restrained black-and-white visual language, the existing typography, and the `Px` mark.
- Keep interface copy in English unless the user explicitly requests another language.
- Prefer a small, clear information architecture over adding speculative pages or dense menus.

## Content boundaries

- Never claim that PIXN completed a project, won an award, held a job, spoke at an event, or earned a credential without user-provided evidence.
- Do not import or republish wargame, CTF, Dreamhack, challenge-solution, or flag content into `public/learn` or `public/reference` unless the user explicitly changes this rule.
- External technical material requires permission and must retain a visible original-source link. Remove personal biography, promotion, awards, travel, and first-person claims belonging to the original author.
- Keep security content educational and scoped to authorized testing, secure engineering, defensive verification, or clearly safe examples.

## Source ownership

- `app/` owns the hosted application shell and homepage.
- `public/` owns the static multi-route blog consumed by GitHub Pages and the hosted Site.
- `scripts/import-learning.mjs` and `scripts/import-cullinan.mjs` own generated technical libraries. Change their generation rules rather than hand-editing generated articles that will be overwritten.
- Preserve `public/og.png` and the existing GitHub Pages base-path behavior.

## Required workflow

1. Inspect the current Git status and preserve unrelated user changes.
2. Make the smallest coherent change that satisfies the request.
3. When current external facts or OpenAI behavior matter, verify them against primary sources before implementation.
4. Run `npm run check` after source or content changes.
5. Run `npm run test:e2e` after navigation, layout, typography, responsive CSS, or route changes.
6. For reference-image work, compare the implementation at desktop, tablet, and mobile sizes and iterate until the requested visual relationship is met.
7. Do not report completion until checks pass and the requested deployment succeeds.

## Review severity

- P0: credential exposure, destructive data loss, unauthorized publication, or a critical exploitable security issue.
- P1: broken production build/deployment, inaccessible primary navigation, serious security regression, or widespread broken routes.
- P2: incorrect content ownership, missing source attribution, responsive overlap, broken secondary links, or meaningful accessibility regression.
- P3: minor copy, formatting, or maintainability issue that does not block use.

## Completion rules

- Build and production dependency audit succeed.
- Static content verification reports no broken internal routes, forbidden learning content, unsafe imported markup, or missing attribution.
- Browser tests pass at 1440px, 768px, and 390px widths when UI behavior changed.
- GitHub Pages output is generated successfully.
- The working tree contains only intentional changes.
