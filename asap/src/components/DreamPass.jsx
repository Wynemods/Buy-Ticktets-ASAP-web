import { useState, useEffect } from 'react';
import dreampass from '../assets/dreampass1.png';
import dreampasslogo from '../assets/dreampass2.png';
import international from '../assets/international.png';
import savingsImg from '../assets/star.png';
import esimImg from '../assets/esim.png';
import notificationsImg from '../assets/alarm.png';
import creditImg from '../assets/coin.png';
import dealsImg from '../assets/crown.png';

const DreamPass = ({ selectedPlan = '55', onPlanChange = () => {} }) => {
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  // Update parent when selection changes
  useEffect(() => {
    onPlanChange(selectedPlan);
  }, [selectedPlan, onPlanChange]);

  const toggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  const handlePlanChange = (planId) => {
    onPlanChange(planId);
  };

  const accordionItems = [
    {
      id: 'medical',
      title: 'International Emergency Medical Protection',
      summary: 'Comprehensive medical coverage up to $500,000 for you and your family while travelling international, ensuring you are protected wherever you go.',
      description: 'The coverage includes assistance for medical emergencies and reimbursement for expenses up to $500,000 if you or your accompanying immediate family become ill or injured during your trip abroad. This includes urgent or unplanned medical treatment for illness or injury (including Covid-19), hospitalization coverage including surgery and specialist care, reimbursement for certain out-of-pocket costs incurred during in-patient stays, and emergency dental treatment. Please note that to use this benefit, you need to activate it following the activation process provided in the DreamPass App, no earlier than 72 hours before your trip. Full Terms and Conditions',
      image: international
    },
    {
      id: 'savings',
      title: 'Unlock greater savings on your trips',
      summary: 'Earn up to 10% cashback on every purchase, turning your trips into future rewards. On average, members save $51 on every booking!',
      description: 'Dreampass Plus is a membership that offers generous cashback in the form of Dreamcoins, up to 10% for every trip. Dreamcoins are points exclusively earned by members through the Loyalty Program. DreamCoins rewards are as follows: Tickets: 1.5% on economy class tickets; 0.75% on business class tickets, Car rentals, hotels, airport transfers: 3%, Travel Care Service, Exchange/Cancel For Any Reason, Medical Expense Trip Protection: 5%, Other services: 10%. Dreamcoins remain valid for 18 months from the date of addition to your account. For more details, please refer to the program\'s Terms and Conditions',
      image: savingsImg
    },
    {
      id: 'esim',
      title: 'Connect anywhere, anytime with eSIM',
      summary: (
        <span>
          <span style={{ color: '#7245F0' }}>Free 3 GB</span> of data across{' '}
          <span style={{ color: '#7245F0' }}>140 countries</span> for{' '}
          <span style={{ color: '#7245F0' }}>all your trips with us</span>. Travel smart and stay connected.
        </span>
      ),
      description: 'Stay connected effortlessly with our Travel eSIM, providing instant access to free mobile data as soon as you arrive at your destination for each trip booked through us. No physical SIM card required—just activate it and go! Enjoy 3GB of mobile data, valid for 365 days, for each trip booked through us. No roaming fees or surprise charges. Works in 140 countries, giving you global coverage for stress-free travel. Activate easily in just a few taps.',
      image: esimImg
    },
    {
      id: 'notifications',
      title: 'Stress-free travel with the fastest real-time notifications',
      summary: (
        <span>
          <span style={{ color: '#7245F0' }}>With our Dreampass app</span> - all your flight info, right when you need it. Stay informed with{' '}
          <span style={{ color: '#7245F0' }}>real-time flight tracking</span>, gate changes, baggage info, and delay information. Easy to use. Hard to fly without.
        </span>
      ),
      description: 'Everything you\'ve ever wanted to know about your trip - be the first to hear about delays, gate or terminal changes, baggage carousel info, and more. Get fast, clear alerts exactly when they matter most. Just download the Dreampass app and stay ahead of everyone else with real-time updates right in your pocket. Travel with confidence, skip the stress, and focus on what really matters.',
      image: notificationsImg
    },
    {
      id: 'credit',
      title: '$100 Ancillary Credit',
      summary: 'Get $100 credit per year towards future ancillary purchases of Travel Care Service and Lost Baggage Protection products. Benefit is available only for a 12-month membership. $100 credit expires 12 months from the date of membership activation or renewal',
      description: 'On your next purchase with us, choose any ancillary benefit you desire to enhance your travel experience, and up to $100 per year will be credited back to you immediately after the purchase! Claim your reimbursement through your agent or submit the request here. You can use the credit on the 8th day after the membership purchase. Benefit is available only for a 12-month membership. $100 credit expires 12 months from the date of membership activation or renewal',
      image: creditImg
    },
    {
      id: 'deals',
      title: 'Enjoy Members-only Deals',
      summary: 'Access exclusive deals and discounts available only to our members.',
      description: '',
      image: dealsImg
    }
  ];

  const pricingPlans = [
    {
      id: '39',
      name: 'Pay every 3 months',
      price: '$69.95',
      monthlyPrice: '$23.31 per month'
    },
    {
      id: '47',
      name: 'Pay every 6 months',
      price: '$119.95',
      monthlyPrice: '$19.99 per month'
    },
    {
      id: '55',
      name: 'Pay every 12 months',
      price: '$129.95',
      originalPrice: '$279.80',
      monthlyPrice: '$10.82 per month',
      discount: 'Save 54% + $100 Ancillary Credit',
      badge: 'Limited time offer (over $300 value)'
    }
  ];

  return (
    <div className="w-auto mx-auto bg-[#f0ecfc] mb-6 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#692ff1] to-[#9869ff] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-transparent rounded px-2 py-1">
              <img src={dreampasslogo} alt="" />
            </div>
          </div>
          {/* <div className="flex items-center space-x-1 bg-transparent rounded-full px-3 py-2 border border-white">
            <div className="w-4 h-4 bg-transparent rounded-full border-[2px] border-white flex items-center justify-center">
              <span className="text-white text-xs">i</span>
            </div>
            <span className="text-white text-xs font-semibold">How it works</span>
          </div>
          */}
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#f0ecfc] px-4 pt-3 pb-2">
        <div className="flex">
          <div className="flex-1">
            <h2 className="text-gray-600 text-xl font-bold mb-2 pt-4 ">
              Travel with Confidence, Save with Assurance
            </h2>
            <p className="text-gray-600 text-sm w-9/12">
              Join our exclusive travel membership and enjoy peace of mind on every journey. With our all-in-one travel protection plan, you can travel smarter and safer.
            </p>
          </div>
          <div className="ml-4 relative ">
            <div className="h-40 w-40 pr-6 bg-transparent rounded-full flex items-center justify-center">
              <img src={dreampass} alt="" className='h-45 w-40'/>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Items */}
      <div className="px-4 py-2 mx-4 bg-white rounded-md border border-gray-200">
        {accordionItems.map((item, index) => (
          <div key={item.id} className="border-b border-gray-100 last:border-b-0">
            <div
              onClick={() => toggleAccordion(item.id)}
              className="w-full py-4 flex items-start justify-between text-left focus:outline-none"
            >
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-10 h-10 bg-transparent flex items-center justify-center mt-0.5">
                  <img src={item.image} alt="" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-700 text-lg  mb-1">{item.title}</h3>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {typeof item.summary === 'string' ? (
                      item.summary.split(/(\$[0-9,]+(?:\.\d+)?(?: per year)?|up to \$[0-9,]+|members save \$\d+|10% cashback|140 countries|all your trips with us|real-time flight tracking|With our Dreampass app|exclusive deals and discounts|members save \$\d+ on every booking|credit per year|credit expires 12 months|Terms and Conditions|Privacy Policy|real-time notifications|medical protection|member-only benefits|Travel Care Service|Lost Baggage Protection|exclusive deals and discounts|earn up to 10% cashback|members save \$\d+ on every booking|Free 3 GB|No, I do not want medical protection and member-only benefits for my bookings|credit expires 12 months from the date of membership activation or renewal|credit per year towards future ancillary purchases)/gi)
                        .map((part, i) => {
                        // Highlight rules
                        if (
                            /\$[0-9,]+(?:\.\d+)?(?: per year)?/i.test(part) ||
                            /up to \$[0-9,]+/i.test(part) ||
                            /members save \$\d+/i.test(part) ||
                            /10% cashback/i.test(part) ||
                            /140 countries/i.test(part) ||
                            /all your trips with us/i.test(part) ||
                            /real-time flight tracking/i.test(part) ||
                            /With our Dreampass app/i.test(part) ||
                            /exclusive deals and discounts/i.test(part) ||
                            /Free 3 GB/i.test(part)
                        ) {
                            return (
                            <span key={i} className="text-[#7245F0] font-medium">
                                {part}
                            </span>
                            );
                        }
                        return part;
                        })
                        ) : (
                        item.summary
                        )}
                  </div>
                </div>
              </div>
              <div className="ml-2">
                <div className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-transform ${expandedAccordion === item.id ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {expandedAccordion === item.id && item.description && (
              <div className="pb-4 pl-13 pr-4">
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pricing Plans */}
      <div className="px-4 py-4 flex w-full gap-4 justify-center">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="relative">
            {plan.badge && (
              <div className="absolute -top-2 left-4 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-md z-10">
                {plan.badge}
              </div>
            )}
            <label
              className={`block border h-37 w-60 rounded-lg p-4 cursor-pointer transition-colors bg-white relative ${
                selectedPlan === plan.id
                  ? 'border-[#692fff]'
                  : 'border-gray-300 hover:border-gray-300'
              }`}
              style={{ boxSizing: 'border-box' }}
            >
              {/* Custom radio at top right */}
              <span
                className={`absolute top-3 right-3 flex items-center justify-center rounded-full border ${
                  selectedPlan === plan.id
                    ? 'border-[#692fff] bg-white'
                    : 'border-gray-500 bg-white'
                }`}
                style={{
                  width: '18px',
                  height: '18px',
                }}
              >
                {selectedPlan === plan.id && (
                  <span
                    className="block rounded-full"
                    style={{
                      width: '9px',
                      height: '9px',
                      background: '#692fff',
                    }}
                  ></span>
                )}
              </span>
              {/* Visually hidden radio input for accessibility */}
              <input
                type="radio"
                name="pricing-plan"
                value={plan.id}
                checked={selectedPlan === plan.id}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div>
                  <div className="font-medium text-gray-700 text-lg">{plan.name}</div>
                  <div className="flex items-center space-x-2">
                    {plan.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">{plan.originalPrice}</span>
                    )}
                    <span className="text-xl font-bold text-gray-700">{plan.price}</span>
                  </div>
                  <div className="text-sms text-gray-600">{plan.monthlyPrice}</div>
                  {plan.discount && (
                    <div className="text-sm text-[#693fff] font-semibold mt-1">{plan.discount}</div>
                  )}
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* No option */}
      <label className="block rounded-lg px-6 pb-4 cursor-pointer hover:border-gray-300">
        <div className="flex items-center">
          {/* Visually hidden radio */}
          <input
            type="radio"
            name="pricing-plan"
            value="0"
            checked={selectedPlan === '0'}
            onChange={(e) => handlePlanChange(e.target.value)}
            className="sr-only"
            id="no-plan"
          />
          {/* Custom radio */}
          <span
            className={`relative flex items-center justify-center rounded-full border transition-colors
              ${selectedPlan === '0' ? 'border-[#693fff]' : 'border-gray-400'}
            `}
            style={{ width: 20, height: 20 }}
          >
            {selectedPlan === '0' && (
              <span
                className="absolute rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  background: '#693fff',
                  boxShadow: '0 0 0 2px #fff',
                }}
              />
            )}
          </span>
          <span className="ml-3 text-gray-700">
            No, I do not want medical protection and member-only benefits for my bookings
          </span>
        </div>
      </label>

      {/* Footer */}
      <div className="px-4 py-4 space-y-2 bg-white">
        <p className="text-xs text-gray-600">
          By choosing the option I confirm that I have read and agreed to the{' '}
          <span className="text-[#306cac]">Terms and Conditions</span> and the{' '}
          <a href="#" className="text-[#306cac]">Privacy Policy.</a>
        </p>
        <p className="text-xs text-gray-600">
          I confirm that I am eligible for coverage and have considered the{' '}
          <a href="#" className="text-[#306cac]">Terms and Conditions</a>. Opportuna Insurance PCC Limited is the underwriter.
        </p>
        <p className="text-xs text-gray-600">
          All future communications with the member will be sent to the email address{' '}
          <a href="mailto:shanayers944@gmail.com" className="text-[#306cac]">shanayers944@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default DreamPass;