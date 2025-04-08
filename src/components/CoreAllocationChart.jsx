import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { useTheme } from '../context/ThemeContext';
import { usePlan } from '../context/PlanContext';

/**
 * Generates chart options based on theme and dynamic data.
 * @param {boolean} isDark
 * @param {function} onDataPointSelection - Callback for slice click
 * @param {Array<{name: string, value: number}>} allocations - The core allocation data
 * @param {number} coreAmount - The total core investment amount
 * @returns {object} ApexCharts options object
 */
const getCoreAllocationOptions = (isDark, onDataPointSelection, allocations, coreAmount) => {
  const colors = {
    coreDonut: isDark ? ['#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#eef2ff'] : ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'], // Indigo variants (added more for flexibility)
    textColor: isDark ? '#d1d5db' : '#374151', // gray-300 / gray-700
    secondaryTextColor: isDark ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
    tooltipBg: isDark ? '#1f2937' : '#ffffff', // gray-800 / white
    strokeColor: isDark ? '#1f2937' : '#ffffff' // gray-800 / white for donut borders
  };

  const chartLabels = allocations.map(a => {
    const percentage = a.value;
    const amount = coreAmount > 0 ? (percentage / 100 * coreAmount).toFixed(0) : 0;
    return `${a.name} (€${amount})`;
  });

  return {
    chart: {
      type: 'donut',
      height: 350,
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      background: 'transparent',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (onDataPointSelection) {
            onDataPointSelection(config.dataPointIndex);
          }
        },
        // Optional: Deselect on mouse leave or click outside
        // mouseLeave: () => { if (onDataPointSelection) onDataPointSelection(null); }
      }
    },
    labels: chartLabels,
    colors: colors.coreDonut,
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
      style: { fontSize: '12px', colors: ['#ffffff'] },
      dropShadow: { enabled: true, top: 1, left: 1, blur: 1, opacity: 0.45 }
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: { colors: colors.textColor },
      markers: { width: 12, height: 12, radius: 12 },
      itemMargin: { horizontal: 5, vertical: 5 }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: { show: true, fontSize: '16px', fontWeight: 600, color: colors.textColor },
            value: {
              show: true,
              fontSize: '14px',
              color: colors.secondaryTextColor,
              formatter: function (val, opts) {
                const percentage = opts.w.globals.series[opts.seriesIndex];
                const amount = coreAmount > 0 ? (percentage / 100 * coreAmount).toFixed(0) : 0;
                return `€${amount}`;
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Core ETF Monthly',
              fontSize: '14px',
              fontWeight: 'normal',
              color: colors.secondaryTextColor,
              formatter: () => `€${coreAmount} / month`
            }
          }
        }
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (value) => {
          const amount = coreAmount > 0 ? (value / 100 * coreAmount).toFixed(0) : 0;
          return `€${amount} (${value.toFixed(0)}%)`;
        },
        title: { formatter: (seriesName) => seriesName.split(' (')[0].trim() + ':' }
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: [colors.strokeColor]
    },
    responsive: [{ breakpoint: 480, options: { chart: { height: 300 }, legend: { position: 'bottom' } } }]
  };
};

/**
 * Renders the Core Allocation donut chart.
 * Uses ThemeContext and PlanContext. Receives onSliceSelect prop from parent.
 */
function CoreAllocationChart({ onSliceSelect }) {
  const { isDarkMode } = useTheme();
  const { coreAmount, coreAllocations: allocations } = usePlan();

  const series = allocations.map(a => a.value);
  const [options, setOptions] = useState(getCoreAllocationOptions(isDarkMode, onSliceSelect, allocations, coreAmount));

  useEffect(() => {
    // Update options when theme, callback, allocations or coreAmount changes
    setOptions(getCoreAllocationOptions(isDarkMode, onSliceSelect, allocations, coreAmount));
  }, [isDarkMode, onSliceSelect, allocations, coreAmount]);

  // Create dynamic summary for aria-label
  const allocationSummary = allocations.map(a => {
      const amount = coreAmount > 0 ? (a.value / 100 * coreAmount).toFixed(0) : 0;
      return `${a.name} at ${a.value}% (€${amount})`;
  }).join(', ');
  const ariaLabel = `Donut chart showing core ETF allocation of €${coreAmount} per month: ${allocationSummary}. Click slices to highlight details.`;

  return (
    <div 
      id="coreAllocationChartContainer" 
      role="img" // Identify as graphical content
      aria-label={ariaLabel} // Provide text alternative
    >
      <Chart
        options={options}
        series={series}
        type="donut"
        height={350}
      />
    </div>
  );
}

CoreAllocationChart.propTypes = {
  onSliceSelect: PropTypes.func.isRequired,
};

export default CoreAllocationChart; 