import React, { useState, useEffect } from 'react';

const TAX_FREE_ALLOWANCE = 1000; // German Sparer-Pauschbetrag for single filer

function TaxCalculator() {
    const [estimatedGains, setEstimatedGains] = useState(''); // Input is text initially
    const [coveredAmount, setCoveredAmount] = useState(0);
    const [taxableAmount, setTaxableAmount] = useState(0);

    useEffect(() => {
        const gainsNumber = Number(estimatedGains);
        if (!isNaN(gainsNumber) && gainsNumber >= 0) {
            const covered = Math.min(gainsNumber, TAX_FREE_ALLOWANCE);
            const taxable = Math.max(0, gainsNumber - TAX_FREE_ALLOWANCE);
            setCoveredAmount(covered);
            setTaxableAmount(taxable);
        } else {
            // Reset if input is invalid or empty
            setCoveredAmount(0);
            setTaxableAmount(0);
        }
    }, [estimatedGains]);

    const formatCurrency = (amount) => {
        return amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Sparer-Pauschbetrag Calculator (€{TAX_FREE_ALLOWANCE.toLocaleString('de-DE')} Allowance)</h4>
            <div className="mb-3">
                <label htmlFor="input-gains" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Est. Annual Gains/Dividends (€):</label>
                <input
                    type="number"
                    id="input-gains"
                    name="input-gains"
                    placeholder="e.g., 500"
                    value={estimatedGains} // Controlled component
                    onChange={(e) => setEstimatedGains(e.target.value)} // Update state on change
                    min="0"
                    step="10"
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
            </div>
            <div className="space-y-1 text-sm">
                 {/* Display calculated values directly */}
                <p>Covered by Pauschbetrag: <span className="font-semibold text-green-700 dark:text-green-400">€ {formatCurrency(coveredAmount)}</span></p>
                <p>Potentially Taxable Amount: <span className="font-semibold text-red-700 dark:text-red-400">€ {formatCurrency(taxableAmount)}</span></p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Assumes single filer allowance (€{TAX_FREE_ALLOWANCE.toLocaleString('de-DE')}). Ensure you submit a <em>Freistellungsauftrag</em> to your broker.</p>
        </div>
    );
}

export default TaxCalculator; 