import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import GrowthProjectionChart from './GrowthProjectionChart'; // Import the chart component
import { Save, RotateCcw, Target, TrendingUp, Calendar, Euro, Percent, PlusCircle, Trash2, XCircle } from 'lucide-react'; // Icons for buttons and goal seeker + Percent
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import { calculateGrowth, calculateRequiredMonthly, prepareProjectionSeries } from '../utils/calculations'; // Import calculations

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
 * Generates ApexCharts annotations object based on events.
 * @param {Array} events - The events array
 * @param {boolean} isDark - Theme status for colors
 * @returns {object} - ApexCharts annotations configuration
 */
const generateAnnotations = (events, isDark) => {
  const pointAnnotations = [];
  const xaxisAnnotations = [];
  const colors = {
    lumpSum: isDark ? '#2dd4bf' : '#0d9488', // Teal
    pauseBg: isDark ? 'rgba(156, 163, 175, 0.2)' : 'rgba(209, 213, 219, 0.4)', // Gray bg with opacity
    pauseBorder: isDark ? '#6b7280' : '#9ca3af', // Gray border
  };

  events.forEach(event => {
    if (event.type === 'lumpSum') {
      pointAnnotations.push({
        x: event.year,
        // y: find corresponding y-value? - complicates things, let Apex place on series
        seriesIndex: 0, // Assuming Nominal Growth is always the first series
        marker: {
          size: 5,
          fillColor: colors.lumpSum,
          strokeColor: '#fff',
          strokeWidth: 2,
          shape: 'circle',
          radius: 2,
        },
        label: {
          borderColor: colors.lumpSum,
          offsetY: 0,
          style: {
            color: '#fff',
            background: colors.lumpSum,
            fontSize: '10px',
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
          },
          text: `+€${event.amount.toLocaleString('de-DE')}`,
        },
      });
    } else if (event.type === 'pause') {
      xaxisAnnotations.push({
        x: event.year - 0.5, // Start slightly before the year tick
        x2: event.endYear + 0.5, // End slightly after the year tick
        fillColor: colors.pauseBg,
        borderColor: colors.pauseBorder,
        strokeDashArray: 0,
        label: {
          borderColor: colors.pauseBorder,
          style: {
            color: isDark ? '#e5e7eb' : '#374151',
            background: colors.pauseBorder,
            fontSize: '10px',
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
          },
          offsetY: -10,
          text: 'Paused',
        },
      });
    }
  });

  return {
    points: pointAnnotations,
    xaxis: xaxisAnnotations,
  };
};

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

  // --- State for "What If" Events ---
  const [events, setEvents] = useState([]);
  const [newEventType, setNewEventType] = useState('lumpSum');
  const [newEventYear, setNewEventYear] = useState(new Date().getFullYear() + 5); // Default to 5 years from now
  const [newEventAmount, setNewEventAmount] = useState(5000);
  const [newEventEndYear, setNewEventEndYear] = useState(new Date().getFullYear() + 7);
  const [eventError, setEventError] = useState('');
  // --- End Event State ---

  // Recalculate live projection whenever DEBOUNCED inputs OR events change
  useEffect(() => {
    const rateDecimal = annualRate / 100;
    const inflationDecimal = inflationRate / 100;
    // Pass events to calculateGrowth
    const nominalData = calculateGrowth(initialInvestment, monthlyInvestment, years, rateDecimal, events);

    // Prepare series data
    const projectionSeries = prepareProjectionSeries(nominalData, inflationDecimal);

    setLiveProjectionData(projectionSeries);
    // Add events to dependency array (already done in previous step)
  }, [initialInvestment, monthlyInvestment, annualRate, years, inflationRate, events]);

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
  
  // Generate annotations based on events
  const annotations = generateAnnotations(events, isDarkMode);

  // --- Event Handlers ---
  const handleAddEvent = (e) => {
    e.preventDefault();
    setEventError('');
    const startYear = new Date().getFullYear();
    const endYearOfProjection = startYear + years;

    // Basic Validation
    if (newEventYear < startYear || newEventYear > endYearOfProjection) {
      setEventError(`Event year must be between ${startYear} and ${endYearOfProjection}.`);
      return;
    }
    if (newEventType === 'pause' && (newEventEndYear < newEventYear || newEventEndYear > endYearOfProjection)) {
      setEventError(`Pause end year must be between ${newEventYear} and ${endYearOfProjection}.`);
      return;
    }
    if (newEventType === 'lumpSum' && newEventAmount <= 0) {
      setEventError('Lump sum amount must be positive.');
      return;
    }

    const newEvent = {
      id: Date.now(),
      type: newEventType,
      year: newEventYear,
      // Only include relevant properties
      ...(newEventType === 'lumpSum' && { amount: newEventAmount }),
      ...(newEventType === 'pause' && { endYear: newEventEndYear }),
    };
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.year - b.year)); // Keep sorted by year
    // Reset form? Maybe not, user might add similar events
  };

  const handleRemoveEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };
  
  const handleClearEvents = () => {
      setEvents([]);
  };
  // --- End Event Handlers ---

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
          seriesData={allChartSeries} 
          isDarkMode={isDarkMode}
          annotations={annotations}
        />
      </div>

      {/* Input Controls Area + Event Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          {/* Column 1: Forward Projection */}
          <div className="lg:col-span-1 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50">
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

          {/* Column 2: Goal Seeker */}
          <div className="lg:col-span-1 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50">
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

          {/* Column 3: Event Builder */}
          <div className="lg:col-span-1 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700/50 space-y-4">
            <h3 className="text-xl font-semibold mb-3 text-center text-cyan-700 dark:text-cyan-400">"What If" Events</h3>
            
            {/* Event Form */}
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                 <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
                 <select 
                    id="event-type" 
                    value={newEventType} 
                    onChange={(e) => setNewEventType(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  >
                   <option value="lumpSum">Lump Sum Investment</option>
                   <option value="pause">Pause Contributions</option>
                 </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label htmlFor="event-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Year</label>
                    <input 
                      type="number" 
                      id="event-year" 
                      value={newEventYear} 
                      onChange={(e) => setNewEventYear(parseInt(e.target.value, 10) || new Date().getFullYear())} 
                      min={new Date().getFullYear()} 
                      max={new Date().getFullYear() + years} 
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                    />
                 </div>
                 {newEventType === 'pause' && (
                    <div>
                       <label htmlFor="event-end-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Year</label>
                       <input 
                         type="number" 
                         id="event-end-year" 
                         value={newEventEndYear} 
                         onChange={(e) => setNewEventEndYear(parseInt(e.target.value, 10) || new Date().getFullYear())} 
                         min={newEventYear} 
                         max={new Date().getFullYear() + years}
                         step="1"
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                       />
                    </div>
                 )}
              </div>

              {newEventType === 'lumpSum' && (
                <div>
                   <label htmlFor="event-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (€)</label>
                   <input 
                     type="number" 
                     id="event-amount" 
                     value={newEventAmount} 
                     onChange={(e) => setNewEventAmount(parseInt(e.target.value, 10) || 0)} 
                     step="100"
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                   />
                </div>
              )}
              
              {eventError && <p className="text-xs text-red-600 dark:text-red-400">{eventError}</p>}

              <button 
                 type="submit" 
                 className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md shadow flex items-center justify-center space-x-2 transition duration-150 ease-in-out"
               >
                 <PlusCircle size={18} />
                 <span>Add Event</span>
              </button>
            </form>

            {/* Event List */}
            {events.length > 0 && (
               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Added Events:</h4>
                    <button 
                      onClick={handleClearEvents}
                      title="Clear all events"
                      className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                    >
                       <XCircle size={14} className="mr-1" /> Clear All
                    </button>
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                     {events.map(event => (
                        <li key={event.id} className="flex justify-between items-center p-1 bg-gray-50 dark:bg-gray-700/50 rounded">
                           <span>
                              {event.year}: {event.type === 'lumpSum' ? `+€${event.amount.toLocaleString('de-DE')}` : `Pause until ${event.endYear}`}
                           </span>
                           <button onClick={() => handleRemoveEvent(event.id)} title="Remove event" className="ml-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                              <Trash2 size={14} />
                           </button>
                        </li>
                     ))}
                  </ul>
               </div>
            )}
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