# React Investment Plan Visualizer

This project is a single-page application built with React and Vite, designed to visualize a specific long-term personal investment strategy. It serves as a dynamic and interactive representation of a plan focused on achieving capital growth over a 20+ year horizon through controlled risk and consistent monthly investments (€600).

The application provides users with:

*   **A Detailed Overview:** A snapshot of the overall plan, including the core vs. satellite allocation (€500 Core, €100 Satellite), the long-term time horizon, the moderate-high risk profile, and the planned review schedule.
*   **Core Portfolio Breakdown:** Insights into the €500/month core investment strategy, focusing on diversification through Global Developed, European, and Emerging Market ETFs. It features an interactive donut chart where selecting a slice highlights corresponding implementation details and rationale.
*   **Interactive Growth Scenarios:** A projection tool using an area chart that allows users to adjust parameters like monthly investment amount, expected annual return rate, and investment duration (years) to visualize potential long-term growth outcomes.
*   **China Satellite Strategy:** Information on the dedicated €100/month satellite investment focused on the Chinese market, outlining different allocation approaches (Balanced, High-Risk, Combined).
*   **German Tax Considerations:** Key information relevant to German investors, including the *Kapitalertragssteuer* (flat tax on capital gains) and the *Sparer-Pauschbetrag* (annual tax-free allowance), along with a simple calculator for the allowance.
*   **Practical Implementation Guide:** Concrete examples of ETFs and potentially stocks that align with the strategy, including details like ISIN, TER (Total Expense Ratio), and the rationale for their inclusion. It also offers guidance on selecting a suitable low-cost broker in Germany, highlighting important factors like *Sparpläne* (savings plans).
*   **Portfolio Tracking Advice:** Recommendations on how to monitor the investment portfolio effectively using broker interfaces, dedicated apps, or spreadsheets.
*   **Supporting Sections:** Additional context provided through a Long-Term View and a Revision History section (content may vary).

Built with modern web technologies, the application features a responsive design using Tailwind CSS, light/dark mode toggle, scrollspy navigation for easy section hopping, and subtle entrance animations via AOS.

## Table of Contents

*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Prerequisites](#prerequisites)
*   [Setup and Installation](#setup-and-installation)
*   [Running the Development Server](#running-the-development-server)
*   [Building for Production](#building-for-production)
*   [Project Structure](#project-structure)
*   [Key Components & State Management](#key-components--state-management)
*   [Styling](#styling)
*   [Future Enhancements / TODOs](#future-enhancements--todos)

## Features

*   **Component-Based Structure:** Organized into reusable React components for different sections (Overview, Core Portfolio, China Satellite, Tax, Implementation, etc.).
*   **Interactive Core Portfolio Allocation:** Donut chart visualizing core ETF allocation, with clickable slices highlighting corresponding implementation examples.
*   **Interactive Growth Projection:** Allows users to adjust monthly investment, assumed annual rate, and time horizon to see projected growth visualized in an area chart.
*   **Tax Calculator:** Simple calculator for the German *Sparer-Pauschbetrag* (tax-free allowance).
*   **Dark Mode:** Supports toggling between light and dark themes, with preferences saved in local storage.
*   **Responsive Design:** Utilizes Tailwind CSS for a mobile-first, responsive layout.
*   **Scrollspy Navigation:** Navigation links automatically highlight based on the currently viewed section.
*   **Animations:** Uses AOS (Animate On Scroll) library for subtle entrance animations.

## Tech Stack

*   **Framework:** React 18+
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Charting:** ApexCharts (via `react-apexcharts`)
*   **Animations:** AOS (Animate On Scroll)
*   **Icons:** Lucide Icons (via `lucide-react`)
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

The output files will be generated in the `dist` directory. You can preview the production build locally using:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
react-investment-app/
├── public/             # Static assets (favicon, etc.)
├── src/
│   ├── assets/         # Images, logos (if any)
│   ├── components/     # React components (Navbar, Footer, Sections, Charts, etc.)
│   ├── App.jsx         # Main application component, root state management
│   ├── base.css        # Base styles (Tailwind directives, global styles)
│   ├── components.css  # Custom component-level styles
│   └── main.jsx        # Application entry point (renders App)
├── .eslintrc.cjs       # ESLint configuration
├── .gitignore          # Git ignore rules
├── index.html          # HTML template entry point
├── package.json        # Project metadata and dependencies
├── postcss.config.js   # PostCSS configuration (for Tailwind)
├── tailwind.config.js  # Tailwind CSS configuration
├── README.md           # This file
└── vite.config.js      # Vite configuration
```

## Key Components & State Management

*   **`App.jsx`**: The root component. Manages global state like `isDarkMode` and the `highlightedCoreIndex` used for interaction between the portfolio chart and implementation cards. It renders the `Navbar`, `Footer`, and all section components, passing down necessary props (state and callbacks).
*   **Section Components (`src/components/*Section.jsx`)**: Represent the main content blocks (e.g., `OverviewSection`, `CorePortfolioSection`, `GrowthProjectionSection`, `TaxSection`). They receive props like `isDarkMode` or state related to interactions from `App.jsx`.
*   **Chart Components (`CoreAllocationChart.jsx`, `GrowthProjectionChart.jsx`)**: Render the ApexCharts visualizations. They receive data and configuration props (like `isDarkMode` or input values) and may call callback functions passed from parent components (e.g., `onSliceSelect`).
*   **Interactive Components (`GrowthProjectionSection.jsx`, `TaxCalculator.jsx`)**: Manage their own local state related to user inputs (e.g., investment amount, estimated gains).
*   **`ImplementationCard.jsx`**: A reusable component to display individual investment examples. Receives data and an `isHighlighted` prop.
*   **`Navbar.jsx`**: Application header. Manages mobile menu state, implements scrollspy logic, and includes the dark mode toggle.
*   **`Footer.jsx`**: Application footer with dynamic year.

## Styling

*   **Tailwind CSS:** Primary styling method using utility classes. Configuration is in `tailwind.config.js`. Base styles and Tailwind directives are included in `src/base.css`.
*   **Custom CSS:** Component-specific styles (e.g., range input styling, chart text adjustments, card highlighting) are located in `src/components.css`.

## Future Enhancements / TODOs

*   Add PropTypes or migrate to TypeScript for better type safety.
*   Perform a more thorough accessibility (A11y) audit.
*   Add unit tests (e.g., for `calculateGrowth`, `TaxCalculator`) and potentially component/integration tests.
*   Refine the logic for clearing the highlighted implementation card (e.g., click outside).
*   Consider using React Context for managing `isDarkMode` state instead of prop drilling if the application grows significantly.
*   Make the "Last Reviewed" date in `OverviewSection` dynamic or easily configurable.
*   Fetch `RevisionHistory` data dynamically if needed.
*   Add a `LICENSE` file.
