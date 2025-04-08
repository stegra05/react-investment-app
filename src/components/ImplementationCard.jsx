import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ExternalLink, Globe, Euro, LineChart, Landmark, HandCoins, Rocket, Combine, TrendingUp, TrendingDown, AlertTriangle, Loader2, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfoTooltip from './InfoTooltip';
import { fetchMarketData, ISIN_TO_SYMBOL_MAP } from '../utils/api';

// Map icon names (or types) to actual Lucide components
const iconMap = {
  globe: Globe,
  euro: Euro,
  linechart: LineChart,
  landmark: Landmark,
  handcoins: HandCoins,
  rocket: Rocket,
  combine: Combine,
};

/**
 * Renders a single implementation card, potentially fetching market data
 * for ISINs defined in ISIN_TO_SYMBOL_MAP.
 * @param {{ cardData: object, isHighlighted: boolean, rationale: string | null }} props
 */
const ImplementationCard = forwardRef(({ cardData, isHighlighted, rationale }, ref) => {
  const { id, title, icon, iconColor = 'indigo', link, description, isin, ter, why, delay, isOptional, isSuggested } = cardData;

  const IconComponent = iconMap[icon] || Globe; // Default to Globe if icon not found
  const titleColor = iconColor === 'rose' ? 'text-rose-700 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-500';
  const linkHoverColor = iconColor === 'rose' ? 'hover:text-rose-600 dark:hover:text-rose-400' : 'hover:text-indigo-600 dark:hover:text-indigo-400';

  // State for market data
  const [marketData, setMarketData] = useState({ data: null, loading: false, error: null, source: null });

  // Check if the current card's ISIN should fetch market data
  const shouldFetchData = isin && ISIN_TO_SYMBOL_MAP[isin];
  const apiSymbol = shouldFetchData ? ISIN_TO_SYMBOL_MAP[isin] : null;

  // Function to fetch data (memoized)
  const fetchData = useCallback(async (force = false) => {
      if (shouldFetchData && apiSymbol) {
          setMarketData(prev => ({ ...prev, loading: true, error: null })); // Keep existing data while loading fresh? Or clear? Let's clear for simplicity.
          // setMarketData({ data: null, loading: true, error: null, source: null });
          try {
              const result = await fetchMarketData(apiSymbol, force);
              if (result.error) {
                  setMarketData({ data: null, loading: false, error: result.error, source: result.source || 'api' });
              } else {
                  setMarketData({ data: result.data, loading: false, error: null, source: result.source || 'api' });
              }
          } catch (err) { // Catch unexpected errors during the fetch process itself
              console.error("Unexpected error calling fetchMarketData:", err);
              setMarketData({ data: null, loading: false, error: 'Fetch Error', source: 'api' });
          }
      }
  }, [shouldFetchData, apiSymbol]); // Dependencies for useCallback

  useEffect(() => {
      fetchData(); // Initial fetch (will use cache if available)
  }, [fetchData]); // Re-run if fetchData function changes (symbol changes)

  // Handler for the refresh button
  const handleRefresh = (e) => {
      e.stopPropagation(); // Prevent card interactions if any
      e.preventDefault();
      console.log(`Force refreshing data for ${apiSymbol}`);
      fetchData(true); // Call fetchData with forceRefresh = true
  };

  // Function to render specific error messages
  const renderErrorMessage = (error) => {
    if (!error) return 'Market data unavailable'; // Default
    if (error.includes('API Rate Limit')) return 'Market data unavailable (Rate limit likely reached)';
    if (error.includes('API Key')) return 'Market data unavailable (Check API Key)';
    if (error.includes('No Quote Data Found')) return 'Market data unavailable (No quote data found)';
    return `Market data unavailable (${error})`; // Generic fallback
  };

  // Base classes
  let cardClasses = "implementation-card bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[180px]";

  // Add highlight class if needed
  if (isHighlighted) {
    cardClasses += " highlight-card";
  }

  // Add opacity for optional cards
  if (isOptional) {
     cardClasses += " opacity-75 dark:opacity-60";
  }

  // Add special border for suggested China approach
  if (isSuggested) {
    cardClasses += " border-2 border-rose-300 dark:border-rose-500";
  }

  return (
    <div id={id} className={cardClasses} data-aos="fade-up" data-aos-delay={delay || 0} ref={ref}>
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className={`font-semibold text-gray-800 dark:text-gray-200 flex items-center ${isSuggested ? 'text-rose-800 dark:text-rose-200' : ''}`}>
            <IconComponent size={18} className={`${titleColor} mr-2 flex-shrink-0`} />
            {title}
          </h4>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" title={`Open ${description || title} on external site`} className={`text-gray-400 dark:text-gray-500 ${linkHoverColor}`}>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{description}</p>}
        {isin && <p className="text-xs text-gray-500 dark:text-gray-400">
          <InfoTooltip term="ISIN" definition="International Securities Identification Number: A unique code identifying a specific security." />: {isin}
        </p>}
        {ter && <p className="text-xs text-gray-500 dark:text-gray-400">
          <InfoTooltip term="TER" definition="Total Expense Ratio: Annual cost of managing and operating an investment fund (like an ETF), expressed as a percentage of the fund's assets." />: {ter}
        </p>}

        {/* Market Data Display - only for applicable ETFs */}
        {shouldFetchData && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 border-t border-gray-100 dark:border-gray-700 pt-1">
                <div className="flex items-center justify-between"> {/* Flex container for status and button */}
                    {marketData.loading && (
                        <span className="flex items-center text-gray-400 animate-pulse">
                            <Loader2 size={12} className="mr-1 animate-spin" /> Loading market data...
                        </span>
                    )}
                    {marketData.error && !marketData.loading && ( // Don't show error while loading new data
                        <span className="flex items-center text-red-500 dark:text-red-400" title={marketData.error}>
                            <AlertTriangle size={12} className="mr-1 flex-shrink-0" />
                            {renderErrorMessage(marketData.error)}
                        </span>
                    )}
                    {marketData.data && !marketData.loading && marketData.data['10. change percent'] !== undefined && ( // Don't show stale data while loading new
                        <span className={`flex items-center ${parseFloat(marketData.data['10. change percent']) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {parseFloat(marketData.data['10. change percent']) >= 0 ?
                               <TrendingUp size={12} className="mr-1" /> :
                               <TrendingDown size={12} className="mr-1" />
                            }
                            Daily Change: {marketData.data['10. change percent']}
                        </span>
                    )}
                    {/* Placeholder to maintain layout when no data/error/loading */}
                    {!marketData.loading && !marketData.error && !marketData.data && (
                       <span className="flex items-center text-gray-400">
                           {/* Maybe indicate waiting or N/A? Keep minimal for now. */}
                           {/* Market data status pending... */}
                       </span>
                    )}

                    {/* Refresh Button - Show only when not loading */}
                    {!marketData.loading && (
                        <button
                            onClick={handleRefresh}
                            title="Refresh market data (ignores cache)"
                            className="ml-2 p-0.5 rounded text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                            aria-label="Refresh market data"
                            disabled={marketData.loading} // Disable while loading
                        >
                            <RotateCw size={12} />
                        </button>
                    )}
                     {/* Show loading indicator next to button if loading */}
                     {marketData.loading && (
                         <Loader2 size={12} className="ml-2 text-gray-400 animate-spin" />
                     )}
                </div>

                {/* Data Source/Timestamp (Optional improvement) */}
                 {marketData.data && (
                    <span className="block text-gray-400 dark:text-gray-500 text-[10px] leading-tight mt-0.5">
                         (Data from {marketData.source === 'cache' ? 'cache' : 'Alpha Vantage'}, may be delayed)
                     </span>
                 )}
                  {marketData.error && marketData.source === 'cache' && ( // Indicate if error is cached
                      <span className="block text-gray-400 dark:text-gray-500 text-[10px] leading-tight mt-0.5">
                          (Cached error state from today)
                      </span>
                  )}
            </div>
        )}

        {/* Animated rationale display */}
        <AnimatePresence initial={false}>
          {isHighlighted && rationale && (
            <motion.p
              key="rationale-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-sm text-indigo-700 dark:text-indigo-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <strong>Rationale:</strong> {rationale}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {why && !isHighlighted && <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{`Why: ${why}`}</p>}
    </div>
  );
});

// Add propTypes definition
ImplementationCard.propTypes = {
  cardData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired, // Title is now dynamically generated
    baseTitle: PropTypes.string, // Base title might still exist in ImplementationSection
    icon: PropTypes.string.isRequired,
    iconColor: PropTypes.string,
    link: PropTypes.string, // Can be null
    description: PropTypes.string,
    isin: PropTypes.string,
    ter: PropTypes.string,
    why: PropTypes.string,
    delay: PropTypes.number,
    isOptional: PropTypes.bool,
    isSuggested: PropTypes.bool,
  }).isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  rationale: PropTypes.string, // Can be null
};

ImplementationCard.displayName = 'ImplementationCard'; // Add display name for DevTools

export default ImplementationCard; 