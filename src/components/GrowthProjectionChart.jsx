import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

/**
 * Generates chart options based on theme.
 * @param {boolean} isDark
 * @param {Array} seriesData - The series data to determine types (area/line)
 * @param {object} [annotations] - Optional annotations configuration
 * @returns {object} ApexCharts options object
 */
const getGrowthChartOptions = (isDark, seriesData = [], annotations = {}) => {
  const colors = {
    // Define a broader palette for multiple lines + area
    palette: isDark
      ? ['#a78bfa', '#f472b6', '#67e8f9', '#a3e635', '#fde047', '#fdba74'] // Purple, Pink, Cyan, Lime, Yellow, Orange (Dark)
      : ['#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#facc15', '#fb923c'], // Purple, Pink, Cyan, Lime, Yellow, Orange (Light)
    textColor: isDark ? '#d1d5db' : '#374151', // gray-300 / gray-700
    secondaryTextColor: isDark ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
    gridColor: isDark ? '#4b5563' : '#e5e7eb', // gray-600 / gray-200
    tooltipBg: isDark ? '#1f2937' : '#ffffff', // gray-800 / white
  };

  return {
    chart: {
      type: 'line', // Set base type to line, individual series can override via seriesData[i].type
      height: 350,
      fontFamily: 'Inter, sans-serif',
      zoom: { enabled: false },
      toolbar: { show: false },
      background: 'transparent'
    },
    colors: colors.palette, // Use the full palette
    dataLabels: { enabled: false },
    stroke: { 
      curve: 'smooth', 
      width: seriesData.map(s => (s.name && s.name.startsWith('Saved #')) ? 1.5 : (s.type === 'area' ? 2 : 3)),
      dashArray: seriesData.map(s => (s.name && s.name.startsWith('Saved #')) ? 4 : 0)
    },
    fill: {
      type: seriesData.map(s => (s.name && s.name.startsWith('Saved #')) ? 'solid' : (s.type === 'area' ? 'gradient' : 'solid')),
      opacity: seriesData.map(s => (s.name && s.name.startsWith('Saved #')) ? 1 : (s.type === 'area' ? 1 : 0.85)),
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: isDark ? 0.1 : 0.3,
        stops: [0, 90, 100]
      }
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
        title: { 
          formatter: (seriesName) => seriesName ? seriesName + ':' : ''
        }
      },
      shared: true, // Tooltip shows all series for a given x-value
      intersect: false,
      marker: {
        show: true,
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      labels: { colors: colors.textColor },
      markers: { width: 12, height: 12, radius: 6 },
      itemMargin: { horizontal: 10, vertical: 5 },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      }
    },
    markers: {
      size: 0, // Hide markers by default
      hover: {
        sizeOffset: 4
      }
    },
    grid: { borderColor: colors.gridColor, strokeDashArray: 4, padding: { left: 10, right: 10 } },
    annotations: annotations // Add annotations here
  };
};

/**
 * Renders the Growth Projection area/line chart.
 * @param {{seriesData: Array, annotations: object}} props
 * Uses ThemeContext.
 */
function GrowthProjectionChart({ seriesData, annotations }) {
  const { isDarkMode } = useTheme(); // Use context hook
  const [chartOptions, setChartOptions] = useState(() => getGrowthChartOptions(isDarkMode, seriesData, annotations));

  useEffect(() => {
    // Update options when theme, series data structure, or annotations change
    setChartOptions(getGrowthChartOptions(isDarkMode, seriesData, annotations));
  }, [isDarkMode, seriesData, annotations]);

  // Create dynamic summary for aria-label
  let ariaLabel = "Growth projection chart.";
  if (seriesData && seriesData.length > 0) {
    const liveSeries = seriesData[0]; // Assume first is live data
    if (liveSeries && liveSeries.data && liveSeries.data.length > 0) {
      const finalDataPoint = liveSeries.data[liveSeries.data.length - 1];
      const finalYear = finalDataPoint.x;
      const finalValue = finalDataPoint.y;
      ariaLabel = `Growth projection chart based on current inputs, showing an estimated value of approximately €${finalValue.toLocaleString('de-DE')} after year ${finalYear}.`;
      if (seriesData.length > 1) {
        ariaLabel += ` ${seriesData.length - 1} saved comparison scenarios are also displayed.`;
      }
    }
  }

  return (
    <div 
      id="growthChartContainer"
      role="img" // Identify as graphical content
      aria-label={ariaLabel} // Provide text alternative
    >
      <Chart
        key={isDarkMode ? 'dark' : 'light'} // Re-render on theme change
        options={chartOptions}
        series={seriesData} // Pass seriesData prop directly
        type="line" // Base type is line, actual type determined by series data
        height={350}
      />
    </div>
  );
}

GrowthProjectionChart.propTypes = {
  seriesData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.any.isRequired, // Year (number) or Date
      y: PropTypes.number.isRequired,
    })).isRequired,
    type: PropTypes.oneOf(['line', 'area']).isRequired,
    // Might include 'inputs' for saved scenarios, but not strictly needed for rendering
  })).isRequired,
  annotations: PropTypes.object, // Annotations are optional
};

export default GrowthProjectionChart; 