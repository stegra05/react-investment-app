import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { ExternalLink, Globe, Euro, LineChart, Landmark, HandCoins, Rocket, Combine, Info } from 'lucide-react'; // Relevant icons
import ImplementationCard from './ImplementationCard'; // Import the reusable card
import { usePlan } from '../context/PlanContext'; // Import usePlan

// Base data for the cards (without amounts in title)
const baseCoreCardsData = [
  {
    id: 'impl-card-global',
    baseTitle: '1. Global Dev. ETF',
    icon: 'globe',
    iconColor: 'indigo',
    link: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B4L5Y983',
    description: 'iShares Core MSCI World UCITS ETF (Acc)',
    isin: 'IE00B4L5Y983',
    ter: '~0.20%',
    why: 'Broad global diversification, low cost, accumulating.',
    delay: 100
  },
  {
    id: 'impl-card-europe',
    baseTitle: '2. Europe ETF',
    icon: 'euro',
    iconColor: 'indigo',
    link: 'https://www.justetf.com/de/etf-profile.html?isin=DE0002635307',
    description: 'iShares STOXX Europe 600 UCITS ETF (Acc)',
    isin: 'DE0002635307',
    ter: '~0.20%',
    why: 'European exposure, potential valuation, accumulating.',
    delay: 200
  },
  {
    id: 'impl-card-em',
    baseTitle: '3. EM ETF',
    icon: 'linechart',
    iconColor: 'indigo',
    link: 'https://www.justetf.com/de/etf-profile.html?isin=IE00BKM4GZ66',
    description: 'iShares Core MSCI EM IMI UCITS ETF (Acc)',
    isin: 'IE00BKM4GZ66',
    ter: '~0.18%',
    why: 'Higher growth potential, diversified emerging economies.',
    delay: 300
  }
];

const optionalCardsData = [
  {
    id: 'impl-card-bonds',
    title: '4. Global Bond ETF (€50) (Optional)',
    icon: 'landmark',
    iconColor: 'gray',
    link: 'https://www.justetf.com/de/etf-profile.html?isin=IE00BDBRDM35',
    description: 'iShares Global Agg Bond UCITS ETF (EUR Hedged)',
    isin: 'IE00BDBRDM35',
    ter: '~0.10%',
    why: 'Adds stability, reduces volatility, EUR hedged.',
    delay: 100,
    isOptional: true
  },
  {
    id: 'impl-card-bluechip',
    title: '5. Blue-Chip Stocks (€50) (Optional)',
    icon: 'handcoins',
    iconColor: 'gray',
    link: 'https://www.google.com/finance/quote/MSFT:NASDAQ',
    description: 'e.g., Microsoft (US5949181045), Allianz (DE0008404005)',
    isin: 'N/A',
    ter: 'N/A',
    why: 'Direct ownership in stable, global leaders (1-2 max).',
    delay: 200,
    isOptional: true
  }
];

const chinaCardsData = [
  {
    id: 'impl-card-china-broad',
    title: 'A. Broad China ETF (€50-€100)',
    icon: 'globe',
    iconColor: 'rose',
    link: 'https://www.justetf.com/de/etf-profile.html?isin=LU0514695690',
    description: 'Xtrackers MSCI China UCITS ETF (Acc)',
    isin: 'LU0514695690',
    ter: '~0.65%',
    why: 'Diversified China exposure, balanced approach.',
    delay: 100
  },
  {
    id: 'impl-card-china-growth',
    title: 'B. High-Growth Stocks/ETF (€0-€50)',
    icon: 'rocket',
    iconColor: 'rose',
    link: 'https://www.justetf.com/de/etf-profile.html?isin=IE00BFXR7645',
    description: 'e.g., KWEB ETF (IE00BFXR7645), BABA, 700.HK, 1211.HK',
    isin: 'Varies',
    ter: 'Varies (ETF ~0.75%)',
    why: 'Concentrated bets on specific growth themes/companies.',
    delay: 200
  },
  {
    id: 'impl-card-china-combined',
    title: 'C. Combined Approach (Plan Suggestion)',
    icon: 'combine',
    iconColor: 'rose',
    link: null, // No specific link for the combined approach
    description: '€50 Broad China ETF + €50 split on 1-2 Stocks/Thematic ETF',
    isin: 'Mix',
    ter: 'Mix',
    why: 'Balances diversification with targeted growth potential.',
    delay: 300,
    isSuggested: true
  }
];

/**
 * Renders the Implementation Guide section.
 * Uses PlanContext. Receives highlight props from App.
 */
function ImplementationSection({ 
  highlightedCoreIndex, 
  highlightedRationale, 
  registerCardRef,
}) {
  const { coreAmount, coreAllocations, satelliteAmount } = usePlan(); // Use context hook

  // Generate dynamic core card data with calculated amounts in titles
  const coreCardsDataWithAmounts = baseCoreCardsData.map((card, index) => {
    const allocation = coreAllocations[index]; // Assumes order matches
    const amount = coreAmount > 0 && allocation ? (allocation.value / 100 * coreAmount).toFixed(0) : 0;
    return {
      ...card,
      title: `${card.baseTitle} (€${amount})`
    };
  });

  const totalInvestment = coreAmount + satelliteAmount;

  return (
    <section id="implementation" className="mb-16 scroll-mt-16" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">
        Practical Implementation Guide
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Example ETFs and stocks for setting up your monthly investment plan (€{totalInvestment} total).
      </p>

      <div className="space-y-8">
        {/* Core Portfolio ETFs */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-400">Core Portfolio (€{coreAmount}/month - ETFs)</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCardsDataWithAmounts.map((card, index) => (
              <ImplementationCard
                key={card.id}
                ref={(el) => registerCardRef(index, el)}
                cardData={card}
                isHighlighted={index === highlightedCoreIndex}
                rationale={index === highlightedCoreIndex ? highlightedRationale : null}
              />
            ))}
          </div>
        </div>

        {/* Optional Additions */}
        <div>
          <h3 className="text-xl font-semibold mb-4 mt-6 text-indigo-700 dark:text-indigo-400">Optional Additions (within total €{totalInvestment} plan)</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {optionalCardsData.map((card) => (
               <ImplementationCard
                 key={card.id}
                 cardData={card}
                 isHighlighted={false} // Optional cards are never highlighted by core chart
               />
             ))}
          </div>
           <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Note: The core €{coreAmount} is allocated to the {coreCardsDataWithAmounts.length} ETFs above. The optional €{satelliteAmount} can be allocated to Bonds/Stocks instead of or alongside the China satellite, depending on preference.</p>
        </div>

        {/* China Satellite */}
        <div id="impl-china">
          <h3 className="text-xl font-semibold mb-4 text-rose-700 dark:text-rose-400">China Satellite (€{satelliteAmount}/month)</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {chinaCardsData.map((card) => (
               <ImplementationCard
                 key={card.id}
                 cardData={card}
                 isHighlighted={false} // China cards are not highlighted by core chart
                 // TODO: Update amounts in China card titles if satelliteAmount changes?
               />
             ))}
          </div>
        </div>
      </div>

      {/* Choosing Broker Info Box */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg" data-aos="fade-up">
        <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-300 mb-3 flex items-center">
          <Info size={18} className="mr-2" /> Choosing Your Broker
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">Selecting the right broker is crucial for efficient implementation. Key factors for German investors include:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-400 pl-4">
          <li><strong>Low-cost Sparpläne:</strong> Availability and fees for automated ETF/Stock savings plans.</li>
          <li><strong>Asset Availability:</strong> Ensure the broker offers the specific ETFs and stocks you plan to invest in.</li>
          <li><strong>User Interface:</strong> Ease of use of the web platform and mobile app.</li>
          <li><strong>Security:</strong> Features like two-factor authentication (2FA) and deposit protection schemes.</li>
          <li><strong>Tax Reporting:</strong> Simplified tax handling, ideally with automatic generation of the German tax certificate (<em>Steuerbescheinigung</em>).</li>
        </ul>
        <p className="text-xs text-blue-600 dark:text-blue-500 mt-3">Popular brokers in Germany include names like Scalable Capital, Trade Republic, ING, Consorsbank, and others. Compare their current conditions and features.</p>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-6" data-aos="fade-up">Use a broker offering Sparpläne (savings plans) for automated monthly investments, often available for ETFs and major stocks (e.g., Scalable Capital, Trade Republic in Germany).</p>
    </section>
  );
}

// Update propTypes definition
ImplementationSection.propTypes = {
  highlightedCoreIndex: PropTypes.number, // Can be null
  highlightedRationale: PropTypes.string, // Can be null
  registerCardRef: PropTypes.func.isRequired, // Add prop type for the callback
};

export default ImplementationSection; 