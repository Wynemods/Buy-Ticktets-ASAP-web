import React, { useState, useEffect } from 'react';
import { Shield, ChevronDown, Check, X } from 'lucide-react';
import travelcare from '../assets/travelcare.png';
import jim from '../assets/jim.png';

const TravelCare = ({ selectedPlan = 'premium', onPlanChange = () => {} }) => {
  const [addInsurance, setAddInsurance] = useState({
    basic: false,
    premium: true,
    allIncluded: false
  });
  const [declineSelected, setDeclineSelected] = useState(false);

  // Update parent when selection changes
  useEffect(() => {
    if (declineSelected) {
      onPlanChange('decline');
    } else {
      onPlanChange(selectedPlan);
    }
  }, [selectedPlan, declineSelected, onPlanChange]);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$62.02'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$76.62',
      mostPopular: true
    },
    {
      id: 'allIncluded',
      name: 'All included',
      price: '$83.92',
      originalPrice: '$97.90',
      oneTimeOffer: true
    }
  ];

  const features = [
    {
      id: 'vipSupport',
      title: 'VIP Support & Flight Delay Rebooking',
      description: 'Get priority support and free rebooking when your flight is delayed',
      hasDropdown: true,
      availability: [true, true, true]
    },
    {
      id: 'changeForFree',
      title: 'Change for Free',
      description: 'Add flexibility to your trip and we will waive all fees',
      hasDropdown: true,
      availability: [false, true, true]
    },
    {
      id: 'voucher',
      title: '$25 Voucher for Your Next Trip',
      description: 'Take $25 off your next booking with us!',
      hasDropdown: false,
      availability: [false, false, true]
    },
    {
      id: 'insurance',
      title: 'Travel Insurance (for US residents only)',
      description: 'Protect your trip. Underwritten by Nationwide®',
      specialOffer: 'Special offer +$10.95 only',
      hasDropdown: true,
      availability: [false, false, true]
    }
  ];

  const handleInsuranceChange = (planId, checked) => {
    setAddInsurance(prev => ({
      ...prev,
      [planId]: checked
    }));
  };

  const handleDeclineChange = (checked) => {
    setDeclineSelected(checked);
    if (checked) {
      onPlanChange('decline');
    }
  };

  const handlePlanSelect = (planId) => {
    setDeclineSelected(false);
    onPlanChange(planId);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white mb-5">
      {/* Header with green background */}
      <div className="bg-[#2aa575] text-white px-6 flex h-25 justify-between">
        <div className="flex items-center gap-3">
          <img src={travelcare} alt="" className='h-auto w-10/12' />
        </div>
        <div className="rounded-lg flex items-center justify-center">
          <span className="text-sm text-white/80">
          <img src={jim} alt="" className='h-30 pb-2.5' />
          </span>
        </div>
        {/* Plan cards */}
        <div className=" w-1/2 grid grid-cols-3 gap-2 pl-7.5  pt-6 h-25">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-green-50 rounded-t-sm p-2 text-center relative border-x-1 h-20 ${
                selectedPlan === plan.id ? 'border-[#2aa575]' : 'border-[#2aa575]'
              }`}
            >
              {plan.mostPopular && (
                <div className="absolute w-2/3 -top-3 left-1/2 transform -translate-x-1/2 font-semibold bg-yellow-500 text-gray-700 px-1 py-1 rounded-xs text-[9px]">
                  Most Popular
                </div>
              )}
              <h3 className="font-medium text-sm mb-2 text-gray-700 ">{plan.name}</h3>
              <div className="">
                {plan.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">{plan.originalPrice}</div>
                )}
                <div className="text-xs text-gray-800">{plan.price}</div>
              </div>
              {plan.oneTimeOffer && (
                <div className="text-[9px] text-orange-600 mb-1">ONE-TIME OFFER</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Plans container */}
      <div className="bg-green-50 mx-auto">
        {/* Features list */}
        <div className=" ">
          {features.map((feature, index) => (
            <div key={feature.id} className="rounded-lg flex">
              <div className="py-2 px-4 flex w-1/2 items-center justify-between border-b border-gray-200">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-800">{feature.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                  {feature.specialOffer && (
                    <div className="text-sm text-orange-600 font-semibold mt-1">{feature.specialOffer}</div>
                  )}
                </div>
                {feature.hasDropdown && (
                  <ChevronDown className="w-5 h-5 text-gray-400 ml-4" />
                )}
              </div>
              
              <div className="pl-7.5 px-6 grid grid-cols-3 gap-2 w-1/2">
                {plans.map((plan, planIndex) => (
                  <div key={`${feature.id}-${plan.id}`} className="text-center border-x border-[#2aa575] py-4">
                    {feature.availability[planIndex] ? (
                      <Check className="w-6 h-6 text-[#2aa575] mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-gray-400 mx-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

           <div className="text-white px-6 mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3 w-1/2">
                   <label className="flex items-start gap-3 cursor-pointer">
                        {/* Custom styled radio button */}
                        <span
                          className={`w-4 h-4 flex items-center justify-center rounded-full border mt-1 ${
                            declineSelected ? 'border-[#2aa575] bg-white' : 'border-[#2aa575] bg-white'
                          }`}
                          style={{ backgroundColor: '#f4fcf8' }}
                        >
                          {declineSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#2aa575] block"></span>
                          )}
                        </span>
                        <input
                          type="radio"
                          name="travelCare"
                          checked={declineSelected}
                          onChange={(e) => handleDeclineChange(e.target.checked)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <span className="text-gray-800 text-sm">
                            No, thanks, I choose not to add Travel Care Plan and take all the risks on myself.
                          </span>
                          <span className="text-[#306cac] text-sm underline ml-2 cursor-pointer">Read More</span>
                        </div>
                    </label>
                </div>

                {/* Plan cards */}
                <div className="w-1/2 grid grid-cols-3 gap-2 pl-7.5 h-20">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`bg-green-50 rounded-b-sm p-2 text-center relative border-x-1 border-b h-20 ${
                        selectedPlan === plan.id ? 'border-[#2aa575]' : 'border-[#2aa575]'
                      }`}
                    >
                      <div className="mt-1">
                        <label className="flex items-center justify-center gap-2 text-sm cursor-pointer">
                          <span
                            className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
                              selectedPlan === plan.id
                                ? 'border-[#2aa575] bg-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {selectedPlan === plan.id && (
                              <span className="w-2 h-2 rounded-full bg-[#2aa575] block"></span>
                            )}
                          </span>
                          <input
                            type="radio"
                            name="planSelect"
                            checked={selectedPlan === plan.id && !declineSelected}
                            onChange={() => handlePlanSelect(plan.id)}
                            className="sr-only"
                          />
                          <span className="text-[#2aa575] font-semibold">
                            {selectedPlan === plan.id && !declineSelected ? 'Added' : 'Add'}
                          </span>
                        </label>
                        <div className="text-[10px] text-[#306cac] underline mt-1 cursor-pointer">
                          Terms & Conditions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
      </div>
        </div>

        {/* Footer Terms */}
        <div className="mt-4 text-xs text-gray-600">
          <div className="bg-white px-6 pt-4">
            Underwritten by Nationwide Mutual Insurance Company, Columbus, Ohio. In WA, coverage is underwritten by Nationwide Life Insurance Company, Columbus, Ohio and Nationwide Mutual Insurance Company, Columbus, Ohio. Applicable to Policy forms NSIGTC 2000, NSHTC 2000, SRTC 2000, or state equivalent. Travel Care Service is not an insurance policy. Travel Care Service is provided by ITN solely in combination with Travel Insurance provided by TRAWICK. Please refer to the terms and conditions to find out about the full terms for each product.
          </div>
          <div className="text-center text-gray-600 bg-white rounded-lg p-3">
            DON'T MISS THE CHANCE. NOT AVAILABLE AFTER BOOKING.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelCare;