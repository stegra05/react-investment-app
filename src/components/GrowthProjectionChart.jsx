import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

/**
 * Calculates the projected growth data.
 * @param {number} initial - Initial balance (usually 0)
 * @param {number} monthly - Monthly investment amount
 * @param {number} years - Investment duration in years
 * @param {number} rate - Assumed annual rate of return (e.g., 0.07 for 7%)
 * @returns {Array<{x: number, y: number}>} - Array of data points for the chart
 */
const calculateGrowth = (initial, monthly, years, rate) => {
  let balance = initial;
  const monthlyRate = rate / 12;
  const data = [{ x: new Date().getFullYear(), y: Math.round(balance) }]; // Start with initial balance at current year
  let currentYear = new Date().getFullYear();

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }
    currentYear++;
    data.push({ x: currentYear, y: Math.round(balance) });
  }
  return data;
};

/**
 * Generates chart options based on theme and data.
 * @param {boolean} isDark
 * @param {Array<{x: number, y: number}>} growthData - The calculated data series
 * @returns {object} ApexCharts options object
 */
const getGrowthChartOptions = (isDark, growthData) => {
  const colors = {
    growthArea: isDark ? ['#a78bfa'] : ['#8b5cf6'], // Violet variants
    textColor: isDark ? '#d1d5db' : '#374151', // gray-300 / gray-700
    secondaryTextColor: isDark ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
    gridColor: isDark ? '#4b5563' : '#e5e7eb', // gray-600 / gray-200
    tooltipBg: isDark ? '#1f2937' : '#ffffff', // gray-800 / white
  };

  return {
    chart: {
      type: 'area',
      height: 350,
      fontFamily: 'Inter, sans-serif',
      zoom: { enabled: false },
      toolbar: { show: false },
      background: 'transparent'
    },
    series: [{ name: 'Projected Value', data: growthData }],
    colors: colors.growthArea,
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: isDark ? 0.1 : 0.3, stops: [0, 90, 100] }
    },
    xaxis: {
      type: 'numeric',
      title: { text: 'Year', style: { color: colors.secondaryTextColor, fontSize: '12px', fontWeight: 400, } },
      labels: { formatter: (value) => Math.round(value), style: { colors: colors.secondaryTextColor } },
      axisBorder: { show: true, color: colors.gridColor },
      axisTicks: { show: true, color: colors.gridColor },
    },
    yaxis: {
      title: { text: 'Portfolio Value (€)', style: { color: colors.secondaryTextColor, fontSize: '12px', fontWeight: 400, } },
      labels: {
        formatter: (value) => "€" + value.toLocaleString('de-DE'),
        style: { colors: colors.secondaryTextColor }
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      x: { formatter: (value) => `End of Year: ${Math.round(value)}` },
      y: {
        formatter: (value) => "€" + value.toLocaleString('de-DE'),
        title: { formatter: (seriesName) => seriesName + ':' }
      }
    },
    grid: { borderColor: colors.gridColor, strokeDashArray: 4, padding: { left: 10, right: 10 } }
  };
};

/**
 * Renders the Growth Projection area chart.
 * @param {{monthlyInvestment: number, annualRate: number, years: number, isDarkMode: boolean}} props
 */
function GrowthProjectionChart({ monthlyInvestment, annualRate, years, isDarkMode }) {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Recalculate data when inputs change
    const rateDecimal = annualRate / 100;
    const newGrowthData = calculateGrowth(0, monthlyInvestment, years, rateDecimal);
    setChartData(newGrowthData);
  }, [monthlyInvestment, annualRate, years]);

  useEffect(() => {
    // Update options when data or theme changes
    setChartOptions(getGrowthChartOptions(isDarkMode, chartData));
  }, [isDarkMode, chartData]);

  return (
    <div id="growthChartContainer">
      {/* Use a key to force re-render if options object identity changes significantly, prevents stale chart issues */}
      <Chart
        key={isDarkMode ? 'dark' : 'light'} // Simple key based on theme
        options={chartOptions}
        series={chartOptions.series} // Pass series from options
        type="area"
        height={350}
      />
    </div>
  );
}

export default GrowthProjectionChart; 