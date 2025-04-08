import React from 'react';
import Chart from 'react-apexcharts';

// Pass isDarkMode as a prop eventually to toggle theme
// Accept onSliceClick as a prop
function CoreAllocationChart({ isDarkMode, onSliceClick }) {

    // Example data - replace with actual data logic later
    const series = [60, 20, 20]; // Represents €300, €100, €100 from original example (scaled)

    const options = {
        chart: {
            type: 'donut',
            animations: {
                enabled: true
            },
            events: {
                // Call the passed-in handler function
                dataPointSelection: (event, chartContext, config) => {
                    const clickedIndex = config.dataPointIndex;
                    const clickedLabel = config.w.config.labels[clickedIndex];
                    if (onSliceClick) { // Check if the prop function exists and call it
                        onSliceClick(clickedIndex, clickedLabel);
                    }
                }
            }
        },
        labels: ['Global Developed (e.g., MSCI World)', 'Europe (e.g., STOXX 600)', 'Emerging Markets (e.g., MSCI EM IMI)'],
        colors: ['#4f46e5', '#6366f1', '#a5b4fc'], // Indigo shades
        legend: {
            position: 'bottom',
            // theme: { // Needs logic based on isDarkMode
            //     mode: isDarkMode ? 'dark' : 'light'
            // }
            labels: {
                colors: isDarkMode ? '#e5e7eb' : '#374151' // Adjust legend text color for dark/light
            }
        },
        tooltip: {
            // theme: isDarkMode ? 'dark' : 'light' // Adjust tooltip theme
            y: {
                formatter: function (val) {
                    // Calculate percentage based on total (€500)
                    const percentage = (val / series.reduce((a, b) => a + b, 0) * 100).toFixed(0);
                    const amount = (val / 100 * 500).toFixed(0); // Assuming 100 total represents 500 EUR
                    return `€${amount} (${percentage}%)`
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Core Total',
                            formatter: function (w) {
                                return '€500' // Hardcoded total from original example
                            }
                        }
                    }
                }
            }
        },
        // Responsive options if needed
        // responsive: [{
        //     breakpoint: 480,
        //     options: {
        //         chart: {
        //             width: 200
        //         },
        //         legend: {
        //             position: 'bottom'
        //         }
        //     }
        // }]
    };

    // Dynamically update theme based on isDarkMode
    const chartOptions = {
        ...options,
        theme: {
            mode: isDarkMode ? 'dark' : 'light'
        },
        legend: {
            ...options.legend,
            labels: {
                colors: isDarkMode ? '#e5e7eb' : '#374151'
            }
        },
        tooltip: {
            ...options.tooltip,
            theme: isDarkMode ? 'dark' : 'light'
        }
    };


    return (
        <div id="coreAllocationChart">
             {/* Use the Chart component from react-apexcharts */}
            <Chart options={chartOptions} series={series} type="donut" height={350} />
        </div>
    );
}

export default CoreAllocationChart; 