# frontend-v2

Portfolio frontend built with React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, and Zustand.

## Scripts

- `npm run dev` starts local development server.
- `npm run build` runs type-check + production build.
- `npm run lint` runs ESLint checks.
- `npm run test` runs Vitest test suite.
- `npm run test:watch` runs Vitest in watch mode.
- `npm run preview` serves the production build locally.

## Environment

- `VITE_API_URL` (optional): base URL for backend APIs.
  - Default: `http://localhost:8080`
  - Contact form posts to `POST /api/v1/contact`.
  - Analytics posts to `POST /api/v1/analytics/track` (failures are intentionally silent).

## Quality Gates

Run this before merging:

```bash
npm run lint
npm run test
npm run build
```

## Project Notes

- X-Ray mode state is managed via Zustand in `src/store/xrayStore.ts`.
- Shared API calls live in `src/api/client.ts`.
- Visual sections are split into reusable components under `src/components`.
