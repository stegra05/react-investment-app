# Project TODOs & Enhancements

This document outlines potential improvements and new features for the React Investment Plan Visualizer, based on a UX critique and exploration of enhancements.

## 1. UX Improvements & Clarifications

*   **Improve Core Chart -> Implementation Card Connection:**
    *   **Problem:** Clicking a core allocation slice highlights a card further down, and the rationale appears within that card. The connection isn't immediate or obvious due to distance.
    *   **Goal:** Make the link between the selected chart slice, its rationale, and the highlighted implementation card clearer and more direct.
    *   **Ideas:**
        *   Animate scrolling the page smoothly to bring the highlighted `ImplementationCard` into or closer to the viewport when a slice is clicked.
        *   Add a brief visual pulse/flash animation to the `ImplementationCard` upon highlighting.
        *   (Optional/Advanced) Experiment with a temporary animated visual connector (e.g., subtle dashed line) from the chart slice towards the card.
    *   **Files involved:** `App.jsx` (state, possibly scroll logic), `CoreAllocationChart.jsx` (slice selection event), `ImplementationSection.jsx` (card rendering/passing props), `ImplementationCard.jsx` (receiving highlight/rationale, animation).

*   **Refine Highlight Clearing Logic:**
    *   **Problem:** The method for clearing the `ImplementationCard` highlight isn't fully defined (README suggests click-outside, `App.jsx` allows re-clicking slice).
    *   **Goal:** Implement a clear, consistent, and intuitive way to deselect/clear the highlight.
    *   **Tasks:**
        *   Confirm the re-click toggle logic in `App.jsx` (`handleCoreSliceSelect`) is the desired primary method.
        *   (Optional) Implement a click-outside listener (e.g., at the `App.jsx` or page level) that calls `setHighlightedCoreIndex(null)` when clicking anywhere *except* the chart slices or the implementation cards themselves. Ensure this doesn't interfere with other interactions.
    *   **Files involved:** `App.jsx` (state management, potentially click-outside listener), `CoreAllocationChart.jsx` (event handling).

*   **Enhance Input Control Feedback:**
    *   **Problem:** Sliders/inputs in `GrowthProjectionSection` update the chart, but the feedback loop could be tighter.
    *   **Goal:** Provide more immediate visual feedback on the chart as sliders/inputs are adjusted.
    *   **Tasks:**
        *   Review the debouncing in `GrowthProjectionSection`. Ensure the delay feels responsive but avoids excessive chart re-renders during rapid slider dragging.
        *   Consider if direct (non-debounced) updates are feasible for certain inputs or if the current debounce (`300ms`) is optimal.
    *   **Files involved:** `GrowthProjectionSection.jsx` (`useDebouncedCallback`, state updates).

*   **Add Contextual Help/Glossary:**
    *   **Problem:** Investment terms (Vorabpauschale, TER, ISIN, Sparer-Pauschbetrag, etc.) might be unfamiliar to some users.
    *   **Goal:** Improve accessibility and understanding by providing in-context explanations.
    *   **Tasks:**
        *   Identify key technical terms throughout the application text.
        *   Add small help icons (`<HelpCircle />` from `lucide-react`) next to these terms.
        *   Implement simple tooltips (e.g., using basic HTML `title` attribute or a lightweight tooltip library) or modals that display concise definitions when the icon is hovered/clicked.
    *   **Files involved:** Various Section components (`TaxSection`, `ImplementationSection`, etc.).

## 2. Feature Enhancements

*   **Implement Dynamic Text Updates:**
    *   **Problem:** Descriptive text in various sections (Overview, Core Portfolio, etc.) may contain static values (€600, €500, specific percentages) that don't update when the user changes the configuration via `ConfigurationSection`.
    *   **Goal:** Ensure all displayed text reflects the current plan configuration from `PlanContext`.
    *   **Tasks:**
        *   Identify all instances of static values/descriptions related to configurable plan parameters (total investment, core/satellite amounts, core allocation percentages) in component JSX.
        *   Replace static text with dynamic values/text derived from `usePlan()` context hook. Example: `Invest €{totalInvestment} per month` instead of `Invest €600 per month`.
        *   Update labels and titles dynamically where appropriate (e.g., section headers, chart titles).
    *   **Files involved:** `OverviewSection.jsx`, `CorePortfolioSection.jsx`, `ChinaSatelliteSection.jsx` (card titles), `LongTermViewSection.jsx`, `ImplementationSection.jsx` (card titles/descriptions), potentially others.

*   **Implement Goal-Seeking Calculation:**
    *   **Problem:** The growth projection currently only works forward (inputs -> result). A reverse calculation is desirable.
    *   **Goal:** Add functionality to calculate the required monthly investment needed to reach a specific financial target.
    *   **Tasks:**
        *   Implement the `calculateRequiredMonthly` function (already present in `GrowthProjectionSection.jsx` logic).
        *   Add input fields in `GrowthProjectionSection` for `targetValue`, `goalDuration`, and `goalReturnRate`.
        *   Connect these inputs to the state and the `calculateRequiredMonthly` function.
        *   Display the calculated required monthly investment clearly.
    *   **Files involved:** `GrowthProjectionSection.jsx`.

*   **Enhance Tax Section Visualization/Integration:**
    *   **Problem:** Tax concepts (`Sparer-Pauschbetrag`, `Vorabpauschale`, `Teilfreistellung`) are explained but their interplay isn't fully visualized.
    *   **Goal:** Provide a clearer picture of potential tax impact.
    *   **Tasks:**
        *   In `TaxCalculator`, clarify that the calculated `taxableAmount` could potentially be offset by losses or reduced by `Teilfreistellung` if applicable.
        *   In `VorabpauschaleEstimator`, add an optional input for unused `Sparer-Pauschbetrag` and show how it reduces the `estimatedTax`.
        *   (Advanced) Add an optional "Estimated Tax Drag" line to the `GrowthProjectionChart`. This would require calculating estimated annual `Vorabpauschale` tax (using the estimator logic) for each year of the projection and subtracting it from the nominal growth. Make assumptions clear (e.g., assumes constant `Basiszins`, uses estimator logic, ignores `Sparer-Pauschbetrag` for the chart line).
    *   **Files involved:** `TaxCalculator.jsx`, `VorabpauschaleEstimator.jsx`, `TaxSection.jsx`, `GrowthProjectionSection.jsx`, `GrowthProjectionChart.jsx`.

*   **Implement Strategy Template Selection:**
    *   **Problem:** Users might prefer pre-defined starting points instead of configuring everything manually. The detailed strategy text describes variations not fully captured by the default UI.
    *   **Goal:** Offer selectable plan templates that pre-fill the configuration.
    *   **Tasks:**
        *   Define 2-3 strategy templates based on the provided text (e.g., "Default 60/20/20 Core + China", "Core + Optional Bonds/Stocks").
        *   Add a selection mechanism (e.g., dropdown or buttons) probably near `ConfigurationSection`.
        *   Implement logic so that selecting a template updates the state in `PlanContext` (`totalInvestment`, `coreAmount`, `coreAllocations`) accordingly.
        *   (Optional) Adjust some descriptive text based on the selected template.
    *   **Files involved:** `App.jsx` or `PlanContext.jsx` (state logic), `ConfigurationSection.jsx` (UI for selection).

*   **Implement "What If" Scenario Builder:**
    *   **Problem:** Growth projection is based on constant inputs. Real life involves variations.
    *   **Goal:** Allow modeling of common financial events.
    *   **Tasks:**
        *   Extend `GrowthProjectionSection` UI to allow adding "events" to the timeline (e.g., "Pause contributions from Year X to Y", "Add lump sum of €Z in Year W").
        *   Modify the `calculateGrowth` logic (or create a more advanced version) to handle these events during the projection loop.
        *   Visualize these events on the chart (e.g., markers, annotations).
    *   **Files involved:** `GrowthProjectionSection.jsx`, `GrowthProjectionChart.jsx`.

## 3. Technical Refinements & Code Quality

*   **Implement PropTypes Consistently or Migrate to TypeScript:**
    *   **Problem:** Type safety is lacking (PropTypes used inconsistently, ESLint rule disabled).
    *   **Goal:** Improve code robustness and maintainability through static typing.
    *   **Tasks:**
        *   **Option A (PropTypes):** Go through all components, define `propTypes` for all expected props, and re-enable the `react/prop-types` ESLint rule.
        *   **Option B (TypeScript):** Migrate the project from `.jsx` to `.tsx`. Define interfaces/types for props, state, and context values. Leverage TypeScript's static analysis benefits. (Larger effort).
    *   **Files involved:** All `.jsx` component files, `PlanContext.jsx`, `ThemeContext.jsx`, `.eslintrc.cjs`.

*   **Add Unit and Integration Tests:**
    *   **Problem:** No automated tests currently exist.
    *   **Goal:** Ensure core logic is correct and prevent regressions.
    *   **Tasks:**
        *   Set up a testing framework (e.g., Vitest, React Testing Library).
        *   Write unit tests for utility functions (`calculateGrowth`, tax calculation logic in estimators).
        *   Write integration tests for key user interactions (e.g., changing projection inputs updates chart, clicking chart slice highlights card, configuring plan updates overview).
    *   **Files involved:** New test files (`*.test.jsx`), potentially test setup configuration.

*   **Perform Accessibility (A11y) Audit:**
    *   **Problem:** While some ARIA labels exist, a thorough check is needed.
    *   **Goal:** Ensure the application is usable for people with disabilities.
    *   **Tasks:**
        *   Review semantic HTML structure.
        *   Verify ARIA attributes for interactive elements (charts, sliders, toggles, menus, accordions). Ensure controls are keyboard navigable and focus indicators are clear.
        *   Check color contrast ratios, especially for text on background colors and chart elements.
        *   Provide screen-reader-friendly text alternatives or summaries for complex visualizations like charts. Add `aria-hidden="true"` to purely decorative icons.
    *   **Files involved:** All component files, potentially `base.css`/`components.css` for focus styles.

*   **Refactor State Management if Needed:**
    *   **Problem:** Current Context API use is fine, but might become cumbersome if many more global states are added.
    *   **Goal:** Maintain manageable state logic as the app grows.
    *   **Tasks:**
        *   Monitor prop drilling and context complexity as new features (like templates, advanced scenarios) are added.
        *   If state logic becomes overly complex or performance issues arise due to context updates, consider refactoring parts of the state management to a dedicated library (e.g., Zustand for simplicity, or Redux Toolkit for more complex state). (Evaluate if necessary later).
    *   **Files involved:** `App.jsx`, `PlanContext.jsx`, `ThemeContext.jsx`, potentially introducing new state management files.

*   **Make Static Dates/Content Configurable:**
    *   **Problem:** Some content might be hardcoded (e.g., "Last Reviewed" date, revision history entries).
    *   **Goal:** Make content easier to update without code changes.
    *   **Tasks:**
        *   Identify hardcoded dates or content lists (e.g., `RevisionHistorySection`).
        *   Move this data to a configuration file (e.g., a simple JS object/array) or fetch it if it becomes dynamic.
        *   Update components to consume this configuration data.
    *   **Files involved:** `OverviewSection.jsx`, `RevisionHistorySection.jsx`, potentially create a new config file.

*   **Add License File:**
    *   **Problem:** `README.md` mentions adding a license, but it might be missing or need confirmation.
    *   **Goal:** Clearly define the project's usage rights.
    *   **Tasks:**
        *   Ensure a `LICENSE` file exists at the project root (e.g., using the MIT license text provided).
    *   **Files involved:** `LICENSE` file.

## 4. Potential Advanced Features (Future Scope)

*   **Monte Carlo Simulation for Projections:**
    *   Implement probabilistic projections instead of linear ones using Monte Carlo methods. Visualize results as a probability cone or distribution graph.

*   **AI-Driven Insights Integration:**
    *   Explore integrating an LLM for personalized commentary, risk explanation, or suggesting ETF alternatives (requires careful implementation and disclaimers).

*   **Historical Backtesting Feature:**
    *   Allow users to see how the configured strategy would have performed historically.

*   **API Integration for Market Data:**
    *   Fetch and display minor, real-time or recent market trend indicators.

*   **Enhanced Risk Visualization:**
    *   Dynamically link the `RiskGauge` to the configured asset allocation, adjusting the visual based on the calculated risk of the user's choices.
