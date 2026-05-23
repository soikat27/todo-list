# Frontend Webpack Template

A clean starter template for small frontend projects that use **npm** and **Webpack**. It gives you a ready-to-run dev server, production builds, HTML generation, CSS loading, basic asset handling, and a minimal `src/` structure.

This template is intentionally lightweight: no framework, test runner, TypeScript, Sass, or formatting setup by default. Add those pieces only when a project actually needs them.

## Included

- Webpack 5 with separate common, development, and production configs
- Local development through Webpack Dev Server
- HTML generation from `src/template.html`
- CSS loading with `normalize.css` and a starter `style.css`
- Basic image asset handling
- Optional GitHub Pages deployment through `gh-pages`

## Project Structure

```text
frontend-webpack-template/
├── src/
│   ├── index.js
│   ├── template.html
│   └── styles/
│       ├── normalize.css
│       └── style.css
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── package.json
└── README.md
```

## Getting Started

If this repository is marked as a GitHub template, click **Use this template** and create a new repository from it.

You can also clone it directly:

```bash
git clone https://github.com/soikat27/frontend-webpack-template.git
cd frontend-webpack-template
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Available Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build in `dist/`.
- `npm run deploy` builds the project and publishes `dist/` to GitHub Pages.

## Webpack Configs

- `webpack.common.js` contains shared settings: entry point, HTML plugin, CSS loader, HTML loader, and asset rules.
- `webpack.dev.js` adds development mode, dev server settings, and development source maps.
- `webpack.prod.js` adds production mode, hashed output filenames, asset output naming, and disables production source maps.

## Deployment

The deploy script runs:

```bash
npm run build && gh-pages -d dist
```

That builds the project, then publishes the generated `dist/` folder to a `gh-pages` branch. Before deploying a project made from this template, update the `homepage` field in `package.json` to match the final repository URL.

## Customizing the Template

After creating a new project from this template:

- Update the document title in `src/template.html`
- Add your app logic to `src/index.js`
- Add project styles in `src/styles/style.css`
- Update package metadata in `package.json`
- Remove scripts or dependencies you do not need

## Author

- **Soikat Saha**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
