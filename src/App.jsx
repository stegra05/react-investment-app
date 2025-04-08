import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useRef } from 'react'
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
import ConfigurationSection from './components/ConfigurationSection';

// Import Context Providers and Hooks
import { ThemeProvider } from './context/ThemeContext';
import { PlanProvider } from './context/PlanContext';

// Data for highlighting interaction
const coreRationales = {
  0: "Broad global diversification across developed markets. Low cost and accumulating strategy captures long-term growth.",
  1: "Targeted exposure to established European economies. Offers diversification and potential valuation opportunities.",
  2: "Access to faster-growing emerging economies. Higher potential returns, balanced by higher risk, within a diversified core.",
};

function AppContent() {
  // Initialize AOS effect
  useEffect(() => {
    AOS.init({ once: true, duration: 600, offset: 50 });
  }, []);

  // State for interaction between Core Portfolio Chart and Implementation Cards
  const [highlightedCoreIndex, setHighlightedCoreIndex] = useState(null);
  const [highlightedRationale, setHighlightedRationale] = useState(null);

  // Ref container for implementation card DOM elements
  const implementationCardRefs = useRef({});
  // Ref for the core portfolio section
  const chartSectionRef = useRef(null);

  // Callback to register refs from ImplementationSection
  const registerCardRef = useCallback((index, element) => {
    implementationCardRefs.current[index] = element;
  }, []); // Empty dependency array, this function never needs to change

  // State for plan configuration
  const [totalInvestment, setTotalInvestment] = useState(600);
  const [coreAmount, setCoreAmount] = useState(500);
  // Ensure satelliteAmount is derived correctly
  const satelliteAmount = totalInvestment - coreAmount;
  const [coreAllocations, setCoreAllocations] = useState([
    { name: 'Global Dev.', value: 60 },
    { name: 'Europe', value: 20 },
    { name: 'EM', value: 20 },
  ]);

  // Update rationale when highlighted index changes
  useEffect(() => {
    if (highlightedCoreIndex !== null && coreRationales.hasOwnProperty(highlightedCoreIndex)) {
      setHighlightedRationale(coreRationales[highlightedCoreIndex]);
    } else {
      setHighlightedRationale(null); // Clear rationale if index is null or invalid
    }
  }, [highlightedCoreIndex]);

  // Effect for click-outside listener to clear highlight
  useEffect(() => {
    if (highlightedCoreIndex === null) return; // Only listen when something is highlighted

    const handleClickOutside = (event) => {
      // Check if the click is outside the chart section
      const isOutsideChart = chartSectionRef.current && !chartSectionRef.current.contains(event.target);
      
      // Check if the click is outside all implementation cards
      const isOutsideCards = Object.values(implementationCardRefs.current).every(
        (cardRef) => cardRef && !cardRef.contains(event.target)
      );

      if (isOutsideChart && isOutsideCards) {
        setHighlightedCoreIndex(null);
      }
    };

    // Add listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener on unmount or when highlight changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [highlightedCoreIndex]); // Re-run when highlight changes

  // Callback for the Core Allocation Chart slice selection
  const handleCoreSliceSelect = (index) => {
    // Allow deselecting by clicking the same slice again (optional)
    const newIndex = highlightedCoreIndex === index ? null : index;
    setHighlightedCoreIndex(newIndex);

    // Scroll to the card if a new index is set (and the element exists)
    if (newIndex !== null) {
      const cardElement = implementationCardRefs.current[newIndex];
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // Scrolls the element to the nearest edge of the viewport
          inline: 'nearest'
        });
      }
    }
  };

  // TODO: Pass highlightedCoreIndex to ImplementationSection
  // TODO: Update TaxSection to include TaxCalculator component

  return (
    <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 min-h-screen flex flex-col transition-colors duration-500 ease-in-out">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <OverviewSection
            totalInvestment={totalInvestment}
            coreAmount={coreAmount}
            satelliteAmount={satelliteAmount}
          />
          <ConfigurationSection
            totalInvestment={totalInvestment}
            setTotalInvestment={setTotalInvestment}
            coreAmount={coreAmount}
            setCoreAmount={setCoreAmount}
            coreAllocations={coreAllocations}
            setCoreAllocations={setCoreAllocations}
          />
          <CorePortfolioSection
            ref={chartSectionRef}
            onSliceSelect={handleCoreSliceSelect}
            highlightedRationale={highlightedRationale}
            coreAmount={coreAmount}
            coreAllocations={coreAllocations}
          />
          <GrowthProjectionSection />
          <ChinaSatelliteSection />
          <TaxSection />
          <ImplementationSection
            highlightedCoreIndex={highlightedCoreIndex}
            highlightedRationale={highlightedRationale}
            coreAmount={coreAmount}
            coreAllocations={coreAllocations}
            satelliteAmount={satelliteAmount}
            registerCardRef={registerCardRef}
          />
          <TrackingSection />
          <LongTermViewSection />
          <RevisionHistorySection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

// New Root App component to wrap providers
function App() {
  return (
    <ThemeProvider>
      <PlanProvider>
        <AppContent />
      </PlanProvider>
    </ThemeProvider>
  );
}

export default App