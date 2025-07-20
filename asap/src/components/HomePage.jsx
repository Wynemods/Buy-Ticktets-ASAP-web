import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import flightService from '../services/FlightService';

const COUNTDOWN_CONFIG = {
  initialHours: 2,
  initialMinutes: 22,
  initialSeconds: 50
};

// Universal logo URL function
const getAirlineLogoUrl = (airlineCode) => {
  return `https://airline-logo.asaptickets.com/result_no_bg/${airlineCode.toLowerCase()}.png`;
};

// Default fallback configuration
const DEFAULT_FLIGHT_CONFIG = {
  airline: {
    name: "EGYPTAIR",
    code: "ms",
    operatedBy: "EgyptAir"
  },
  
  price: {
    amount: "2,660.00",
    currency: "C$"
  },
  
  flights: [
    {
      route: "Nairobi → Washington",
      date: "Mon, Jul 28", 
      duration: "30h 15m",
      stops: "1 Stop",
      segments: [
        {
          flightNumber: "MS 850",
          class: "Economy",
          aircraft: "Boeing 737-800",
          departure: { time: "5:55 AM", date: "Jul 28", airport: "Nairobi, NBO" },
          arrival: { time: "11:05 AM", date: "Jul 28", airport: "Cairo, CAI" },
          duration: "5:10",
          meal: "Meal",
          airlineCode: "ms"
        },
        {
          flightNumber: "MS 981",
          class: "Economy",
          aircraft: "Boeing 787-9",
          departure: { time: "12:20 AM", date: "Jul 28", airport: "Cairo, CAI" },
          arrival: { time: "5:10 AM", date: "Jul 29", airport: "Washington, IAD" },
          duration: "11:50",
          meal: "Meal",
          airlineCode: "ms"
        }
      ],
      layovers: [
        { location: "Cairo", duration: "13h 15m" }
      ]
    },
    {
      route: "Washington → Nairobi",
      date: "Wed, Aug 20",
      duration: "22h 7m", 
      stops: "1 Stop",
      segments: [
        {
          flightNumber: "MS 982",
          class: "Economy", 
          aircraft: "Boeing 787-9",
          departure: { time: "7:00 PM", date: "Aug 20", airport: "Washington, IAD" },
          arrival: { time: "11:55 PM", date: "Aug 21", airport: "Cairo, CAI" },
          duration: "10:55",
          meal: "Meal",
          airlineCode: "ms"
        },
        {
          flightNumber: "MS 851",
          class: "Economy",
          aircraft: "Boeing 737-800", 
          departure: { time: "3:45 AM", date: "Aug 21", airport: "Cairo, CAI" },
          arrival: { time: "7:10 AM", date: "Aug 21", airport: "Nairobi, NBO" },
          duration: "4:25",
          meal: "Meal",
          airlineCode: "ms"
        }
      ],
      layovers: [
        { location: "Cairo", duration: "3h 50m" }
      ]
    }
  ],
  
  baggage: "2pcs",

  customization: {
    agentName: 'Vasan Oneill',
    agentEmail: 'vasan.oneill.w@asaptickets.com',
    agentPhone: '(888) 806-4059',
    companyName: 'ASAP Tickets',
    confirmationCode: 'CPYSVV',
    logoUrl: '',
  }
};

const CheckIcon = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>
);

const BaggageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 400 512" fill="currentColor">
    <path d="M400 64h-48V32c0-17.6-14.4-32-32-32H192c-17.6 0-32 14.4-32 32v32h-48C67.2 64 32 99.2 32 144v240c0 44.8 35.2 80 80 80h16v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16h192v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16h16c44.8 0 80-35.2 80-80V144c0-44.8-35.2-80-80-80zM192 64h128V32H192v32z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Custom Date Input Component
const DateInput = ({ value, onChange, placeholder, ...props }) => {
  const [displayValue, setDisplayValue] = useState(value || '');

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const formatDate = (input) => {
    // Remove any non-numeric characters
    const numbersOnly = input.replace(/\D/g, '');
    
    // Apply DD/MM/YYYY formatting
    if (numbersOnly.length <= 2) {
      return numbersOnly;
    } else if (numbersOnly.length <= 4) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    } else {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
    }
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatDate(input);
    setDisplayValue(formatted);
    
    // Only call onChange if we have a complete date (DD/MM/YYYY)
    if (formatted.length === 10) {
      const [day, month, year] = formatted.split('/');
      // Convert to YYYY-MM-DD format for consistency
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      onChange(isoDate);
    } else {
      onChange(formatted);
    }
  };

  const handleKeyDown = (e) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder || "DD/MM/YYYY"}
      maxLength={10}
      className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-b-1 focus:border focus:border-b-blue-500 placeholder-gray-400"
      {...props}
    />
  );
};

const CountdownTimer = ({ onClose, isClosed }) => {
  const [hours, setHours] = useState(COUNTDOWN_CONFIG.initialHours);
  const [minutes, setMinutes] = useState(COUNTDOWN_CONFIG.initialMinutes);
  const [seconds, setSeconds] = useState(COUNTDOWN_CONFIG.initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev > 0) return prev - 1;
        
        setMinutes(prevMin => {
          if (prevMin > 0) return prevMin - 1;
          
          setHours(prevHour => {
            if (prevHour > 0) return prevHour - 1;
            return 0;
          });
          return 59;
        });
        return 59;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalHours = hours + (minutes / 60) + (seconds / 3600);
  const isUrgentTime = totalHours < 4;
  const bgColor = isUrgentTime ? 'bg-red-200' : 'bg-green-200 ';
  const textColor = isUrgentTime ? 'text-red-700' : 'text-green-700';
  const borderColor = isUrgentTime ? 'border border-red-600' : 'border-green-600';

  if (isClosed) {
    return (
      <div className={`${bgColor} ${textColor} ${borderColor} px-4 py-3 rounded-lg mb-4 flex items-center justify-between text-sm border-l-4 border-white`}>
        <div className="flex items-center gap-3">
          <span className="font-medium">Book now before tickets run out!</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 px-2 py-1 rounded text-center min-w-[32px] text-lg font-bold">
                {hours.toString().padStart(2, '0')}
              </div>
              <span className="text-xs">Hours</span>
            </div>
            <span className="text-lg font-bold">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 px-2 py-1 rounded text-center min-w-[32px] text-lg font-bold">
                {minutes.toString().padStart(2, '0')}
              </div>
              <span className="text-xs">Minutes</span>
            </div>
            <span className="text-lg font-bold">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 px-2 py-1 rounded text-center min-w-[32px] text-lg font-bold">
                {seconds.toString().padStart(2, '0')}
              </div>
              <span className="text-xs">Seconds</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} ${textColor} ${borderColor} px-4 py-3 rounded-md mb-4 flex items-center justify-between text-sm relative`}>
      <div className="flex items-center gap-2">
        <WarningIcon />
        <span>Book now before tickets run out!</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <div className="bg-white/20 px-2 py-1 rounded text-center min-w-[32px] text-lg font-bold">
              {hours.toString().padStart(2, '0')}
            </div>
            <span className="text-xs">Hours</span>
          </div>
          <span className="text-lg font-bold">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-white/20 px-2 py-1 rounded text-center min-w-[32px] text-lg font-bold">
              {minutes.toString().padStart(2, '0')}
            </div>
            <span className="text-xs">Minutes</span>
          </div>
          <span className="text-lg font-bold">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-white/20 px-2 py-1 rounded text-center min-w-[32px] text-lg font-bold">
              {seconds.toString().padStart(2, '0')}
            </div>
            <span className="text-xs">Seconds</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-white/10 rounded p-1"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

const FlightCard = ({ flight, flightConfig }) => {
  return (
    <div className="mb-8">
      {/* Flight Route Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-xl font-medium text-gray-700">{flight.route} {flight.date}</div>
        <div className="text-right text-sm text-gray-500">
          <div>Travel time: {flight.duration} • {flight.stops}</div>
        </div>
      </div>

      {/* Flight Card */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {flight.segments.map((segment, segmentIndex) => (
          <div key={segmentIndex}>
            {/* Flight Segment */}
            <div className="flex gap-4 p-4">
              {/* Left Column - Airline Info */}
              <div className="flex flex-col items-center w-20 flex-shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <img 
                    src={flightConfig.customization?.logoUrl || logo} 
                    alt={flightConfig.airline.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                </div>
                <div className="text-xs text-center text-gray-600 leading-tight">
                  <div className="font-medium">{segment.flightNumber}</div>
                  <div>{segment.class}</div>
                  <div>{segment.aircraft}</div>
                </div>
              </div>

              {/* Right Column - Flight Timeline */}
              <div className="flex-1">
                {/* Departure */}
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-md font-medium text-gray-700">
                      {segment.departure.time}
                    </span>
                    <span className="text-xs text-gray-500 align-top">
                      {segment.departure.date.slice(-2)}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {segment.departure.airport}
                    </span>
                  </div>
                </div>

                {/* Flight Duration */}
                <div className="ml-7 mb-3">
                  <span className="text-xs text-gray-500">Flight time: {segment.duration}</span>
                </div>

                {/* Arrival */}
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-full mr-4"></div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-md text-gray-700">
                      {segment.arrival.time}
                    </span>
                    <span className="text-xs text-gray-500 align-top">
                      {segment.arrival.date.slice(-2)}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      {segment.arrival.airport}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Layover */}
            {segmentIndex < flight.layovers.length && (
              <div className="bg-white mx-4 px-4 py-1 text-left border-t border-b border-gray-300">
                <span className="text-xs text-red-500">
                  {flight.layovers[segmentIndex].duration} long layover
                </span>
                <span className='text-xs text-gray-500'>
                  {' in '}{flight.layovers[segmentIndex].location}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flightConfig, setFlightConfig] = useState(DEFAULT_FLIGHT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [configSource, setConfigSource] = useState('default');

  const [passengers, setPassengers] = useState([
    {
      id: 1,
      gender: '',
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: ''
    }
  ]);

  const [isHovered, setIsHovered] = useState(false);
  const [isUrgencyBannerClosed, setIsUrgencyBannerClosed] = useState(false);

  // Function to calculate total price based on number of passengers
  const calculateTotalPrice = () => {
    const basePriceString = flightConfig.price.amount.replace(/,/g, '');
    const basePrice = parseFloat(basePriceString) || 0;
    const totalPrice = basePrice * passengers.length;
    return totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Function to get price display text
  const getPriceDisplayText = () => {
    if (passengers.length === 1) {
      return "Total per adult";
    } else {
      return `Total for ${passengers.length} passengers`;
    }
  };

  // Debug: Log import status
  useEffect(() => {
    console.log("🔍 FlightService status:", flightService ? "✅ Imported" : "❌ Failed");
    if (flightService) {
      console.log("🔧 Available methods:", Object.keys(flightService));
    }
  }, []);

  // Debug: Log current URL and search params
  useEffect(() => {
    console.log("🌐 Current location:", location);
    console.log("🔍 Search params:", location.search);
    console.log("📄 Full URL:", window.location.href);
    
    const urlParams = new URLSearchParams(location.search);
    console.log("🎯 Template ID:", urlParams.get('template'));
    console.log("📦 Encoded data:", urlParams.get('data'));
    
    // Check for old format parameters
    const hasOldParams = urlParams.get('airline') || urlParams.get('price') || urlParams.get('dep_route');
    console.log("🔄 Has old format params:", hasOldParams);
  }, [location]);

  // Load flight configuration on component mount
  useEffect(() => {
    const loadFlightConfiguration = async () => {
      try {
        console.log("🚀 Starting flight configuration loading...");
        setLoading(true);
        
        const urlParams = new URLSearchParams(location.search);
        const templateId = urlParams.get('template');
        const encodedData = urlParams.get('data');
        
        // Check for old format parameters
        const hasOldParams = urlParams.get('airline') || urlParams.get('price') || urlParams.get('dep_route');

        console.log("🔧 URL Parameters:", { templateId, encodedData, hasOldParams });

        if (templateId) {
          console.log("📋 Loading from template ID:", templateId);
          
          if (!flightService) {
            throw new Error('flightService not available - check import');
          }

          try {
            const template = await flightService.getFlightConfig(templateId);
            console.log("✅ Template loaded successfully:", template);
            
            // Ensure airlineCode is set for each segment if not present
            const processedTemplate = {
              ...template,
              flights: template.flights.map(flight => ({
                ...flight,
                segments: flight.segments.map(segment => ({
                  ...segment,
                  airlineCode: segment.airlineCode || template.airline.code
                }))
              }))
            };
            
            setFlightConfig(processedTemplate);
            setConfigSource('template');
            
            // Update analytics
            await flightService.incrementClickCount(templateId);
            console.log("📊 Analytics updated for template:", templateId);
            
          } catch (error) {
            console.error("❌ Error loading template:", error);
            setError(`Template not found: ${error.message}`);
            setFlightConfig(DEFAULT_FLIGHT_CONFIG);
            setConfigSource('default');
          }
        } else if (encodedData) {
          console.log("🔓 Decoding data from URL");
          
          if (!flightService) {
            throw new Error('flightService not available - check import');
          }

          try {
            const decodedConfig = flightService.decodeFlightDataFromUrl(encodedData);
            console.log("✅ Data decoded successfully:", decodedConfig);
            
            // Ensure airlineCode is set for each segment if not present
            const processedConfig = {
              ...decodedConfig,
              flights: decodedConfig.flights.map(flight => ({
                ...flight,
                segments: flight.segments.map(segment => ({
                  ...segment,
                  airlineCode: segment.airlineCode || decodedConfig.airline.code
                }))
              }))
            };
            
            setFlightConfig(processedConfig);
            setConfigSource('encoded');
          } catch (error) {
            console.error("❌ Error decoding flight data:", error);
            setError(`Invalid flight data: ${error.message}`);
            setFlightConfig(DEFAULT_FLIGHT_CONFIG);
            setConfigSource('default');
          }
        } else if (hasOldParams && flightService && flightService.parseOldUrlFormat) {
          console.log("🔄 Parsing old URL format");
          
          try {
            const oldConfig = flightService.parseOldUrlFormat(urlParams);
            console.log("✅ Old format parsed successfully:", oldConfig);
            
            setFlightConfig(oldConfig);
            setConfigSource('legacy');
          } catch (error) {
            console.error("❌ Error parsing old URL format:", error);
            setError(`Failed to parse URL: ${error.message}`);
            setFlightConfig(DEFAULT_FLIGHT_CONFIG);
            setConfigSource('default');
          }
        } else {
          console.log("🔄 Using default configuration");
          setFlightConfig(DEFAULT_FLIGHT_CONFIG);
          setConfigSource('default');
        }
      } catch (error) {
        console.error("💥 Fatal error loading flight configuration:", error);
        setError(`Failed to load flight data: ${error.message}`);
        setFlightConfig(DEFAULT_FLIGHT_CONFIG);
        setConfigSource('default');
      } finally {
        setLoading(false);
        console.log("🏁 Flight configuration loading completed");
      }
    };

    loadFlightConfiguration();
  }, [location.search]);

  const handleInputChange = (passengerId, field, value) => {
    setPassengers(prev => prev.map(passenger => 
      passenger.id === passengerId 
        ? { ...passenger, [field]: value }
        : passenger
    ));
  };

  const addPassenger = () => {
    if (passengers.length < 9) {
      const newId = Math.max(...passengers.map(p => p.id)) + 1;
      setPassengers(prev => [...prev, {
        id: newId,
        gender: '',
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: ''
      }]);
    }
  };

  const removePassenger = (passengerId) => {
    if (passengers.length > 1) {
      setPassengers(prev => prev.filter(passenger => passenger.id !== passengerId));
    }
  };

  const handleBooking = async () => {
    setBookingLoading(true);
    
    try {
      let isValid = true;
      let firstError = '';

      for (let passenger of passengers) {
        if (!passenger.gender) {
          isValid = false;
          if (!firstError) firstError = 'Please select gender for all passengers';
          break;
        }

        if (!passenger.firstName.trim()) {
          isValid = false;
          if (!firstError) firstError = 'Please enter first name for all passengers';
          break;
        }

        if (!passenger.lastName.trim()) {
          isValid = false;
          if (!firstError) firstError = 'Please enter last name for all passengers';
          break;
        }

        if (!passenger.dateOfBirth) {
          isValid = false;
          if (!firstError) firstError = 'Please enter date of birth for all passengers';
          break;
        }
      }

      if (!isValid) {
        alert(firstError);
        setBookingLoading(false);
        return;
      }

      // Prepare booking data
      const bookingData = {
        passengers: passengers,
        flightConfig: flightConfig,
        bookingTimestamp: new Date(),
        totalPrice: calculateTotalPrice(), // Use calculated total price
        currency: flightConfig.price.currency,
        agentInfo: flightConfig.customization,
        flightDetails: {
          airline: flightConfig.airline,
          flights: flightConfig.flights,
          baggage: flightConfig.baggage
        }
      };

      console.log("💾 Saving booking data:", bookingData);

      // Save to Firebase
      const bookingId = await flightService.saveUserBooking(bookingData);
      
      console.log("✅ Booking saved with ID:", bookingId);

      // Navigate to payment page with booking ID
      navigate(`/payment?booking=${bookingId}`);

    } catch (error) {
      console.error("❌ Error processing booking:", error);
      alert(`Failed to process booking: ${error.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCloseUrgencyBanner = () => {
    setIsUrgencyBannerClosed(true);
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 font-sans flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading flight information...</p>
          <p className="mt-2 text-xs text-gray-500">Check browser console for debug logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-100 font-sans">
      {/* Debug Panel - Remove this in production */}
      <div className="bg-gray-900 text-white p-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto">
          🐛 DEBUG: Config Source: <span className="text-green-400">{configSource}</span> | 
          FlightService: <span className={flightService ? "text-green-400" : "text-red-400"}>{flightService ? "✅ Loaded" : "❌ Failed"}</span> | 
          URL: <span className="text-blue-400">{window.location.href}</span>
          {error && <span className="text-red-400"> | Error: {error}</span>}
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img
            src={logo}
            alt={`${flightConfig.customization?.companyName || 'ASAP Tickets'} Logo`}
            className="h-8 w-auto"
            style={{ display: 'block' }}
            onError={(e) => {
              e.target.src = logo;
            }}
          />
        </div>
        
        <div className="hidden md:flex gap-8 text-gray-600 text-sm">
          <span
            className="cursor-pointer hover:text-gray-800"
            onClick={() => window.open('https://www.asaptickets.com/about', '_blank')}
          >
            About Us
          </span>
          <span
            className="cursor-pointer hover:text-gray-800"
            onClick={() => window.open('https://www.asaptickets.com/reviews', '_blank')}
          >
            Reviews
          </span>
          <span
            className="cursor-pointer hover:text-gray-800"
            onClick={() => window.open('https://www.asaptickets.com/privacy', '_blank')}
          >
            Privacy Policy
          </span>
          <span
            className="cursor-pointer hover:text-gray-800"
            onClick={() => window.open('https://www.asaptickets.com/customer-service/rules-conditions', '_blank')}
          >
            Terms & Conditions
          </span>
          <span
            className="cursor-pointer hover:text-gray-800"
            onClick={() => window.open('#', '_blank')}
          >
            Language (English) ▼
          </span>
        </div>
        
        <div className="text-right text-sm text-gray-600">
          <div>Travel agent <span className="font-bold text-gray-800">{flightConfig.customization?.agentEmail || 'vasan.oneill.w@asaptickets.com'}</span></div>
          <div><span className="font-bold text-gray-800">{flightConfig.customization?.agentName || 'Vasan Oneill'}</span> {flightConfig.customization?.agentPhone || '(888) 806 - 4059'}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="text-white px-8 py-5 flex justify-between items-center" style={{backgroundColor: '#306cac'}}>
        <div>
          <h2 className="text-lg font-medium mb-1">Please, choose the flight and check passenger details</h2>
          <p className="text-sm text-white/90">Tickets at a good price are almost in your hands!</p>
        </div>
        
        <div className="hidden md:flex gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-sm" style={{color: '#306cac'}}>
              <CheckIcon />
            </div>
            <div className="text-sm">Request a<br/>quote</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-sm" style={{color: '#306cac'}}>
              <CheckIcon />
            </div>
            <div className="text-sm">Review flight<br/>options</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-sm" style={{color: '#306cac'}}>
              3
            </div>
            <div className="text-sm">Choose best<br/>flight</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div className="text-sm text-white/70">Complete<br/>payment</div>
          </div>
        </div>
      </div>

      {/* Configuration Source Indicator */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-8 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {configSource !== 'default' && !error && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-8 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {configSource === 'template' && 'Flight configuration loaded from saved template.'}
                {configSource === 'encoded' && 'Flight configuration loaded from shared URL.'}
                {configSource === 'legacy' && 'Flight configuration parsed from legacy URL format.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-4 px-5 py-5">
        {/* Left Panel */}
        <div className="flex-auto w-1/4 bg-white rounded-lg p-5 shadow-lg">
          {/* Flight Details Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-gray-600">Flight details</div>
              <div className="flex items-center gap-2 text-md font-bold text-red-400 cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <span>Alternative Dates</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm" style={{color: '#306cac'}}>
              <span>Baggage:</span>
              <span className="font-bold">{flightConfig.baggage}</span>
              <BaggageIcon />
              <BaggageIcon />
            </div>
          </div>

          {/* Dynamic Flight Cards */}
          {flightConfig.flights.map((flight, index) => (
            <FlightCard key={index} flight={flight} flightConfig={flightConfig} />
          ))}
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white rounded-lg p-5 shadow-lg h-fit">
          {/* Passenger Details */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Passenger details ({passengers.length} passenger{passengers.length !== 1 ? 's' : ''})
            </h3>
            
            {passengers.map((passenger, index) => (
              <div key={passenger.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base font-semibold text-gray-700">Passenger {index + 1}</h4>
                  {passengers.length > 1 && (
                    <div
                      onClick={() => removePassenger(passenger.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </div>
                  )}
                </div>
                
                {/* Gender */}
                <div className="mb-4 flex">
                  <div className='px-2 py-0'>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Gender <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input 
                          type="radio" 
                          name={`gender-${passenger.id}`}
                          value="Male" 
                          checked={passenger.gender === 'Male'}
                          onChange={(e) => handleInputChange(passenger.id, 'gender', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          passenger.gender === 'Male' 
                            ? 'border-[#306cac] bg-[#306cac]' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {passenger.gender === 'Male' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input 
                          type="radio" 
                          name={`gender-${passenger.id}`}
                          value="Female" 
                          checked={passenger.gender === 'Female'}
                          onChange={(e) => handleInputChange(passenger.id, 'gender', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          passenger.gender === 'Female' 
                            ? 'border-[#306cac] bg-[#306cac]' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {passenger.gender === 'Female' && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">Female</span>
                    </label>
                  </div>
                  </div>
                  {/* Disclaimer for this passenger */}
                  <div className="ml-10 text-xs text-gray-700 leading-relaxed ">
                    The passenger names must match the travel documents. Name changes are not allowed.
                  </div>
                </div>

                {/* Name Fields Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* First Name */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      First name <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="First name"
                      value={passenger.firstName}
                      onChange={(e) => handleInputChange(passenger.id, 'firstName', e.target.value)}
                      className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-b-1 focus:border focus:border-b-blue-500 placeholder-gray-400"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Last name <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Last name"
                      value={passenger.lastName}
                      onChange={(e) => handleInputChange(passenger.id, 'lastName', e.target.value)}
                      className="text-gray-800 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-b-1 focus:border focus:border-b-blue-500 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Middle Name and Date of Birth Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Middle Name */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Middle name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Middle name"
                      value={passenger.middleName}
                      onChange={(e) => handleInputChange(passenger.id, 'middleName', e.target.value)}
                      className=" text-gray-800 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-b-1 focus:border focus:border-b-blue-500 placeholder-gray-400"
                    />
                  </div>

                  {/* Date of Birth - Custom Component */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-600">*</span>
                    </label>
                    <DateInput
                      value={passenger.dateOfBirth}
                      onChange={(value) => handleInputChange(passenger.id, 'dateOfBirth', value)}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Passenger Button */}
            {passengers.length < 9 && (
                <div
                  onClick={addPassenger}
                  onMouseEnter={e => e.currentTarget.style.color = '#284c74'}
                  onMouseLeave={e => e.currentTarget.style.color = '#306cac'}
                  className="flex items-center gap-2 font-semibold  mb-4 cursor-pointer"
                  style={{ color: '#306cac' }}
                >
                  <PlusIcon />
                  Add passenger (Max: 9)
                </div>
              )}

            {/* Info Box */}
            <div className="bg-green-50 border border-green-200 rounded-sm p-3 flex items-start gap-3 mb-4">
              <InfoIcon className="text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-bold text-green-800">
                The quoted prices are not guaranteed until the tickets are issued
              </p>
            </div>
          </div>

          {/* Urgency Banner - appears below passenger details */}
          {!isUrgencyBannerClosed && (
            <CountdownTimer 
              onClose={handleCloseUrgencyBanner}
              isClosed={true}
            />
          )}
        </div>
      </div>

      {/* Price Section - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 shadow-lg z-10">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Left side - Airline logo and name */}
          <div className="flex items-center w-1/2">
            <div className="flex items-center gap-3">
              <div className="w-20 h-auto rounded flex items-center justify-center bg-gray-50">
                <img 
                  src={flightConfig.customization?.logoUrl || logo} 
                  alt={flightConfig.airline.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="text-xs font-bold text-gray-500 hidden">LOGO</span>
              </div>
              <div className="flex flex-col justify-center pl-3">
                <span className="text-lg font-bold" style={{ color: '#306cac' }}>
                  {flightConfig.airline?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Price and button */}
          <div className="flex items-center gap-4 w-1/2 justify-end">
            {/* Price section with dropdown arrow */}
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-600">
                  {flightConfig.price.currency} {calculateTotalPrice()}
                </div>
                <div className="text-md text-gray-800">{getPriceDisplayText()}</div>
              </div>
            </div>

            {/* Call to Book button */}
            <div 
              onClick={bookingLoading ? null : handleBooking}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`text-white rounded-xs px-16 py-3 align-middle font-medium text-sm transition-colors flex items-center gap-2 max-w-[200px] shadow-xl active:shadow-none ${
                bookingLoading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
              }`}
              style={{
                backgroundColor: bookingLoading ? '#94a3b8' : (isHovered ? '#284c74' : '#306cac')
              }}
            >
              {bookingLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className='font-semibold'>Processing...</span>
                </>
              ) : (
                <span className='font-semibold'>Book Now</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom padding to prevent content from being hidden behind fixed price section */}
      <div className="h-20"></div>
    </div>
  );
};

export default HomePage;