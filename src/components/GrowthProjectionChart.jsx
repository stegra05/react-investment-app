import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

// Default calculation function (keep commented for now)
// const calculateProjection = (monthly, rate, years) => { ... };

/**
 * Renders the investment growth projection chart using ApexCharts.
 * Receives calculation parameters and theme preference as props.
 * Currently in a disabled state for debugging, rendering a placeholder.
 *
 * @param {object} props - Component props.
 * @param {number} [props.monthlyInvestment=600] - The monthly investment amount.
 * @param {number} [props.annualRate=7] - The annual growth rate (percentage).
 * @param {number} [props.years=20] - The number of years for the projection.
 * @param {boolean} props.isDarkMode - Indicates if dark mode is enabled.
 * @returns {JSX.Element} The chart component or a placeholder.
 */
// Pass input values and isDarkMode as props
function GrowthProjectionChart({ monthlyInvestment = 600, annualRate = 7, years = 20, isDarkMode }) {
    // Keep state commented out
    // const [chartData, setChartData] = useState([]);

    // Keep useEffect commented out
    // useEffect(() => {
    //     console.log("Recalculating chart...");
    //     const projectionData = calculateProjection(monthlyInvestment, annualRate, years);
    //     setChartData(projectionData);
    // }, [monthlyInvestment, annualRate, years]);

    // Keep options definitions commented out
    // const options = { ... };
    // const chartOptions = { ... };
    // const series = [{ ... }];

    console.log("Rendering GrowthProjectionChart (Disabled)"); // Add a log

    return (
        <div id="growthChart">
            {/* Render placeholder instead of chart */}
            <p style={{ textAlign: 'center', padding: '2rem', color: isDarkMode ? 'white' : 'black' }}>
                [Growth Projection Chart Temporarily Disabled for Debugging]
            </p>
            {/* Keep Chart commented out */}
            {/* <Chart options={chartOptions} series={series} type="area" height={350} /> */}
        </div>
    );
}

export default GrowthProjectionChart; 