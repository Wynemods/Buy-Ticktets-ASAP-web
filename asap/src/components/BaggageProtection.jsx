import { useState, useEffect } from 'react';
import bag from '../assets/bag.png';
import lost from '../assets/lost.png';

const BaggageProtection = ({ selectedOption = '', onOptionChange = () => {} }) => {

  // Update parent when selection changes
  useEffect(() => {
    onOptionChange(selectedOption);
  }, [selectedOption, onOptionChange]);

  const handleOptionChange = (value) => {
    onOptionChange(value);
  };

  return (
    <div className="bg-white shadow-sm overflow-hidden mb-6">
      {/* Header Section with Blue Background */}
      <div className="bg-[#2886bb] p-0 relative h-50">
        <img src={lost} alt="Lost Baggage Protection" className="px-6 pt-4" />
        {/* Header Content and Card */}
        <div className="flex w-full flex-col md:flex-row items-start md:items-stretch">
            
          {/* Left: Card with benefits */}
          <div className="w-full md:w-[540px] z-10">
            <div className="bg-white  shadow-md mt-[-35px] md:mt-5 ml-0 md:ml-8 p-1 md:py-1 px-2 border border-gray-200">
                            
              {/* Benefits List */}
              <div className="space-y-1 mb-1">
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-[#00946c] rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    We will <span className="font-semibold">track and expedite</span> the return of your undelivered bags by the airline
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-[#00946c] rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    <span className="font-semibold text-[#00946c]">Get $1,000 per bag</span> <span className="text-gray-700">(up to 2 bags)</span> if your luggage is not delivered within <span className="font-semibold text-green-700">96 hours</span>
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-[#00946c] rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    No proof of baggage contents is required to receive our <span className="font-semibold">Satisfaction Guarantee Payment</span>
                  </span>
                </div>
              </div>
              
            </div>
            

          </div>
          {/* Right: Suitcase Image */}
          <div className="hidden md:flex flex-1 justify-center  pr-8 mt-[-88px]">
            <img src={bag} alt="Suitcases" className="w-45 h-auto= object-contain" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-0">
        {/* Radio Options */}
        <div className="space-y-0 border-t border-gray-200 bg-[#e8f4fc] px-6 pt-4">
          {/* Accept Option */}
          {/* Recommended Badge */}
              <div className="flex justify-start ">
                <div className="bg-[#00946c] text-white mt-5 mx-5 px-2 py-1 rounded-full text-[11px] font-bold shadow-sm">
                  Recommended
                </div>
              </div>

          <label className="flex items-center space-x-2 cursor-pointer py-2 select-none">
            {/* Visually hidden radio */}
            <input
              type="radio"
              name="baggage-protection"
              value="accept"
              checked={selectedOption === 'accept'}
              onChange={(e) => handleOptionChange(e.target.value)}
              className="sr-only"
              id="baggage-accept"
            />
            {/* Custom radio */}
            <span
              className={`relative flex items-center justify-center rounded-full border transition-colors
                ${selectedOption === 'accept' ? 'border-[#306cac]' : 'border-[#306cac]'}
              `}
              style={{ width: 20, height: 20 }}
            >
              {selectedOption === 'accept' && (
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 10,
                    height: 10,
                    background: '#306cac',
                  }}
                />
              )}
            </span>
            <span className="text-[13px] text-gray-700">
              <span className="font-semibold">
                Yes, I want to add Lost Baggage Protection for{' '}
                <span className="text-[#306cac]">$30.99</span>
              </span>
              <span className="text-gray-600"> (per person)</span>{' '}
              <span className="font-semibold">and I agree to the </span>
              <a
                href="#"
                className="text-[#306cac] underline hover:text-[#176cae] font-medium"
              >
                Terms and Conditions
              </a>
            </span>
          </label>
         
        </div>
         {/* Decline Option */}
          <label className="flex items-center space-x-2 cursor-pointer py-2 px-6 select-none">
            {/* Visually hidden radio */}
            <input
              type="radio"
              name="baggage-protection"
              value="decline"
              checked={selectedOption === 'decline'}
              onChange={(e) => handleOptionChange(e.target.value)}
              className="sr-only"
              id="baggage-decline"
            />
            {/* Custom radio */}
            <span
              className={`relative flex items-center justify-center rounded-full border transition-colors
                ${selectedOption === 'decline' ? 'border-[#306cac]' : 'border-[#306cac]'}
              `}
              style={{ width: 20, height: 20 }}
            >
              {selectedOption === 'decline' && (
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 10,
                    height: 10,
                    background: '#306cac',
                  }}
                />
              )}
            </span>
            <span className="text-[13px] text-gray-800">
              No, I don't want to protect my bags
            </span>
          </label>
      </div>
    </div>
  );
};

export default BaggageProtection;