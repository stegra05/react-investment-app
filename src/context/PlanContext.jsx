import React, { createContext, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

// Create the context
const PlanContext = createContext();

// Create a provider component
export function PlanProvider({ children }) {
  const [totalInvestment, setTotalInvestment] = useState(600);
  const [coreAmount, setCoreAmount] = useState(500);
  const [coreAllocations, setCoreAllocations] = useState([
    { name: 'Global Dev.', value: 60 },
    { name: 'Europe', value: 20 },
    { name: 'EM', value: 20 },
  ]);

  // Derived state: satelliteAmount
  const satelliteAmount = totalInvestment - coreAmount;

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    totalInvestment,
    setTotalInvestment,
    coreAmount,
    setCoreAmount,
    satelliteAmount, // Provide derived state as well
    coreAllocations,
    setCoreAllocations,
  }), [totalInvestment, coreAmount, satelliteAmount, coreAllocations]);

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
}

// Add propTypes for the provider
PlanProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to consume the context
export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
} 