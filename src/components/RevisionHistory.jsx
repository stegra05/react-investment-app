import React from 'react';

function RevisionHistory() {
    // Could add state later to control open/close if needed
    return (
        <section id="revision-history" className="mb-8 scroll-mt-16" data-aos="fade-up">
            <details className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 flex justify-between items-center">
                    <span>Revision History</span>
                    {/* Using a simple chevron for now, could be replaced with dynamic icon */}
                    <span className="lucide lucide-chevron text-gray-500 dark:text-gray-400" style={{ fontSize: '1rem' }}>▼</span>
                </summary>
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
                    <ul className="list-disc list-inside space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        <li><strong>[Initial Date - e.g., May 2024]:</strong> Initial Plan Setup & First Version.</li>
                         {/* Add new revisions here as needed, e.g.: */}
                         {/* <li><strong>[Date]:</strong> [Brief description of change, e.g., Increased monthly savings to €700].</li> */}
                    </ul>
                </div>
            </details>
        </section>
    );
}

export default RevisionHistory; 