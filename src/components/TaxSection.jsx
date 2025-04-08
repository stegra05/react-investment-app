import React from 'react';
import TaxCalculator from './TaxCalculator'; // Adjust path if needed

/**
 * Displays the section covering German tax considerations.
 * Includes explanations of key rules (Kapitalertragssteuer, Sparer-Pauschbetrag, Vorabpauschale),
 * links to external resources, and a note on tax residency changes.
 * Integrates the TaxCalculator component.
 *
 * @returns {JSX.Element} The TaxSection component.
 */
function TaxSection() {
    return (
        <section id="tax" className="mb-16 scroll-mt-16" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">German Tax Efficiency</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Key Considerations for Germany</h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                    <p>Key German tax rules, such as the flat tax (<em>Kapitalertragssteuer</em> ~26.4%) and the annual tax-free allowance (<em>Sparer-Pauschbetrag</em>), apply to this investment plan.</p>
                    <TaxCalculator />
                    <div className="mt-6 pt-4 border-t border-gray-200"> <h4 className="font-semibold text-gray-800 mb-2">Vorabpauschale (Accumulating ETFs)</h4> <p className="text-sm text-gray-600">Accumulating ETFs don't distribute dividends, but a potential upfront tax ('Vorabpauschale') might apply annually. This is calculated based on fund performance and a base interest rate set by the government. It's usually modest until you sell, but ensures some tax is paid yearly even without distributions. <a href="https://www.finanztipp.de/indexfonds-etf/vorabpauschale/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-xs whitespace-nowrap"> Learn More (Finanztipp)<span className="lucide lucide-link">&#xe966;</span></a> </p> </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"> <p className="flex items-start"> <span className="lucide mr-2 mt-0.5 flex-shrink-0" style={{ fontSize: '1.25rem' }}>&#xe8bb;</span> <span><strong>Important Note (Tax Residency):</strong> Tax rules differ significantly between countries. If you become tax-resident outside Germany (e.g., during your Erasmus semester in the Netherlands), the tax implications for your investments will likely change. It's crucial to review your situation then.</span> </p> </div>
                </div>
            </div>
        </section>
    );
}

export default TaxSection; 