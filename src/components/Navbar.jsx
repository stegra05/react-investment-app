import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Landmark } from 'lucide-react';

/**
 * Renders the navigation bar for the application.
 * Includes links to different sections, a dark mode toggle, and a responsive mobile menu.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isDarkMode - Current dark mode state.
 * @param {function} props.toggleDarkMode - Function to toggle dark mode.
 * @returns {JSX.Element} The Navbar component.
 */
// Receive isDarkMode and toggleDarkMode as props
function Navbar({ isDarkMode, toggleDarkMode }) {
    /**
     * State to control the visibility of the mobile menu.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    /**
     * Toggles the visibility of the mobile menu.
     */
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    // Effect to handle clicking outside the mobile menu to close it (optional but good UX)
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //     if (isMobileMenuOpen && !document.getElementById('mobile-menu').contains(event.target) && !document.getElementById('mobile-menu-button').contains(event.target)) {
    //         setMobileMenuOpen(false);
    //     }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [isMobileMenuOpen]);


    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Landmark className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                        <span className="font-bold text-lg ml-2 text-gray-900 dark:text-white">Investment Plan</span>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <a href="#overview" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Overview</a>
                        <a href="#core-portfolio" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Core Portfolio</a>
                        <a href="#china-satellite" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">China Satellite</a>
                        <a href="#tax" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Tax (Germany)</a>
                        <a href="#implementation" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Implementation</a>
                        <a href="#long-term" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Long-Term View</a>
                        <button
                            id="darkModeToggleDesktop"
                            aria-label="Toggle Dark Mode"
                            onClick={toggleDarkMode}
                            className="ml-4 p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Toggle Dark Mode</span>
                            {isDarkMode ? (
                                <Sun className="h-5 w-5" aria-hidden="true" />
                            ) : (
                                <Moon className="h-5 w-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
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
             {/* Conditionally render mobile menu based on isMobileMenuOpen state */}
            <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} absolute w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {/* Close menu on link click */}
                    <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400">Overview</a>
                    <a href="#core-portfolio" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400">Core Portfolio</a>
                    <a href="#china-satellite" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400">China Satellite</a>
                    <a href="#tax" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400">Tax (Germany)</a>
                    <a href="#implementation" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400">Implementation</a>
                    <a href="#long-term" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400">Long-Term View</a>
                    <button
                        id="darkModeToggleMobile"
                        aria-label="Toggle Dark Mode"
                        onClick={() => { toggleDarkMode(); setMobileMenuOpen(false); }}
                        className="w-full text-left text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400 flex items-center px-3 py-2 rounded-md text-base font-medium mt-2"
                    >
                        {isDarkMode ? (
                            <Sun className="mr-2 h-5 w-5" aria-hidden="true" />
                        ) : (
                            <Moon className="mr-2 h-5 w-5" aria-hidden="true" />
                        )}
                        Toggle Theme
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar; 