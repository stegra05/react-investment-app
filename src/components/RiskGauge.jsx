import React from 'react';
import PropTypes from 'prop-types';

/**
 * A visual gauge component to represent risk levels.
 * @param {string} level - The risk level ('Low', 'Moderate', 'Moderate-High', 'High').
 */
function RiskGauge({ level }) {
  const levels = {
    'Low': { value: 1, color: 'bg-green-500', label: 'Low' },
    'Moderate': { value: 2, color: 'bg-yellow-500', label: 'Moderate' },
    'Moderate-High': { value: 3, color: 'bg-orange-500', label: 'Moderate-High' },
    'High': { value: 4, color: 'bg-red-500', label: 'High' },
  };

  const currentLevel = levels[level] || levels['Moderate']; // Default to Moderate if level is unknown
  const totalLevels = Object.keys(levels).length;
  const percentage = (currentLevel.value / totalLevels) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto" title={`Risk Level: ${currentLevel.label}`}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden relative">
        {/* Background segments for visual steps */}
        <div className="absolute flex w-full h-full top-0 left-0">
          <div className="w-1/4 h-full border-r border-white/50 dark:border-black/50"></div>
          <div className="w-1/4 h-full border-r border-white/50 dark:border-black/50"></div>
          <div className="w-1/4 h-full border-r border-white/50 dark:border-black/50"></div>
          <div className="w-1/4 h-full"></div>
        </div>
        {/* Indicator bar */}
        <div
          className={`h-2.5 rounded-full ${currentLevel.color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="meter"
          aria-valuenow={currentLevel.value}
          aria-valuemin="1"
          aria-valuemax={totalLevels}
          aria-label={`Risk Level Meter: ${currentLevel.label}`}
        >
          {/* Small nub at the end */}
           <div className="absolute top-1/2 right-0 w-1 h-4 bg-gray-700 dark:bg-gray-200 rounded transform -translate-y-1/2 translate-x-1/2" style={{left: `${percentage}%`}}></div>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentLevel.label}</span>
    </div>
  );
}

RiskGauge.propTypes = {
  level: PropTypes.oneOf(['Low', 'Moderate', 'Moderate-High', 'High']).isRequired,
};

export default RiskGauge; 