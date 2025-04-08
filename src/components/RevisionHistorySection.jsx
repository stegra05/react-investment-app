import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { ChevronRight } from 'lucide-react'; // Icon for the details toggle
import { appConfig } from '../data/appConfig'; // Import config

/**
 * Renders the Revision History section.
 */
function RevisionHistorySection() {
  // Use revisions from config
  const { revisions } = appConfig;

  // TODO: Fetch revision history dynamically or manage it elsewhere
  // const revisions = [
  //   { date: 'June 2024', description: 'Initial Plan Setup & First React Version.' },
  //   // Add more revisions here as needed
  // ];

  return (
    <section id="revision-history" className="mb-8 scroll-mt-16" data-aos="fade-up">
      <details className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 flex justify-between items-center list-none">
          <span>Revision History</span>
          <ChevronRight size={16} className="lucide-chevron transition-transform duration-200" />
        </summary>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
          <ul className="list-disc list-inside space-y-2 text-xs text-gray-600 dark:text-gray-400">
            {revisions.map((rev, index) => (
              <li key={index}>
                <strong>{rev.date}:</strong> {rev.description}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </section>
  );
}

// RevisionHistorySection doesn't receive props, so no propTypes definition needed.

export default RevisionHistorySection; 