import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

/**
 * Generates chart options based on theme.
 * @param {boolean} isDark
 * @param {function} onDataPointSelection - Callback for slice click
 * @returns {object} ApexCharts options object
 */
const getCoreAllocationOptions = (isDark, onDataPointSelection) => {
  const colors = {
    coreDonut: isDark ? ['#818cf8', '#a5b4fc', '#c7d2fe'] : ['#4f46e5', '#6366f1', '#818cf8'], // Indigo variants
    textColor: isDark ? '#d1d5db' : '#374151', // gray-300 / gray-700
    secondaryTextColor: isDark ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
    tooltipBg: isDark ? '#1f2937' : '#ffffff', // gray-800 / white
    strokeColor: isDark ? '#1f2937' : '#ffffff' // gray-800 / white for donut borders
  };

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
    labels: ['Global Developed ETF (€300)', 'Europe ETF (€100)', 'Emerging Markets ETF (€100)'],
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
                const label = opts.w.globals.labels[opts.seriesIndex];
                const amountMatch = label.match(/€(\d+)/);
                return amountMatch ? `€${amountMatch[1]}` : '';
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Core ETF Monthly',
              fontSize: '14px',
              fontWeight: 'normal',
              color: colors.secondaryTextColor,
              formatter: () => '€500 / month'
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
          const amount = (value / 100 * 500).toFixed(0);
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
 * @param {{isDarkMode: boolean, onSliceSelect: function}} props
 */
function CoreAllocationChart({ isDarkMode, onSliceSelect }) {
  const series = [60, 20, 20]; // Static data for core allocation
  const [options, setOptions] = useState(getCoreAllocationOptions(isDarkMode, onSliceSelect));

  useEffect(() => {
    // Update options only when theme or callback changes
    setOptions(getCoreAllocationOptions(isDarkMode, onSliceSelect));
  }, [isDarkMode, onSliceSelect]);

  return (
    <div id="coreAllocationChartContainer">
      <Chart
        options={options}
        series={series}
        type="donut"
        height={350}
      />
    </div>
  );
}

export default CoreAllocationChart; 