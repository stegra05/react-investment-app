/**
 * Mapping of ISINs to their corresponding Alpha Vantage API ticker symbols.
 */
export const ISIN_TO_SYMBOL_MAP = {
  'IE00B4L5Y983': 'SWDA.LON', // iShares Core MSCI World UCITS ETF (Acc)
  'DE0002635307': 'EXSA.DEX', // iShares STOXX Europe 600 UCITS ETF (Acc) (XETRA)
  'IE00BKM4GZ66': 'EMIM.LON', // iShares Core MSCI EM IMI UCITS ETF (Acc)
  // We are keeping this limited to 3 for now due to AlphaVantage free tier limits (25/day)
  // 'IE00BDBRDM35': 'AGGH.DEX', 
  // 'LU0514695690': 'XCS6.DE', 
};


/**
 * Fetches the latest global quote data for a given symbol from Alpha Vantage.
 * Handles API key retrieval from environment variables.
 * Implements client-side caching using localStorage to avoid excessive API calls.
 *
 * @param {string} symbol The stock/ETF symbol compatible with Alpha Vantage (e.g., 'SWDA.LON').
 * @param {boolean} [forceRefresh=false] If true, bypasses the cache and fetches fresh data.
 * @returns {Promise<object>} A promise that resolves to an object containing the quote data
 *                           (e.g., { data: { ... Alpha Vantage quote ... } }) or an error
 *                           (e.g., { error: 'API Key Missing', source?: 'cache' | 'api' }).
 */
export async function fetchMarketData(symbol, forceRefresh = false) {
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

  // --- Caching Logic ---
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const cacheKey = `marketData_${symbol}_${today}`;

  if (!forceRefresh) {
    try {
      const cachedDataString = localStorage.getItem(cacheKey);
      if (cachedDataString) {
        console.log(`Using cached data for ${symbol} from ${today}`);
        const cachedData = JSON.parse(cachedDataString);
        // Ensure the cached structure is valid (has data or error)
        if (cachedData.data || cachedData.error) {
           // Add source indicator for clarity, especially for cached errors
           return { ...cachedData, source: 'cache' };
        } else {
          console.warn(`Invalid cached data structure for ${symbol}, removing.`);
          localStorage.removeItem(cacheKey); // Remove invalid cache entry
        }
      }
    } catch (error) {
      console.error(`Error reading or parsing cache for ${symbol}:`, error);
      // Optionally remove potentially corrupted cache entry
      localStorage.removeItem(cacheKey);
    }
  }
  // --- End Caching Logic ---

  if (!apiKey) {
    console.error('Alpha Vantage API key is missing. Please set VITE_ALPHA_VANTAGE_API_KEY in your .env file.');
    // Cache the API key error as well, associated with the symbol for today
    const errorResult = { error: 'API Key Missing', source: 'api' };
    try {
        localStorage.setItem(cacheKey, JSON.stringify(errorResult));
    } catch (cacheError) {
        console.error('Failed to cache API key error:', cacheError);
    }
    return errorResult;
  }

  // Alpha Vantage GLOBAL_QUOTE endpoint
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  console.log(`Fetching fresh data for ${symbol} from Alpha Vantage`); // Log fetch attempt

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check for API error messages within the JSON response
    if (data['Error Message']) {
      throw new Error(`API Error: ${data['Error Message']}`);
    }
    // Check for rate limiting note - treat as error for UI
     if (data['Note']) {
      console.warn('Alpha Vantage API Note:', data['Note']);
      if (data['Note'].includes('call frequency')) {
         throw new Error('API rate limit likely exceeded.');
      }
      // If the note isn't about rate limits but data is missing, could be an issue
      if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
        // Allow caching this "note" state, might be temporary issue
         console.warn('API returned a note but no quote data for symbol:', symbol);
         // Let it proceed to the check below, which will throw 'No quote data found'
      }
    }

    // Check if 'Global Quote' data is present and not empty
    if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
       const result = { data: data['Global Quote'], source: 'api' };
       try {
         localStorage.setItem(cacheKey, JSON.stringify(result)); // Cache successful result
       } catch (cacheError) {
         console.error(`Failed to cache data for ${symbol}:`, cacheError);
       }
       return result; // Return the 'Global Quote' object
    } else {
      // Handle cases where the symbol might be valid but returns no data or unexpected format
      console.warn('No detailed quote data returned for symbol:', symbol, 'Response:', data);
      throw new Error('No quote data found for symbol.');
    }

  } catch (error) {
    console.error('Failed to fetch market data from Alpha Vantage:', error);
    let displayError = error.message || 'Fetch Error';
     if (displayError.includes("API key")) displayError = "Invalid or Missing API Key";
     if (displayError.includes("limit")) displayError = "API Rate Limit Reached";
     if (displayError.includes("quote data found")) displayError = "No Quote Data Found"; // Sanitize this specific error

    const errorResult = { error: displayError, source: 'api' };
     try {
       // Cache the error result too, to prevent repeated failed calls within the day
       localStorage.setItem(cacheKey, JSON.stringify(errorResult));
     } catch (cacheError) {
       console.error(`Failed to cache error for ${symbol}:`, cacheError);
     }
    return errorResult; // Return sanitized error message
  }
} 