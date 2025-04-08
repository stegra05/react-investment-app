import React from 'react';

/**
 * Displays the high-level overview of the investment plan.
 * Includes the plan's goal, snapshot of allocation, time horizon, and review schedule.
 * Currently uses hardcoded data for the snapshot.
 *
 * @returns {JSX.Element} The OverviewSection component.
 */
function OverviewSection() {
    // Props might be needed later if content becomes dynamic
    return (
        <section id="overview" className="mb-16 scroll-mt-16">
             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-aos="fade-up">Your Long-Term Investment Plan</h1>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-2" data-aos="fade-up" data-aos-delay="50">Last Reviewed: <span className="font-semibold">[Manually Update Date Here]</span></p>
             <p className="text-lg text-gray-600 dark:text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="100">A structured approach for Steffen, aiming for capital growth over 20+ years with controlled risk, investing €600 per month.</p>
             <div id="overview-dashboard" className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                 <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-start" data-aos="fade-up" data-aos-delay="200">
                     <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 text-center">Plan Snapshot (€600/month)</h3>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden flex">
                         {/* Need state/props to manage these widths */}
                         <div className="bg-indigo-600 dark:bg-indigo-500 h-4 text-xs font-medium text-indigo-100 text-center p-0.5 leading-none rounded-l-full" style={{ width: '83%' }} title="Core: €500 (83%)"></div>
                         <div className="bg-purple-500 dark:bg-purple-400 h-4 text-xs font-medium text-purple-100 text-center p-0.5 leading-none rounded-r-full" style={{ width: '17%' }} title="Satellite: €100 (17%)"></div>
                     </div>
                     <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-1 mb-3">
                         <span>Core: €500 (83%)</span>
                         <span>Satellite: €100 (17%)</span>
                     </div>
                     <div className="text-center mt-auto pt-2">
                         <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Risk Profile:</span>
                         <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 ml-1">Moderate-High</span>
                     </div>
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center flex flex-col justify-center items-center" data-aos="fade-up" data-aos-delay="400"> <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Time Horizon</h3> <div className="flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-4 mb-2"> <span className="lucide text-3xl mr-2">&#xe90a;</span> <span className="text-xl font-bold text-gray-800 dark:text-gray-200">20+ Years</span> </div> <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Long-Term Growth Focus</p> </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center flex flex-col justify-center items-center" data-aos="fade-up" data-aos-delay="500"> <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Next Review Due</h3> <div className="flex items-center justify-center text-cyan-600 dark:text-cyan-400 mt-4 mb-2"> <span className="lucide text-3xl mr-2">&#xe909;</span> <span className="text-xl font-bold text-gray-800 dark:text-gray-200">~2030</span> </div> <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Approx. 5 Years</p> </div>
             </div>
        </section>
    );
}

export default OverviewSection; 