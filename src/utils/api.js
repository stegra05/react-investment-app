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
 * 
 * @param {string} symbol The stock/ETF symbol compatible with Alpha Vantage (e.g., 'SWDA.LON').
 * @returns {Promise<object>} A promise that resolves to an object containing the quote data 
 *                           (e.g., { data: { ... Alpha Vantage quote ... } }) or an error 
 *                           (e.g., { error: 'API Key Missing' }).
 */
export async function fetchMarketData(symbol) {
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY; // Use Alpha Vantage key

  if (!apiKey) {
    console.error('Alpha Vantage API key is missing. Please set VITE_ALPHA_VANTAGE_API_KEY in your .env file.');
    return { error: 'API Key Missing' }; 
  }

  // Alpha Vantage GLOBAL_QUOTE endpoint
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  console.log(`Fetching fresh data for ${symbol} from Alpha Vantage`); // Log fetch attempt

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Throw an error with status text, which might contain useful info from Alpha Vantage
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
        throw new Error('API returned a note but no quote data.'); 
      }
    }

    // Check if 'Global Quote' data is present and not empty
    if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
      return { data: data['Global Quote'] }; // Return the 'Global Quote' object
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

    return { error: displayError }; // Return sanitized error message
  }
} 