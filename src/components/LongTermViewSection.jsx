import React from 'react';

function LongTermViewSection() {
    return (
        <section id="long-term" className="mb-16 scroll-mt-16" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">Long-Term View & Discipline</h2>
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 p-8 rounded-lg shadow dark:shadow-gray-700"> <div className="grid md:grid-cols-2 gap-8"> <div> <h3 className="text-xl font-semibold mb-3 text-teal-700 dark:text-teal-400 flex items-center"><span className="lucide mr-2" style={{ fontSize: '1.25rem' }}>&#xe907;</span> Compounding & Consistency</h3> <p className="text-gray-700 dark:text-gray-300 mb-4">Consistent €600 monthly investments (dollar-cost averaging) combined with long-term compounding of reinvested earnings drives potential portfolio growth. Staying invested through market cycles is key.</p> </div> <div> <h3 className="text-xl font-semibold mb-3 text-cyan-700 dark:text-cyan-400 flex items-center"><span className="lucide mr-2" style={{ fontSize: '1.25rem' }}>&#xea0c;</span> 5-Year Review & Rebalancing</h3> <p className="text-gray-700 dark:text-gray-300 mb-4">Review your plan around the 5-year mark:</p> <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm"> <li>Assess risk tolerance & goals.</li> <li>Rebalance if allocations drift significantly.</li> <li>Check fund competitiveness (fees, etc.).</li> <li>Adjust for major life/economic shifts.</li> </ul> <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm">Regular rebalancing maintains your risk profile.</p> </div> </div> </div>
        </section>
    );
}

export default LongTermViewSection; 