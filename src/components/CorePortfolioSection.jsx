import React from 'react';
import PropTypes from 'prop-types';
import CoreAllocationChart from './CoreAllocationChart';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { usePlan } from '../context/PlanContext'; // Import usePlan

/**
 * Renders the Core Portfolio section, including the allocation chart.
 * Uses ThemeContext and PlanContext. Receives highlight props from App.
 */
function CorePortfolioSection({ 
  onSliceSelect, 
  highlightedRationale
}) {
  const { isDarkMode } = useTheme(); // Get theme context
  const { coreAmount, coreAllocations } = usePlan(); // Get plan context

  return (
    <section id="core-portfolio" className="mb-16 scroll-mt-16" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">
        Core Portfolio: Stable Growth (€{coreAmount} per month)
      </h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Strategy & Rationale Text */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Strategy & Rationale</h3>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              The core focuses on broad diversification using low-cost Exchange Traded Funds (ETFs)
              to capture global market growth while managing risk. This part uses €{coreAmount} of the total monthly investment,
              primarily split across {coreAllocations.map(a => a.name).join(', ')} ETFs.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <em>(Optional satellite components are detailed separately).</em>
            </p>
          </div>
        </div>

        {/* Chart & Rationale Display */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-3 text-center text-indigo-700 dark:text-indigo-400">
            Core ETF Allocation (€{coreAmount}/month)
          </h3>
          {/* Render the chart, passing props */}
          <CoreAllocationChart 
            isDarkMode={isDarkMode} 
            onSliceSelect={onSliceSelect} 
            coreAmount={coreAmount}
            allocations={coreAllocations}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Click chart slices to highlight implementation examples and see rationale.
          </p>
          {/* Rationale display removed - now shown in ImplementationCard */}
          <div className="min-h-[3em]"></div> {/* Keep space for layout consistency */}
        </div>
      </div>
    </section>
  );
}

// Update propTypes definition
CorePortfolioSection.propTypes = {
  onSliceSelect: PropTypes.func.isRequired,
  highlightedRationale: PropTypes.string, // Can be null
};

export default CorePortfolioSection; 