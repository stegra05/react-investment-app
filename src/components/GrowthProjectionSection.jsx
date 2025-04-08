import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import GrowthProjectionChart from './GrowthProjectionChart'; // Import the chart component
import { Save, RotateCcw, Target, TrendingUp, Calendar, Euro, Percent } from 'lucide-react'; // Icons for buttons and goal seeker + Percent
import { useTheme } from '../context/ThemeContext'; // Import useTheme

/**
 * Calculates the projected growth data.
 * @param {number} initial - Initial balance (usually 0)
 * @param {number} monthly - Monthly investment amount
 * @param {number} years - Investment duration in years
 * @param {number} rate - Assumed annual rate of return (e.g., 0.07 for 7%)
 * @returns {Array<{x: number, y: number}>} - Array of data points for the chart
 */
const calculateGrowth = (initial, monthly, years, rate) => {
  let balance = initial;
  const monthlyRate = rate / 12;
  const data = [{ x: new Date().getFullYear(), y: Math.round(balance) }]; // Start with initial balance at current year
  let currentYear = new Date().getFullYear();

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }
    currentYear++;
    data.push({ x: currentYear, y: Math.round(balance) });
  }
  return data;
};

/**
 * Calculates the required monthly investment to reach a target future value.
 * Formula: PMT = FV * (r / ((1 + r)^n - 1))
 * @param {number} targetValue - The desired future value (FV)
 * @param {number} years - Investment duration in years
 * @param {number} annualRatePercent - Assumed annual rate of return (e.g., 7 for 7%)
 * @returns {number | null} - Required monthly investment, or null if calculation is not possible.
 */
const calculateRequiredMonthly = (targetValue, years, annualRatePercent) => {
  if (targetValue <= 0 || years <= 0) return null;
  
  const monthlyRate = annualRatePercent / 100 / 12;
  const numMonths = years * 12;

  // Handle 0% rate separately to avoid division by zero
  if (monthlyRate === 0) {
    return targetValue / numMonths;
  }

  const factor = Math.pow(1 + monthlyRate, numMonths);
  if (factor === 1) return null; // Avoid division by zero if rate is extremely small

  const requiredMonthly = targetValue * (monthlyRate / (factor - 1));

  return requiredMonthly > 0 ? requiredMonthly : null;
};

/**
 * Takes nominal growth data and calculates the inflation-adjusted (real) growth data.
 * Returns an array of series objects for the chart.
 * @param {Array<{x: number, y: number}>} nominalData - Nominal growth data from calculateGrowth.
 * @param {number} inflationDecimal - Annual inflation rate (e.g., 0.02 for 2%).
 * @returns {Array<object>} - Array containing nominal and real growth series.
 */
const prepareProjectionSeries = (nominalData, inflationDecimal) => {
  if (!nominalData || nominalData.length === 0) {
    return [];
  }

  const startYear = nominalData[0].x;
  const realData = nominalData.map(point => {
    const yearsElapsed = point.x - startYear;
    // Adjust value: Real = Nominal / (1 + Inflation)^Years
    const adjustedValue = yearsElapsed === 0 ? point.y : point.y / Math.pow(1 + inflationDecimal, yearsElapsed);
    return { x: point.x, y: Math.round(adjustedValue) };
  });

  return [
    {
      name: 'Nominal Growth',
      data: nominalData,
      type: 'area'
    },
    {
      name: 'Real Growth (Inflation Adj.)',
      data: realData,
      type: 'line'
    }
  ];
};

/** Debounce helper hook */
function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
}

/**
 * Renders the Growth Projection section, including controls and the chart.
 * Uses ThemeContext.
 */
function GrowthProjectionSection() {
  const { isDarkMode } = useTheme(); // Use context hook
  // State for current inputs (forward projection)
  const [monthlyInvestment, setMonthlyInvestment] = useState(600);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(20);
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [inflationRate, setInflationRate] = useState(2);

  // State for scenarios
  const [scenarios, setScenarios] = useState([]);
  const [liveProjectionData, setLiveProjectionData] = useState([]);

  // State for goal seeking
  const [goalTargetValue, setGoalTargetValue] = useState(100000);
  const [goalDuration, setGoalDuration] = useState(15);
  const [goalReturnRate, setGoalReturnRate] = useState(6);
  const [goalMonthlyInvestment, setGoalMonthlyInvestment] = useState(null);

  // Recalculate live projection whenever DEBOUNCED inputs change
  useEffect(() => {
    const rateDecimal = annualRate / 100;
    const inflationDecimal = inflationRate / 100;
    const nominalData = calculateGrowth(initialInvestment, monthlyInvestment, years, rateDecimal);

    // Prepare series data
    const projectionSeries = prepareProjectionSeries(nominalData, inflationDecimal);

    setLiveProjectionData(projectionSeries);
  }, [initialInvestment, monthlyInvestment, annualRate, years, inflationRate]);

  // Recalculate goal monthly investment (NO debounce needed here, direct is fine)
  useEffect(() => {
    const required = calculateRequiredMonthly(goalTargetValue, goalDuration, goalReturnRate);
    setGoalMonthlyInvestment(required);
  }, [goalTargetValue, goalDuration, goalReturnRate]);

  // --- Debounced Handlers for Live Projection Inputs ---
  const DEBOUNCE_DELAY = 150; // milliseconds (Reduced from 300ms for responsiveness)

  const debouncedSetInitialInvestment = useDebouncedCallback(setInitialInvestment, DEBOUNCE_DELAY);
  const debouncedSetMonthlyInvestment = useDebouncedCallback(setMonthlyInvestment, DEBOUNCE_DELAY);
  const debouncedSetAnnualRate = useDebouncedCallback(setAnnualRate, DEBOUNCE_DELAY);
  const debouncedSetYears = useDebouncedCallback(setYears, DEBOUNCE_DELAY);
  const debouncedSetInflationRate = useDebouncedCallback(setInflationRate, DEBOUNCE_DELAY);

  const handleInitialChange = (e) => debouncedSetInitialInvestment(Number(e.target.value));
  const handleMonthlyChange = (e) => debouncedSetMonthlyInvestment(Number(e.target.value));
  const handleRateChange = (e) => debouncedSetAnnualRate(Number(e.target.value));
  const handleYearsChange = (e) => debouncedSetYears(Number(e.target.value));
  const handleInflationChange = (e) => debouncedSetInflationRate(Number(e.target.value));

  // --- Direct Handlers for Goal Seeker Inputs ---
  const handleGoalTargetChange = (e) => setGoalTargetValue(Number(e.target.value));
  const handleGoalDurationChange = (e) => setGoalDuration(Number(e.target.value));
  const handleGoalReturnRateChange = (e) => setGoalReturnRate(Number(e.target.value));

  // Add a new scenario based on current inputs
  const handleAddScenario = () => {
    const rateDecimal = annualRate / 100;
    const scenarioData = calculateGrowth(initialInvestment, monthlyInvestment, years, rateDecimal);
    const scenarioName = `Saved #${scenarios.length + 1}: ${annualRate}% @ €${monthlyInvestment}/mo for ${years}y`;
    const newScenario = {
      id: Date.now(), // Simple unique ID
      name: scenarioName,
      data: scenarioData,
      type: 'line', // Display saved scenarios as lines
      inputs: { initialInvestment, monthlyInvestment, annualRate, years }
    };
    setScenarios(prev => [...prev, newScenario]);
  };

  // Clear saved scenarios
  const handleResetScenarios = () => {
    setScenarios([]);
  };

  // Combine live data with saved scenarios for the chart
  const allChartSeries = [...liveProjectionData, ...scenarios];

  return (
    <section id="growth-projection" className="mb-16 scroll-mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 md:p-8 rounded-lg shadow dark:shadow-gray-700" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Explore Growth Scenarios & Goals
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Adjust inputs, save scenarios, and calculate required investments for your financial goals.
      </p>

      {/* Chart Area */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700 mb-6">
        <GrowthProjectionChart
          seriesData={allChartSeries} // Pass combined series data
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Input Controls Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">

        {/* Forward Projection Inputs (use debounced handlers) */}
        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50">
          <h3 className="text-xl font-semibold mb-4 text-center text-indigo-700 dark:text-indigo-400">Forward Projection</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
             <div>
               <label htmlFor="input-initial" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Initial Investment (€)
               </label>
               <input
                 type="number"
                 id="input-initial"
                 name="input-initial"
                 value={initialInvestment}
                 onChange={handleInitialChange}
                 min="0"
                 step="100"
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
               />
             </div>
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
             <div className="sm:col-span-2">
               <label htmlFor="input-inflation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Assumed Annual Inflation (%)
               </label>
               <div className="flex items-center space-x-3">
                 <input
                   type="range"
                   id="input-inflation"
                   name="input-inflation"
                   min="0"
                   max="10"
                   step="0.1"
                   defaultValue={inflationRate}
                   onChange={handleInflationChange}
                   className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-600 dark:accent-pink-400"
                 />
                 <span id="inflation-value" className="text-sm font-semibold text-pink-700 dark:text-pink-400 w-12 text-right">
                   {inflationRate.toFixed(1)}%
                 </span>
               </div>
             </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
             <button 
               onClick={handleAddScenario}
               disabled={scenarios.length >= 5}
               title={scenarios.length >= 5 ? "Maximum scenarios saved" : "Save current inputs as a comparison line"}
               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow flex items-center space-x-2 transition duration-150 ease-in-out disabled:opacity-50"
             >
               <Save size={18} />
               <span>Save Scenario</span>
             </button>
             <button 
               onClick={handleResetScenarios}
               disabled={scenarios.length === 0}
               title="Clear all saved comparison lines"
               className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md shadow flex items-center space-x-2 transition duration-150 ease-in-out disabled:opacity-50"
             >
               <RotateCcw size={18} />
               <span>Reset Comparison</span>
             </button>
          </div>
        </div>

        {/* Goal Seeker Inputs (use direct handlers) */}
        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50">
           <h3 className="text-xl font-semibold mb-4 text-center text-purple-700 dark:text-purple-400">Goal Calculator</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="goal-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Value (€)</label>
              <input 
                type="number"
                id="goal-target"
                name="goal-target"
                value={goalTargetValue}
                onChange={handleGoalTargetChange}
                min="1000"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
             <div>
              <label htmlFor="goal-duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (Years)</label>
              <input 
                type="number"
                id="goal-duration"
                name="goal-duration"
                value={goalDuration}
                onChange={handleGoalDurationChange}
                min="1"
                max="50"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
            <div className="sm:col-span-2"> {/* Rate input spans full width on small screens */} 
              <label htmlFor="goal-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assumed Annual Return (%)</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="range"
                  id="goal-rate"
                  name="goal-rate"
                  min="1"
                  max="12"
                  step="0.5"
                  value={goalReturnRate}
                  onChange={handleGoalReturnRateChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-400"
                />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 w-12 text-right">
                  {goalReturnRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          {/* Result Display */} 
          <div className="text-center mt-4 p-3 bg-purple-50 dark:bg-purple-900/40 rounded-md border border-purple-200 dark:border-purple-700/50">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Monthly Investment:</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {goalMonthlyInvestment !== null 
                ? `€${goalMonthlyInvestment.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "--" }
            </p>
          </div>
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