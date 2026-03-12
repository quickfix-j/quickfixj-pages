# QuickFIX/J Documentation Site

[![Built with Docusaurus](https://img.shields.io/badge/built%20with-Docusaurus-blue.svg)](https://docusaurus.io/)
[![GitHub Pages](https://img.shields.io/badge/Deployed_to-GitHub_Pages-2ea44f.svg?logo=github)](http://quickfix-j.github.io/quickfixj-pages)
[![License: QuickFIX](https://img.shields.io/badge/License%3A-QuickFIX-blue)](https://github.com/quickfix-j/quickfixj/blob/master/LICENSE)

This repository contains the source code for the official documentation of **QuickFIX/J**, the premier open-source Java implementation of the FIX (Financial Information eXchange) Protocol.

The site is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## 🌐 Live Website

Access the live documentation site here: **[http://quickfix-j.github.io/quickfixj-pages](http://quickfix-j.github.io/quickfixj-pages)**

## 🚀 Quick Start for Local Development

To contribute to the documentation or run the site locally, follow these steps:

### Prerequisites
- Node.js (>= 20.0)
- npm, yarn, or pnpm

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/quickfix-j/quickfixj-pages.git
cd quickfixj-docs
npm install
# or yarn install
```

### Local Development

Start a local development server:

```bash
npm run start
# or yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

To generate static content into the `build` directory:

```bash
npm run build
# or yarn build
```

The generated files can be served using any static hosting service.

## 📖 Content Structure

- **`docs/`**: Contains all the Markdown (`.md` / `.mdx`) files for the documentation. This is where you'll spend most of your time when contributing content.
- **`src/`**: Contains React components, pages, and custom CSS used by the Docusaurus theme.
- **`static/`**: Contains static assets like images, logos, and favicons.
- **`sidebars.ts`**: Configuration file for defining the structure and order of the documentation sidebar.
- **`docusaurus.config.ts`**: The main configuration file for the Docusaurus site.

## 🤝 Contributing

Contributions to the documentation are welcome! If you find a typo, want to clarify a concept, or add a new tutorial:
1. Fork the repository.
2. Create a new branch for your changes.
3. Make your edits in the `docs/` folder.
4. Preview your changes locally.
5. Submit a Pull Request.

## 🔗 Related Links
- [QuickFIX/J Core Repository](https://github.com/quickfix-j/quickfixj)
- [QuickFIX/J Mailing List](https://sourceforge.net/p/quickfix/mailman/)
- [Stack Overflow `quickfixj` Tag](https://stackoverflow.com/questions/tagged/quickfixj)
