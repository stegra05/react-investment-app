# Project TODOs & Enhancements

This document outlines potential improvements and new features for the React Investment Plan Visualizer, based on a UX critique and exploration of enhancements.

## 1. UX Improvements & Clarifications

*   **Improve Rationale-Highlight Connection:**
    *   **Problem:** When a core allocation slice is clicked (`CoreAllocationChart`), the rationale appears under the chart (`CorePortfolioSection`) while the corresponding card (`ImplementationCard`) is highlighted further down (`ImplementationSection`). This connection isn't immediately obvious.
    *   **Goal:** Make the link between the selected chart slice, its rationale, and the highlighted implementation card clearer.
    *   **Ideas:**
        *   Animate the rationale text appearing closer to the highlighted `ImplementationCard`.
        *   Display the rationale in a tooltip or popover directly on the selected chart slice or the highlighted card.
        *   Use a subtle visual cue (e.g., brief animated line) drawing attention from the chart slice/rationale area to the highlighted card.
    *   **Files involved:** `App.jsx` (state management), `CorePortfolioSection.jsx` (rationale display), `CoreAllocationChart.jsx` (slice selection event), `ImplementationSection.jsx` (card rendering), `ImplementationCard.jsx` (highlighting).

*   **Refine Highlight Clearing Logic:**
    *   **Problem:** The `README.md` mentions "Refine the logic for clearing the highlighted implementation card (e.g., click outside)". The current implementation in `App.jsx` uses `handleCoreSliceSelect` and `clearCoreHighlight` but doesn't specify the trigger for clearing (commented out deselect logic, mouseLeave suggestion in chart).
    *   **Goal:** Implement a clear and intuitive way to deselect/clear the highlight on the `ImplementationCard`.
    *   **Ideas:**
        *   Clicking the same slice again toggles the highlight off (`setHighlightedCoreIndex(prevIndex => prevIndex === index ? null : index);`).
        *   Clicking anywhere outside the chart or the highlighted cards clears the highlight (implement a click-outside listener, perhaps at the `App.jsx` level or within `CorePortfolioSection`).
    *   **Files involved:** `App.jsx`, `CoreAllocationChart.jsx`.

## 2. Feature Enhancements

*   **Dynamic Plan Configuration:**
    *   **Goal:** Allow users to adjust core parameters of the visualized investment plan instead of it being fixed.
    *   **Tasks:**
        *   Add input controls (e.g., sliders, number inputs) to adjust the Core (€500) vs. Satellite (€100) split, ensuring the total remains €600 (or make the total adjustable too).
        *   Add input controls (e.g., linked sliders summing to 100%) to adjust the allocation percentages within the Core Portfolio (currently fixed at 60/20/20 for Global/Europe/EM).
        *   Update the `CoreAllocationChart` to reflect these user-defined percentages dynamically.
        *   Update the labels/display values throughout the app (e.g., section titles, chart labels) to reflect the adjusted amounts/percentages.
    *   **Files involved:** `App.jsx` (new state), `OverviewSection.jsx` (display snapshot), `CorePortfolioSection.jsx` (pass data), `CoreAllocationChart.jsx` (use dynamic series/labels).

*   **Comparative Growth Projections:**
    *   **Goal:** Enable users to compare different growth scenarios side-by-side.
    *   **Tasks:**
        *   Add functionality in `GrowthProjectionSection` to "save" or "snapshot" the current projection (based on input parameters).
        *   Allow users to modify inputs and plot a *new* projection line on the *same* `GrowthProjectionChart` alongside the saved baseline(s).
        *   Use distinct colors and update the chart legend to differentiate between scenarios.
    *   **Files involved:** `GrowthProjectionSection.jsx` (state for multiple scenarios), `GrowthProjectionChart.jsx` (accept and render multiple series).

*   **Goal-Seeking Calculation:**
    *   **Goal:** Add a reverse calculation to the growth projection section.
    *   **Tasks:**
        *   Add input fields for target portfolio value (€), investment duration (years), and assumed annual return (%).
        *   Implement the logic to calculate the required monthly investment needed to reach the target under those assumptions.
        *   Display the result clearly within the `GrowthProjectionSection`.
    *   **Files involved:** `GrowthProjectionSection.jsx`.

*   **Visual Tax Impact Estimation (`Vorabpauschale`):**
    *   **Goal:** Provide a clearer picture of potential tax drag, especially the `Vorabpauschale` relevant for accumulating ETFs in Germany.
    *   **Tasks:**
        *   Add an informational section within `TaxSection.jsx` explaining the `Vorabpauschale` more visually or with an *estimator*.
        *   (Advanced) Integrate an *estimated* tax drag into the `GrowthProjectionChart`. This requires making assumptions about annual fund performance, the *Basiszins* (base rate published annually by the German government), and applying the ~26.4% tax rate on the calculated *Vorabpauschale* (minus the *Sparer-Pauschbetrag* if applicable). This could be a separate line on the chart showing "Growth after estimated tax".
    *   **Files involved:** `TaxSection.jsx`, potentially `GrowthProjectionChart.jsx`.

## 3. Potential Advanced Features (Future Scope)

*   **Risk Level Visualization:**
    *   Instead of just text ("Moderate-High"), use a visual gauge or indicator in `OverviewSection`.
    *   (More complex) If asset allocation becomes dynamic (Feature Enhancement #2), adjust the risk indicator based on the allocation (e.g., higher equity % increases risk indicator).

*   **AI/Data Integration:**
    *   **Contextual Market Insights:** Integrate external APIs (market data, news feeds) and potentially an LLM to provide brief, relevant commentary alongside portfolio sections (e.g., recent performance drivers for EM). (Requires significant backend/API work).
    *   **ETF Alternatives:** Integrate an ETF database API to suggest similar, potentially lower-cost ETFs based on the examples shown in `ImplementationSection`.
    *   **Inflation Adjustment:** Allow users to factor in an assumed inflation rate into the `GrowthProjectionChart` to visualize projected *real* returns.

## 4. UI/UX & Technical Refinements

*   **Enhanced Animations/Transitions:**
    *   Explore using a library like Framer Motion for more fluid transitions between component states (e.g., chart updates, rationale appearing/disappearing).
    *   Refine existing AOS animations for smoothness.

*   **Input Control Feedback:**
    *   Make sliders/inputs in `GrowthProjectionSection` provide more immediate feedback on the chart as they are adjusted (debouncing might be needed for performance).

*   **Accessibility (A11y) Audit:**
    *   Perform a thorough review focusing on ARIA attributes for interactive components (charts, sliders, toggles), keyboard navigation, focus management, and color contrast (especially with custom chart colors).
    *   Provide screen-reader-friendly text summaries for chart data.

*   **Code Quality & Maintainability:**
    *   Add PropTypes or migrate to TypeScript for improved type safety (as noted in `README.md`).
    *   Add unit/integration tests (e.g., for `calculateGrowth`, `TaxCalculator`, chart interactions).
    *   Consider using React Context for global state (`isDarkMode`, `highlightedCoreIndex`) if prop drilling becomes too complex as features are added (as noted in `README.md`).
    *   Make "Last Reviewed" date in `OverviewSection` dynamic or easily configurable.
    *   Fetch `RevisionHistory` data dynamically if it becomes complex.
    *   Add a `LICENSE` file. 