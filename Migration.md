# Migration Plan: Static HTML to React Investment App

This document outlines the steps to rebuild the static HTML/CSS/JS investment website (`stegra05-investmentwebsite`) into a modern React application (`react-investment-app`) using Vite, Tailwind CSS, ApexCharts, and AOS, based on the structure suggested in the `README.md`.

**Goal:** Migrate the static `stegra05-investmentwebsite` into a component-based React application (`react-investment-app`) maintaining existing features and interactivity.

**Phase 1: Project Setup & Foundation**

1.  **Initialize Project:**
    *   Use Vite to scaffold a new React project:
        ```bash
        npm create vite@latest react-investment-app --template react
        # or yarn create vite react-investment-app --template react
        cd react-investment-app
        ```
2.  **Install Dependencies:**
    *   Core React dependencies are included by Vite.
    *   Install necessary libraries:
        ```bash
        npm install tailwindcss postcss autoprefixer react-apexcharts apexcharts aos
        # or yarn add tailwindcss postcss autoprefixer react-apexcharts apexcharts aos
        ```
    *   (Recommended) Install Lucide icons library for React:
        ```bash
        npm install lucide-react
        # or yarn add lucide-react
        ```
3.  **Configure Tailwind CSS:**
    *   Follow the official Tailwind CSS guide for Vite integration ([https://tailwindcss.com/docs/guides/vite](https://tailwindcss.com/docs/guides/vite)). This involves:
        *   Creating `tailwind.config.js` and `postcss.config.js`.
        *   Configuring the `content` paths in `tailwind.config.js` to include `.jsx` files (`./src/**/*.{js,ts,jsx,tsx}`).
        *   Adding Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) to the main CSS file (e.g., `src/index.css` or a new `src/base.css`).
    *   Extend the Tailwind theme in `tailwind.config.js` if custom colors/fonts from the original project are needed, although the original uses standard Tailwind colors extensively. Enable dark mode: `darkMode: 'class'`.
4.  **Basic CSS Migration:**
    *   **`src/base.css` (or `src/index.css`):** Include Tailwind directives. Migrate the `@font-face` rule for Lucide (if *not* using `lucide-react`) and base `body`, `html` styles from the original `css/base.css`.
    *   **`src/components.css`:** Migrate custom styles from the original `css/components.css` and `css/utilities.css`. This includes styles for ApexCharts, range inputs, highlighted cards, details/summary animations, etc. Update selectors if necessary for the React component structure. Remove utility styles for Lucide if using `lucide-react`.
5.  **Project Structure:**
    *   Organize the `src` directory as planned:
        *   `src/assets/`: For any static images (if needed).
        *   `src/components/`: For all React components.
        *   `src/App.jsx`: Main application component.
        *   `src/main.jsx`: React entry point (Vite default).
        *   `src/base.css` (or `src/index.css`): Tailwind directives and base styles.
        *   `src/components.css`: Custom component styles.
    *   Clean up default Vite template files (e.g., `App.css`, default logo).

**Phase 2: Core Layout & Static Sections**

1.  **`App.jsx`:**
    *   Set up the main application layout.
    *   Import and render `Navbar` and `Footer` components.
    *   Render placeholder components for each main section (`OverviewSection`, `CorePortfolioSection`, etc.).
    *   Initialize AOS globally using a `useEffect` hook:
        ```jsx
        import AOS from 'aos';
        import 'aos/dist/aos.css';
        import { useEffect } from 'react';

        function App() {
          useEffect(() => {
            AOS.init({
              once: true,
              duration: 600,
              offset: 50,
            });
          }, []);
          // ... rest of App component
        }
        ```
    *   Manage `isDarkMode` state (using `useState` and `useEffect` to sync with `localStorage`) and pass it down or provide it via Context.
2.  **`Navbar.jsx`:**
    *   Replicate the HTML structure of the `nav` element.
    *   Use `lucide-react` components (e.g., `<Menu />`, `<X />`, `<Sun />`, `<Moon />`) instead of font icons.
    *   Implement mobile menu toggle logic using `useState`.
    *   Add placeholders for navigation links (`<a>` tags initially).
    *   Integrate the dark mode toggle button, getting state and the toggle function from `App` (props or Context).
3.  **`Footer.jsx`:**
    *   Replicate the HTML structure of the `footer`.
    *   Implement the dynamic year calculation (`new Date().getFullYear()`).
4.  **Static Section Components:**
    *   Create components for sections that are mostly static content:
        *   `OverviewSection.jsx`
        *   `ChinaSatelliteSection.jsx`
        *   `TaxSection.jsx` (initially without the calculator)
        *   `ImplementationSection.jsx` (initially without dynamic highlighting)
        *   `TrackingSection.jsx`
        *   `LongTermViewSection.jsx`
        *   `RevisionHistorySection.jsx`
    *   Copy the relevant HTML structure from `main.html` into the `return` statement of each component.
    *   Convert HTML attributes like `class` to `className`, `for` to `htmlFor`.
    *   Apply `data-aos` attributes to elements as in the original HTML.
    *   Replace static text/data.
    *   Use `lucide-react` for icons.
    *   Import and use these section components within `App.jsx`.

**Phase 3: Interactive Components & State Management**

1.  **`CorePortfolioSection.jsx` & `CoreAllocationChart.jsx`:**
    *   Create `CoreAllocationChart.jsx`.
    *   Import `Chart` from `react-apexcharts`.
    *   Migrate the donut chart options logic from `js/charts.js` into `CoreAllocationChart.jsx`, likely within a function that generates options based on the `isDarkMode` prop.
    *   Use `useState` for chart series/options if they need dynamic updates (though core allocation seems static).
    *   Pass `isDarkMode` from `App` down to `CoreAllocationChart`.
    *   Implement the `dataPointSelection` event handler. This handler needs to communicate the selected index *up* to a shared parent (`App.jsx` or Context).
    *   In `CorePortfolioSection.jsx`, render the static text and the `CoreAllocationChart` component.
2.  **`GrowthProjectionSection.jsx` & `GrowthProjectionChart.jsx`:**
    *   Create `GrowthProjectionChart.jsx`.
    *   Import `Chart` from `react-apexcharts`.
    *   Migrate the area chart options logic and the `calculateGrowth` function from `js/charts.js`.
    *   `GrowthProjectionChart` should receive `monthlyInvestment`, `annualRate`, `years`, and `isDarkMode` as props.
    *   Use `useEffect` within `GrowthProjectionChart` to recalculate the `series` data whenever the input props change.
    *   In `GrowthProjectionSection.jsx`:
        *   Manage state (`useState`) for `monthlyInvestment`, `annualRate`, `years`.
        *   Render the input controls (`<input type="number">`, `<input type="range">`).
        *   Attach `onChange` handlers to update the state.
        *   Render the `GrowthProjectionChart`, passing down the state variables and `isDarkMode`.
        *   Render the disclaimer.
3.  **`TaxSection.jsx` & `TaxCalculator.jsx`:**
    *   Create `TaxCalculator.jsx`.
    *   Migrate the tax calculation logic from `js/calculator.js`.
    *   Use `useState` to manage the `estimatedGains` input value.
    *   Calculate `coveredAmount` and `taxableAmount` based on the state.
    *   Render the input field and the result paragraphs.
    *   Include `TaxCalculator` within `TaxSection.jsx`.
4.  **`ImplementationSection.jsx` Interaction:**
    *   Refactor the implementation cards into a reusable `ImplementationCard.jsx` component.
    *   Pass data (title, description, link, ISIN, TER, icon name/component, etc.) as props.
    *   Define an array/object containing the data for all cards in `ImplementationSection.jsx`. Map over this data to render `ImplementationCard` instances.
    *   `ImplementationCard` should accept an `isHighlighted` prop. Conditionally apply the `highlight-card` CSS class based on this prop.
    *   Lift the state for the highlighted card index (`highlightedCoreIndex`, initially `null`) to `App.jsx`.
    *   Pass the `highlightedCoreIndex` down to `ImplementationSection.jsx`.
    *   Pass a setter function (`setHighlightedCoreIndex`) down to `CoreAllocationChart.jsx` to be called on `dataPointSelection`.
    *   Modify `ImplementationSection.jsx` to pass `isHighlighted={index === highlightedCoreIndex}` to each relevant `ImplementationCard`.
    *   Add logic to clear the highlight (e.g., clicking outside the chart, or a timeout), potentially by having `CoreAllocationChart` call `setHighlightedCoreIndex(null)` on `mouseLeave` or via a more robust click-outside handler.
5.  **`Navbar.jsx` Scrollspy:**
    *   Implement scrollspy logic within `Navbar.jsx` using `useEffect` and a scroll event listener.
    *   Get references to section elements (perhaps passing IDs down from `App` or using `document.getElementById`).
    *   Determine the currently visible section based on scroll position (`window.scrollY` and section `offsetTop`).
    *   Maintain state (`useState`) for the `activeSectionId`.
    *   Conditionally apply active link styles (e.g., `activeNavClasses` from `js/ui.js`) to nav links based on `activeSectionId`.
    *   Remember to clean up the scroll listener in the `useEffect` return function.

**Phase 4: Refinement & Cleanup**

1.  **PropTypes/TypeScript:** (Optional but Recommended) Add prop type validation (using `prop-types` library or migrating to TypeScript) for components to improve maintainability.
2.  **Accessibility (A11y):** Review semantic HTML, ARIA attributes (especially for interactive elements like menus, toggles), and keyboard navigation.
3.  **Performance:** Check for unnecessary re-renders, especially around state updates and context usage. Use `React.memo` where appropriate.
4.  **Code Style & Linting:** Ensure consistent code style (e.g., using Prettier) and address any ESLint warnings.
5.  **Testing:** (Future Enhancement) Add unit tests for utility functions (like `calculateGrowth`, tax calculation) and component tests (using React Testing Library) for key interactions.
6.  **README Update:** Update the `README.md` to accurately reflect the final implementation, setup, and running instructions. 