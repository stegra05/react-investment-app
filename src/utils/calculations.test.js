import { describe, it, expect, beforeEach } from 'vitest';
import { 
    calculateGrowth, 
    calculateRequiredMonthly, 
    prepareProjectionSeries, 
    calculateVorabpauschaleEstimate 
} from './calculations';

// Mock Date.now() for consistent results if needed
// vi.spyOn(Date, 'now').mockImplementation(() => new Date('2024-01-01T00:00:00.000Z').valueOf());

describe('calculateGrowth', () => {
    const currentYear = new Date().getFullYear();

    it('should return initial balance for 0 years', () => {
        const result = calculateGrowth(1000, 100, 0, 0.05);
        expect(result).toEqual([{ x: currentYear, y: 1000 }]);
    });

    it('should calculate growth correctly for 1 year', () => {
        const initial = 0;
        const monthly = 100;
        const years = 1;
        const rate = 0.06; // 6% annual
        const result = calculateGrowth(initial, monthly, years, rate);
        
        expect(result).toHaveLength(2); // Initial + 1 year
        expect(result[0]).toEqual({ x: currentYear, y: 0 });
        // Calculation: ((0*(1+0.005)^12) + 100 * (((1+0.005)^12 - 1) / 0.005)) approx 1233.56
        expect(result[1].x).toBe(currentYear + 1);
        expect(result[1].y).toBeCloseTo(1234, 0); // Rounding to nearest integer
    });

    it('should handle 0% rate', () => {
        const result = calculateGrowth(500, 50, 2, 0);
        expect(result).toHaveLength(3);
        expect(result[0].y).toBe(500);
        expect(result[1].y).toBe(500 + 50 * 12); // 1100
        expect(result[2].y).toBe(1100 + 50 * 12); // 1700
    });
});

describe('calculateRequiredMonthly', () => {
    it('should return null for invalid inputs', () => {
        expect(calculateRequiredMonthly(0, 10, 5)).toBeNull();
        expect(calculateRequiredMonthly(100000, 0, 5)).toBeNull();
    });

    it('should calculate correctly for 0% rate', () => {
        expect(calculateRequiredMonthly(12000, 10, 0)).toBeCloseTo(100); // 12000 / (10*12)
    });

    it('should calculate correctly for positive rate', () => {
        const target = 100000;
        const years = 15;
        const rate = 6;
        // Using online calculator: FV=100000, N=180, I/Y=6% -> PMT ~ 344.85
        expect(calculateRequiredMonthly(target, years, rate)).toBeCloseTo(344.85, 2);
    });
});

describe('prepareProjectionSeries', () => {
    it('should return empty data arrays if no nominal data', () => {
        const result = prepareProjectionSeries([], 0.02);
        expect(result).toHaveLength(2);
        expect(result[0].data).toEqual([]);
        expect(result[1].data).toEqual([]);
    });

    it('should return nominal and real series', () => {
        const nominalData = [{ x: 2024, y: 1000 }, { x: 2025, y: 2000 }];
        const inflation = 0.02;
        const result = prepareProjectionSeries(nominalData, inflation);

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Nominal Growth');
        expect(result[0].data).toEqual(nominalData);
        expect(result[0].type).toBe('area');

        expect(result[1].name).toBe('Real Growth (Inflation Adj.)');
        expect(result[1].type).toBe('line');
        expect(result[1].data).toHaveLength(2);
        expect(result[1].data[0].x).toBe(2024);
        expect(result[1].data[0].y).toBe(1000); // Year 0, no adjustment
        expect(result[1].data[1].x).toBe(2025);
        expect(result[1].data[1].y).toBeCloseTo(2000 / 1.02); // 1 year inflation adj
    });
});

describe('calculateVorabpauschaleEstimate', () => {
    const baseParams = {
        portfolioValue: 20000,
        fundGainPercent: 8,
        basiszinsPercent: 2.29,
        unusedAllowance: 0,
    };

    it('should calculate estimate with positive gain and no allowance used', () => {
        const result = calculateVorabpauschaleEstimate(baseParams);

        // Basisertrag: 20000 * 0.0229 * 0.7 = 320.6
        // Actual Gain: 20000 * 0.08 = 1600
        // Capped Basisertrag: min(320.6, 1600) = 320.6
        expect(result.basisertrag).toBeCloseTo(320.6, 2);
        
        // Vorabpauschale: 320.6 * 0.7 (Teilfreistellung) = 224.42
        expect(result.vorabpauschale).toBeCloseTo(224.42, 2);

        // Taxable: max(0, 224.42 - 0) = 224.42
        // Tax: 224.42 * 0.26375 = 59.189...
        expect(result.estimatedTax).toBeCloseTo(59.19, 2);
    });

    it('should cap Basisertrag at actual fund gain if lower', () => {
        const params = { ...baseParams, fundGainPercent: 1 }; // 1% gain = €200
        const result = calculateVorabpauschaleEstimate(params);

        // Basisertrag (uncapped): 320.6
        // Actual Gain: 200
        // Capped Basisertrag: min(320.6, 200) = 200
        expect(result.basisertrag).toBeCloseTo(200, 2);

        // Vorabpauschale: 200 * 0.7 = 140
        expect(result.vorabpauschale).toBeCloseTo(140, 2);

        // Tax: 140 * 0.26375 = 36.925
        expect(result.estimatedTax).toBeCloseTo(36.93, 2);
    });

    it('should result in zero tax if fund gain is negative', () => {
        const params = { ...baseParams, fundGainPercent: -5 };
        const result = calculateVorabpauschaleEstimate(params);

        // Actual Gain: -1000
        // Capped Basisertrag: min(320.6, -1000) -> max(0, -1000) = 0
        expect(result.basisertrag).toBe(0);
        expect(result.vorabpauschale).toBe(0);
        expect(result.estimatedTax).toBe(0);
    });

    it('should reduce tax based on unused allowance', () => {
        const params = { ...baseParams, unusedAllowance: 100 };
        const result = calculateVorabpauschaleEstimate(params);
        
        // Vorabpauschale: 224.42 (from first test)
        expect(result.vorabpauschale).toBeCloseTo(224.42, 2);

        // Taxable: max(0, 224.42 - 100) = 124.42
        // Tax: 124.42 * 0.26375 = 32.815...
        expect(result.estimatedTax).toBeCloseTo(32.82, 2);
    });

    it('should result in zero tax if allowance covers Vorabpauschale', () => {
        const params = { ...baseParams, unusedAllowance: 500 };
        const result = calculateVorabpauschaleEstimate(params);
        
        // Vorabpauschale: 224.42
        expect(result.vorabpauschale).toBeCloseTo(224.42, 2);

        // Taxable: max(0, 224.42 - 500) = 0
        expect(result.estimatedTax).toBe(0);
    });
}); 