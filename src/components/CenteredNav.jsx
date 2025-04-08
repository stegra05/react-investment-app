import React, { useRef, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import './CenteredNav.css'; // Import the CSS

/**
 * Renders a horizontal navigation bar where the active item scrolls to the center
 * and is highlighted by a moving indicator.
 *
 * @param {object[]} items - Array of navigation item objects ({ id: string, text: string }).
 * @param {string} [activeItemId=null] - The id of the currently active item.
 */
function CenteredNav({ items, activeItemId = null }) {
  const containerRef = useRef(null);
  const itemsListRef = useRef(null);
  const indicatorRef = useRef(null);
  // Use a map to store refs for individual items { id: ref }
  const itemRefs = useRef(new Map());

  // Effect to clear refs when items array changes (keep as useEffect)
  useEffect(() => {
    // Clear previous refs when items change
    itemRefs.current.clear();
  }, [items]);

  // Changed to useLayoutEffect for potentially better timing with DOM mutations
  useLayoutEffect(() => {
    // Removed setTimeout wrapper
    if (!activeItemId || !itemsListRef.current || !containerRef.current || !indicatorRef.current) {
      // console.log('[CenteredNav] LayoutEffect skipped: Refs or activeItemId missing');
      return; // Exit if refs aren't ready or no item is active
    }

    // --> Log the keys in the ref map (inside LayoutEffect)
    // console.log('[CenteredNav] LayoutEffect Refs available:', Array.from(itemRefs.current.keys()));

    const activeItemRef = itemRefs.current.get(activeItemId);
    if (!activeItemRef) {
      // console.warn(`[CenteredNav] LayoutEffect skipped: Could not find ref for active item ID: ${activeItemId}`);
      // Optionally hide indicator if active item ref isn't found yet
      if (indicatorRef.current) {
          indicatorRef.current.style.width = '0px';
          indicatorRef.current.style.opacity = '0';
      }
      return;
    }

    // --- Calculation and scrolling logic --- (no longer inside timeout)
    const containerWidth = containerRef.current.offsetWidth;
    const itemsList = itemsListRef.current;
    const indicator = indicatorRef.current;

    // Calculate indicator position and size
    const itemOffsetLeft = activeItemRef.offsetLeft;
    const itemWidth = activeItemRef.offsetWidth;

    indicator.style.width = `${itemWidth}px`;
    indicator.style.transform = `translateX(${itemOffsetLeft}px)`;
    indicator.style.opacity = '1'; // Make sure it's visible

    // Calculate scroll position to center the item
    const targetScrollLeft = itemOffsetLeft + itemWidth / 2 - containerWidth / 2;
    const maxScrollLeft = itemsList.scrollWidth - containerWidth;
    const clampedScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));

    // console.log('[CenteredNav] LayoutEffect Scrolling', {
    //   itemOffsetLeft,
    //   itemWidth,
    //   containerWidth,
    //   targetScrollLeft,
    //   maxScrollLeft,
    //   clampedScrollLeft,
    //   currentScrollLeft: itemsList.scrollLeft
    // });

    // Scroll smoothly
    // NOTE: Smooth scrolling might behave differently or cause warnings in useLayoutEffect
    // If issues arise, might need to revert to 'auto' or use useEffect + requestAnimationFrame
    itemsList.scrollTo({
      left: clampedScrollLeft,
      behavior: 'smooth', // Keep smooth for now
    });

    // console.log('[CenteredNav] LayoutEffect Run', {
    //   activeItemId,
    //   activeItemExists: !!activeItemRef,
    // });

    // No cleanup needed for setTimeout anymore

  }, [activeItemId, items]); // Re-run when active item or items list changes

  // Tailwind classes reused from Navbar for consistency
  const baseNavClasses = 'block whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150';
  const activeNavClasses = 'block whitespace-nowrap px-3 py-2 rounded-md text-sm font-semibold text-indigo-700 dark:text-indigo-300 transition-colors duration-150'; // Active state handled visually by indicator mostly

  return (
    <div ref={containerRef} className="centered-nav-container relative w-full overflow-hidden">
      <div
        ref={itemsListRef}
        className="centered-nav-items flex items-center overflow-x-auto py-1 relative" // Added padding for indicator space
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            // Store ref in the map
            ref={(el) => {
              if (el) {
                itemRefs.current.set(item.id, el);
              } else {
                itemRefs.current.delete(item.id); // Clean up if element unmounts
              }
            }}
            className={`centered-nav-item flex-shrink-0 ${activeItemId === item.id ? activeNavClasses : baseNavClasses}`}
          >
            {item.text}
          </a>
        ))}
        {/* Visual Indicator */}
        <div
          ref={indicatorRef}
          className="nav-indicator absolute bottom-0 left-0 h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-full"
          style={{ opacity: 0 }} // Initially hidden
        ></div>
      </div>
    </div>
  );
}

CenteredNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  activeItemId: PropTypes.string,
};

export default CenteredNav; 