import React from 'react';
import PropTypes from 'prop-types';
import { HelpCircle } from 'lucide-react';

/**
 * Renders a term with an info icon that shows a definition on hover (using title attribute).
 * @param {{ term: string, definition: string }} props
 */
function InfoTooltip({ term, definition }) {
  return (
    <span className="inline-flex items-center">
      {term}
      <span title={definition} className="ml-1 cursor-help">
        <HelpCircle size={14} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
      </span>
    </span>
  );
}

InfoTooltip.propTypes = {
  term: PropTypes.string.isRequired,
  definition: PropTypes.string.isRequired,
};

export default InfoTooltip; 