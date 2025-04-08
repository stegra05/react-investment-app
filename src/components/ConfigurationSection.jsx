import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { SlidersHorizontal, BoxSelect } from 'lucide-react';
import { usePlan } from '../context/PlanContext'; // Import usePlan hook

// Define Templates
const templates = {
  default: {
    name: "Default 60/20/20",
    totalInvestment: 600,
    coreAmount: 500,
    coreAllocations: [
      { name: 'Global Dev.', value: 60 },
      { name: 'Europe', value: 20 },
      { name: 'EM', value: 20 },
    ]
  },
  higherCore: {
    name: "Higher Core 70/15/15",
    totalInvestment: 700,
    coreAmount: 600,
    coreAllocations: [
      { name: 'Global Dev.', value: 70 },
      { name: 'Europe', value: 15 },
      { name: 'EM', value: 15 },
    ]
  }
};

/**
 * Allows configuration of the investment plan parameters.
 * Uses PlanContext for plan state and setters.
 */
function ConfigurationSection() {
  const {
    totalInvestment,
    setTotalInvestment,
    coreAmount,
    setCoreAmount,
    satelliteAmount, // Get derived amount from context too
    coreAllocations,
    setCoreAllocations
  } = usePlan(); // Use context hook
  
  const [localAllocations, setLocalAllocations] = useState(coreAllocations);
  const [allocationError, setAllocationError] = useState('');

  // Sync local state when prop changes (e.g., initial load)
  useEffect(() => {
    setLocalAllocations(coreAllocations);
  }, [coreAllocations]);

  // Handler for Total Investment Change
  const handleTotalInvestmentChange = (e) => {
    const newTotal = parseInt(e.target.value, 10) || 0;
    setTotalInvestment(newTotal);
    // If new total is less than core, adjust core?
    if (newTotal < coreAmount) {
      setCoreAmount(newTotal);
    }
  };

  // Handler for Core Amount Change
  const handleCoreAmountChange = (e) => {
    let newCore = parseInt(e.target.value, 10) || 0;
    if (newCore > totalInvestment) {
      newCore = totalInvestment;
    }
    if (newCore < 0) {
      newCore = 0;
    }
    setCoreAmount(newCore);
  };

  // Handler for Individual Core Allocation Change
  const handleAllocationChange = (index, newValue) => {
    const updatedAllocations = localAllocations.map((item, i) => {
      if (i === index) {
        return { ...item, value: newValue };
      }
      return item;
    });
    setLocalAllocations(updatedAllocations);

    // Check sum and potentially update parent state
    const currentSum = updatedAllocations.reduce((sum, item) => sum + item.value, 0);
    if (currentSum === 100) {
      setCoreAllocations(updatedAllocations); // Update parent state
      setAllocationError('');
    } else {
        setAllocationError(`Allocations must sum to 100% (current: ${currentSum}%)`);
        // Don't update parent state yet
    }
  };

  // Handler for applying a template
  const applyTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (!template) return;

    setTotalInvestment(template.totalInvestment);
    setCoreAmount(template.coreAmount);
    setCoreAllocations(template.coreAllocations); // Update context
    setLocalAllocations(template.coreAllocations); // Update local state for UI sync
    setAllocationError(''); // Clear any existing error
  };

  return (
    <section id="configuration" className="mb-16 scroll-mt-16 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600 flex items-center">
        <SlidersHorizontal size={28} className="mr-3 text-indigo-600 dark:text-indigo-500" /> Plan Configuration
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Investment Split */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Monthly Investment Split</h3>
          <div>
            <label htmlFor="totalInvestment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Monthly Investment (€)</label>
            <input
              type="number"
              id="totalInvestment"
              name="totalInvestment"
              value={totalInvestment}
              onChange={handleTotalInvestmentChange}
              min="0"
              step="50"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="coreAmountSlider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Core Amount (€{coreAmount})</label>
            <input
              type="range"
              id="coreAmountSlider"
              name="coreAmount"
              value={coreAmount}
              onChange={handleCoreAmountChange}
              min="0"
              max={totalInvestment}
              step="50"
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Satellite Amount: €{satelliteAmount}</p>
          </div>
        </div>

        {/* Core Allocation */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Core Portfolio Allocation (%)</h3>
          {localAllocations.map((alloc, index) => (
            <div key={alloc.name}>
              <label htmlFor={`alloc-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{alloc.name} (%)</label>
              <input
                type="number"
                id={`alloc-${index}`}
                name={`alloc-${index}`}
                value={alloc.value}
                onChange={(e) => handleAllocationChange(index, parseInt(e.target.value, 10) || 0)}
                min="0"
                max="100"
                step="1"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
          {allocationError && (
             <p className="text-sm text-red-600 dark:text-red-400 mt-2">{allocationError}</p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Total Core Allocation: {localAllocations.reduce((sum, item) => sum + item.value, 0)}%
          </p>
        </div>
      </div>

      {/* --- Template Selection --- */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold mb-3 text-indigo-700 dark:text-indigo-400 flex items-center">
          <BoxSelect size={20} className="mr-2" /> Load a Template
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => applyTemplate('default')}
            className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm transition duration-150"
            title={`Load: ${templates.default.totalInvestment} Total, ${templates.default.coreAmount} Core, ${templates.default.coreAllocations.map(a=>a.value).join('/')}`}
          >
            {templates.default.name}
          </button>
          <button
            onClick={() => applyTemplate('higherCore')}
            className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md shadow-sm transition duration-150"
             title={`Load: ${templates.higherCore.totalInvestment} Total, ${templates.higherCore.coreAmount} Core, ${templates.higherCore.coreAllocations.map(a=>a.value).join('/')}`}
          >
             {templates.higherCore.name}
          </button>
          {/* Add more template buttons here if needed */}
        </div>
      </div>

    </section>
  );
}

export default ConfigurationSection; 