import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { ExternalLink, Info, AlertTriangle } from 'lucide-react';
import TaxCalculator from './TaxCalculator'; // Component for Sparer-Pauschbetrag
import VorabpauschaleEstimator from './VorabpauschaleEstimator'; // Import the new estimator
import InfoTooltip from './InfoTooltip'; // Import the tooltip component

/**
 * Renders the German Tax Efficiency section.
 */
function TaxSection() {
  return (
    <section id="tax" className="mb-16 scroll-mt-16" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">
        German Tax Efficiency
      </h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 space-y-6">
        <div> 
          <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Key Considerations for Germany</h3>
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            <p>Understanding German tax rules is important for maximizing long-term returns. Key aspects include:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Kapitalertragssteuer:</strong> A flat tax rate (currently ~26.375% including solidarity surcharge) applies to most investment income like dividends, interest, and capital gains upon selling assets held in a standard brokerage account.</li>
              <li><InfoTooltip term="Sparer-Pauschbetrag" definition="Annual tax-free allowance for capital gains and investment income (€1,000 for singles, €2,000 for couples in 2024). Only income above this is taxed." />: An annual tax-free allowance for capital gains and income. For individuals, it's €1,000; for jointly assessed couples, it's €2,000 (as of 2024). Only income exceeding this allowance is taxed.</li>
              <li><InfoTooltip term="Vorabpauschale" definition="Potential annual tax prepayment on future capital gains for accumulating funds. Calculated based on a base rate ('Basiszins') but capped by actual fund performance. Tax paid reduces eventual capital gains tax." />: A specific rule for accumulating funds (like the example ETFs) that don't pay out dividends.</li>
              <li><InfoTooltip term="Teilfreistellung" definition="Partial tax exemption on investment returns based on fund type (e.g., 30% for equity funds). Reduces the taxable amount for distributions, the Vorabpauschale, and capital gains." />: Partial tax exemptions apply based on the fund type (e.g., 30% for equity funds with &gt;50% equity). This reduces the taxable amount of both distributions and capital gains.</li>
            </ul>
          </div>
        </div>

        {/* Render the existing TaxCalculator for Sparer-Pauschbetrag */}
        <TaxCalculator />

        {/* Vorabpauschale Section */}
        <div>
           <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Vorabpauschale (Accumulating ETFs)</h3>
          <div className="text-gray-700 dark:text-gray-300 space-y-3 text-sm">
             <p>
               Accumulating ETFs reinvest profits internally instead of distributing them. To ensure some level of ongoing taxation similar to distributing funds,
               Germany implemented the 'Vorabpauschale' (preliminary lump sum). This is a *potential* annual tax prepayment on *future* capital gains.
             </p>
             <p>
               It's calculated based on the fund's value at the start of the year, the official <InfoTooltip term="Basiszins" definition="Base interest rate set annually by the German Ministry of Finance, derived from government bond yields. Used to calculate the Basisertrag for the Vorabpauschale." /> (base rate, derived from government bond yields), and the fund's actual performance during the year.
               Crucially, the taxable base amount (<InfoTooltip term="Basisertrag" definition="The base income calculated for the Vorabpauschale (Fund Value * Basiszins * 0.7). It's capped by the fund's actual gain in value for the year." />) is capped by the fund's actual gains – if the fund has a loss, the Vorabpauschale is zero for that year.
               For equity funds, only 70% of the Basisertrag is used for calculation, and then the 30% Teilfreistellung is applied to the resulting Vorabpauschale before tax is calculated.
             </p>
             <p>
               While it might sound complex, the actual tax amount is often modest in early years or years with low Basiszins / low fund performance.
               The tax paid is deducted from your eventual capital gains tax liability when you sell the ETF units, avoiding double taxation.
               <a
                 href="https://www.finanztipp.de/indexfonds-etf/vorabpauschale/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs whitespace-nowrap inline-flex items-center ml-1"
               >
                 Learn More (Finanztipp)
                 <ExternalLink size={12} className="ml-1" />
               </a>
             </p>
           </div>

           {/* Render the new Vorabpauschale Estimator */}
           <VorabpauschaleEstimator />
         </div>

        {/* Tax Residency Note */}
         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg text-sm text-blue-800 dark:text-blue-300">
           <p className="flex items-start">
             <AlertTriangle size={20} className="mr-2 mt-0.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
             <span>
               <strong>Important Note (Tax Residency):</strong> Tax rules differ significantly between countries.
               If you become tax-resident outside Germany (e.g., during your Erasmus semester in the Netherlands),
               the tax implications for your investments will likely change. It's crucial to review your situation then.
             </span>
           </p>
         </div>

      </div>
    </section>
  );
}

// TaxSection doesn't receive props, so no propTypes definition needed.

export default TaxSection; 