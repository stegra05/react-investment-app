/**
 * Calculates the projected growth data, incorporating events.
 * @param {number} initial - Initial balance (usually 0)
 * @param {number} monthly - Default monthly investment amount
 * @param {number} years - Investment duration in years
 * @param {number} rate - Assumed annual rate of return (e.g., 0.07 for 7%)
 * @param {Array<object>} [events=[]] - Array of event objects {id, type, year, amount?, endYear?}
 * @returns {Array<{x: number, y: number}>} - Array of data points for the chart
 */
export const calculateGrowth = (initial, monthly, years, rate, events = []) => {
  let balance = initial;
  const monthlyRate = rate / 12;
  const currentFullYear = new Date().getFullYear();
  const data = [{ x: currentFullYear, y: Math.round(balance) }]; // Start with initial balance at current year
  let currentYear = currentFullYear;

  // Pre-process events for quick lookup
  const pauseEvents = events.filter(e => e.type === 'pause');
  const lumpSumEvents = events.filter(e => e.type === 'lumpSum');

  for (let year = 1; year <= years; year++) {
    currentYear++;
    let currentMonthly = monthly;

    // Check for pause event covering this year
    const isPaused = pauseEvents.some(e => currentYear >= e.year && currentYear <= e.endYear);
    if (isPaused) {
      currentMonthly = 0;
    }

    // Monthly compounding loop
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + monthlyRate) + currentMonthly;
    }

    // Check for lump sum events happening *at the end* of this year
    lumpSumEvents.forEach(e => {
        if (e.year === currentYear) {
            balance += e.amount;
        }
    });

    data.push({ x: currentYear, y: Math.round(balance) });
  }
  return data;
};

/**
 * Calculates the required monthly investment to reach a target future value.
 * Formula: PMT = FV * (r / ((1 + r)^n - 1))
 * @param {number} targetValue - The desired future value (FV)
 * @param {number} years - Investment duration in years
 * @param {number} annualRatePercent - Assumed annual rate of return (e.g., 7 for 7%)
 * @returns {number | null} - Required monthly investment, or null if calculation is not possible.
 */
export const calculateRequiredMonthly = (targetValue, years, annualRatePercent) => {
  if (targetValue <= 0 || years <= 0) return null;
  
  const monthlyRate = annualRatePercent / 100 / 12;
  const numMonths = years * 12;

  // Handle 0% rate separately to avoid division by zero
  if (monthlyRate === 0) {
    return targetValue / numMonths;
  }

  const factor = Math.pow(1 + monthlyRate, numMonths);
  if (factor === 1) return null; // Avoid division by zero if rate is extremely small

  const requiredMonthly = targetValue * (monthlyRate / (factor - 1));

  return requiredMonthly > 0 ? requiredMonthly : null;
};

/**
 * Takes nominal growth data and calculates the inflation-adjusted (real) growth data.
 * Returns an array of series objects for the chart.
 * @param {Array<{x: number, y: number}>} nominalData - Nominal growth data from calculateGrowth.
 * @param {number} inflationDecimal - Annual inflation rate (e.g., 0.02 for 2%).
 * @returns {Array<object>} - Array containing nominal and real growth series.
 */
export const prepareProjectionSeries = (nominalData, inflationDecimal) => {
  if (!nominalData || nominalData.length === 0) {
    return [
        { name: 'Nominal Growth', data: [], type: 'area' },
        { name: 'Real Growth (Inflation Adj.)', data: [], type: 'line' }
    ];
  }

  const startYear = nominalData[0].x;
  const realData = nominalData.map(point => {
    const yearsElapsed = point.x - startYear;
    // Adjust value: Real = Nominal / (1 + Inflation)^Years
    const adjustedValue = yearsElapsed === 0 ? point.y : point.y / Math.pow(1 + inflationDecimal, yearsElapsed);
    return { x: point.x, y: Math.round(adjustedValue) };
  });

  return [
    {
      name: 'Nominal Growth',
      data: nominalData,
      type: 'area'
    },
    {
      name: 'Real Growth (Inflation Adj.)',
      data: realData,
      type: 'line'
    }
  ];
};


/**
 * Calculates values for the Vorabpauschale estimator.
 * @param {object} params
 * @param {number} params.portfolioValue
 * @param {number} params.fundGainPercent
 * @param {number} params.basiszinsPercent
 * @param {number} params.unusedAllowance
 * @returns {{basisertrag: number, teilfreistellungAmount: number, vorabpauschale: number, taxableVorabpauschaleBeforeAllowance: number, estimatedTax: number}}
 */
export const calculateVorabpauschaleEstimate = ({ 
    portfolioValue, 
    fundGainPercent, 
    basiszinsPercent, 
    unusedAllowance 
}) => {
    const basiszinsDecimal = basiszinsPercent / 100;
    const fundGainDecimal = fundGainPercent / 100;

    const calculatedBasisertragFull = portfolioValue * basiszinsDecimal * 0.7; // 70% factor for Basisertrag
    const actualFundGainValue = portfolioValue * fundGainDecimal;
    
    // Basisertrag is capped by the actual fund gain
    const calculatedBasisertrag = Math.max(0, Math.min(calculatedBasisertragFull, actualFundGainValue));
    
    // Calculate Teilfreistellung amount (30% of Basisertrag for equity)
    const teilfreistellungAmount = calculatedBasisertrag * 0.3;
    
    // Vorabpauschale is Basisertrag minus Teilfreistellung
    // const calculatedVorabpauschale_old = calculatedBasisertrag * 0.7;
    const taxableVorabpauschaleBeforeAllowance = calculatedBasisertrag - teilfreistellungAmount;
    
    // Apply unused allowance before calculating tax
    const taxableVorabpauschaleAfterAllowance = Math.max(0, taxableVorabpauschaleBeforeAllowance - unusedAllowance);
    
    // Tax is ~26.375% of the potentially taxable Vorabpauschale (after allowance)
    const calculatedTax = taxableVorabpauschaleAfterAllowance * 0.26375;

    return {
        basisertrag: calculatedBasisertrag,               // Basisertrag (capped)
        teilfreistellungAmount: teilfreistellungAmount,   // The 30% reduction amount
        vorabpauschale: taxableVorabpauschaleBeforeAllowance, // Renamed for clarity in UI context
        taxableVorabpauschaleBeforeAllowance: taxableVorabpauschaleBeforeAllowance, // Explicitly named for UI
        estimatedTax: calculatedTax,                     // Final tax after allowance
    };
}; 