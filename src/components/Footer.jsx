import React, { useState, useEffect } from 'react';

/**
 * Renders the footer section of the application.
 * Displays the current year and a disclaimer.
 *
 * @returns {JSX.Element} The Footer component.
 */
function Footer() {
    /**
     * State to hold the current year.
     * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
     */
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Effect to set current year (could be removed if only set initially)
    // useEffect(() => {
    //     setCurrentYear(new Date().getFullYear());
    //     // const currentYearElement = document.getElementById('currentYearSpan'); // Use a more specific ID
    //     // if (currentYearElement) {
    //     //   currentYearElement.textContent = new Date().getFullYear();
    //     // }
    //   }, []);

    return (
        <footer className="text-center mt-12 pt-8 border-t border-gray-300 dark:border-gray-700" data-aos="fade-up">
             <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {currentYear} Investment Plan Overview. Information purposes only.</p>
             <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">This is not financial advice. Consult with a qualified financial advisor before making investment decisions. All investments involve risk.</p>
         </footer>
    );
}

export default Footer; 