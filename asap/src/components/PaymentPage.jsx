
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc 
} from 'firebase/firestore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { X, Menu } from 'lucide-react';

import logo from '../assets/logo.png';
import travelcare from '../assets/travelcare.png';
import TravelCare from './Travelcare';
import DreamPass from './DreamPass';
import BaggageProtection from './BaggageProtection';
import PaymentSection from './PaymentSection';
import ta from '../assets/ta.png';
import padlock from '../assets/padlock.png';
import smile from '../assets/smile.png';
import smile2 from '../assets/smile2.png';
import neutral from '../assets/neutral.png';
import sad from '../assets/sad.png';
import happy from '../assets/happy.png';
import plane from '../assets/plane.png';
import voucher from '../assets/voucher.png';
import footer from '../assets/footer.png';
import carryon from '../assets/carryon.png';
import carryb from '../assets/checkb.png';
import EditPassenger from './EditPassengerModal';

// VoucherDropdown component (inline for this file)
const VoucherDropdown = ({ isOpen, onClose, onApplyVoucher }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!voucherCode.trim()) {
      setError('Please enter a voucher code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const defaultVoucher = {
        code: voucherCode.toUpperCase(),
        type: 'percentage',
        discount: 10,
        description: 'Voucher applied successfully'
      };
      
      onApplyVoucher(defaultVoucher);
      handleClose();
      
    } catch (err) {
      setError('Failed to apply voucher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleClose = () => {
    setVoucherCode('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
      <div className="p-3">
        <div className="mb-2">
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter voucher code"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#306cac] focus:border-[#306cac]"
            disabled={isLoading}
            autoFocus
          />
        </div>

        {error && (
          <div className="mb-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <div
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !voucherCode.trim()}
            className={`flex-1 px-1 py-1 text-center text-xs font-medium text-white rounded transition-colors cursor-pointer ${
              isLoading || !voucherCode.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#306cac] hover:bg-[#2558a0]'
            }`}
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </div>
          <div
            type="button"
            onClick={handleClose}
            className="cursor-pointer px-2 py-1 text-xs font-medium items-center text-white bg-[#306cac] hover:bg-[#2558a0] rounded transition-colors"
            disabled={isLoading}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Passenger Modal Component
const EditPassengerModal = ({ isOpen, onClose, passenger, onSave }) => {
  const [formData, setFormData] = useState({
    gender: '',
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && passenger) {
      setFormData({
        gender: passenger.gender || '',
        firstName: passenger.firstName || '',
        lastName: passenger.lastName || '',
        middleName: passenger.middleName || '',
        dateOfBirth: passenger.dateOfBirth || ''
      });
      setErrors({});
    }
  }, [isOpen, passenger]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.gender) {
      newErrors.gender = 'Please select gender';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    setFormData({
      gender: '',
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={handleCancel}
      />
      
      <div className="relative bg-white rounded-xs shadow-xl w-full max-w-md max-h-[90vh] md:max-h-[75vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-medium font-semibold text-gray-800">Edit Passenger</h2>
          <div
            onClick={handleCancel}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <div className="p-4 max-h-[calc(90vh-200px)] md:max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="bg-orange-50 border border-orange-100 p-2 mb-2 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-orange-300/65 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-orange-400/75">
              Traveler names must match the government-issued identification document intended to use during travel
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2 ${
                    formData.gender === 'Male'
                      ? 'border-[#306cac] bg-[#306cac]'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {formData.gender === 'Male' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Male</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2 ${
                    formData.gender === 'Female'
                      ? 'border-[#306cac] bg-[#306cac]'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {formData.gender === 'Female' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-2 py-1 border rounded-sm shadow-sm focus:outline-none  ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ONOME"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-2 py-1 border rounded-sm shadow-sm focus:outline-none  ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="MAUREEN"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-700">
                Middle Name
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-sm shadow-sm focus:outline-none "
                placeholder="OSUETHA"
              />
            </div>

            <div>
              <label className="block text-xs  text-gray-700 ">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full px-2 py-1 border rounded-sm shadow-sm focus:outline-none  ${
                    errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                  }`}
                  max={new Date().toISOString().split('T')[0]}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <div
            onClick={handleCancel}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300  hover:bg-gray-50 focus:outline-none "
          >
            Cancel
          </div>
          <div
            onClick={handleSave}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-[#306cac] border border-transparent  focus:outline-none "
          >
            Confirm changes
          </div>
        </div>
      </div>
    </div>
  );
};

// Baggage Fees Modal Component
const BaggageFeesModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className={`
        relative bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] md:max-h-[75vh] overflow-hidden
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Baggage Fees</h2>
          <div
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </div>
        </div>
        
        <div className="px-4 sm:px-6 py-2 overflow-y-auto max-h-[calc(90vh-120px)] md:max-h-[calc(80vh-120px)]">
          <div className="mb-1">
            <p className="text-sm text-gray-600">
              Baggage fees are not charged at booking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center">
                  <img src={carryon} alt="" />
                </div>
              </div>
              
              <div className="border-gray-200 border-r overflow-x-auto">
                <table className="w-full min-w-[300px]">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-2 lg:px-4 border-r border-2 border-gray-300 py-3 text-left text-xs font-medium text-[#306cac]">Traveler</th>
                      <th className="px-2 lg:px-4 py-2 border-r border-2 border-gray-300 text-left text-xs font-medium text-[#306cac]">Allowance and Dimensions</th>
                      <th className="border-r border-2 border-gray-300 px-2 lg:px-4 py-2 text-left text-sm font-medium text-[#306cac]">1st</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="border-r border-2 border-gray-300 px-2 lg:px-4 py-2 text-xs text-gray-700 font-semibold">Adult</td>
                      <td className="border-r border-2 border-gray-300 px-2 lg:px-4 py-2 text-xs text-gray-600">
                        Please verify with your agent
                      </td>
                      <td className="border-r border-2 border-gray-300 px-2 lg:px-4 py-1 text-xs text-gray-600">Free</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center">
                  <img src={carryb} alt="" />
                </div>
              </div>
              
              <div className="border border-gray-200 overflow-x-auto">
                <table className="w-full min-w-[350px]">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="border-r border-2 border-gray-300 px-2 lg:px-4 py-1 text-left text-xs font-medium text-[#306cac]">Traveler</th>
                      <th className="border-r border-2 border-gray-300 px-1 py-1 text-left text-xs font-medium text-[#306cac]">Allowance and Dimensions</th>
                      <th className="border-r border-2 border-gray-300 px-2 lg:px-4 py-1 text-left text-xs font-medium text-[#306cac]">1st</th>
                      <th className="border-r border-2 border-gray-300 px-2 lg:px-4 py-1 text-left text-xs font-medium text-[#306cac]">2nd</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="border-2 border-r border-gray-300 px-2 lg:px-4 py-1 text-xs text-gray-800 font-medium">Adult</td>
                      <td className="border-2 border-r border-gray-300 px-1 py-3 text-xs text-gray-600">
                        up to 50LB / 23KG
                      </td>
                      <td className="border-2 border-r border-gray-300 px-2 lg:px-4 py-3 text-xs text-gray-600">Free</td>
                      <td className="border-2 border-r border-gray-300 px-2 lg:px-4 py-3 text-xs text-gray-600">Free</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-1 p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Here's the most up-to-date information we have on baggage fees, provided by Global Distribution System 
              Apollo, and should be used for informational purposes only. Fees may vary based on when and how you pay, 
              frequent flier and military status, baggage size and weight or other factors. Exceptions may apply, so you 
              should use the link below or contact the airline for more information.
            </p>
            <p className="text-sm text-gray-700 mt-3 font-medium">
              Baggage fee estimates are provided for your convenience and are subject to changes by the airlines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fare Rules Modal Component
const FareRulesModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/20 bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className={`
        relative bg-white shadow-xl w-full max-w-2xl max-h-[90vh] md:max-h-[75vh] overflow-hidden
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="flex items-center justify-between py-1 px-4 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Fare Rules</h2>
          <div
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </div>
        </div>
        
        <div className="px-4 sm:px-6 py-1 overflow-y-auto max-h-[calc(90vh-120px)] md:max-h-[calc(80vh-120px)]">
          <div className="pt-1">
            <h4 className="text-sm font-semibold text-[#306cac] mb-1">Cancellations and refunds:</h4>
            <ul className="text-[13px] text-gray-700 space-y-1 mb-1">
              <li>a. Cancellation and refunds before departure not permitted</li>
              <li>b. Cancellation and refunds after departure not permitted</li>
            </ul>
            
            <h4 className="text-sm font-semibold text-[#306cac] mb-1">Exchanges:</h4>
            <ul className="text-[13px] text-gray-700 space-y-1 mb-1">
              <li>a. Changes before departure not permitted</li>
              <li>b. Changes after departure not permitted</li>
              <li>c. All the tickets are subject to fare difference when exchange</li>
            </ul>
          </div>

          <h3 className="text-sm font-semibold text-[#306cac] mb-2">
            THE ABOVE CONFIRMED TICKETS ARE NON ROUTABLE AND NON TRANSFERABLE
          </h3>
          
          <div className="space-y-2">
            <div>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-2">
                If fare rules allow refunds and/or exchanges, a C$250.00 ITN fee per ticket will be charged to process any 
                refund and/or exchange request. This fee will be collected in addition to the penalties charged directly by 
                the airline and/or recalled by the airline from ITN. Reservations for tickets to be refunded and/or 
                exchanged must be canceled at least 24 hours prior to scheduled departure - NO SHOW ticket(s) will not 
                be processed for refund and/or exchange. Cancellation of reservation does not automatically initiate 
                refund. All exchanges can be made only prior to scheduled departure.
              </p>
              
              <p className="text-[13px] text-gray-700 leading-relaxed mb-2">
                After the tickets are issued, any changes or refunds are subject to the restrictions of the fares used. 
                Generally speaking, discounted fares are more restrictive and in many cases they are non refundable and 
                non exchangeable. Please pay attention to the fare restrictions of your tickets. If you need more flexibility 
                with your tickets in terms of refunds and exchanges, please consult your agent and request a less 
                restrictive fare. Airlines offer a wide range of fares, including those that offer exchanges and refunds 
                without any restrictions and penalties. The airlines strictly follow their policies, and do not permit 
                exchanges or refunds in case the fare restrictions do not allow it. The airlines determine the restrictions of 
                the fares, and ITN has no power to override these restrictions.
              </p>
              
              <p className="text-[13px] text-gray-700 leading-relaxed">
                The airlines change their fares and the availability of the seats on daily basis. Most airlines file their fares 
                with the Airline Tariff Publishing Company. These file updates can occur several times a day. The airlines 
                manage their seat inventory through their reservation systems. In most cases, they decrease or increase 
                the seat inventory (and thus the fare availability) based on many factors which may include for example 
                reservation cancellations or load factor on certain flights. ITN cannot predict the fare value nor can it 
                guarantee that the airlines will not release cheaper seat inventory. Once the tickets are issued, they are 
                subject to fare restrictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVzx99v4W13PmDnAUrrtYnvapQnUzQYwY",
  authDomain: "aspp-bbf36.firebaseapp.com",
  projectId: "aspp-bbf36",
  storageBucket: "aspp-bbf36.firebasestorage.app",
  messagingSenderId: "429957697717",
  appId: "1:429957697717:web:985632f4beee4645ae6efc",
  measurementId: "G-5Q6DGZGDBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Pricing Constants
const PRICING = {
  travelCare: {
    basic: 62.02,
    premium: 76.62,
    allIncluded: 83.92,
    decline: 0
  },
  dreamPass: {
    39: 69.95,
    47: 119.95,
    55: 129.95,
    0: 0
  },
  baggageProtection: 30.99,
};

const FLIGHT_DATA = {
  departure: {
    date: 'Aug 6',
    fullDate: 'Wed, Aug 6',
    time: '6:14 PM',
    airport: 'ORF',
    duration: '5h 57m',
    stops: '1 stop'
  },
  arrival: {
    date: 'Aug 6',
    time: '10:11 PM',
    airport: 'LAS'
  },
  return: {
    date: 'Aug 11',
    fullDate: 'Mon, Aug 11',
    time: '11:30 PM',
    airport: 'LAS',
    duration: '9h 12m',
    stops: '1 stop'
  },
  returnArrival: {
    date: 'Aug 12',
    time: '11:42 AM',
    airport: 'ORF'
  }
};

const FlightRoute = ({ 
  departureTime, 
  departureAirport, 
  arrivalTime, 
  arrivalAirport, 
  duration, 
  stops,
  departureDate,
  arrivalDate 
}) => (
  <div className="w-full items-center justify-between">
    <div className="flex flex-col sm:flex-row items-center w-auto px-2 sm:px-4 lg:px-30 mb-4">
      <div className="text-center mb-2 sm:mb-0">
        <div className="text-xs sm:text-sm text-gray-500">{departureDate}</div>
        <div className="text-sm font-semibold text-gray-700">{departureTime}</div>
        <div className="text-sm font-medium text-gray-700">{departureAirport}</div>
      </div>

      <div className="flex-1 mx-2 sm:mx-6 my-2 sm:my-0 min-w-[120px] sm:min-w-[150px]">
        <div className="text-center text-xs sm:text-sm text-gray-500 mb-1">{duration}</div>
        <div className="relative">
          <div className="h-0.5 bg-gray-300 w-full"></div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
        <div className="text-center text-xs sm:text-sm text-gray-500 mt-1">{stops}</div>
      </div>

      <div className="text-center">
        <div className="text-xs sm:text-sm text-gray-500">{arrivalDate}</div>
        <div className="text-sm font-semibold text-gray-700">{arrivalTime}</div>
        <div className="text-sm font-medium text-gray-700">{arrivalAirport}</div>
      </div>
    </div>
  </div>
);

const CheckIcon = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ISOLATED Phone Input Component - prevents parent re-renders from affecting it
const IsolatedPhoneInput = React.memo(({ initialValue = '', onPhoneChange, hasError = false }) => {
  const [localPhone, setLocalPhone] = useState(initialValue);
  const timeoutRef = useRef(null);

  const handleChange = useCallback((phone) => {
    setLocalPhone(phone);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (onPhoneChange) {
        onPhoneChange(phone);
      }
    }, 20000);
  }, [onPhoneChange]);

  useEffect(() => {
    if (initialValue !== localPhone) {
      setLocalPhone(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <PhoneInput
      country={'us'}
      value={localPhone}
      onChange={handleChange}
      inputStyle={{
        width: '100%',
        height: '40px',
        fontSize: '14px',
        color: '#374151',
        border: hasError ? '1px solid #ef4444' : '1px solid #d1d5db',
        borderRadius: '2px',
        fontWeight: '600'
      }}
      buttonStyle={{
        border: hasError ? '1px solid #ef4444' : '1px solid #d1d5db',
        borderRadius: '2px 0 0 2px',
        backgroundColor: '#f9fafb'
      }}
      dropdownStyle={{
        width: '300px'
      }}
      containerStyle={{
        width: '100%'
      }}
      placeholder="Enter Phone Number"
    />
  );
});

// Contact Info Section Component
const ContactInfoSection = ({ initialEmail = '', initialPhone = '', onContactInfoChange, validationErrors = {} }) => {
  const emailRef = useRef(null);
  const [currentPhone, setCurrentPhone] = useState(initialPhone);
  
  const handleEmailBlur = useCallback(() => {
    if (onContactInfoChange) {
      const emailValue = emailRef.current?.value || '';
      onContactInfoChange({ 
        email: emailValue, 
        phone: currentPhone 
      });
    }
  }, [currentPhone, onContactInfoChange]);

  const handlePhoneChange = useCallback((phone) => {
    setCurrentPhone(phone);
    if (onContactInfoChange) {
      const emailValue = emailRef.current?.value || '';
      onContactInfoChange({ 
        email: emailValue, 
        phone: phone 
      });
    }
  }, [onContactInfoChange]);

  useEffect(() => {
    if (emailRef.current && emailRef.current.value !== initialEmail) {
      emailRef.current.value = initialEmail;
    }
  }, [initialEmail]);

  useEffect(() => {
    if (initialPhone !== currentPhone) {
      setCurrentPhone(initialPhone);
    }
  }, [initialPhone]);

  return (
    <div className="p-1 rounded-lg flex flex-col lg:flex-row w-full gap-4">
      <div className='w-full lg:w-1/3 px-4'>
        <h3 className="font-medium mb-2 text-gray-700">Contact Person</h3>
        <p className="text-xs text-gray-600 mb-2">Please provide information about a contact person we should get in touch with in case of schedule change</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        <div>
          <label className="block text-xs text-gray-700 mb-1">
            Confirmation Email <span className="text-red-600">*</span>
          </label>
          <input 
            ref={emailRef}
            type="email" 
            placeholder="Enter email"
            defaultValue={initialEmail}
            onBlur={handleEmailBlur}
            className={`w-full px-3 py-2 text-gray-700 border rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${
              validationErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-700 mb-1">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <IsolatedPhoneInput
            initialValue={initialPhone}
            onPhoneChange={handlePhoneChange}
            hasError={validationErrors.phone}
          />
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [baseFlightPrice, setBaseFlightPrice] = useState(364.85);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [editingPassengerIndex, setEditingPassengerIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // NEW: Validation errors state for field-level validation
  const [validationErrors, setValidationErrors] = useState({});

  // Modal state variables
  const [activeBaggageModal, setActiveBaggageModal] = useState(false);
  const [activeFareModal, setActiveFareModal] = useState(false);
  const [editPassengerModal, setEditPassengerModal] = useState({
    isOpen: false,
    passenger: null,
    passengerIndex: -1
  });

  const [activeFlightModal, setActiveFlightModal] = useState({ 
    isOpen: false, 
    flight: null, 
    type: '' 
  });

  // Voucher state
  const [isVoucherDropdownOpen, setIsVoucherDropdownOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // Form states - will be populated from Firebase data
  const [passengers, setPassengers] = useState([
    {
      id: 1,
      gender: '',
      firstName: 'BRITTANY',
      lastName: 'SMITH',
      middleName: 'ELIZABETH',
      dateOfBirth: ''
    }
  ]);

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: ''
  });

  // Simple handler for contact info
  const handleContactInfoChange = (contactData) => {
    setContactInfo(contactData);
    // Clear validation errors for contact fields when user updates them
    if (validationErrors.email || validationErrors.phone) {
      setValidationErrors(prev => ({
        ...prev,
        email: contactData.email.trim() ? false : prev.email,
        phone: contactData.phone.trim() ? false : prev.phone
      }));
    }
  };

  const [selectedTravelCare, setSelectedTravelCare] = useState('premium');
  const [selectedDreamPass, setSelectedDreamPass] = useState('55');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedBaggage, setSelectedBaggage] = useState('');
  const [tipAmount, setTipAmount] = useState(20);
  const [agreement, setAgreement] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    cardHolderName: '',
    bankPhoneNumber: '',
    cardHolderEmail: '',
    zipCode: '',
    billingPhoneNumber: '',
    state: '',
    city: '',
    streetAddress: '',
    country: 'United States',
    paymentMethod: 'card',
    splitPayment: false
  });

  // Voucher handlers
  const handleApplyVoucher = (voucher) => {
    setAppliedVoucher(voucher);
    console.log('Applied voucher:', voucher);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
  };

  // Edit passenger handlers
  const handleEditPassenger = (passenger, index) => {
    setEditingPassenger(passenger);
    setEditingPassengerIndex(index);
    setEditModalOpen(true);
  };

  const handleSavePassenger = (updatedPassengerData) => {
    if (editingPassengerIndex !== null) {
      setPassengers(prev => prev.map((passenger, index) => 
        index === editingPassengerIndex 
          ? { ...passenger, ...updatedPassengerData }
          : passenger
      ));
    }
    setEditModalOpen(false);
    setEditingPassenger(null);
    setEditingPassengerIndex(null);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingPassenger(null);
    setEditingPassengerIndex(null);
  };

  // Load booking data from Firebase
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        console.log("🚀 Starting booking data loading...");
        setLoading(true);
        setError('');
        
        const urlParams = new URLSearchParams(location.search);
        const bookingIdParam = urlParams.get('booking');
        
        console.log("🔍 Booking ID from URL:", bookingIdParam);
        
        if (!bookingIdParam) {
          console.log("❌ No booking ID found in URL");
          setError('No booking ID provided. Please start from the booking page.');
          setLoading(false);
          return;
        }

        setBookingId(bookingIdParam);

        // Fetch booking data from Firebase
        console.log("📡 Fetching booking data from Firebase...");
        const bookingDocRef = doc(db, 'users', bookingIdParam);
        const bookingDoc = await getDoc(bookingDocRef);
        
        if (!bookingDoc.exists()) {
          console.log("❌ Booking document not found");
          setError('Booking not found. Please check your booking reference or start a new booking.');
          setLoading(false);
          return;
        }

        const data = bookingDoc.data();
        console.log("✅ Booking data loaded:", data);
        setBookingData(data);

        // Populate form fields with booking data
        if (data.passengers && data.passengers.length > 0) {
          console.log("👥 Setting passengers data:", data.passengers);
          setPassengers(data.passengers);
        }

        // Set base flight price from booking data or calculated total
        if (data.totalPrice) {
          const totalFromHomepage = parseFloat(data.totalPrice.replace(/,/g, '')) || 364.85;
          console.log("💰 Setting base flight price from homepage total:", totalFromHomepage);
          setBaseFlightPrice(totalFromHomepage);
        } else if (data.flightConfig && data.flightConfig.price) {
          const priceAmount = parseFloat(data.flightConfig.price.amount.replace(/,/g, '')) || 364.85;
          console.log("💰 Setting base flight price from config:", priceAmount);
          setBaseFlightPrice(priceAmount);
        }

        // Set contact info from booking data if available
        if (data.contactInfo) {
          console.log("📞 Setting contact info:", data.contactInfo);
          setContactInfo({
            email: data.contactInfo.email || '',
            phone: data.contactInfo.phone || ''
          });
        }

        console.log("✅ Booking data loaded and form populated successfully");
        
      } catch (error) {
        console.error("❌ Error loading booking data:", error);
        setError(`Failed to load booking information: ${error.message}`);
      } finally {
        setLoading(false);
        console.log("🏁 Booking data loading completed");
      }
    };

    loadBookingData();
  }, [location.search]);

  // Calculate dynamic pricing with voucher discount
  const calculatePricing = () => {
    const passengerCount = passengers.length;
    const flightPrice = baseFlightPrice;
    const travelCarePrice = PRICING.travelCare[selectedTravelCare] || 0;
    const dreamPassPrice = PRICING.dreamPass[selectedDreamPass] || 0;
    const baggagePrice = selectedBaggage === 'accept' ? PRICING.baggageProtection * passengerCount : 0;
    const tip = parseFloat(tipAmount) || 0;
    const subtotal = flightPrice + travelCarePrice + dreamPassPrice + baggagePrice;
    
    // Calculate voucher discount
    let voucherDiscount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.type === 'percentage') {
        voucherDiscount = (subtotal * appliedVoucher.discount) / 100;
      } else if (appliedVoucher.type === 'fixed') {
        voucherDiscount = appliedVoucher.discount;
      }
    }
    
    const discountedSubtotal = Math.max(0, subtotal - voucherDiscount);
    const total = discountedSubtotal + tip;
    
    return {
      flightPrice,
      travelCarePrice,
      dreamPassPrice,
      baggagePrice,
      tip,
      subtotal,
      voucherDiscount,
      discountedSubtotal,
      total,
      passengerCount
    };
  };

  // Handle service changes with useCallback to prevent infinite loops
  const handleTravelCareChange = useCallback((plan) => {
    setSelectedTravelCare(plan);
  }, []);

  const handleDreamPassChange = useCallback((plan) => {
    setSelectedDreamPass(plan);
  }, []);

  const handleBaggageChange = useCallback((option) => {
    setSelectedBaggage(option);
  }, []);

  const handlePaymentDataChange = useCallback((data) => {
    setPaymentData(data);
    // Clear validation errors for payment fields when user updates them
    if (Object.keys(validationErrors).some(key => key.startsWith('payment'))) {
      const clearedErrors = { ...validationErrors };
      
      // Clear relevant payment validation errors based on what was updated
      if (data.cardNumber && data.cardNumber.trim()) {
        clearedErrors.paymentCardNumber = false;
      }
      if (data.expirationMonth) {
        clearedErrors.paymentExpirationMonth = false;
      }
      if (data.expirationYear) {
        clearedErrors.paymentExpirationYear = false;
      }
      if (data.cvv && data.cvv.trim()) {
        clearedErrors.paymentCvv = false;
      }
      if (data.cardHolderName && data.cardHolderName.trim()) {
        clearedErrors.paymentCardHolderName = false;
      }
      if (data.cardHolderEmail && data.cardHolderEmail.trim()) {
        clearedErrors.paymentCardHolderEmail = false;
      }
      if (data.zipCode && data.zipCode.trim()) {
        clearedErrors.paymentZipCode = false;
      }
      if (data.city && data.city.trim()) {
        clearedErrors.paymentCity = false;
      }
      if (data.streetAddress && data.streetAddress.trim()) {
        clearedErrors.paymentStreetAddress = false;
      }
      
      setValidationErrors(clearedErrors);
    }
  }, [validationErrors]);

  // Format date for display (convert from YYYY-MM-DD to DD/MM/YYYY if needed)
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    
    // If it's already in DD/MM/YYYY format, return as is
    if (dateStr.includes('/')) return dateStr;
    
    // If it's in YYYY-MM-DD format, convert to DD/MM/YYYY
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    
    return dateStr;
  };

  // NEW: Field-level validation function
  const validateFormFields = () => {
    const errors = {};
    
    // Validate contact info
    if (!contactInfo.email.trim()) {
      errors.email = true;
    }
    if (!contactInfo.phone.trim()) {
      errors.phone = true;
    }

    // Validate payment information if card payment is selected
    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber.trim()) {
        errors.paymentCardNumber = true;
      }
      if (!paymentData.expirationMonth) {
        errors.paymentExpirationMonth = true;
      }
      if (!paymentData.expirationYear) {
        errors.paymentExpirationYear = true;
      }
      if (!paymentData.cvv.trim()) {
        errors.paymentCvv = true;
      }
      if (!paymentData.cardHolderName.trim()) {
        errors.paymentCardHolderName = true;
      }
      if (!paymentData.cardHolderEmail.trim()) {
        errors.paymentCardHolderEmail = true;
      }
      if (!paymentData.zipCode.trim()) {
        errors.paymentZipCode = true;
      }
      if (!paymentData.city.trim()) {
        errors.paymentCity = true;
      }
      if (!paymentData.streetAddress.trim()) {
        errors.paymentStreetAddress = true;
      }

      // Validate second card if split payment is enabled
      if (paymentData.splitPayment) {
        if (!paymentData.cardNumber2 || !paymentData.cardNumber2.trim()) {
          errors.paymentCardNumber2 = true;
        }
        if (!paymentData.expirationMonth2) {
          errors.paymentExpirationMonth2 = true;
        }
        if (!paymentData.expirationYear2) {
          errors.paymentExpirationYear2 = true;
        }
        if (!paymentData.cvv2 || !paymentData.cvv2.trim()) {
          errors.paymentCvv2 = true;
        }
        if (!paymentData.cardHolderName2 || !paymentData.cardHolderName2.trim()) {
          errors.paymentCardHolderName2 = true;
        }
        if (!paymentData.cardHolderEmail2 || !paymentData.cardHolderEmail2.trim()) {
          errors.paymentCardHolderEmail2 = true;
        }
        if (!paymentData.zipCode2 || !paymentData.zipCode2.trim()) {
          errors.paymentZipCode2 = true;
        }
        if (!paymentData.city2 || !paymentData.city2.trim()) {
          errors.paymentCity2 = true;
        }
        if (!paymentData.streetAddress2 || !paymentData.streetAddress2.trim()) {
          errors.paymentStreetAddress2 = true;
        }
      }
    }

    // Validate agreement
    if (!agreement) {
      errors.agreement = true;
    }

    return errors;
  };

  // Save payment completion to Firebase
  const handleCompletePayment = async () => {
    try {
      setSaving(true);
      setError('');

      // NEW: Use field-level validation instead of error messages
      const fieldErrors = validateFormFields();
      
      if (Object.keys(fieldErrors).length > 0) {
        setValidationErrors(fieldErrors);
        setSaving(false);
        
        // Scroll to first error field
        const firstErrorField = document.querySelector('.border-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorField.focus();
        }
        
        return;
      }

      // Clear any existing validation errors
      setValidationErrors({});

      if (!bookingId) {
        setError('No booking ID found. Please start from the booking page.');
        return;
      }

      const pricing = calculatePricing();

      // Prepare payment information based on split payment or single payment
      let paymentInformation;

      if (paymentData.splitPayment) {
        // Handle split payment - store both cards (only last 4 digits)
        const firstCardNumber = paymentData.cardNumber ? paymentData.cardNumber.replace(/\s/g, '') : '';
        const secondCardNumber = paymentData.cardNumber2 ? paymentData.cardNumber2.replace(/\s/g, '') : '';
        
        paymentInformation = {
          paymentMethod: paymentData.paymentMethod,
          splitPayment: true,
          
          // First Card Information
          firstCard: {
            cardNumber: firstCardNumber, // Only last 4 digits
            cvv: paymentData.cvv,
            expirationMonth: paymentData.expirationMonth,
            expirationYear: paymentData.expirationYear,
            cardHolderName: paymentData.cardHolderName,
            bankPhoneNumber: paymentData.bankPhoneNumber,
            cardHolderEmail: paymentData.cardHolderEmail,
            billingAddress: {
              street: paymentData.streetAddress,
              city: paymentData.city,
              state: paymentData.state,
              zipCode: paymentData.zipCode,
              country: paymentData.country
            },
            billingPhoneNumber: paymentData.billingPhoneNumber
          },
          
          // Second Card Information
          secondCard: {
            cardNumber: secondCardNumber, // Only last 4 digits
            expirationMonth: paymentData.expirationMonth2,
            expirationYear: paymentData.expirationYear2,
            cvv: paymentData.cvv2,
            cardHolderName: paymentData.cardHolderName2,
            bankPhoneNumber: paymentData.bankPhoneNumber2,
            cardHolderEmail: paymentData.cardHolderEmail2,
            billingAddress: {
              street: paymentData.streetAddress2,
              city: paymentData.city2,
              state: paymentData.state2,
              zipCode: paymentData.zipCode2,
              country: paymentData.country2
            },
            billingPhoneNumber: paymentData.billingPhoneNumber2
          },
          
          paymentCompletedAt: new Date()
        };
      } else {
        // Handle single payment
        const cardNumberForStorage = paymentData.cardNumber ? paymentData.cardNumber.replace(/\s/g, '') : '';
        
        paymentInformation = {
          paymentMethod: paymentData.paymentMethod,
          splitPayment: false,
          cardNumber: cardNumberForStorage, // Only last 4 digits
          expirationMonth: paymentData.expirationMonth,
          expirationYear: paymentData.expirationYear,
          cvv: paymentData.cvv,
          cardHolderName: paymentData.cardHolderName,
          bankPhoneNumber: paymentData.bankPhoneNumber,
          cardHolderEmail: paymentData.cardHolderEmail,
          billingAddress: {
            street: paymentData.streetAddress,
            city: paymentData.city,
            state: paymentData.state,
            zipCode: paymentData.zipCode,
            country: paymentData.country
          },
          billingPhoneNumber: paymentData.billingPhoneNumber,
          paymentCompletedAt: new Date()
        };
      }

      // Update the existing booking document with payment information
      const updatedBookingData = {
        ...bookingData,
        updatedAt: new Date(),
        bookingStatus: 'payment_completed',
        
        // Update passengers data (in case user modified it)
        passengers: passengers,
        
        // Add contact info
        contactInfo: contactInfo,
        
        // Add selected services
        services: {
          travelCare: {
            selected: selectedTravelCare,
            price: pricing.travelCarePrice
          },
          dreamPass: {
            selected: selectedDreamPass,
            price: pricing.dreamPassPrice
          },
          baggageProtection: {
            selected: selectedBaggage,
            price: pricing.baggagePrice
          },
          tip: {
            amount: pricing.tip
          }
        },
        
        // Add rating information
        rating: selectedRating ? {
          value: selectedRating,
          ratedAt: new Date()
        } : null,
        
        // Add voucher information
        voucher: appliedVoucher ? {
          code: appliedVoucher.code,
          discount: appliedVoucher.discount,
          type: appliedVoucher.type,
          discountAmount: pricing.voucherDiscount
        } : null,
        
        // Add payment information (updated to handle both single and split payments)
        paymentInformation: paymentInformation,
        
        // Update pricing
        pricing: {
          baseFlightPrice: pricing.flightPrice,
          travelCare: pricing.travelCarePrice,
          dreamPass: pricing.dreamPassPrice,
          baggageProtection: pricing.baggagePrice,
          tip: pricing.tip,
          subtotal: pricing.subtotal,
          voucherDiscount: pricing.voucherDiscount,
          total: pricing.total,
          currency: bookingData?.flightConfig?.price?.currency || 'USD',
          passengerCount: pricing.passengerCount
        },
        
        // Update total price
        totalPrice: pricing.total.toFixed(2),
        
        // Terms agreement
        termsAgreed: agreement,
        termsAgreedAt: new Date(),
        paymentCompletedAt: new Date()
      };

      console.log("💾 Updating booking with payment data:", updatedBookingData);

      // Update the existing document
      const docRef = doc(db, 'users', bookingId);
      await updateDoc(docRef, updatedBookingData);
      
      console.log("✅ Payment completed and booking updated successfully:", bookingId);
      alert(`Payment completed successfully! Your booking has been confirmed. Booking ID: ${bookingId}`);
      
      // Optionally redirect to a confirmation page
      // navigate(`/confirmation?booking=${bookingId}`);
      
    } catch (error) {
      console.error("❌ Error completing payment:", error);
      setError(`Failed to complete payment: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const FlightDetailsModal = ({ isOpen, onClose, flight, flightConfig, flightType = "Outbound" }) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    if (!isOpen || !flight) return null;

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      return timeStr;
    };

    return (
      <div className="w-screen fixed inset-0 z-50 lg:flex items-center justify-center">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/20 transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-sm p-4 shadow-xl w-full max-w-2xl max-h-[90vh] md:max-h-[70vh] overflow-hidden mx-4">
          <div className="flex justify-between items-start">
            <div className="text-base md:text-md font-medium text-gray-700">{flight.route} {flight.date}</div>
            <div className="text-right text-xs text-gray-500">
              <div>Travel time: {flight.duration} • {flight.stops}</div>
            </div>
          </div>
          
          {/* Flight Card */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {flight.segments.map((segment, segmentIndex) => (
              <div key={segmentIndex}>
                {/* Flight Segment */}
                <div className="flex gap-3 md:gap-6 p-3 md:p-4">
                  {/* Left Column - Airline Info */}
                  <div className="flex flex-col items-center w-16 md:w-20 flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-10 rounded-full flex items-center justify-center">
                      <img 
                        src={flightConfig.customization?.logoUrl || logo} 
                        alt={flightConfig.airline.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    </div>
                    <div className="text-xs text-center text-gray-600 leading-tight mt-1">
                      <div className="font-medium">{segment.flightNumber}</div>
                      <div>{segment.class}</div>
                      <div className="hidden md:block">{segment.aircraft}</div>
                    </div>
                  </div>
          
                  {/* Right Column - Flight Timeline */}
                  <div className="flex-1">
                    {/* Departure */}
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-3 md:mr-4"></div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm md:text-md font-medium text-gray-700">
                          {segment.departure.time}
                        </span>
                        <span className="text-xs text-gray-500 align-top">
                          {segment.departure.date.slice(-2)}
                        </span>
                        <span className="text-xs md:text-sm text-gray-600 ml-2">
                          {segment.departure.airport}
                        </span>
                      </div>
                    </div>
          
                    {/* Flight Duration */}
                    <div className="ml-6 md:ml-7 mb-3">
                      <span className="text-xs text-gray-500">Flight time: {segment.duration}</span>
                    </div>
          
                    {/* Arrival */}
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-600 rounded-full mr-3 md:mr-4"></div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm md:text-md text-gray-700">
                          {segment.arrival.time}
                        </span>
                        <span className="text-xs text-gray-500 align-top">
                          {segment.arrival.date.slice(-2)}
                        </span>
                        <span className="text-xs md:text-sm text-gray-600 ml-2">
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
      </div>
    );
  };

  // Flight Details Component - uses data from Firebase
  const FlightDetails = () => {
    const flightData = bookingData?.flightConfig || {};
    const flights = flightData.flights || [];
    
    const handleOpenFlightModal = (flight, type) => {
      setActiveFlightModal({ isOpen: true, flight, type });
    };

    const handleCloseFlightModal = () => {
      setActiveFlightModal({ isOpen: false, flight: null, type: '' });
    };
    
    return (
      <div className="bg-white rounded-sm shadow-sm p-4 mb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Flight Details</h2>
          <div className="flex gap-4 text-xs sm:text-sm text-[#306cac]">
            <div 
              className="hover:underline underline cursor-pointer"
              onClick={() => setActiveFareModal(true)}
            >
              Fare Rules
            </div>
            <div 
              className="hover:underline underline cursor-pointer"
              onClick={() => setActiveBaggageModal(true)}
            >
              Baggage Fees
            </div>
          </div>
        </div>
        
        {/* Outbound Flight */}
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4 mb-2">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className='w-full lg:w-1/4'>
              <div className="text-sm text-gray-600">Depart:</div>
              <div className="font-medium text-gray-700">{flights[0]?.date || 'Wed, Aug 6'}</div>
            </div>
            <div className="w-full lg:flex-1">
              <FlightRoute
                departureTime={FLIGHT_DATA.departure.time}
                departureAirport={FLIGHT_DATA.departure.airport}
                arrivalTime={FLIGHT_DATA.arrival.time}
                arrivalAirport={FLIGHT_DATA.arrival.airport}
                duration={FLIGHT_DATA.departure.duration}
                stops={FLIGHT_DATA.departure.stops}
                departureDate={FLIGHT_DATA.departure.date}
                arrivalDate={FLIGHT_DATA.arrival.date}
              />
            </div>

            <div className="flex flex-row lg:flex-col w-full lg:w-1/4 items-center lg:items-end justify-between lg:justify-start space-y-0 lg:space-y-3">
              <div
                onClick={() => handleOpenFlightModal(flights[0], 'outbound')}
                className="bg-blue-50 text-[#306cac] px-3 sm:px-2 py-2 rounded text-xs hover:bg-blue-100 cursor-pointer transition-colors"
              >
                Flight Details
              </div>
              <div className="relative">
                <img 
                  src={bookingData?.flightConfig?.customization?.logoUrl || logo}
                  alt={flightData.airline?.name || "Airline"}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Return Flight */}
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className='w-full lg:w-1/4'>
              <div className="text-sm text-gray-600">Return:</div>
              <div className="font-medium text-gray-700">{flights[1]?.date || 'Mon, Aug 11'}</div>
            </div>
            <div className="w-full lg:flex-1">
              <FlightRoute
                departureTime={FLIGHT_DATA.return.time}
                departureAirport={FLIGHT_DATA.return.airport}
                arrivalTime={FLIGHT_DATA.returnArrival.time}
                arrivalAirport={FLIGHT_DATA.returnArrival.airport}
                duration={FLIGHT_DATA.return.duration}
                stops={FLIGHT_DATA.return.stops}
                departureDate={FLIGHT_DATA.return.date}
                arrivalDate={FLIGHT_DATA.returnArrival.date}
              />
            </div>

            <div className="flex flex-row lg:flex-col w-full lg:w-1/4 items-center lg:items-end justify-between lg:justify-start space-y-0 lg:space-y-3">
              <div
                onClick={() => handleOpenFlightModal(flights[1], 'return')}
                className="bg-blue-50 text-[#306cac] px-3 sm:px-2 py-2 rounded text-xs hover:bg-blue-100 cursor-pointer transition-colors"
              >
                Flight Details
              </div>
              <div className="relative">
                <img 
                  src={bookingData?.flightConfig?.customization?.logoUrl || logo}
                  alt={flightData.airline?.name || "Airline"}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Flight Details Modal */}
        <FlightDetailsModal
          isOpen={activeFlightModal.isOpen}
          onClose={handleCloseFlightModal}
          flight={activeFlightModal.flight}
          flightConfig={flightData}
          flightType={activeFlightModal.type}
        />
      </div>
    );
  };

  // Passenger Details Component
  const PassengerDetails = () => {
    const [expandedSections, setExpandedSections] = useState({
      combined: false
    });

    const [frequentFlyerPrograms, setFrequentFlyerPrograms] = useState([
      { id: 1, airline: '', programNumber: '' }
    ]);

    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    const addFrequentFlyerProgram = () => {
      const newId = Math.max(...frequentFlyerPrograms.map(p => p.id)) + 1;
      setFrequentFlyerPrograms(prev => [...prev, { id: newId, airline: '', programNumber: '' }]);
    };

    const deleteFrequentFlyerProgram = (id) => {
      if (frequentFlyerPrograms.length > 1) {
        setFrequentFlyerPrograms(prev => prev.filter(program => program.id !== id));
      }
    };

    const updateFrequentFlyerProgram = (id, field, value) => {
      setFrequentFlyerPrograms(prev => prev.map(program => 
        program.id === id ? { ...program, [field]: value } : program
      ));
    };

    return (
      <div className="bg-white w-full shadow-sm p-4 sm:p-6 mb-6">
        <div className='border-b border-gray-200 mb-4'>
          <h2 className="text-gray-700 text-lg sm:text-xl font-semibold mb-4">Passenger Details</h2>
        </div>
        
        {/* Warning Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4 flex items-start gap-3">
          <div className="w-5 h-5 bg-orange-300/65 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">!</div>
          <p className="text-xs sm:text-sm font-medium text-orange-400/75">Traveler names must match the government-issued identification document intended to use during travel</p>
        </div>
        
        {passengers.map((passenger, index) => (
          <div key={`passenger-${passenger.id}`} className="mb-6 w-full">
            {/* Passenger Header */}
            <div className="flex flex-col lg:flex-row items-start justify-between w-full mb-4 gap-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-8 flex-1">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-700 mb-1">Passenger</h3>
                  <div 
                    onClick={() => handleEditPassenger(passenger, index)}
                    className="w-full text-left bg-blue-50 text-[#306cac] px-3 py-1 rounded-xs text-xs border border-[#306cac]/20 hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    {passenger.gender ? `Gender: ${passenger.gender}` : 'Please select gender'}
                  </div>
                </div>
                
                {/* Passenger Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1 w-full">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Last Name</label>
                    <div className="font-medium text-sm sm:text-base text-gray-800">{passenger.lastName}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">First Name</label>
                    <div className="font-medium text-sm sm:text-base text-gray-800">{passenger.firstName}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Middle Name</label>
                    <div className="font-medium text-sm sm:text-base text-gray-800">{passenger.middleName || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Date of Birth</label>
                    <div className="font-medium text-sm sm:text-base text-gray-800">
                      {formatDateForDisplay(passenger.dateOfBirth) || (
                        <span 
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => handleEditPassenger(passenger, index)}
                        >
                          Please select date of birth
                        </span>
                      )}
                      <span className="text-gray-500 text-xs sm:text-sm ml-2">(Adult)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <div className='w-full sm:w-auto'>
                <div 
                  onClick={() => handleEditPassenger(passenger, index)}
                  className="text-[#306cac] text-center text-xs sm:text-sm hover:underline bg-blue-50 px-3 sm:px-2 py-1 rounded border border-[#306cac]/20 hover:bg-blue-100 cursor-pointer transition-colors w-full sm:w-auto"
                >
                  ✎ Edit
                </div>
              </div>
            </div>

            {/* Combined Optional Sections */}
            <div className="mt-4 w-full">
              {/* Combined Header for both Redress and Preferences */}
              <div className="flex flex-col sm:flex-row">
                {/* Redress Number Header */}
                <div className="bg-gray-100 w-full sm:w-1/3">
                  <div
                    onClick={() => toggleSection('combined')}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-600">Optional</span>
                      <span className="text-xs sm:text-sm text-gray-700">Redress number</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform sm:hidden ${expandedSections.combined ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Frequent Flyer Header */}
                <div className="bg-gray-100 w-full sm:w-2/3 border-t sm:border-t-0 sm:border-l border-gray-300">
                  <div
                    onClick={() => toggleSection('combined')}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-600">Optional</span>
                      <span className="text-xs sm:text-sm text-gray-700">Frequent flyer and meal preferences</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.combined ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Combined Expanded Content */}
              {expandedSections.combined && (
                <div className="flex flex-col sm:flex-row mt-0">
                  {/* Redress Number Content */}
                  <div className="bg-gray-100 w-full sm:w-1/3 border-l border-b border-gray-200 p-2">
                    <div className="text-xs font-semibold text-[#306cac] mb-1 hover:underline cursor-pointer">
                      More info
                    </div>
                    <div className="mb-1">
                      <label className="block text-xs text-gray-700 mb-1">Redress number</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Redress number"
                      className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-gray-400"
                      maxLength="25"
                    />
                  </div>

                  {/* Frequent Flyer Content */}
                  <div className="bg-gray-100 w-full sm:w-2/3 border-x border-b border-gray-200 p-3">
                    <div className="text-xs font-semibold text-[#306cac] mb-1 hover:underline cursor-pointer">
                      More info
                    </div>
                    
                    {/* Meal and Special Assistance */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">Meal Preference</label>
                        <select className="w-full px-2 sm:px-3 py-1 border border-gray-300 rounded-sm text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option value="">Select Meal Preference</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="kosher">Kosher</option>
                          <option value="halal">Halal</option>
                          <option value="gluten-free">Gluten Free</option>
                          <option value="diabetic">Diabetic</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-gray-700 mb-1">Special Assistance</label>
                        <select className="w-full px-2 sm:px-3 py-1 border border-gray-300 rounded-sm text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option value="">Select Special Assistance</option>
                          <option value="wheelchair">Wheelchair Assistance</option>
                          <option value="mobility">Mobility Assistance</option>
                          <option value="visual">Visual Impairment</option>
                          <option value="hearing">Hearing Impairment</option>
                          <option value="oxygen">Oxygen Required</option>
                        </select>
                      </div>
                    </div>

                    {/* Frequent Flyer Programs */}
                    {frequentFlyerPrograms.map((program, programIndex) => (
                      <div key={program.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs sm:text-sm text-gray-700 mb-1">Frequent Flyer</label>
                          <select 
                            className="w-full px-2 sm:px-3 py-1 border border-gray-300 rounded-sm text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                            value={program.airline}
                            onChange={(e) => updateFrequentFlyerProgram(program.id, 'airline', e.target.value)}
                          >
                            <option value="">Select Frequent Flyer</option>
                            <option value="delta">Delta SkyMiles</option>
                            <option value="american">American AAdvantage</option>
                            <option value="united">United MileagePlus</option>
                            <option value="lufthansa">Lufthansa Miles & More</option>
                            <option value="emirates">Emirates Skywards</option>
                            <option value="british">British Airways Executive Club</option>
                          </select>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs sm:text-sm text-gray-700 mb-1">Program Number</label>
                            <input
                              type="text"
                              placeholder="Enter program number"
                              className="w-full px-2 sm:px-3 py-1 border border-gray-300 rounded-sm text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={program.programNumber}
                              onChange={(e) => updateFrequentFlyerProgram(program.id, 'programNumber', e.target.value)}
                            />
                          </div>
                          {frequentFlyerPrograms.length > 1 && (
                            <div
                              onClick={() => deleteFrequentFlyerProgram(program.id)}
                              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-[#306cac] border border-[#306cac] rounded-sm hover:bg-blue-50 cursor-pointer"
                            >
                              Delete
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div
                      onClick={addFrequentFlyerProgram}
                      className="text-[#306cac] font-semibold text-xs sm:text-sm hover:underline cursor-pointer w-full flex justify-end"
                    >
                      + Add Program Number
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Contact Person Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          {/* Warning Banner for Contact Info */}
          <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4 flex items-start gap-3">
            <div className="w-5 h-5 bg-orange-300/65 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">!</div>
            <p className="text-xs sm:text-sm font-medium text-orange-400/75">Confirmation email and phone number fields are required!</p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-full lg:w-1/3">
              <h3 className="font-medium text-gray-700 mb-2">Contact Person</h3>
              <p className="text-xs sm:text-sm text-gray-600">Please provide information about a contact person we should get in touch with in case of schedule change</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                  Confirmation Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <IsolatedPhoneInput
                  initialValue={contactInfo.phone}
                  onPhoneChange={(phone) => setContactInfo({...contactInfo, phone})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TipSection = () => (
    <div className="bg-white rounded-sm shadow-sm mb-6">
      <div className="bg-gradient-to-b from-[#468ed1] to-[#1f6eb7] text-white p-4 rounded-t-sm mb-6 flex items-start gap-4">
        <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center">
          <img src={ta} alt="" />
        </div>
        <div className='w-1/2'>
          <h3 className="font-semibold mb-1 text-lg">How was my service?</h3>
          <p className="text-sm text-blue-100">If you feel that the service provided was exceptional, you can express your gratitude (optional)</p>
        </div>
        <div className="flex w-1/2">
          
          <div className="flex gap-1 mt-4 space-y-2">
            {[
              { label: 'Average', amount: 15 },
              { label: 'Good', amount: 20 },
              { label: 'Great', amount: 25 },
              { label: 'Excellent', amount: 30 },
              { label: 'Perfect', amount: 35 }
            ].map((tip) => (
              <div
                key={tip.amount}
                onClick={() => setTipAmount(tip.amount)}
                className={`flex flex-col items-center justify-center py-2 h-7 pb-2 rounded-full cursor-pointer border-[0.5px] transition-all
                  ${
                    tipAmount === tip.amount
                      ? 'bg-[#306cac] border border-white text-white '
                      : 'bg-[#306cac] bg-opacity-80 border  border-[#306cac] text-white hover:bg-opacity-90'
                  }
                `}
                style={{
                  minWidth: 70,
                  margin: '4 0px',
                  boxShadow: tipAmount === tip.amount ? '0 0 0 [0.5]px #fff, 0 0 0 4px #306cac' : undefined
                }}
              >
                <div className={`font-semibold text-xs mb-1 ${tipAmount === tip.amount ? 'text-white' : 'text-white/90'}`}>{tip.label}</div>
                <div className={`text-xs mt-1.5 mb-[-25px] ${tipAmount === tip.amount ? 'text-white' : 'text-blue-100'}`}>${tip.amount}.00</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 mb-4 pb-4 px-6">
        <div className="text-sm font-medium text-gray-700">Think I did better?</div>
        <div className="flex items-center border border-gray-200 rounded-sm space-x-1 bg-white">
          <div
            onClick={() => setTipAmount(Math.max(0, tipAmount - 1))}
            className="px-4 py-2 cursor-pointer text-[#306cac] text-lg font-bold select-none hover:bg-blue-50 transition"
          >
            -
          </div>
          <input
            type="number"
            value={tipAmount}
            onChange={(e) => setTipAmount(Number(e.target.value))}
            className="w-20 px-2 py-2 text-center border-x border-gray-200 focus:outline-none text-lg font-semibold text-[#306cac] bg-white"
          />
          <div
            onClick={() => setTipAmount(tipAmount + 1)}
            className="px-4 py-2 cursor-pointer text-[#306cac] text-lg font-bold select-none hover:bg-blue-50 transition"
          >
            +
          </div>
        </div>

        <div className="flex items-center px-4 py-3 bg-[#f8fcfc]">
        
          <input
            type="checkbox"
            id="tip-agree"
            className="w-5 h-5 accent-[#306cac] border border-[#306cac] rounded mr-3 cursor-pointer"
            style={{ 
              minWidth: 20, 
              minHeight: 20, 
              backgroundColor: "#fff",
              colorScheme: "light"
            }}
          />
        <label htmlFor="tip-agree" className="text-sm text-gray-700 cursor-pointer">
          <span className="font-semibold text-[#306cac]">I agree</span>
          <span className="text-gray-700">, that this amount will be charged in addition to the cost of the airline ticket(s)</span>
        </label>
      </div>
      </div>
    </div>
  );

  const PriceSummary = () => {
    const pricing = calculatePricing();
    const flightData = bookingData?.flightConfig || {};
    const flights = flightData.flights || [];

    return (
      <div className="bg-white rounded-sm shadow-sm sticky top-4">
        <div className="flex  gap-1 pt-4 px-6 mb-4 border-b border-gray-200">
          <img src={plane} alt="" className='h-4 mt-1' />
          <span className="text-md text-gray-600 font-bold">Flight</span>
          <div className="ml-auto space-y-2 text-xs font-semibold text-gray-600 text-right">
            <div>{flights[0]?.route || "Norfolk (ORF) to Las Vegas (LAS) Wed, Aug 6"}</div>
            <div>{flights[1]?.route || "Las Vegas (LAS) to Norfolk (ORF) Mon, Aug 11"}</div>
             
           <div className="mt-6 mb-4">
            <div
              className="rounded-xs py-1 font-semibold text-sm text-[#306cac] bg-white relative"
              style={{
                minWidth: 250,
                textAlign: "center",
                fontWeight: 600,
                display: "inline-block",
                border: "1px solid #306cac"
              }}
            >
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full"
                style={{
                  borderRight: "1px solid #306cac"
                }}
              ></div>
              
              <div 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full"
                style={{
                  borderLeft: "1px solid #306cac"
                }}
              ></div>
              
              ITN Confirm. No.: <span className="font-bold">{flightData.customization?.confirmationCode || 'CPYSVV'}</span>
            </div>
          </div>

          </div>
        </div>

        {/* Dynamic Items */}
        <div className="mb-2 px-6">
          <div className="text-gray-700 flex justify-between items-start mt-2">
            <div>
              <span className="font-semibold text-sm text-gray-500">Round-Trip Flight</span>
            </div>
            <span className="font-semibold text-base">${pricing.flightPrice.toFixed(2)}</span>
          </div>

          {selectedTravelCare !== 'decline' && (
            <div className="text-gray-700 flex justify-between items-start mt-2">
              <div>
                <span className="italic font-bold text-gray-600 text-sm">Travel Care Service (x1)</span>
                <div className="text-xs text-gray-500 -mt-0.5">Non-refundable charge by ITN LLC</div>
              </div>
              <span className="font-semibold text-base">${pricing.travelCarePrice.toFixed(2)}</span>
            </div>
          )}

          {selectedDreamPass !== '0' && (
            <div className="text-gray-700 flex justify-between items-start mt-2">
              <div>
                <span className="italic font-bold text-gray-600 text-sm">Dreampass Plus</span>
                <div className="text-xs text-gray-500 -mt-0.5">Non-refundable charge by ITN LLC</div>
              </div>
              {pricing.dreamPassPrice > 0 ? (
                <span className="font-semibold text-base">${pricing.dreamPassPrice.toFixed(2)}</span>
              ) : (
                <div className="text-[#306cac] text-sm underline cursor-pointer mt-1">Add</div>
              )}
            </div>
          )}

          {selectedBaggage === 'accept' && (
            <div className="text-gray-700 flex justify-between items-start mt-2">
              <div>
                <span className="italic font-bold text-gray-600 text-sm">Lost Baggage Protection</span>
                <span className="text-xs text-gray-600"> (per person) $30.99</span>
                <div className="text-xs text-gray-500 -mt-0.5">Non-refundable charge by ITN LLC</div>
              </div>
              <span className="font-semibold text-base">${pricing.baggagePrice.toFixed(2)}</span>
            </div>
          )}

          {!selectedBaggage && (
            <div className="text-gray-700 flex justify-between items-start mt-2">
              <div>
                <span className="italic font-bold text-gray-600 text-sm">Lost Baggage Protection</span>
                <span className="text-xs text-gray-600"> (per person) $30.99</span>
                <div className="text-xs text-gray-500 -mt-0.5">Non-refundable charge by ITN LLC</div>
              </div>
              <div className="text-[#306cac] text-sm underline cursor-pointer mt-1">Add</div>
            </div>
          )}
        </div>

        <div className="border-t flex border-gray-200 pt-4 mb-3 px-6">
          <div className='w-2/3 items-center justify-between gap-2'>
            <div className="flex mb-1">
              <img src={voucher} className='h-6 w-5 mt-0.5 items-center  mr-1.5 ' />
              <span className="text-gray-700 text-base font-semibold">Do you have a voucher?</span>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              You can redeem the voucher code to get special discount
            </div>
          </div>

          <div className="w-1/3 flex justify-end h-1/3 items-center relative">
            {appliedVoucher ? (
              <div className="flex items-center gap-2">
                <div className="text-green-600 text-xs font-medium">
                  {appliedVoucher.code} applied
                </div>
                <div
                  onClick={handleRemoveVoucher}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Remove
                </div>
              </div>
            ) : (
              <div className="relative">
                <div 
                  onClick={() => setIsVoucherDropdownOpen(!isVoucherDropdownOpen)}
                  className=" cursor-pointer text-gray-600 flex items-center gap-1 border border-gray-300 rounded-full px-2 py-1 text-xs font-medium bg-white hover:bg-gray-50 transition"
                >
                  Redeem
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </div>
                
                <VoucherDropdown 
                  isOpen={isVoucherDropdownOpen}
                  onClose={() => setIsVoucherDropdownOpen(false)}
                  onApplyVoucher={handleApplyVoucher}
                />
              </div>
            )}
          </div>
        </div>

        {/* Show voucher discount if applied */}
        {appliedVoucher && pricing.voucherDiscount > 0 && (
          <div className="px-6 mb-2">
            <div className="text-gray-700 flex justify-between items-start">
              <div>
                <span className="text-green-600 font-semibold text-sm">Voucher Discount ({appliedVoucher.code})</span>
                <div className="text-xs text-gray-500">
                  {appliedVoucher.type === 'percentage' 
                    ? `${appliedVoucher.discount}% off`
                    : `${appliedVoucher.discount} off`
                  }
                </div>
              </div>
              <span className="font-semibold text-base text-green-600">-${pricing.voucherDiscount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-2 px-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600 text-lg font-bold">Total:</span>
            <span className="text-gray-600 text-2xl font-bold">${pricing.total.toFixed(2)}</span>
          </div>
          <div className="text-[10px] font-semibold text-gray-500 text-end mb-4">
            ({pricing.total.toFixed(2)} US dollars)
          </div>

          <div className="bg-[#e8f4fc] w-full rounded-sm p-2 mb-3 flex">
            <div className='w-1/2 flex items-center'>
              <div className="flex flex-col items-centers mb-2">
                <span className="text-sm font-bold text-[#306cac]">Please rate</span>
                <span className="font-semibold text-xs text-[#306cac]">the quality of Service</span>
              </div>
            </div>

            <div className="w-1/2 flex gap-2 justify-center items-center">
              {[
                { id: 'sad', src: sad, alt: 'Sad' },
                { id: 'neutral', src: neutral, alt: 'Neutral' },
                { id: 'smile', src: smile, alt: 'Smile' },
                { id: 'smile2', src: smile2, alt: 'Happy' },
                { id: 'happy', src: happy, alt: 'Very Happy' }
              ].map((rating) => (
                <div 
                  key={rating.id}
                  onClick={() => setSelectedRating(rating.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xl cursor-pointer transition-all duration-200 ${
                    selectedRating === rating.id 
                      ? 'bg-[#acd0f6] bg-opacity-20 transform scale-110' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <img 
                    src={rating.src} 
                    alt={rating.alt}
                    className={`transition-all duration-200 ${
                      selectedRating === rating.id 
                        ? 'filter brightness-50 contrast-150' 
                        : ''
                    }`}
                    style={{
                      filter: selectedRating === rating.id 
                        ? 'brightness(0.5) saturate(2) hue-rotate(200deg)' 
                        : 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">Loading booking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <img
                    src={logo}
                    alt="ASAP Tickets Logo"
                    className="h-8 w-auto"
                    style={{ display: 'block' }}
                    onError={(e) => {
                      e.target.src = logo;
                    }}
                  />
                  
                </div>
        
        <div className="hidden md:flex gap-8 text-gray-600 text-sm">
          <span className="cursor-pointer hover:text-gray-800">About Us</span>
          <span className="cursor-pointer hover:text-gray-800">Reviews</span>
          <span className="cursor-pointer hover:text-gray-800">Privacy Policy</span>
          <span className="cursor-pointer hover:text-gray-800">Terms & Conditions</span>
          <span className="cursor-pointer hover:text-gray-800">Language (English) ▼</span>
        </div>
        
        <div className="text-right text-sm text-gray-600">
          <div>Travel agent <span className="font-bold text-gray-800">{bookingData?.flightConfig?.customization?.agentEmail || 'vasan.oneill.w@asaptickets.com'}</span></div>
          <div><span className="font-bold text-gray-800">{bookingData?.flightConfig?.customization?.agentName || 'Vasan Oneill'}</span> {bookingData?.flightConfig?.customization?.agentPhone || '(888) 806 - 4059'}</div>
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
              <CheckIcon />
            </div>
            <div className="text-sm">Choose best<br/>flight</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-sm"style={{color: '#306cac'}}>
              4
            </div>
            <div className="text-sm text-white">Complete<br/>payment</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-screen mx-auto p-3 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Main Content */}
            <div className="flex-1 lg:max-w-[66%]">
            <FlightDetails />
            <PassengerDetails />
           
            <TravelCare 
              selectedPlan={selectedTravelCare}
              onPlanChange={handleTravelCareChange}
            />
            <DreamPass 
              selectedPlan={selectedDreamPass}
              onPlanChange={handleDreamPassChange}
            />
            <BaggageProtection 
              selectedOption={selectedBaggage}
              onOptionChange={handleBaggageChange}
            />
            <PaymentSection 
              paymentData={paymentData}
              onDataChange={handlePaymentDataChange}
              totalPrice={calculatePricing().total}
              currency={bookingData?.flightConfig?.price?.currency || 'USD'}
              validationErrors={validationErrors}
            />
            <FlightDetailsModal
              isOpen={activeFlightModal.isOpen}
              onClose={() => setActiveFlightModal({ isOpen: false, flight: null, type: '' })}
              flight={activeFlightModal.flight}
              flightConfig={bookingData?.flightConfig}
              flightType={activeFlightModal.type}
            />
            <TipSection />
            
            {/* Agreement and Submit */}
            <div className="bg-[#f8fcfc] rounded-lg shadow-sm p-6">
              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={agreement}
                  onChange={(e) => {
                    setAgreement(e.target.checked);
                    // Clear agreement validation error when user checks it
                    if (e.target.checked && validationErrors.agreement) {
                      setValidationErrors(prev => ({
                        ...prev,
                        agreement: false
                      }));
                    }
                  }}
                  className={`w-5 h-5 accent-[#306cac] border rounded bg-white mt-1 ${
                    validationErrors.agreement ? 'border-red-500' : 'border-[#306cac]'
                  }`}
                  style={{ 
                    minWidth: 20, 
                    minHeight: 20, 
                    backgroundColor: "#fff",
                    colorScheme: "light"
                  }}
                />
                <span className="text-[13px] text-gray-600 leading-relaxed">
                  By checking this box I affirm that I have read, understood and accepted present{' '}
                  <span className="text-[#306cac] font-bold underline cursor-pointer">Terms and Conditions</span>,{' '}
                  <span className="text-[#306cac] font-bold underline cursor-pointer">Travel Care Service Terms and Conditions</span>,{' '}
                  <span className="text-[#306cac] font-bold underline cursor-pointer">Privacy Policy</span> and{' '}
                  <span className="text-[#306cac] font-bold underline cursor-pointer">airline liability limitations</span>, confirmed the accuracy of flight itinerary, and verified the spelling of the name(s) of the passenger(s) to be matching passenger(s) passport(s) /{' '}
                  <span className="text-[#306cac] font-bold underline cursor-pointer">valid travel document(s)</span>, as well as I have taken the consent of Credit/Debit Card Holder and all the passengers regarding the{' '}
                  <span className="text-[#306cac] font-bold underline cursor-pointer">Terms and Conditions</span> and{' '}
                  <span className="text-[#306cac] font-bold underline cursor-pointer">Privacy Policy</span>.
                </span>
              </label>

              <div className="flex justify-end">
                <div
                  onClick={handleCompletePayment}
                  disabled={saving || !agreement}
                  className={`flex justify-center items-center rounded-sm gap-2 px-8 py-3 font-medium text-white text-lg transition ${
                    agreement && !saving
                      ? 'bg-[#306cac] hover:bg-[#306cac]/90 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  style={{ minWidth: 300 }}
                >
                  <img src={padlock} alt="" className='h-5'/>
                  <span>{saving ? 'Processing...' : 'Pay Securely Now'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Price Summary */}
          <div className="max-w-2/6 w-full">
            <PriceSummary />
          </div>
        </div>
      </div>
      <div className='h-50 p-4'>
        <img src={footer} alt="" className='w-full px-6'/>
      </div>

      {/* Modals */}
      <BaggageFeesModal 
        isOpen={activeBaggageModal} 
        onClose={() => setActiveBaggageModal(false)} 
      />
      <FareRulesModal 
        isOpen={activeFareModal} 
        onClose={() => setActiveFareModal(false)} 
      />
      <EditPassengerModal 
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        passenger={editingPassenger}
        onSave={handleSavePassenger}
      />
    </div>
  );
};

export default PaymentPage;