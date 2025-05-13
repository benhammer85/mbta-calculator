import React from 'react';
import Calculator from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            MBTA Transit Benefit Calculator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Compare monthly pass vs. pay-per-ride costs to find your best option
          </p>
        </div>
        <Calculator />
      </div>
    </div>
  );
}

export default App; 