import React, { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './base.css';
import './components.css';
// import './utilities.css'; // Remove this import - likely redundant with Tailwind
import Navbar from './components/Navbar';
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Import AOS styles

// Import Section Components
import OverviewSection from './components/OverviewSection';
import CorePortfolioSection from './components/CorePortfolioSection';
import GrowthProjectionSection from './components/GrowthProjectionSection';
import ChinaSatelliteSection from './components/ChinaSatelliteSection';
import TaxSection from './components/TaxSection';
import ImplementationSection from './components/ImplementationSection';
import TrackingSection from './components/TrackingSection';
import LongTermViewSection from './components/LongTermViewSection';
import RevisionHistory from './components/RevisionHistory';
import Footer from './components/Footer';

/**
 * The main application component.
 * Manages global state including dark mode and growth projection parameters.
 * Renders all sections of the single-page application.
 */
function App() {
  // const [count, setCount] = useState(0)

  /**
   * State for managing the dark mode theme.
   * Initialized based on localStorage or system preference.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isDarkMode, setDarkMode] = useState(() => {
    return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  /**
   * Toggles the dark mode state between true and false.
   */
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  // Effect to apply dark mode class to HTML element and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  // --- Growth Calculator State ---
  /**
   * State for the monthly investment amount used in the growth projection.
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [monthlyInvestment, setMonthlyInvestment] = useState(600);
  /**
   * State for the estimated annual growth rate (as a percentage) used in the projection.
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [annualRate, setAnnualRate] = useState(7);
  /**
   * State for the number of years over which the growth is projected.
   * @type {[number, React.Dispatch<React.SetStateAction<number>>]}
   */
  const [years, setYears] = useState(20);
  // -------------------------------

  // Uncomment AOS Initialization Effect
  useEffect(() => {
    console.log("Initializing AOS...");
    AOS.init({
        duration: 800,
        once: true,
    });
  }, []);

  // console.log("Rendering App component (Re-enabled)");

  return (
    <>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Remove placeholder heading */}
          {/* <h1 style={{ ... }}>...</h1> */}
         {/* Uncomment Section Components */}
         <OverviewSection />
         <CorePortfolioSection isDarkMode={isDarkMode} />
         <GrowthProjectionSection
            isDarkMode={isDarkMode}
            monthlyInvestment={monthlyInvestment}
            setMonthlyInvestment={setMonthlyInvestment}
            annualRate={annualRate}
            setAnnualRate={setAnnualRate}
            years={years}
            setYears={setYears}
         />
         <ChinaSatelliteSection />
         <TaxSection />
         <ImplementationSection />
         <TrackingSection />
         <LongTermViewSection />
         <RevisionHistory />
         <Footer />
      </div>
    </>
  )
}

export default App
