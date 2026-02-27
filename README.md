## Bank99 CSS & Static Assets

This repository contains the CSS, HTML, and supporting assets for the Bank99 new‑customer (`Neukunde`) and existing‑customer (`bestehender Kunde`) flows. The CSS is authored in `src/css/**`, processed with PostCSS, and compiled into a single distributable stylesheet at `dist/bank99-new.css`.

For a detailed overview of how the Bank99‑specific form and component styles are applied via CSS selectors (including `.b99-style` and related wrappers), see the [Bank99 Styling Glossary](./STYLE-GLOSSARY.md).

### Using `package.json`

- **Install dependencies**
  - Run `npm install` in the project root to install the PostCSS toolchain (no runtime dependencies, only devDependencies).
- **Available scripts**
  - **`npm run css:build`**: Runs `postcss src/css/main.css -o dist/bank99-new.css` for a one‑off local build of the CSS bundle.
  - **`npm run css:build:prod`**: Same as `css:build` but with `NODE_ENV=production`, enabling additional optimizations (via `cssnano`) for production output.
  - **`npm run css:watch`**: Watches `src/css/main.css` and all imported files, rebuilding `dist/bank99-new.css` automatically on changes.
- **Browserslist**
  - The `browserslist` section in `package.json` defines the supported browsers (`last 2 versions`, `> 0.5%`, `not dead`) and is used by `autoprefixer` to determine which vendor prefixes to add during the build.

### What `postcss.config.js` Does

The CSS build is powered by [PostCSS](https://postcss.org/), which processes `src/css/main.css` through a pipeline of plugins configured in `postcss.config.js`:

- **`postcss-import`**
  - Enables `@import` of other CSS files so `src/css/main.css` can act as a single entry point that stitches together tokens, base styles, components, layout, and process‑specific styles in a controlled order.
- **`postcss-url` (with `url: 'inline'`)**
  - Inlines referenced assets (for example fonts or small images) directly into the output CSS as base64‑encoded data URLs, making `dist/bank99-new.css` more self‑contained.
- **`autoprefixer`**
  - Adds vendor prefixes based on the `browserslist` configuration in `package.json`, ensuring the generated CSS works across the targeted browsers.
- **`cssnano` (production only)**
  - When `NODE_ENV=production`, `cssnano` minifies and optimizes the CSS (removing whitespace, merging rules, etc.); in non‑production builds this plugin is disabled to keep the CSS easier to inspect.

These plugins are executed automatically whenever you run one of the `postcss` scripts from `package.json`.

### Overview of the `src` Folder

The `src` folder contains all source assets (CSS, HTML, JS) that are compiled or used to generate the final artifacts in `dist`.

- **JavaScript**
  - `src/js/main.js`: Main JavaScript bundle used by the static pages; handles UI behaviors such as moving header elements, expandable checkbox text, file‑upload interactions, and radio/checkbox toggle logic, including support for dynamically injected DOM via `MutationObserver`.

- **Top‑level CSS entry**
  - `src/css/main.css`: Primary CSS entry point processed by PostCSS; imports design tokens, base styles, Bootstrap overrides, common components, layout, and both Neukunde and existing‑customer process styles, then compiles to `dist/bank99-new.css`.

- **Common CSS (`src/css/common/`)**
  - `tokens/design-system.css`: Design tokens such as colors, typography scales, spacing, and other reusable design variables.
  - `base/font-faces.css`: `@font-face` declarations; fonts should be available in the configured fonts folder so they can be resolved and inlined by PostCSS.
  - `base/form-reset.css`: Normalization and reset rules for form elements to provide a consistent baseline across browsers.
  - `overrides/bootstrap.css`: Custom overrides and adjustments applied on top of Bootstrap’s default styles.
  - `layout/header.css`: Layout and styling for the global page header.
  - `layout/footer.css`: Layout and styling for the global page footer.
  - `layout/contact-nav.css`: Layout for the contact/navigation bar used across pages.
  - `components/buttons.css`: Styles for primary, secondary, and other button variants.
  - `components/cards.css`: Card component styling used for grouped content blocks.
  - `components/tables.css`: Table styling for data and comparison layouts.
  - `components/alerts.css`: Alert and notification styles for status messages.
  - `components/progress-indicator.css`: Step/progress indicator styling for multi‑step flows.
  - `components/icons.css`: Icon sizing, alignment, and related utility rules.
  - `components/tooltips.css`: Tooltip appearance and positioning.
  - `components/form-fields.css`: Base styles for inputs, selects, checkboxes, and other form controls.
  - `components/form-sections.css`: Layout and spacing rules for grouped form sections.
  - `components/form-spinner.css`: Loading/processing spinner used in form interactions.
  - `components/modal.css`: Modal dialog styling, including overlay and content container.

- **Neukunde CSS (`src/css/neukunde/`)**
  - `main.css`: Entry point for Neukunde (new‑customer) styles; imports the various Neukunde‑specific section and page styles.
  - `fonds.css`: Styles for the funds selection step in the Neukunde flow.
  - `anlegerprofil.css`: Styles for the investor profile (`Anlegerprofil`) pages.
  - `autorisierung.css`: Styles for authorization/consent steps.
  - `page-rechtliches.css`: Page‑level legal information layout and typography.
  - `rechtliches-checkboxes.css`: Detailed styling for legal/terms related checkboxes.
  - `documents-section.css`: Layout and styling for document upload/overview sections.
  - `file-upload.css`: Styles for the custom file‑upload control and its states.
  - `add-more-buttons.css`: Styles for “add more …” buttons used to add extra items (e.g., documents, nationalities).
  - `form-controls.css`: Additional form‑control rules specific to Neukunde pages.
  - `form-sections.css`: Neukunde‑specific overrides and layouts for form sections.
  - `mittelherkunft-icons.css`: Icon styles for the source‑of‑funds (`Mittelherkunft`) step.
  - `radio-disabled-states.css`: Custom styling for disabled or inactive radio button states.
  - `thank-you.css`: Styles for the confirmation/thank‑you page at the end of the Neukunde flow.

- **Existing Customer CSS (`src/css/bestehender_kunde/`)**
  - `main.css`: CSS bundle for existing‑customer (`bestehender Kunde`) flows, containing process‑specific overrides on top of the shared common styles.

- **Neukunde HTML templates (`src/html/neukunde/`)**
  - `persoenliche_daten.html`: Template for collecting personal data.
  - `produktauswahl.html`: Product selection step in the Neukunde journey.
  - `fonds.html`: Funds selection page.
  - `anlegerprofil.html`: Investor profile questionnaire page.
  - `mittelherkunft.html`: Source‑of‑funds information page.
  - `steuerliche_ansaessigkeit.html`: Tax residence (`steuerliche Ansässigkeit`) page.
  - `beruf.html`: Occupation/employment details page.
  - `meldeadresse.html`: Address/registration (`Meldeadresse`) details page.
  - `depot99.html`: Depot99‑specific page template.
  - `recap.html`: Recap/summary page for reviewing provided information.
  - `dokumente.html`: Documents upload/overview page.
  - `rechliges.html`: Legal information and confirmations page.
  - `thank-you.html` (if present): Final confirmation/thank‑you page shown after successful completion.

These HTML templates are primarily used for local development and previewing the flows together with the CSS and JS from this repository.

