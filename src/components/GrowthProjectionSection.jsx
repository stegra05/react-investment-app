import React, { useState } from 'react';
import GrowthProjectionChart from './GrowthProjectionChart'; // Import the chart component

/**
 * Renders the Growth Projection section, including controls and the chart.
 * @param {{isDarkMode: boolean}} props
 */
function GrowthProjectionSection({ isDarkMode }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(600);
  const [annualRate, setAnnualRate] = useState(7); // Store as percentage value (e.g., 7 for 7%)
  const [years, setYears] = useState(20);

  const handleMonthlyChange = (e) => {
    setMonthlyInvestment(Number(e.target.value));
  };

  const handleRateChange = (e) => {
    setAnnualRate(Number(e.target.value));
  };

  const handleYearsChange = (e) => {
    setYears(Number(e.target.value));
  };

  return (
    <section id="growth-projection" className="mb-16 scroll-mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 md:p-8 rounded-lg shadow dark:shadow-gray-700" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Explore Growth Scenarios
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Adjust the inputs below to see how changes might affect the illustrative projection over time.
      </p>

      {/* Chart Area */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700 mb-6">
        <GrowthProjectionChart
          monthlyInvestment={monthlyInvestment}
          annualRate={annualRate}
          years={years}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label htmlFor="input-monthly" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monthly Investment (€)
          </label>
          <input
            type="number"
            id="input-monthly"
            name="input-monthly"
            value={monthlyInvestment}
            onChange={handleMonthlyChange}
            min="50"
            step="50"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
        <div>
          <label htmlFor="input-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assumed Annual Return (%)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="input-rate"
              name="input-rate"
              min="3"
              max="12"
              step="0.5"
              value={annualRate}
              onChange={handleRateChange}
              // Apply custom styles via components.css (or Tailwind directly if preferred)
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
            <span id="rate-value" className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 w-12 text-right">
              {annualRate.toFixed(1)}%
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="input-years" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Horizon (Years)
          </label>
          <input
            type="number"
            id="input-years"
            name="input-years"
            value={years}
            onChange={handleYearsChange}
            min="5"
            max="40"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-sm text-yellow-800 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 p-3 rounded-md text-center mt-4">
        <strong>Disclaimer:</strong> Projections are purely illustrative and assume constant inputs.
        Actual returns will vary and can be negative. Past performance is not indicative of future results.
        Investment involves risk, including the possible loss of principal.
      </p>
    </section>
  );
}

export default GrowthProjectionSection; 