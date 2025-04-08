# Project TODOs & Enhancements

This document outlines potential improvements and new features for the React Investment Plan Visualizer.

## API & Data Fetching

*   **Address Alpha Vantage API Rate Limiting:**
    *   **Problem:** The current implementation uses Alpha Vantage's free tier (`VITE_ALPHA_VANTAGE_API_KEY`), which has a very low request limit (e.g., 25/day). Only 3 core ETFs fetch data (`ISIN_TO_SYMBOL_MAP`), making it unreliable and preventing data display for optional/satellite investments. Error handling for rate limits or missing keys is basic.
    *   **Goal:** Improve the robustness and usability of market data fetching within the constraints of free/low-cost APIs.
    *   **Tasks:**
        *   **Client-Side Caching:** Implement caching in `src/utils/api.js` (`fetchMarketData`). Store successful API responses in `localStorage` with a timestamp (e.g., key: `marketData_${symbol}_${yyyymmdd}`). Before fetching, check if valid cached data exists for the current day. If so, return cached data; otherwise, fetch fresh data and update cache.
        *   **Manual Refresh Button:** Add an optional small refresh icon button (e.g., `<RotateCw size={12}/>`) to `ImplementationCard.jsx` *only* for cards where `shouldFetchData` is true. Clicking this button should bypass the cache check (for that specific click) and call `fetchMarketData` again. Update the market data state accordingly.
        *   **Refine Error Display:** In `ImplementationCard.jsx`, provide more specific feedback based on the `marketData.error` string (e.g., explicitly mention "Rate limit likely reached" or "Check API Key").
        *   **(Optional) Review `ISIN_TO_SYMBOL_MAP`:** Decide if more symbols *should* be added, considering the cache will mitigate but not eliminate rate limiting if many are refreshed simultaneously.
    *   **Files involved:** `src/utils/api.js`, `src/components/ImplementationCard.jsx`.

## Tax Calculation & Display

*   **Refine Tax Explanations & Calculator Display:**
    *   **Problem:** While the tax section explains `Teilfreistellung` and `Vorabpauschale`, the calculations in the estimators could be more transparent, and minor clarifications can improve user understanding.
    *   **Goal:** Enhance the clarity and educational value of the tax calculators.
    *   **Tasks:**
        *   **Vorabpauschale Breakdown:** In `VorabpauschaleEstimator.jsx`, modify the results display. Show the "Basisertrag (Capped)" first. Then, explicitly show the "Less 30% Teilfreistellung (Equity)" amount being subtracted. Finally, show the resulting "Taxable Vorabpauschale (before allowance)". Keep the final "Estimated Tax" display as is (which already considers the allowance). This makes the 30% equity fund reduction visually explicit.
        *   **Tax Calculator Note:** In `TaxCalculator.jsx`, add a brief sentence to the notes at the bottom acknowledging the higher `Sparer-Pauschbetrag` available for jointly assessed couples (e.g., "Note: Jointly assessed couples have a €2,000 allowance.").
    *   **Files involved:** `src/components/VorabpauschaleEstimator.jsx`, `src/components/TaxCalculator.jsx`.

## UI/UX Polish

*   **Refine Growth Chart Legend & Scenario Display:**
    *   **Problem:** When multiple comparison scenarios are saved in the `GrowthProjectionSection`, the chart legend can become cluttered, and all lines have the same visual weight.
    *   **Goal:** Improve chart readability when comparing the live projection against saved scenarios.
    *   **Tasks:**
        *   **Differentiate Scenario Lines:** In `GrowthProjectionChart.jsx` (specifically in `getGrowthChartOptions`), modify the `stroke` and potentially `fill` options. If a series represents a saved scenario (distinguishable perhaps by checking if its `name` starts with "Saved #" or if it has an `inputs` property passed down), apply different styling (e.g., slightly thinner `stroke.width`, maybe a dashed `stroke.dashArray`, or ensure only the live projection uses `fill` type 'gradient'/'area' while scenarios use 'solid'/'line' with no fill).
        *   **(Optional) Legend Interactivity:** Explore ApexCharts options to allow toggling series visibility by clicking legend items (`legend.onItemClick.toggleDataSeries = true`). Ensure this is the default or explicitly set it.
    *   **Files involved:** `src/components/GrowthProjectionChart.jsx`, `src/components/GrowthProjectionSection.jsx` (potentially passing a flag/type with scenario data).

*   **Configuration Input Consistency:**
    *   **Problem:** While the `ConfigurationSection` allows adjusting total/core investment and allocations, some labels or helper texts might not dynamically reflect constraints imposed by loaded templates or extreme user input.
    *   **Goal:** Ensure UI elements in the configuration section remain consistent and helpful.
    *   **Tasks:**
        *   Review labels, placeholders, and helper texts within `ConfigurationSection.jsx`. Ensure they don't contain hardcoded assumptions that might contradict the state loaded from a template (e.g., if a template sets a very high satellite percentage, ensure helper text reflects that).
        *   Consider adding subtle visual cues or validation if user input conflicts logically (e.g., core allocation percentages don't sum to 100, although the error message already handles this).
    *   **Files involved:** `src/components/ConfigurationSection.jsx`.

---
*(Add other TODOs from original file or new ones below)*
