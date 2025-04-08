import React, { useState } from 'react';
// import CoreAllocationChart from '../CoreAllocationChart'; // Old path
import CoreAllocationChart from './CoreAllocationChart'; // Corrected path within components/

function CorePortfolioSection({ isDarkMode }) { // Receive isDarkMode prop
    // State for the rationale display text
    const [rationale, setRationale] = useState('Click a chart slice to see the rationale.');

    // Function to be called by the chart when a slice is clicked
    const handleChartClick = (index, label) => {
        // Define rationales based on index or label (match with chart data)
        const rationales = [
            "Rationale for Global Developed: Broad diversification, captures growth in major developed economies, low cost.",
            "Rationale for Europe: Potential valuation opportunities, hedges against US-centric risks, home bias (if applicable).",
            "Rationale for Emerging Markets: Higher long-term growth potential, diversification benefits (though higher risk)."
        ];
        // Update rationale based on the clicked slice index
        setRationale(rationales[index] || 'Select a slice to see details.');
        // Optional: Add logic to highlight implementation card (see step 4)
    };

    // console.log("Rendering CorePortfolioSection (Chart Re-enabled)");

    return (
        <section id="core-portfolio" className="mb-16 scroll-mt-16" data-aos="fade-up">
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">Core Portfolio: Stable Growth (€500 per month)</h2>
             <div className="grid md:grid-cols-2 gap-8 items-start">
                 <div> <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Strategy & Rationale</h3> <div className="text-gray-700 dark:text-gray-300 space-y-4"> <p>The core focuses on broad diversification using low-cost Exchange Traded Funds (ETFs) to capture global market growth while managing risk. This part uses €500 of the total €600 monthly investment, primarily split across Global Developed, Europe, and Emerging Markets ETFs.</p> <p className="text-sm text-gray-600 dark:text-gray-400"><em>(Optional Bonds & Blue Chips are part of the overall €600 plan but not detailed here).</em></p> </div> </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"> <h3 className="text-xl font-semibold mb-3 text-center text-indigo-700 dark:text-indigo-400">Core ETF Allocation (€500/month)</h3>
                     {/* Uncomment chart rendering */}
                     <CoreAllocationChart
                        isDarkMode={isDarkMode}
                        onSliceClick={handleChartClick}
                     />
                     {/* Remove placeholder */}
                     {/* <div style={{ ... }}>[Core Allocation Chart Temporarily Disabled for Debugging]</div> */}
                     <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Click chart slices to highlight implementation examples and see rationale.</p>
                     <p id="core-rationale-display" className="text-sm text-gray-600 dark:text-gray-400 text-center mt-3 min-h-[3em] px-2">
                        {rationale} {/* Display the state variable */}
                     </p> </div>
             </div>
         </section>
    );
}

export default CorePortfolioSection; 