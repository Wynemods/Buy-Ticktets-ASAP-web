import React, { useState, useEffect } from 'react';
import { Plus, Minus, Copy, Eye, Save, Trash2, Calendar, Clock, Plane, MapPin, Loader } from 'lucide-react';
import flightService from '../services/FlightService';

const FlightConfigGenerator = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState('');
  const [generatedUrls, setGeneratedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [flightConfig, setFlightConfig] = useState({
    templateName: '',
    templateDescription: '',
    airline: {
      name: 'EGYPTAIR',
      code: 'MS',
      operatedBy: 'EgyptAir'
    },
    price: {
      amount: '2,660.00',
      currency: 'USD',
      originalPrice: ''
    },
    flights: [
      {
        type: 'outbound',
        route: 'New York → London',
        date: 'Mon, Dec 15',
        duration: '7h 30m',
        stops: 'Nonstop',
        segments: [
          {
            flightNumber: 'MS 850',
            class: 'Economy',
            aircraft: 'Boeing 787-9',
            departure: {
              time: '10:30 PM',
              date: 'Dec 15',
              airport: 'New York, JFK',
              terminal: 'Terminal 4'
            },
            arrival: {
              time: '9:00 AM',
              date: 'Dec 16',
              airport: 'London, LHR',
              terminal: 'Terminal 5'
            },
            duration: '7:30',
            meal: 'Meal'
          }
        ],
        layovers: []
      },
      {
        type: 'return',
        route: 'London → New York',
        date: 'Mon, Dec 22',
        duration: '8h 45m',
        stops: 'Nonstop',
        segments: [
          {
            flightNumber: 'MS 851',
            class: 'Economy',
            aircraft: 'Boeing 787-9',
            departure: {
              time: '2:15 PM',
              date: 'Dec 22',
              airport: 'London, LHR',
              terminal: 'Terminal 5'
            },
            arrival: {
              time: '5:00 PM',
              date: 'Dec 22',
              airport: 'New York, JFK',
              terminal: 'Terminal 4'
            },
            duration: '8:45',
            meal: 'Meal'
          }
        ],
        layovers: []
      }
    ],
    baggage: '2pcs',
    additionalServices: {
      travelCare: true,
      dreamPass: true,
      baggageProtection: true
    },
    customization: {
      agentName: 'Vasan Oneill',
      agentEmail: 'vasan.oneill.w@asaptickets.com',
      agentPhone: '(888) 806-4059',
      companyName: 'ASAP Tickets',
      confirmationCode: 'CPYSVV',
      logoUrl: '',
      agentLogoUrl: '',
      campaignLogoUrl: ''
    }
  });

  useEffect(() => {
    loadSavedTemplates();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadSavedTemplates = async () => {
    try {
      setLoading(true);
      const templates = await flightService.getAllFlightConfigs(20);
      setSavedTemplates(templates);
    } catch (error) {
      setError('Failed to load saved templates');
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = async (templateId) => {
    try {
      setLoading(true);
      const template = await flightService.getFlightConfig(templateId);
      setFlightConfig(template);
      setCurrentTemplate(templateId);
      setSuccess('Template loaded successfully!');
    } catch (error) {
      setError('Failed to load template');
      console.error('Error loading template:', error);
    } finally {
      setLoading(false);
    }
  };

  const duplicateTemplate = async (template) => {
    const duplicatedConfig = {
      ...template,
      templateName: `${template.templateName} (Copy)`,
      templateDescription: `Copy of ${template.templateDescription || template.templateName}`
    };
    setFlightConfig(duplicatedConfig);
    setCurrentTemplate('');
    setSuccess('Template duplicated! You can now modify and save it.');
  };

  const updateFlightConfig = (path, value) => {
    setFlightConfig(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addSegment = (flightIndex) => {
    const newSegment = {
      flightNumber: '',
      class: 'Economy',
      aircraft: '',
      departure: {
        time: '',
        date: '',
        airport: '',
        terminal: ''
      },
      arrival: {
        time: '',
        date: '',
        airport: '',
        terminal: ''
      },
      duration: '',
      meal: 'Meal'
    };
    
    setFlightConfig(prev => ({
      ...prev,
      flights: prev.flights.map((flight, index) => 
        index === flightIndex 
          ? { ...flight, segments: [...flight.segments, newSegment] }
          : flight
      )
    }));
  };

  const removeSegment = (flightIndex, segmentIndex) => {
    setFlightConfig(prev => ({
      ...prev,
      flights: prev.flights.map((flight, index) => 
        index === flightIndex 
          ? { 
              ...flight, 
              segments: flight.segments.filter((_, sIndex) => sIndex !== segmentIndex)
            }
          : flight
      )
    }));
  };

  const addLayover = (flightIndex) => {
    const newLayover = {
      location: '',
      duration: '',
      terminal: ''
    };
    
    setFlightConfig(prev => ({
      ...prev,
      flights: prev.flights.map((flight, index) => 
        index === flightIndex 
          ? { ...flight, layovers: [...flight.layovers, newLayover] }
          : flight
      )
    }));
  };

  const removeLayover = (flightIndex, layoverIndex) => {
    setFlightConfig(prev => ({
      ...prev,
      flights: prev.flights.map((flight, index) => 
        index === flightIndex 
          ? { 
              ...flight, 
              layovers: flight.layovers.filter((_, lIndex) => lIndex !== layoverIndex)
            }
          : flight
      )
    }));
  };

  const saveTemplate = async () => {
    if (!flightConfig.templateName.trim()) {
      setError('Please enter a template name');
      return;
    }
    
    try {
      setLoading(true);
      const templateId = await flightService.saveFlightConfig(flightConfig);
      
      // Generate URL with template ID
      const templateUrl = flightService.generateFlightUrl(templateId);
      
      const newUrl = {
        id: Date.now(),
        name: flightConfig.templateName,
        description: flightConfig.templateDescription,
        url: templateUrl,
        templateId: templateId,
        createdAt: new Date(),
        clicks: 0
      };
      
      setGeneratedUrls(prev => [newUrl, ...prev]);
      setCurrentTemplate(templateId);
      setSuccess('Template saved successfully!');
      
      // Reload templates to show the new one
      await loadSavedTemplates();
    } catch (error) {
      setError('Failed to save template');
      console.error('Error saving template:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTempUrl = () => {
    try {
      // Generate URL with encoded flight data (temporary, not saved to database)
      const tempUrl = flightService.generateFlightUrl(null, flightConfig);
      
      const newUrl = {
        id: Date.now(),
        name: `${flightConfig.templateName || 'Unnamed'} (Temporary)`,
        description: 'Temporary URL - not saved as template',
        url: tempUrl,
        templateId: null,
        createdAt: new Date(),
        clicks: 0,
        temporary: true
      };
      
      setGeneratedUrls(prev => [newUrl, ...prev]);
      setSuccess('Temporary URL generated successfully!');
    } catch (error) {
      setError('Failed to generate temporary URL');
      console.error('Error generating temp URL:', error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('URL copied to clipboard!');
    } catch (error) {
      setError('Failed to copy URL to clipboard');
    }
  };

  const previewBookingPage = (url) => {
    window.open(url, '_blank');
  };

  const airlines = [
    { code: 'MS', name: 'EGYPTAIR' },
    { code: 'BA', name: 'BRITISH AIRWAYS' },
    { code: 'AA', name: 'AMERICAN AIRLINES' },
    { code: 'DL', name: 'DELTA' },
    { code: 'UA', name: 'UNITED' },
    { code: 'LH', name: 'LUFTHANSA' },
    { code: 'AF', name: 'AIR FRANCE' },
    { code: 'KL', name: 'KLM' },
    { code: 'SQ', name: 'SINGAPORE AIRLINES' },
    { code: 'EK', name: 'EMIRATES' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

  const aircraftTypes = [
    'Boeing 737-800', 'Boeing 787-9', 'Boeing 777-300ER', 'Boeing 747-8',
    'Airbus A320', 'Airbus A350-900', 'Airbus A380', 'Airbus A330-300'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flight Configuration Generator</h1>
              <p className="text-gray-600 mt-1">Create and customize booking pages with unique URLs</p>
            </div>
            <div className="flex space-x-3">
              <div
                onClick={generateTempUrl}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                <span className="text-white">Generate Temp URL</span>
              </div>
              <div
                onClick={saveTemplate}
                disabled={loading || !flightConfig.templateName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="text-white">Save Template</span>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="text-red-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-screen mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'basic', label: 'Basic Info', icon: Plane },
                    { id: 'flights', label: 'Flight Details', icon: MapPin },
                    { id: 'customization', label: 'Customization', icon: Calendar }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-gray-600">{tab.label}</span>
                      </div>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Template Name *
                        </label>
                        <input
                          type="text"
                          value={flightConfig.templateName}
                          onChange={(e) => updateFlightConfig('templateName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          placeholder="e.g., NYC to London Premium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={flightConfig.templateDescription}
                          onChange={(e) => updateFlightConfig('templateDescription', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          placeholder="Brief description"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Airline
                        </label>
                        <select
                          value={flightConfig.airline.name}
                          onChange={(e) => {
                            const selected = airlines.find(a => a.name === e.target.value);
                            updateFlightConfig('airline.name', selected.name);
                            updateFlightConfig('airline.code', selected.code);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                        >
                          {airlines.map(airline => (
                            <option key={airline.code} value={airline.name} className="text-gray-600">
                              {airline.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Price
                        </label>
                        <input
                          type="text"
                          value={flightConfig.price.amount}
                          onChange={(e) => updateFlightConfig('price.amount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          placeholder="2,660.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Currency
                        </label>
                        <select
                          value={flightConfig.price.currency}
                          onChange={(e) => updateFlightConfig('price.currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                        >
                          {currencies.map(currency => (
                            <option key={currency} value={currency} className="text-gray-600">
                              {currency}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Original Price (optional)
                        </label>
                        <input
                          type="text"
                          value={flightConfig.price.originalPrice}
                          onChange={(e) => updateFlightConfig('price.originalPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          placeholder="3,200.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Baggage Allowance
                        </label>
                        <input
                          type="text"
                          value={flightConfig.baggage}
                          onChange={(e) => updateFlightConfig('baggage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          placeholder="2pcs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Flight Details Tab */}
                {activeTab === 'flights' && (
                  <div className="space-y-8">
                    {flightConfig.flights.map((flight, flightIndex) => (
                      <div key={flightIndex} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 text-gray-600">
                          <Plane className="w-5 h-5" />
                          <span>{flight.type === 'outbound' ? 'Outbound Flight' : 'Return Flight'}</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Route
                            </label>
                            <input
                              type="text"
                              value={flight.route}
                              onChange={(e) => updateFlightConfig(`flights.${flightIndex}.route`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                              placeholder="New York → London"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Date
                            </label>
                            <input
                              type="text"
                              value={flight.date}
                              onChange={(e) => updateFlightConfig(`flights.${flightIndex}.date`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                              placeholder="Mon, Dec 15"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={flight.duration}
                              onChange={(e) => updateFlightConfig(`flights.${flightIndex}.duration`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                              placeholder="7h 30m"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Stops
                            </label>
                            <select
                              value={flight.stops}
                              onChange={(e) => updateFlightConfig(`flights.${flightIndex}.stops`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                            >
                              <option value="Nonstop" className="text-gray-600">Nonstop</option>
                              <option value="1 Stop" className="text-gray-600">1 Stop</option>
                              <option value="2 Stops" className="text-gray-600">2 Stops</option>
                            </select>
                          </div>
                        </div>

                        {/* Flight Segments */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-600">Flight Segments</h4>
                            <div
                              onClick={() => addSegment(flightIndex)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-white">Add Segment</span>
                            </div>
                          </div>

                          {flight.segments.map((segment, segmentIndex) => (
                            <div key={segmentIndex} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                              <div className="flex justify-between items-center mb-4">
                                <h5 className="font-medium text-gray-600">Segment {segmentIndex + 1}</h5>
                                {flight.segments.length > 1 && (
                                  <div
                                    onClick={() => removeSegment(flightIndex, segmentIndex)}
                                    className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                                  >
                                    <Minus className="w-4 h-4" />
                                    <span className="text-gray-600">Remove</span>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Flight Number
                                  </label>
                                  <input
                                    type="text"
                                    value={segment.flightNumber}
                                    onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.flightNumber`, e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    placeholder="MS 850"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Aircraft
                                  </label>
                                  <select
                                    value={segment.aircraft}
                                    onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.aircraft`, e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                  >
                                    <option value="" className="text-gray-600">Select Aircraft</option>
                                    {aircraftTypes.map(aircraft => (
                                      <option key={aircraft} value={aircraft} className="text-gray-600">
                                        {aircraft}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Duration
                                  </label>
                                  <input
                                    type="text"
                                    value={segment.duration}
                                    onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.duration`, e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    placeholder="7:30"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h6 className="font-medium mb-2 text-green-700">Departure</h6>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      placeholder="Time (10:30 PM)"
                                      value={segment.departure.time}
                                      onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.departure.time`, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Date (Dec 15)"
                                      value={segment.departure.date}
                                      onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.departure.date`, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Airport (New York, JFK)"
                                      value={segment.departure.airport}
                                      onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.departure.airport`, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Terminal (Terminal 4)"
                                      value={segment.departure.terminal}
                                      onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.departure.terminal`, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <h6 className="font-medium mb-2 text-blue-700">Arrival</h6>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      placeholder="Time (9:00 AM)"
                                      value={segment.arrival.time}
                                      onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.arrival.time`, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Date (Dec 16)"
                                      value={segment.arrival.date}
                                      onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.arrival.date`, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Airport (London, LHR)"
                                      value={segment.arrival.airport}
                                      onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.arrival.airport`, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Terminal (Terminal 5)"
                                      value={segment.arrival.terminal}
                                      onChange={(e) => updateFlightConfig(`flights.${flightIndex}.segments.${segmentIndex}.arrival.terminal`, e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Layovers */}
                        {flight.layovers.length > 0 && (
                          <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium text-gray-600">Layovers</h4>
                              <div
                                onClick={() => addLayover(flightIndex)}
                                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 flex items-center space-x-1"
                              >
                                <Plus className="w-4 h-4" />
                                <span className="text-white">Add Layover</span>
                              </div>
                            </div>

                            {flight.layovers.map((layover, layoverIndex) => (
                              <div key={layoverIndex} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 mb-3">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-yellow-800">Layover {layoverIndex + 1}</h5>
                                  <div
                                    onClick={() => removeLayover(flightIndex, layoverIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <input
                                    type="text"
                                    placeholder="Location (Cairo)"
                                    value={layover.location}
                                    onChange={(e) => updateFlightConfig(`flights.${flightIndex}.layovers.${layoverIndex}.location`, e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-gray-600"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Duration (3h 15m)"
                                    value={layover.duration}
                                    onChange={(e) => updateFlightConfig(`flights.${flightIndex}.layovers.${layoverIndex}.duration`, e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-gray-600"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Terminal"
                                    value={layover.terminal}
                                    onChange={(e) => updateFlightConfig(`flights.${flightIndex}.layovers.${layoverIndex}.terminal`, e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-gray-600"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {flight.stops !== 'Nonstop' && flight.layovers.length === 0 && (
                          <div className="mt-4">
                            <div
                              onClick={() => addLayover(flightIndex)}
                              className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 flex items-center space-x-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-white">Add Layover</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Customization Tab */}
                {activeTab === 'customization' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-600">Branding & Logos</h3>
                      <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Main Company Logo URL
                          </label>
                          <input
                            type="url"
                            value={flightConfig.customization.logoUrl || ''}
                            onChange={(e) => updateFlightConfig('customization.logoUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                            placeholder="https://example.com/logo.png"
                          />
                          {flightConfig.customization.logoUrl && (
                            <div className="mt-2">
                              <img 
                                src={flightConfig.customization.logoUrl} 
                                alt="Company Logo Preview" 
                                className="h-12 object-contain border border-gray-200 rounded bg-white p-2"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="hidden text-sm text-red-500 mt-1">Failed to load logo</div>
                            </div>
                          )}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">Logo Usage Guide</h4>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• <strong>Main Logo:</strong> <span className="text-gray-600">Displayed in header/navbar of booking page</span></li>
                            <li>• <span className="text-gray-600">Recommended format: PNG with transparent background</span></li>
                            <li>• <span className="text-gray-600">Optimal size: 200x80px for main logo</span></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-600">Agent Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Agent Name
                          </label>
                          <input
                            type="text"
                            value={flightConfig.customization.agentName}
                            onChange={(e) => updateFlightConfig('customization.agentName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Agent Email
                          </label>
                          <input
                            type="email"
                            value={flightConfig.customization.agentEmail}
                            onChange={(e) => updateFlightConfig('customization.agentEmail', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Agent Phone
                          </label>
                          <input
                            type="text"
                            value={flightConfig.customization.agentPhone}
                            onChange={(e) => updateFlightConfig('customization.agentPhone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={flightConfig.customization.companyName}
                            onChange={(e) => updateFlightConfig('customization.companyName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-600">Additional Options</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Confirmation Code
                          </label>
                          <input
                            type="text"
                            value={flightConfig.customization.confirmationCode}
                            onChange={(e) => updateFlightConfig('customization.confirmationCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-600">Service Options</h3>
                      <div className="space-y-3">
                        {Object.entries(flightConfig.additionalServices).map(([key, value]) => (
                          <label key={key} className="flex items-center text-gray-600">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => updateFlightConfig(`additionalServices.${key}`, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generated URLs Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-600">Generated URLs</h2>
              
              {generatedUrls.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">No URLs generated yet.</p>
                  <p className="text-sm text-gray-600">Configure your flight and generate URLs.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {generatedUrls.map((url) => (
                    <div key={url.id} className={`border rounded-lg p-4 ${url.temporary ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-600 text-sm">{url.name}</h3>
                          {url.description && (
                            <p className="text-xs text-gray-600 mt-1">{url.description}</p>
                          )}
                        </div>
                        {url.temporary && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                            Temp
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all mb-3 max-h-20 overflow-hidden text-gray-600">
                        {url.url}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>Clicks: {url.clicks}</span>
                        <div className="space-x-2 flex">
                          <div
                            onClick={() => copyToClipboard(url.url)}
                            className="text-blue-600 hover:underline flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span className="text-gray-600">Copy</span>
                          </div>
                          <div
                            onClick={() => previewBookingPage(url.url)}
                            className="text-green-600 hover:underline flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span className="text-gray-600">Preview</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Templates */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-600">Saved Templates</h2>
              
              {loading ? (
                <div className="text-center py-4">
                  <Loader className="w-6 h-6 mx-auto animate-spin text-blue-600" />
                  <p className="text-sm text-gray-600 mt-2">Loading templates...</p>
                </div>
              ) : savedTemplates.length === 0 ? (
                <div className="text-center text-gray-600 py-4">
                  <p className="text-sm text-gray-600">No saved templates yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedTemplates.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-3">
                      <h3 className="font-medium text-gray-600 text-sm">{template.templateName}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Created: {new Date(template.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        Clicks: {template.clickCount || 0}
                      </p>
                      <div className="flex justify-end space-x-2 mt-2">
                        <div
                          onClick={() => loadTemplate(template.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          <span className="text-gray-600">Load</span>
                        </div>
                        <div
                          onClick={() => duplicateTemplate(template)}
                          className="text-xs text-green-600 hover:underline"
                        >
                          <span className="text-gray-600">Duplicate</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightConfigGenerator;