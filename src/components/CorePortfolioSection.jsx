import React from 'react';
import CoreAllocationChart from './CoreAllocationChart'; // Import the chart component

/**
 * Renders the Core Portfolio section, including the allocation chart.
 * @param {{isDarkMode: boolean, onSliceSelect: function, highlightedRationale: string | null}} props
 */
function CorePortfolioSection({ isDarkMode, onSliceSelect, highlightedRationale }) {
  return (
    <section id="core-portfolio" className="mb-16 scroll-mt-16" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">
        Core Portfolio: Stable Growth (€500 per month)
      </h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Strategy & Rationale Text */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Strategy & Rationale</h3>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              The core focuses on broad diversification using low-cost Exchange Traded Funds (ETFs)
              to capture global market growth while managing risk. This part uses €500 of the total €600 monthly investment,
              primarily split across Global Developed, Europe, and Emerging Markets ETFs.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <em>(Optional Bonds & Blue Chips are part of the overall €600 plan but not detailed here).</em>
            </p>
          </div>
        </div>

        {/* Chart & Rationale Display */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-3 text-center text-indigo-700 dark:text-indigo-400">
            Core ETF Allocation (€500/month)
          </h3>
          {/* Render the chart, passing props */}
          <CoreAllocationChart isDarkMode={isDarkMode} onSliceSelect={onSliceSelect} />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Click chart slices to highlight implementation examples and see rationale.
          </p>
          {/* Display area for rationale based on highlighted slice */}
          <p id="core-rationale-display" className="text-sm text-gray-600 dark:text-gray-400 text-center mt-3 min-h-[3em] px-2">
            {highlightedRationale || ' '} {/* Show rationale or empty space */}
          </p>
        </div>
      </div>
    </section>
  );
}

export default CorePortfolioSection; 