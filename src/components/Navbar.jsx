import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Menu, X, Sun, Moon, LineChart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import CenteredNav from './CenteredNav'; // Import the new component
import './CenteredNav.css'; // Import the CSS needed by CenteredNav

/**
 * Renders the navigation bar with scrollspy functionality.
 * Uses ThemeContext for dark mode state and toggle.
 */
function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use context hook
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const navRef = useRef(null); // Ref for the nav element to calculate offset

  const navLinks = [
    { id: 'overview', text: 'Overview' },
    { id: 'core-portfolio', text: 'Core Portfolio' },
    // Add Growth Projection temporarily until section exists, then remove
    { id: 'growth-projection', text: 'Growth Scenarios' },
    { id: 'china-satellite', text: 'China Satellite' },
    { id: 'tax', text: 'Tax (Germany)' },
    { id: 'implementation', text: 'Implementation' },
    { id: 'tracking', text: 'Tracking' },
    { id: 'long-term', text: 'Long-Term View' },
  ];

  // --- Scrollspy Logic --- (Adapted from original ui.js)
  useEffect(() => {
    const sections = navLinks.map(link => document.getElementById(link.id)).filter(Boolean);
    const navHeight = navRef.current?.offsetHeight || 64; // Get nav height or default

    const handleScroll = () => {
      let currentSectionId = '';
      const scrollPosition = window.scrollY + navHeight + 50; // Add offset

      sections.forEach(section => {
        if (section.offsetTop <= scrollPosition) {
          currentSectionId = section.id;
        }
      });

      // Handle edge case for the very top of the page
      if (window.scrollY < sections[0]?.offsetTop - navHeight - 50) {
          currentSectionId = '';
      }
      // Handle edge case for the very bottom (highlight last section)
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          currentSectionId = sections[sections.length - 1]?.id || '';
      }

      setActiveSectionId(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);

  }, [navLinks]); // Re-run if navLinks change (though they are static here)
  // --- End Scrollspy Logic ---

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const baseNavClasses = 'px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150';
  const activeNavClasses = 'px-3 py-2 rounded-md text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 transition-colors duration-150';
  const baseMobileClasses = 'block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors duration-150';
  const activeMobileClasses = 'block px-3 py-2 rounded-md text-base font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 transition-colors duration-150';

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <LineChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" aria-hidden="true" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">Investment Plan</span>
          </div>
          {/* Desktop Navigation - Replaced with CenteredNav */}
          <div className="hidden md:flex md:items-center flex-grow min-w-0 mx-4">
            <CenteredNav items={navLinks} activeItemId={activeSectionId} />
          </div>
          {/* Theme Toggle Button (Desktop) - Moved outside the flex-grow container if needed, or keep here */}
          <div className="hidden md:flex md:items-center">
            <button
              id="darkModeToggleDesktop"
              aria-label="Toggle Dark Mode"
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              id="darkModeToggleMobileTop"
              aria-label="Toggle Dark Mode"
              onClick={toggleDarkMode}
              className="mr-2 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              id="mobile-menu-button"
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} absolute w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
             <a
               key={link.id}
               href={`#${link.id}`}
               className={activeSectionId === link.id ? activeMobileClasses : baseMobileClasses}
               onClick={() => setMobileMenuOpen(false)} // Close menu on link click
             >
               {link.text}
             </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 