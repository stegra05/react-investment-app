import React from 'react';
import { ExternalLink, Globe, Euro, LineChart, Landmark, HandCoins, Rocket, Combine } from 'lucide-react';

// Map icon names (or types) to actual Lucide components
const iconMap = {
  globe: Globe,
  euro: Euro,
  linechart: LineChart,
  landmark: Landmark,
  handcoins: HandCoins,
  rocket: Rocket,
  combine: Combine,
};

/**
 * Renders a single implementation card.
 * @param {{ cardData: object, isHighlighted: boolean }} props
 */
function ImplementationCard({ cardData, isHighlighted }) {
  const { id, title, icon, iconColor = 'indigo', link, description, isin, ter, why, delay, isOptional, isSuggested } = cardData;

  const IconComponent = iconMap[icon] || Globe; // Default to Globe if icon not found
  const titleColor = iconColor === 'rose' ? 'text-rose-700 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-500';
  const linkHoverColor = iconColor === 'rose' ? 'hover:text-rose-600 dark:hover:text-rose-400' : 'hover:text-indigo-600 dark:hover:text-indigo-400';

  // Base classes
  let cardClasses = "implementation-card bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-between min-h-[180px]";

  // Add highlight class if needed
  if (isHighlighted) {
    cardClasses += " highlight-card";
  }

  // Add opacity for optional cards
  if (isOptional) {
     cardClasses += " opacity-75 dark:opacity-60";
  }

  // Add special border for suggested China approach
  if (isSuggested) {
    cardClasses += " border-2 border-rose-300 dark:border-rose-500";
  }

  return (
    <div id={id} className={cardClasses} data-aos="fade-up" data-aos-delay={delay || 0}>
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className={`font-semibold text-gray-800 dark:text-gray-200 flex items-center ${isSuggested ? 'text-rose-800 dark:text-rose-200' : ''}`}>
            <IconComponent size={18} className={`${titleColor} mr-2 flex-shrink-0`} />
            {title}
          </h4>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" title={`Open ${description || title} on external site`} className={`text-gray-400 dark:text-gray-500 ${linkHoverColor}`}>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{description}</p>}
        {isin && <p className="text-xs text-gray-500 dark:text-gray-400">ISIN: {isin}</p>}
        {ter && <p className="text-xs text-gray-500 dark:text-gray-400">TER: {ter}</p>}
      </div>
      {why && <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{`Why: ${why}`}</p>}
    </div>
  );
}

export default ImplementationCard; 