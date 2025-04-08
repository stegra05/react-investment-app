import React from 'react';
import PropTypes from 'prop-types';
import { CalendarDays, Clock, TrendingUp, Scale } from 'lucide-react';
import { usePlan } from '../context/PlanContext'; // Import usePlan hook
import RiskGauge from './RiskGauge'; // Import the RiskGauge component

/**
 * Renders the Overview section.
 * Uses PlanContext for investment amounts.
 */
function OverviewSection() {
  const { totalInvestment, coreAmount, satelliteAmount } = usePlan(); // Use context hook

  const corePercentage = totalInvestment > 0 ? Math.round((coreAmount / totalInvestment) * 100) : 0;
  const satellitePercentage = totalInvestment > 0 ? 100 - corePercentage : 0; // Ensure it adds up

  return (
    <section id="overview" className="mb-16 scroll-mt-16">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-aos="fade-up">
        Your Long-Term Investment Plan
      </h1>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2" data-aos="fade-up" data-aos-delay="50">
        Date: <span className="font-semibold">{new Date().toLocaleDateString('en-CA')}</span>
      </p>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="100">
        A structured approach aiming for capital growth over 20+ years with controlled risk, investing €{totalInvestment} per month.
      </p>
      <div id="overview-dashboard" className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-start" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 text-center">Plan Snapshot (€{totalInvestment}/month)</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 overflow-hidden flex">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-4 text-xs font-medium text-indigo-100 text-center p-0.5 leading-none transition-all duration-300 ease-in-out"
              style={{ width: `${corePercentage}%` }}
              title={`Core: €${coreAmount} (${corePercentage}%)`}>
            </div>
            <div 
              className="bg-purple-500 dark:bg-purple-400 h-4 text-xs font-medium text-purple-100 text-center p-0.5 leading-none transition-all duration-300 ease-in-out"
              style={{ width: `${satellitePercentage}%` }}
              title={`Satellite: €${satelliteAmount} (${satellitePercentage}%)`}>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-1 mb-3">
            <span>Core: €{coreAmount} ({corePercentage}%)</span>
            <span>Satellite: €{satelliteAmount} ({satellitePercentage}%)</span>
          </div>
          <div className="text-center mt-auto pt-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Risk Profile:</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 ml-1">Moderate-High</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center flex flex-col justify-center items-center" data-aos="fade-up" data-aos-delay="400">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Time Horizon</h3>
          <div className="flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-4 mb-2">
            <Clock className="h-8 w-8 mr-2" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">20+ Years</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Long-Term Growth Focus</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center flex flex-col justify-center items-center" data-aos="fade-up" data-aos-delay="500">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Next Review Due</h3>
          <div className="flex items-center justify-center text-cyan-600 dark:text-cyan-400 mt-4 mb-2">
            <CalendarDays className="h-8 w-8 mr-2" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">~2030</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Approx. 5 Years</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12" data-aos="fade-up" data-aos-delay="150">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Investment Split</h3>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{corePercentage}% Core</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{satellitePercentage}% Satellite</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(€{coreAmount} / €{satelliteAmount})</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 text-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-center"><CalendarDays size={14} className="mr-1.5"/>Target Horizon</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">20+ Years</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Long-term capital growth focus</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center"><Scale size={14} className="mr-1.5"/>Risk Profile</h3>
          <RiskGauge level="Moderate-High" />
        </div>
      </div>
    </section>
  );
}

export default OverviewSection; 