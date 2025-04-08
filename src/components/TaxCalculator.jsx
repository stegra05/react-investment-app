import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfoTooltip from './InfoTooltip'; // Import the tooltip component

// Helper function to format currency in German locale
function formatCurrencyDE(amount) {
  return amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Renders the tax allowance calculator.
 */
function TaxCalculator() {
  const [estimatedGains, setEstimatedGains] = useState('');
  const [coveredAmount, setCoveredAmount] = useState(0);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const pauschbetrag = 1000; // Single filer allowance

  useEffect(() => {
    const gains = parseFloat(estimatedGains) || 0;
    const covered = Math.min(gains, pauschbetrag);
    const taxable = Math.max(0, gains - pauschbetrag);

    setCoveredAmount(covered);
    setTaxableAmount(taxable);
  }, [estimatedGains]);

  const handleInputChange = (e) => {
    // Allow only numbers and an empty string
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setEstimatedGains(value);
    }
  };

  return (
    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        <InfoTooltip term="Sparer-Pauschbetrag" definition="Annual tax-free allowance (€1,000 singles / €2,000 couples in 2024) for capital gains and investment income." /> Calculator (€1,000 Allowance)
      </h4>
      <div className="mb-3">
        <label htmlFor="input-gains" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Enter Est. Annual Gains/Dividends (€):
        </label>
        <input
          type="text" // Use text type to allow empty string and better control input
          inputMode="decimal" // Hint for mobile keyboards
          id="input-gains"
          name="input-gains"
          placeholder="e.g., 500"
          value={estimatedGains}
          onChange={handleInputChange}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>
      <div className="space-y-1 text-sm">
        <p>Covered by Pauschbetrag: <span className="font-semibold text-green-700 dark:text-green-400">€ <span id="covered-amount">{formatCurrencyDE(coveredAmount)}</span></span></p>
        <p>Potentially Taxable Amount: <span className="font-semibold text-red-700 dark:text-red-400">€ <span id="taxable-amount">{formatCurrencyDE(taxableAmount)}</span></span></p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Assumes single filer allowance (€1,000). Ensure you submit a 
        <em><InfoTooltip term="Freistellungsauftrag" definition="An order submitted to your bank/broker to apply your Sparer-Pauschbetrag allowance directly, avoiding tax withholding on income up to the allowance amount." /></em> 
        to your broker.
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Note: This calculation does not include the <em>Teilfreistellung</em> (partial exemption) for equity funds, which further reduces the taxable amount on actual gains/distributions. It also does not account for offsetting losses.
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Note: Jointly assessed couples have a higher allowance of €2,000.
      </p>
    </div>
  );
}

export default TaxCalculator; 