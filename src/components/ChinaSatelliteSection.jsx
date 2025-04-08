import React from 'react';
import { ArrowRight, AlertTriangle, ShieldCheck, LineChart, TrendingUp, Zap, Scale, PiggyBank, MapPin, ExternalLink } from 'lucide-react'; // Added more specific icons

/**
 * Renders the China Satellite section.
 */
function ChinaSatelliteSection() {
  return (
    <section id="china-satellite" className="mb-16 scroll-mt-16" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-2 border-gray-300 dark:border-gray-600">
        China Satellite: Higher Growth Potential (€100 per month)
      </h2>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Opportunities vs Risks Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-rose-700 dark:text-rose-400">Opportunities vs. Risks</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            This smaller allocation (€100/month) targets potentially higher returns via China's dynamic economy, but involves increased volatility and specific risks:
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b border-green-200 dark:border-green-700 pb-1">Opportunities</h4>
              <div className="space-y-3">
                <p className="flex items-start text-sm text-green-800 dark:text-green-300">
                  <TrendingUp size={16} className="mr-2 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                  <span>Growth Sectors (Tech, EV, AI)</span>
                </p>
                <p className="flex items-start text-sm text-green-800 dark:text-green-300">
                  <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                  <span>Economic Scale & Development</span>
                </p>
                <p className="flex items-start text-sm text-green-800 dark:text-green-300">
                  <PiggyBank size={16} className="mr-2 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                  <span>Potential Valuation Upside</span>
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b border-red-200 dark:border-red-700 pb-1">Risks</h4>
              <div className="space-y-3">
                <p className="flex items-start text-sm text-red-800 dark:text-red-300">
                  <Scale size={16} className="mr-2 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <span>Regulatory & Political Changes</span>
                </p>
                <p className="flex items-start text-sm text-red-800 dark:text-red-300">
                  <ShieldCheck size={16} className="mr-2 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <span>Geopolitical Tensions</span>
                </p>
                <p className="flex items-start text-sm text-red-800 dark:text-red-300">
                  <LineChart size={16} className="mr-2 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <span>Economic Imbalances (Property, Debt)</span>
                </p>
                <p className="flex items-start text-sm text-red-800 dark:text-red-300">
                  <Zap size={16} className="mr-2 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <span>Market Volatility & Sentiment</span>
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mb-4">
            <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-red-300 dark:border-red-600">
              Risk Level: High
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
            Requires a long-term view and tolerance for significant fluctuations.
          </p>
          <p className="text-sm text-center">
            <a href="#impl-china" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
              See Implementation Examples
              <ArrowRight size={14} className="ml-1" />
            </a>
          </p>
        </div>

        {/* Allocation Approaches Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-3 text-rose-700 dark:text-rose-400">Allocation Approaches (€100/month)</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">1. Balanced Approach:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">Broad China/Asia ETF (e.g., MSCI China). Diversified.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">2. High-Risk Approach:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">Thematic ETF (e.g., Tech) or 1-2 Stocks (e.g., BABA, BYD). Concentrated.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">3. Combined Approach (Plan Suggestion):</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">Split €100 (e.g., €50 Broad ETF + €50 Stock/Thematic). Balanced risk.</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700/50 rounded-lg">
            <p className="text-sm text-rose-800 dark:text-rose-300 font-medium flex items-center">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
              <strong>Important:</strong> Keep total China allocation capped (~17%). Invest only amounts you can afford potential large swings on.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChinaSatelliteSection; 