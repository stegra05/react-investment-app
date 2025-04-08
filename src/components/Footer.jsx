import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders the footer section.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center mt-12 pt-8 border-t border-gray-300 dark:border-gray-700" data-aos="fade-up">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        &copy; {currentYear} Investment Plan Overview. Information purposes only.
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        This is not financial advice. Consult with a qualified financial advisor before making investment decisions. All investments involve risk.
      </p>
    </footer>
  );
}

export default Footer; 