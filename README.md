# React Investment Website

A single-page application built with React and Vite to visualize an investment strategy, including portfolio details, growth projections, and other relevant financial information.

## Features

*   **Component-Based Structure:** Organized into reusable React components for different sections (Overview, Portfolio, Growth Projection, etc.).
*   **Interactive Growth Projection:** Allows users to adjust monthly investment, annual rate, and investment duration to see projected growth visualized in a chart (using ApexCharts).
*   **Dark Mode:** Supports toggling between light and dark themes, with preferences saved in local storage.
*   **Responsive Design:** Utilizes Tailwind CSS for a mobile-first, responsive layout.
*   **Animations:** Uses AOS (Animate On Scroll) library for subtle entrance animations.

## Tech Stack

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, CSS Modules (`components.css`, `base.css`)
*   **Charting:** ApexCharts (via `react-apexcharts`)
*   **Animations:** AOS (Animate On Scroll)
*   **Language:** JavaScript (JSX)

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

## Setup and Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd react-investment-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

## Running the Development Server

To start the application in development mode with hot-reloading:

```bash
npm run dev
# or
yarn dev
```

This will typically start the server on `http://localhost:5173` (Vite's default). Check your terminal output for the exact URL.

## Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
```

The output files will be generated in the `dist` directory.

## Project Structure

```
react-investment-app/
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Images, logos, etc.
│   ├── components/     # React components (Navbar, Footer, Sections...)
│   ├── App.jsx         # Main application component, state management
│   ├── base.css        # Base styles (Tailwind directives)
│   ├── components.css  # Custom component styles
│   └── main.jsx        # Entry point, renders App
├── .eslintrc.cjs       # ESLint configuration
├── .gitignore          # Git ignore rules
├── index.html          # HTML entry point
├── package.json        # Project metadata and dependencies
├── postcss.config.js   # PostCSS configuration (for Tailwind)
├── README.md           # This file
└── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## Key Components & State

*   **`App.jsx`**: The root component. Manages global state like `isDarkMode` and the core state for the growth projection calculator (`monthlyInvestment`, `annualRate`, `years`). It passes state and setters down to relevant child components.
*   **Section Components (`src/components/*Section.jsx`)**: Represent the main content blocks of the page (e.g., `OverviewSection`, `CorePortfolioSection`, `GrowthProjectionSection`). They receive necessary props from `App.jsx`.
*   **`GrowthProjectionSection.jsx`**: Contains the user interface (inputs/sliders) for adjusting growth parameters and renders the `GrowthProjectionChart`.
*   **`GrowthProjectionChart.jsx`**: Displays the projection data using ApexCharts. Receives calculation parameters as props.
*   **`Navbar.jsx`**: Application header, includes the dark mode toggle.
*   **`Footer.jsx`**: Application footer.

## Styling

*   **Tailwind CSS:** Used for utility-first styling. Configuration is in `tailwind.config.js`. Base styles and Tailwind directives are included in `src/base.css`.
*   **Custom CSS:** Component-specific or global custom styles are located in `src/components.css`.

## Future Enhancements / TODOs

*   Implement the content for `GrowthProjectionSection.jsx`.
*   Re-enable the calculation and rendering logic in `GrowthProjectionChart.jsx` after debugging.
*   Add comprehensive JSDoc comments to components and functions.
*   Implement unit and integration tests.
*   Refine error handling and edge cases for the growth calculation.
