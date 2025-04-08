import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { BarChart, TrendingDown, TrendingUp, Percent } from 'lucide-react'; // Icon for tracking

/**
 * Renders the Portfolio Tracking section.
 */
function TrackingSection() {
  return (
    <section id="tracking" className="mb-16 scroll-mt-16" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">
        Tracking Your Portfolio
      </h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400 flex items-center">
          <BarChart size={18} className="mr-2" aria-hidden="true" />
          Keep an Eye on Your Investments
        </h3>
        <div className="text-gray-700 dark:text-gray-300 space-y-4 text-sm">
          <p>
            Regularly monitoring your portfolio is crucial to ensure it stays aligned with your goals and risk tolerance.
            Check its performance and allocation at least annually, or more often if market conditions change significantly.
          </p>
          <p><strong>Common ways to track:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Broker Interface:</strong> Most online brokers provide tools to view your portfolio's value, performance, and holdings.</li>
            <li><strong>Portfolio Tracking Apps:</strong> Dedicated apps (e.g., Parqet, Portfolio Performance, getquin) offer more detailed analysis, aggregation across brokers, and performance metrics.</li>
            <li><strong>Spreadsheets:</strong> A personal spreadsheet (like Google Sheets or Excel) allows for maximum customization and control over how you track your investments.</li>
          </ul>
          {/* Optional: Add link to a template if created
          <p className="mt-4 text-xs">You can use this <a href="#" className="text-indigo-600 hover:text-indigo-800">simple Google Sheets template</a> to get started.</p>
          */}
        </div>
      </div>
    </section>
  );
}

// TrackingSection doesn't receive props, so no propTypes definition needed.

export default TrackingSection; 