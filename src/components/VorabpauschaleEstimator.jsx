import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Percent, HelpCircle } from 'lucide-react';
import InfoTooltip from './InfoTooltip';
import { calculateVorabpauschaleEstimate } from '../utils/calculations'; // Import the calculation function

/**
 * Provides a simplified, illustrative estimator for the German Vorabpauschale tax.
 */
function VorabpauschaleEstimator() {
  const [portfolioValue, setPortfolioValue] = useState(10000);
  const [fundGainPercent, setFundGainPercent] = useState(5); // e.g., 5% gain in the year
  const [basiszinsPercent, setBasiszinsPercent] = useState(2.29); // Example for 2024 (as of June 2024 publication)
  const [unusedAllowance, setUnusedAllowance] = useState(0); // Add state for unused allowance

  const [basisertrag, setBasisertrag] = useState(0);
  const [vorabpauschale, setVorabpauschale] = useState(0);
  const [estimatedTax, setEstimatedTax] = useState(0);

  useEffect(() => {
    // Use the imported calculation function
    const { 
      basisertrag: calculatedBasisertrag, 
      vorabpauschale: calculatedVorabpauschale, 
      estimatedTax: calculatedTax 
    } = calculateVorabpauschaleEstimate({
      portfolioValue,
      fundGainPercent,
      basiszinsPercent,
      unusedAllowance
    });

    // Update state with results
    setBasisertrag(calculatedBasisertrag);
    setVorabpauschale(calculatedVorabpauschale);
    setEstimatedTax(calculatedTax);

  }, [portfolioValue, fundGainPercent, basiszinsPercent, unusedAllowance]); // Dependencies remain the same

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
        <InfoTooltip term="Vorabpauschale" definition="Potential annual tax prepayment on future capital gains for accumulating funds." /> Estimator (Illustrative)
        <span 
          className="ml-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" 
          title="Calculates a *potential* Vorabpauschale tax for a single year based on hypothetical inputs. Actual tax depends on official rates, exact fund performance, and personal tax situation (e.g., Sparer-Pauschbetrag). Assumes equity fund Teilfreistellung (30%)."
        >
           <HelpCircle size={16} />
        </span>
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Estimate the potential tax for accumulating equity ETFs based on hypothetical values for a <strong>single year</strong>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label htmlFor="est-portfolio-val" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portfolio Value Start (€)</label>
          <input 
            type="number" id="est-portfolio-val" value={portfolioValue} 
            onChange={(e) => setPortfolioValue(Number(e.target.value) || 0)}
            min="0" step="1000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
        <div>
          <label htmlFor="est-fund-gain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assumed Fund Gain (%)</label>
          <div className="relative">
            <input 
              type="number" id="est-fund-gain" value={fundGainPercent} 
              onChange={(e) => setFundGainPercent(Number(e.target.value) || 0)}
              step="0.5" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-6"
            />
             <Percent size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label htmlFor="est-basiszins" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assumed <InfoTooltip term="Basiszins" definition="Base interest rate set annually, derived from government bond yields." /> (%)
          </label>
           <div className="relative">
            <input 
              type="number" id="est-basiszins" value={basiszinsPercent} 
              onChange={(e) => setBasiszinsPercent(Number(e.target.value) || 0)}
              step="0.1" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-6"
            />
             <Percent size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label htmlFor="est-unused-allowance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             Unused <InfoTooltip term="Sparer-Pauschbetrag" definition="Enter remaining tax-free allowance (€1000 single / €2000 couple minus other gains/dividends)." /> (€)
          </label>
           <input 
             type="number" id="est-unused-allowance" value={unusedAllowance} 
             onChange={(e) => setUnusedAllowance(Math.max(0, Number(e.target.value) || 0))} // Ensure non-negative
             min="0" step="100"
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
           />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center p-3 bg-indigo-50 dark:bg-indigo-900/40 rounded-md border border-indigo-100 dark:border-indigo-800/50">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            <InfoTooltip term="Basisertrag" definition="Base income calculated (Fund Value * Basiszins * 0.7), capped by actual fund gain." /> (Capped)
          </p>
          <p className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">€{basisertrag.toFixed(2)}</p>
        </div>
        <div>
           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
             <InfoTooltip term="Vorabpauschale" definition="Taxable portion (Basisertrag * 0.7 for equity funds due to Teilfreistellung)." /> (Equity)
           </p>
          <p className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">€{vorabpauschale.toFixed(2)}</p>
        </div>
        <div>
           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Estimated Tax (~26.4%)</p>
          <p className="text-lg font-semibold text-indigo-800 dark:text-indigo-300">€{estimatedTax.toFixed(2)}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
         (Note: Takes entered <InfoTooltip term="Sparer-Pauschbetrag" definition="Annual tax-free allowance (€1,000 singles / €2,000 couples in 2024)." /> into account and assumes 30% <InfoTooltip term="Teilfreistellung" definition="Partial tax exemption (30% for equity funds). Applied to Basisertrag to calculate Vorabpauschale." /> for equity funds.)
      </p>
    </div>
  );
}

export default VorabpauschaleEstimator; 