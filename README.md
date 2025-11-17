# Wizard Builds Towers

A browser-based idle tower building game built with React, TypeScript, and Framer Motion.

## Features

- Animated brick-by-brick tower construction
- Random combo multipliers for each completed row
- Dynamic camera panning as the tower grows
- Tower selling system with gold rewards

## Tech Stack

- **Vite** - Build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management

## Development

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Deployment

This project is configured for GitHub Pages deployment.

### Deploy to GitHub Pages

1. Push your code to GitHub repository `yukimakavy/wizard-builds-towers`
2. Run the build:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to GitHub Pages using one of these methods:

   **Option A: Using gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```

   **Option B: Manual deployment**
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"
   - Create `.github/workflows/deploy.yml` (see below)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Your game will be live at: `https://yukimakavy.github.io/wizard-builds-towers/`

## License

MIT
