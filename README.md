# Fever Pets

Show and sort pets using an Angular 20 + Nx workspace.

- Angular standalone + Signals
- Nx monorepo (apps/web + libs)
- Data from JSON Server (public API)

## Features

- List pets with responsive cards
- Sorting:
  - By name, weight, height, length (uses JSON Server `_sort` + `_order`)
  - By kind (dog/cat) using JSON Server filtering (`?kind=dog|cat`)
  - When “kind” is selected:
    - An additional Kind dropdown appears (All/Dog/Cat)
    - The Asc/Desc dropdown is hidden (filtering is used instead of sorting)
- Pagination:
  - Page size options: 6, 12, 24, 48
  - Prev/Next with disabled states
  - Uses JSON Server `_page` and `_limit`
- Image handling:
  - Graceful “Image unavailable” placeholder if the image fails to load
  - Images contained within card boundaries (object-fit + aspect-ratio)

## Requirements

- Node.js (LTS recommended)
- npm
- Git

This workspace pins TypeScript to `~5.8.x` for Angular compiler compatibility.

## Getting Started

1) Install dependencies
- npm install

2) Start the app
- npm start
- Open http://localhost:4200

3) Run linters and tests
- npm run lint
- npm test

## API configuration

The app reads the base URL from an injection token. Default value is already set.

File: apps/web/src/app/app.config.ts
- { provide: PETS_API_BASE_URL, useValue: 'https://my-json-server.typicode.com/Feverup/fever_pets_data' }

If you need to change it, update the value above.

## How it works (JSON Server queries)

- Pagination
  - _page=1&_limit=12
- Sorting
  - _sort=weight&_order=asc
  - _sort=name&_order=desc
- Filtering
  - kind=dog
  - kind=cat

When “Sort by: kind” is selected, the component switches to filtering mode:
- Shows a “Kind” dropdown (All/Dog/Cat)
- Hides the “Order” dropdown
- Calls GET /pets?kind=dog (or cat) with pagination

## Useful Nx commands

- Serve: npx nx serve web
- Build: npx nx build web
- Lint: npx nx lint
- Test: npx nx test
- Project graph: npx nx graph --focus=web

## Troubleshooting

- TypeScript mismatch
  - Ensure TypeScript is ~5.8.x (this repo pins it)
  - Reinstall if needed: rm -rf node_modules package-lock.json && npm install
- CORS issues with alternative APIs
  - Use a dev proxy or ensure the API supports CORS

## Project structure (high level)

- apps/web: Angular application
- feature-shell: feature library with routes and pages
- data-access-pets: models + PetsService (sorting/pagination/filtering)
- ui: presentational components (e.g., PetCard)

## Scripts

- start: nx serve web
- build: nx build web
- test: nx run-many -t test
- lint: nx run-many -t lint
- affected:graph: nx graph --focus=web
