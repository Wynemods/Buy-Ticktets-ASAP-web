export const encodeFlightData = (flightConfig) => {
  // Convert flight config to URL-safe parameters
  const params = new URLSearchParams();
  
  // Basic flight info
  params.set('airline', flightConfig.airline.name);
  params.set('price', flightConfig.price.amount);
  params.set('currency', flightConfig.price.currency);
  params.set('baggage', flightConfig.baggage);
  
  // Outbound flight
  const outbound = flightConfig.flights[0];
  params.set('dep_route', outbound.route);
  params.set('dep_date', outbound.date);
  params.set('dep_duration', outbound.duration);
  params.set('dep_stops', outbound.stops);
  
  // Return flight
  const returnFlight = flightConfig.flights[1];
  params.set('ret_route', returnFlight.route);
  params.set('ret_date', returnFlight.date);
  params.set('ret_duration', returnFlight.duration);
  params.set('ret_stops', returnFlight.stops);
  
  // Flight segments (simplified - you can expand this)
  params.set('dep_segments', JSON.stringify(outbound.segments));
  params.set('ret_segments', JSON.stringify(returnFlight.segments));
  params.set('dep_layovers', JSON.stringify(outbound.layovers));
  params.set('ret_layovers', JSON.stringify(returnFlight.layovers));
  
  return params.toString();
};

export const decodeFlightData = (searchParams) => {
  if (!searchParams.get('airline')) {
    // Return default config if no parameters
    return null;
  }
  
  try {
    return {
      airline: {
        name: searchParams.get('airline') || "EGYPTAIR",
        operatedBy: searchParams.get('airline') || "EgyptAir"
      },
      price: {
        amount: searchParams.get('price') || "2,660.00",
        currency: searchParams.get('currency') || "C$"
      },
      flights: [
        {
          route: searchParams.get('dep_route') || "Nairobi → Washington",
          date: searchParams.get('dep_date') || "Mon, Jul 28",
          duration: searchParams.get('dep_duration') || "30h 15m",
          stops: searchParams.get('dep_stops') || "1 Stop",
          segments: JSON.parse(searchParams.get('dep_segments') || '[]'),
          layovers: JSON.parse(searchParams.get('dep_layovers') || '[]')
        },
        {
          route: searchParams.get('ret_route') || "Washington → Nairobi",
          date: searchParams.get('ret_date') || "Wed, Aug 20",
          duration: searchParams.get('ret_duration') || "22h 7m",
          stops: searchParams.get('ret_stops') || "1 Stop",
          segments: JSON.parse(searchParams.get('ret_segments') || '[]'),
          layovers: JSON.parse(searchParams.get('ret_layovers') || '[]')
        }
      ],
      baggage: searchParams.get('baggage') || "2pcs"
    };
  } catch (error) {
    console.error('Error decoding flight data:', error);
    return null;
  }
};

export const generateFlightUrl = (baseUrl, flightConfig) => {
  const params = encodeFlightData(flightConfig);
  return `${baseUrl}?${params}`;
};
