import { useState, useEffect } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import './components.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Static Sections
import OverviewSection from './components/OverviewSection';
import ChinaSatelliteSection from './components/ChinaSatelliteSection';
import TaxSection from './components/TaxSection'; // Will be updated later
import ImplementationSection from './components/ImplementationSection'; // Will be updated later
import TrackingSection from './components/TrackingSection';
import LongTermViewSection from './components/LongTermViewSection';
import RevisionHistorySection from './components/RevisionHistorySection';

// Interactive Sections
import CorePortfolioSection from './components/CorePortfolioSection';
import GrowthProjectionSection from './components/GrowthProjectionSection';

// Data for highlighting interaction
const coreRationales = {
  0: "Broad global diversification across developed markets. Low cost and accumulating strategy captures long-term growth.",
  1: "Targeted exposure to established European economies. Offers diversification and potential valuation opportunities.",
  2: "Access to faster-growing emerging economies. Higher potential returns, balanced by higher risk, within a diversified core.",
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // State for interaction between Core Portfolio Chart and Implementation Cards
  const [highlightedCoreIndex, setHighlightedCoreIndex] = useState(null);
  const [highlightedRationale, setHighlightedRationale] = useState(null);

  // Update theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Initialize AOS effect
  useEffect(() => {
    AOS.init({ once: true, duration: 600, offset: 50 });
  }, []);

  // Update rationale when highlighted index changes
  useEffect(() => {
    if (highlightedCoreIndex !== null && coreRationales.hasOwnProperty(highlightedCoreIndex)) {
      setHighlightedRationale(coreRationales[highlightedCoreIndex]);
    } else {
      setHighlightedRationale(null); // Clear rationale if index is null or invalid
    }
  }, [highlightedCoreIndex]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Callback for the Core Allocation Chart slice selection
  const handleCoreSliceSelect = (index) => {
    // Allow deselecting by clicking the same slice again (optional)
    // setHighlightedCoreIndex(prevIndex => prevIndex === index ? null : index);
    setHighlightedCoreIndex(index); // Simple set
  };

  // Function to clear highlight (e.g., passed to ImplementationSection for click outside)
  const clearCoreHighlight = () => {
      setHighlightedCoreIndex(null);
  };

  // TODO: Pass highlightedCoreIndex to ImplementationSection
  // TODO: Pass clearCoreHighlight potentially
  // TODO: Update TaxSection to include TaxCalculator component

  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 min-h-screen flex flex-col">
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <OverviewSection />
          <CorePortfolioSection
            isDarkMode={isDarkMode}
            onSliceSelect={handleCoreSliceSelect}
            highlightedRationale={highlightedRationale}
          />
          <GrowthProjectionSection isDarkMode={isDarkMode} />
          <ChinaSatelliteSection />
          <TaxSection />
          <ImplementationSection highlightedCoreIndex={highlightedCoreIndex} />
          <TrackingSection />
          <LongTermViewSection />
          <RevisionHistorySection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App