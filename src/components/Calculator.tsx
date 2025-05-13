import { useState } from 'react';

interface CalculatorProps {
  title?: string;
}

interface ZoneOption {
  zone: string;
  price: number;
}

const Calculator = ({ title = 'MBTA Transit Benefit Calculator' }: CalculatorProps) => {
  // Basic inputs
  const [workDays, setWorkDays] = useState<number>(20);
  const [transitMode, setTransitMode] = useState<'subway-bus' | 'commuter-rail' | 'ferry'>('subway-bus');
  const [includesSubway, setIncludesSubway] = useState<boolean>(false);
  const [taxBracket, setTaxBracket] = useState<number>(22);
  const [employerSubsidy, setEmployerSubsidy] = useState<boolean>(true);
  const SUBSIDY_RATE = 0.60; // 60% employer subsidy
  
  // Subway/Bus specific
  const [subwayRidesPerDay, setSubwayRidesPerDay] = useState<number>(2);
  const [busRidesPerDay, setBusRidesPerDay] = useState<number>(0);
  
  // Commuter Rail specific
  const [commuterZone, setCommuterZone] = useState<string>("1A");
  
  // Ferry specific
  const [ferryRoute, setFerryRoute] = useState<string>("charlestown");

  // Constants for MBTA fares
  const MONTHLY_LINK_PASS = 90.00;
  const SUBWAY_FARE = 2.40;
  const BUS_FARE = 1.70;

  const COMMUTER_RAIL_ZONES: ZoneOption[] = [
    { zone: "1A", price: 90.00 },
    { zone: "1", price: 214.00 },
    { zone: "2", price: 232.00 },
    { zone: "3", price: 261.00 },
    { zone: "4", price: 281.00 },
    { zone: "5", price: 311.00 },
    { zone: "6", price: 340.00 },
    { zone: "7", price: 360.00 },
    { zone: "8", price: 388.00 },
    { zone: "9", price: 406.00 },
    { zone: "10", price: 426.00 }
  ];

  const FERRY_ROUTES: ZoneOption[] = [
    { zone: "charlestown", price: 90.00 },
    { zone: "hingham-hull", price: 329.00 },
    { zone: "east-boston", price: 90.00 }
  ];

  // Calculate monthly pass cost
  const calculateMonthlyPassCost = () => {
    let total = 0;
    
    if (transitMode === 'subway-bus') {
      total = MONTHLY_LINK_PASS;
    } else if (transitMode === 'commuter-rail') {
      const zonePass = COMMUTER_RAIL_ZONES.find(z => z.zone === commuterZone);
      total = zonePass ? zonePass.price : 0;
    } else if (transitMode === 'ferry') {
      const ferryPass = FERRY_ROUTES.find(f => f.zone === ferryRoute);
      total = ferryPass ? ferryPass.price : 0;
    }

    return total;
  };

  // Calculate subsidized monthly pass cost
  const calculateSubsidizedPassCost = () => {
    const fullCost = calculateMonthlyPassCost();
    return employerSubsidy ? fullCost * (1 - SUBSIDY_RATE) : fullCost;
  };

  // Calculate total monthly cost for pay-per-ride
  const calculatePayPerRide = () => {
    const monthlySubwayRides = workDays * subwayRidesPerDay;
    const monthlyBusRides = workDays * busRidesPerDay;
    
    if (transitMode === 'subway-bus') {
      return (monthlySubwayRides * SUBWAY_FARE) + (monthlyBusRides * BUS_FARE);
    } else {
      let baseRideCost = 0;
      if (transitMode === 'commuter-rail') {
        const zonePass = COMMUTER_RAIL_ZONES.find(z => z.zone === commuterZone);
        baseRideCost = (zonePass ? zonePass.price / 20 : 0) * workDays; // Approximate daily cost
      } else if (transitMode === 'ferry') {
        const ferryPass = FERRY_ROUTES.find(f => f.zone === ferryRoute);
        baseRideCost = (ferryPass ? ferryPass.price / 20 : 0) * workDays; // Approximate daily cost
      }
      
      // Add subway costs if connecting
      if (includesSubway) {
        baseRideCost += (workDays * 2 * SUBWAY_FARE); // Assuming 2 subway rides per day for connections
      }
      
      return baseRideCost;
    }
  };

  // Calculate pre-tax savings
  const calculatePreTaxSavings = (monthlyCost: number) => {
    const annualCost = monthlyCost * 12;
    const taxSavings = (annualCost * (taxBracket / 100));
    return taxSavings / 12; // Monthly tax savings
  };

  // Calculate total savings
  const calculateSavings = () => {
    const payPerRideCost = calculatePayPerRide();
    const monthlyPassCost = calculateSubsidizedPassCost();
    const preTaxSavings = calculatePreTaxSavings(monthlyPassCost);
    
    // Compare pay-per-ride vs. monthly pass with pre-tax savings and subsidy
    return payPerRideCost - (monthlyPassCost - preTaxSavings);
  };

  // Determine recommendation
  const getRecommendation = () => {
    const savings = calculateSavings();
    const monthlyPassCost = calculateSubsidizedPassCost();
    const preTaxSavings = calculatePreTaxSavings(monthlyPassCost);
    const subsidyAmount = employerSubsidy ? calculateMonthlyPassCost() * SUBSIDY_RATE : 0;
    
    if (savings > 0) {
      return `We recommend getting the Monthly Pass. You'll save $${savings.toFixed(2)} per month including $${preTaxSavings.toFixed(2)} in tax savings${employerSubsidy ? ` and $${subsidyAmount.toFixed(2)} in employer subsidy` : ''}.`;
    } else if (savings < 0) {
      return `We recommend paying per ride. The monthly pass would cost $${Math.abs(savings).toFixed(2)} more than what you need, even with tax savings${employerSubsidy ? ' and employer subsidy' : ''}.`;
    }
    return "Both options cost about the same. Consider the monthly pass for convenience and tax savings.";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transit Mode
          </label>
          <select
            value={transitMode}
            onChange={(e) => setTransitMode(e.target.value as any)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="subway-bus">Subway/Bus</option>
            <option value="commuter-rail">Commuter Rail</option>
            <option value="ferry">Ferry</option>
          </select>
        </div>

        {transitMode !== 'subway-bus' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {transitMode === 'commuter-rail' ? 'Commuter Rail Zone' : 'Ferry Route'}
            </label>
            <select
              value={transitMode === 'commuter-rail' ? commuterZone : ferryRoute}
              onChange={(e) => transitMode === 'commuter-rail' 
                ? setCommuterZone(e.target.value)
                : setFerryRoute(e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              {transitMode === 'commuter-rail' 
                ? COMMUTER_RAIL_ZONES.map(zone => (
                    <option key={zone.zone} value={zone.zone}>
                      Zone {zone.zone} - ${zone.price.toFixed(2)}
                    </option>
                  ))
                : FERRY_ROUTES.map(route => (
                    <option key={route.zone} value={route.zone}>
                      {route.zone.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')} - ${route.price.toFixed(2)}
                    </option>
                  ))
              }
            </select>
          </div>
        )}

        {transitMode !== 'subway-bus' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includesSubway"
              checked={includesSubway}
              onChange={(e) => setIncludesSubway(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="includesSubway" className="ml-2 block text-sm text-gray-700">
              Includes subway connection to final destination
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Work Days per Month
          </label>
          <input
            type="number"
            min="0"
            max="31"
            value={workDays}
            onChange={(e) => setWorkDays(Math.max(0, parseInt(e.target.value) || 0))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
        </div>

        {transitMode === 'subway-bus' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subway Rides per Day
              </label>
              <input
                type="number"
                min="0"
                value={subwayRidesPerDay}
                onChange={(e) => setSubwayRidesPerDay(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bus Rides per Day
              </label>
              <input
                type="number"
                min="0"
                value={busRidesPerDay}
                onChange={(e) => setBusRidesPerDay(Math.max(0, parseInt(e.target.value) || 0))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>
          </>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="employerSubsidy"
            checked={employerSubsidy}
            onChange={(e) => setEmployerSubsidy(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="employerSubsidy" className="ml-2 block text-sm text-gray-700">
            Include 60% employer subsidy
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Bracket (%)
          </label>
          <select
            value={taxBracket}
            onChange={(e) => setTaxBracket(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="10">10% - Up to $11,000</option>
            <option value="12">12% - $11,001 to $44,725</option>
            <option value="22">22% - $44,726 to $95,375</option>
            <option value="24">24% - $95,376 to $182,100</option>
            <option value="32">32% - $182,101 to $231,250</option>
            <option value="35">35% - $231,251 to $578,125</option>
            <option value="37">37% - $578,126 or more</option>
          </select>
        </div>

        <div className="mt-8 space-y-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Monthly Pass Cost (Full):</span>
            <span className="font-semibold">${calculateMonthlyPassCost().toFixed(2)}</span>
          </div>

          {employerSubsidy && (
            <div className="flex justify-between items-center text-green-700">
              <span>Employer Subsidy (60%):</span>
              <span className="font-semibold">-${(calculateMonthlyPassCost() * SUBSIDY_RATE).toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Your Monthly Pass Cost:</span>
            <span className="font-semibold">${calculateSubsidizedPassCost().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Pay-per-ride Total:</span>
            <span className="font-semibold">${calculatePayPerRide().toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-green-700">
            <span>Monthly Pre-tax Savings:</span>
            <span className="font-semibold">${calculatePreTaxSavings(calculateSubsidizedPassCost()).toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendation</h3>
            <p className="text-gray-800 bg-white p-3 rounded-md">
              {getRecommendation()}
            </p>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <h4 className="font-medium mb-2">Notes:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Subway fare: ${SUBWAY_FARE.toFixed(2)} per ride</li>
            <li>Bus fare: ${BUS_FARE.toFixed(2)} per ride</li>
            <li>Monthly passes include unlimited rides for their respective modes</li>
            <li>Commuter Rail and Ferry passes include subway/bus access</li>
            <li>Pre-tax savings are estimated based on your tax bracket</li>
            <li>Employer subsidy covers 60% of the monthly pass cost when selected</li>
            <li>Calculations assume regular weekday travel patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 