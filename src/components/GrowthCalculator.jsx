import React from 'react';

// Receive state values and setter functions as props
function GrowthCalculator({ monthlyInvestment, setMonthlyInvestment, annualRate, setAnnualRate, years, setYears }) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
                <label htmlFor="input-monthly" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Investment (€)</label>
                <input
                    type="number"
                    id="input-monthly"
                    name="input-monthly"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))} // Use setter prop
                    min="50"
                    step="50"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                 />
            </div>
            <div>
                 <label htmlFor="input-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assumed Annual Return (%)</label>
                 <div className="flex items-center space-x-3">
                    <input
                        type="range"
                        id="input-rate"
                        name="input-rate"
                        min="3"
                        max="12"
                        step="0.5"
                        value={annualRate}
                        onChange={(e) => setAnnualRate(Number(e.target.value))} // Use setter prop
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                    />
                    <span id="rate-value" className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 w-12 text-right">{annualRate.toFixed(1)}%</span>
                 </div>
             </div>
            <div>
                 <label htmlFor="input-years" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Horizon (Years)</label>
                 <input
                    type="number"
                    id="input-years"
                    name="input-years"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))} // Use setter prop
                    min="5"
                    max="40"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
             </div>
        </div>
    );
}

export default GrowthCalculator; 