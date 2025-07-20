import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import americanexpress from '../assets/american express.png';
import mastercard from '../assets/mastercard.png';
import discover from '../assets/discover.png';
import visa from '../assets/visa.png';
import diners from '../assets/diners.png';
import affirm from '../assets/affirm.png';
import lock from '../assets/lock.png';
import safe from '../assets/safe.png';
import optimal from '../assets/optimum.png';

const allCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const PaymentSection = ({ paymentData = {}, onDataChange, totalPrice = 'undefined', validationErrors = {} }) => {
  // Local state for form data
  const [formState, setFormState] = useState({
    // Credit Card Information
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    cardHolderName: '',
    bankPhoneNumber: '',
    
    // Second Card Information (for split payment)
    cardNumber2: '',
    expirationMonth2: '',
    expirationYear2: '',
    cvv2: '',
    cardHolderName2: '',
    bankPhoneNumber2: '',
    
    // Billing Details
    country: 'United States',
    cardHolderEmail: '',
    zipCode: '',
    billingPhoneNumber: '',
    state: '',
    city: '',
    streetAddress: '',
    
    // Second Card Billing Details
    country2: 'United States',
    cardHolderEmail2: '',
    zipCode2: '',
    billingPhoneNumber2: '',
    state2: '',
    city2: '',
    streetAddress2: '',
    
    // Payment Method
    paymentMethod: 'card',
    splitPayment: false
  });

  // Simple update function that doesn't cause re-renders
  const updateField = (field, value) => {
    let processedValue = value;
    
    // Format card number with spaces for display
    if (field === 'cardNumber' || field === 'cardNumber2') {
      const digitsOnly = value.replace(/\D/g, '');
      processedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
      processedValue = processedValue.substring(0, 19);
    }
    
    // Limit CVV to 4 digits
    if (field === 'cvv' || field === 'cvv2') {
      processedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    const newState = { ...formState, [field]: processedValue };
    setFormState(newState);
    
    // Only update parent if onDataChange exists and is a function
    if (onDataChange && typeof onDataChange === 'function') {
      onDataChange(newState);
    }
  };

  // Format card number for display in preview
  const getCardNumberForPreview = (cardNumber) => {
    const digitsOnly = cardNumber.replace(/\s/g, '');
    if (!digitsOnly) return '0000 0000 0000 0000';
    
    const paddedNumber = digitsOnly.padEnd(16, '0');
    return paddedNumber.replace(/(\d{4})/g, '$1 ').trim();
  };

  // Helper function to get error styling classes
  const getFieldErrorClass = (fieldName) => {
    return validationErrors[fieldName] ? 'border-red-500' : 'border-gray-300';
  };

  return (
    <div className="bg-white shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Payment Information</h2>
        <div className="flex items-center text-sm text-gray-600">
          <img src={lock} alt="" className='mr-2 h-5' />
          All transactions are secure and encrypted.
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-4">
        <label className="flex items-center justify-between px-4 border border-gray-300 cursor-pointer">
          <div className="flex items-center">
            <span className="relative flex items-center mr-3">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={formState.paymentMethod === 'card'}
                onChange={(e) => updateField('paymentMethod', e.target.value)}
                className="peer appearance-none w-4 h-4 rounded-full border border-[#306cac] bg-white transition-colors duration-200 outline-none focus:ring-1 focus:ring-[#306cac]"
              />
              {formState.paymentMethod === 'card' && (
                <span className="pointer-events-none absolute left-0 top-0 w-4 h-4 flex items-center justify-center">
                  <span className="block w-2 h-2 rounded-full bg-[#306cac] transition-all duration-200"></span>
                </span>
              )}
            </span>
            <span className="text-gray-700 font-medium text-base">Credit Card / Debit Card</span>
          </div>
          <div className="flex items-center gap-3">
            <img src={americanexpress} alt="Amex" className="h-10 w-auto" />
            <img src={visa} alt="Visa" className="h-4 w-auto" />
            <img src={discover} alt="Discover" className="h-17 w-auto" />
            <img src={mastercard} alt="Mastercard" className="h-6 w-auto" />
            <img src={diners} alt="Diners Club" className="h-4 w-auto" />
            <span className="text-gray-700 font-bold text-lg ml-2">${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice}</span>
          </div>
        </label>
        
        {/* Disabled Affirm Option */}
        <label className="flex items-center justify-between p-4 border-x border-b border-gray-300 cursor-not-allowed bg-gray-50 opacity-60">
          <div className="flex items-center">
            <span className="relative flex items-center mr-3">
              <input
                type="radio"
                name="payment"
                value="affirm"
                disabled
                className="peer appearance-none w-4 h-4 rounded-full border border-gray-400 bg-gray-100 cursor-not-allowed"
              />
            </span>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium text-base">Affirm Monthly payment</span>
              
            </div>
          </div>
          <div className="flex items-center">
            <img src={affirm} alt="Affirm" className="h-6 w-auto opacity-50" />
          </div>
        </label>
      </div>

      {/* Card Payment Section */}
      {formState.paymentMethod === 'card' && (
        <div className="space-y-4">
          {/* Split Payment Banner */}
          <div className="flex items-center justify-between p-4 bg-blue-50 text-sm text-[#306cac] mb-2">
            <span>Not enough money on one card? Use two bank cards!</span>
            <div className="flex items-center gap-2">
              <span className="text-[#306cac] font-medium">Split Payment</span>
              <label className="relative inline-flex items-center cursor-pointer w-10 h-6">
                <input
                  type="checkbox"
                  checked={formState.splitPayment}
                  onChange={(e) => updateField('splitPayment', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-4 bg-blue-200 rounded-full transition-colors duration-200 peer-focus:outline-none" />
                <div className={`absolute left-0.5 top-0.4 w-6 h-6 bg-white border-2 border-[#306cac] rounded-full transition-all duration-200 ${formState.splitPayment ? 'translate-x-4 border-[#306cac]' : 'border-[#306cac]'}`} />
              </label>
            </div>
          </div>

          {/* First Card Form and Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Credit Card Form */}
            <div className="space-y-3">
              <h3 className="text-lg text-gray-700 font-semibold mb-3 mt-2">
                {formState.splitPayment ? 'First Credit Card' : 'Credit/Debit Card Information'}
              </h3>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Credit/Debit Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={formState.cardNumber}
                  onChange={(e) => updateField('cardNumber', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCardNumber')}`}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Expiration date</label>
                  <select 
                    value={formState.expirationMonth}
                    onChange={(e) => updateField('expirationMonth', e.target.value)}
                    className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentExpirationMonth')}`}
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Year</label>
                  <select 
                    value={formState.expirationYear}
                    onChange={(e) => updateField('expirationYear', e.target.value)}
                    className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentExpirationYear')}`}
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={2024 + i}>{2024 + i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1 flex items-center">
                    Security Code CVV
                    <span className="ml-1" title="3 or 4 digit code on your card">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#888">?</text></svg>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="***"
                    maxLength={4}
                    value={formState.cvv}
                    onChange={(e) => updateField('cvv', e.target.value)}
                    className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCvv')}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Please enter the exact name as on credit/debit card</label>
                <input
                  type="text"
                  placeholder="Card Holder's Name"
                  value={formState.cardHolderName}
                  onChange={(e) => updateField('cardHolderName', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCardHolderName')}`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1 flex items-center">
                  Bank's Phone Number
                  <span className="ml-1" title="Phone number on the back of your card">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#888">?</text></svg>
                  </span>
                </label>
                <PhoneInput
                  country={'us'}
                  value={formState.bankPhoneNumber}
                  onChange={(phone) => updateField('bankPhoneNumber', phone)}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    fontSize: '14px',
                    color: '#374151',
                    border: validationErrors.paymentBankPhoneNumber ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '2px',
                    fontWeight: '600'
                  }}
                  buttonStyle={{
                    border: validationErrors.paymentBankPhoneNumber ? '1px solid #ef4444' : '1px solid #d1d5db',
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
              </div>
            </div>

            {/* Card Preview */}
            <div className="flex flex-col items-center justify-center">
              {formState.splitPayment && (
                <h4 className="text-sm text-gray-600 mb-2 font-medium">Card Preview</h4>
              )}
              <div className="w-full max-w-xs h-48 rounded-xl bg-gradient-to-br from-gray-400 to-gray-700 flex flex-col justify-between p-6 shadow-inner">
                <div className="text-lg text-gray-200 tracking-widest mb-1 mt-6">
                  {getCardNumberForPreview(formState.cardNumber)}
                </div>
                <div className="flex justify-between text-gray-300 text-xs mb-2">
                  <div>
                    <div className="uppercase text-xs text-white font-semibold">Expiration date</div>
                    <div className="text-base text-gray-200">
                      {formState.expirationMonth && formState.expirationYear 
                        ? `${String(formState.expirationMonth).padStart(2, '0')} / ${String(formState.expirationYear).slice(-2)}`
                        : 'MM / YY'
                      }
                    </div>
                  </div>
                </div>
                <div>
                  <div className="uppercase text-xs text-white font-semibold">Credit/Debit Card Holder's Name</div>
                  <div className="text-md text-gray-200 tracking-widest">
                    {formState.cardHolderName.toUpperCase() || "CARD HOLDER'S NAME"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Card Form and Preview - Only show when split payment is enabled */}
          {formState.splitPayment && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Second Credit Card Form */}
              <div className="space-y-3">
                <h3 className="text-lg text-gray-700 font-semibold mb-3 mt-2">
                  Second Credit Card
                </h3>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Credit/Debit Card Number</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={formState.cardNumber2}
                    onChange={(e) => updateField('cardNumber2', e.target.value)}
                    className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCardNumber2')}`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Expiration date</label>
                    <select 
                      value={formState.expirationMonth2}
                      onChange={(e) => updateField('expirationMonth2', e.target.value)}
                      className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentExpirationMonth2')}`}
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Year</label>
                    <select 
                      value={formState.expirationYear2}
                      onChange={(e) => updateField('expirationYear2', e.target.value)}
                      className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentExpirationYear2')}`}
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={2024 + i}>{2024 + i}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1 flex items-center">
                      Security Code CVV
                      <span className="ml-1" title="3 or 4 digit code on your card">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#888">?</text></svg>
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="***"
                      maxLength={4}
                      value={formState.cvv2}
                      onChange={(e) => updateField('cvv2', e.target.value)}
                      className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCvv2')}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Please enter the exact name as on credit/debit card</label>
                  <input
                    type="text"
                    placeholder="Card Holder's Name"
                    value={formState.cardHolderName2}
                    onChange={(e) => updateField('cardHolderName2', e.target.value)}
                    className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCardHolderName2')}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1 flex items-center">
                    Bank's Phone Number
                    <span className="ml-1" title="Phone number on the back of your card">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#888">?</text></svg>
                    </span>
                  </label>
                  <PhoneInput
                    country={'us'}
                    value={formState.bankPhoneNumber2}
                    onChange={(phone) => updateField('bankPhoneNumber2', phone)}
                    inputStyle={{
                      width: '100%',
                      height: '40px',
                      fontSize: '14px',
                      color: '#374151',
                      border: validationErrors.paymentBankPhoneNumber2 ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '2px',
                      fontWeight: '600'
                    }}
                    buttonStyle={{
                      border: validationErrors.paymentBankPhoneNumber2 ? '1px solid #ef4444' : '1px solid #d1d5db',
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
                </div>
              </div>

              {/* Second Card Preview */}
              <div className="flex flex-col items-center justify-center">
                <h4 className="text-sm text-gray-600 mb-2 font-medium">Second Card Preview</h4>
                <div className="w-full max-w-xs h-48 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 flex flex-col justify-between p-6 shadow-inner">
                  <div className="text-lg text-gray-200 tracking-widest mb-1 mt-6">
                    {getCardNumberForPreview(formState.cardNumber2)}
                  </div>
                  <div className="flex justify-between text-gray-300 text-xs mb-2">
                    <div>
                      <div className="uppercase text-xs text-white font-semibold">Expiration date</div>
                      <div className="text-base text-gray-200">
                        {formState.expirationMonth2 && formState.expirationYear2 
                          ? `${String(formState.expirationMonth2).padStart(2, '0')} / ${String(formState.expirationYear2).slice(-2)}`
                          : 'MM / YY'
                        }
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="uppercase text-xs text-white font-semibold">Credit/Debit Card Holder's Name</div>
                    <div className="text-md text-gray-200 tracking-widest">
                      {formState.cardHolderName2.toUpperCase() || "CARD HOLDER'S NAME"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* First Card Billing Details */}
          <div className="space-y-4">
            <h3 className="text-lg text-gray-700 font-medium mt-6 mb-2">
              {formState.splitPayment ? 'First Card Billing Details' : 'Billing Details'}
            </h3>
            <div className="bg-orange-50 border border-orange-100 rounded px-3 py-2 flex items-start gap-3 mb-4">
              <div className="w-5 h-5 bg-orange-500/65 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">!</div>
              <p className="text-sm font-medium text-orange-800/65">Your billing address must match exactly the address on your credit card statement</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Country</label>
                <select 
                  value={formState.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCountry')}`}
                >
                   {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Card Holder's Email</label>
                <input
                  type="email"
                  placeholder="Enter card Holder's Email"
                  value={formState.cardHolderEmail}
                  onChange={(e) => updateField('cardHolderEmail', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCardHolderEmail')}`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">ZIP / Postal Code</label>
                <input
                  type="text"
                  placeholder="Enter ZIP / Postal Code"
                  value={formState.zipCode}
                  onChange={(e) => updateField('zipCode', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentZipCode')}`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Billing Phone Number</label>
                <PhoneInput
                  country={'us'}
                  value={formState.billingPhoneNumber}
                  onChange={(phone) => updateField('billingPhoneNumber', phone)}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    fontSize: '14px',
                    color: '#374151',
                    border: validationErrors.paymentBillingPhoneNumber ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '2px',
                    fontWeight: '600'
                  }}
                  buttonStyle={{
                    border: validationErrors.paymentBillingPhoneNumber ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '2px 0 0 2px',
                    backgroundColor: '#f9fafb'
                  }}
                  dropdownStyle={{
                    width: '300px'
                  }}
                  containerStyle={{
                    width: '100%'
                  }}
                  placeholder="Enter billing Phone Number"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">State</label>
                 <input
                  type="text"
                  placeholder="Enter State"
                  value={formState.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none ${getFieldErrorClass('paymentState')}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">City</label>
              <input
                type="text"
                placeholder="Enter City"
                value={formState.city}
                onChange={(e) => updateField('city', e.target.value)}
                className={`w-1/2 px-2 ml-[-2px] py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCity')}`}
              />
            </div> 
            <div className="mt-4">
              <label className="block text-xs text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                placeholder="Enter Street Address"
                value={formState.streetAddress}
                onChange={(e) => updateField('streetAddress', e.target.value)}
                className={`w-1/2 ml-[-2px] px-4 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentStreetAddress')}`}
              />
            </div>
          </div>

          {/* Second Card Billing Details - Only show when split payment is enabled */}
          {formState.splitPayment && (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg text-gray-700 font-medium mt-6 mb-2">Second Card Billing Details</h3>
              <div className="bg-orange-50 border border-orange-100 rounded px-3 py-2 flex items-start gap-3 mb-4">
                <div className="w-5 h-5 bg-orange-500/65 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">!</div>
                <p className="text-sm font-medium text-orange-800/65">Your billing address must match exactly the address on your second credit card statement</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Country</label>
                  <select 
                    value={formState.country2}
                    onChange={(e) => updateField('country2', e.target.value)}
                    className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCountry2')}`}
                  >
                    {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Card Holder's Email</label>
                  <input
                    type="email"
                    placeholder="Enter card Holder's Email"
                    value={formState.cardHolderEmail2}
                    onChange={(e) => updateField('cardHolderEmail2', e.target.value)}
                    className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCardHolderEmail2')}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">ZIP / Postal Code</label>
                  <input
                    type="text"
                    placeholder="Enter ZIP / Postal Code"
                    value={formState.zipCode2}
                    onChange={(e) => updateField('zipCode2', e.target.value)}
                    className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentZipCode2')}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">Billing Phone Number</label>
                  <PhoneInput
                    country={'us'}
                    value={formState.billingPhoneNumber2}
                    onChange={(phone) => updateField('billingPhoneNumber2', phone)}
                    inputStyle={{
                      width: '100%',
                      height: '40px',
                      fontSize: '14px',
                      color: '#374151',
                      border: validationErrors.paymentBillingPhoneNumber2 ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '2px',
                      fontWeight: '600'
                    }}
                    buttonStyle={{
                      border: validationErrors.paymentBillingPhoneNumber2 ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '2px 0 0 2px',
                      backgroundColor: '#f9fafb'
                    }}
                    dropdownStyle={{
                      width: '300px'
                    }}
                    containerStyle={{
                      width: '100%'
                    }}
                    placeholder="Enter billing Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-700 mb-1">State</label>
                  <input
                  type="text"
                  placeholder="Enter State"
                  value={formState.state2}
                  onChange={(e) => updateField('state2', e.target.value)}
                  className={`w-full px-3 py-2 border text-gray-700 rounded-sm focus:outline-none ${getFieldErrorClass('paymentState2')}`}
                />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Enter City"
                  value={formState.city2}
                  onChange={(e) => updateField('city2', e.target.value)}
                  className={`w-1/2 px-2 ml-[-2px] py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentCity2')}`}
                />
              </div> 
              <div className="mt-4">
                <label className="block text-xs text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="Enter Street Address"
                  value={formState.streetAddress2}
                  onChange={(e) => updateField('streetAddress2', e.target.value)}
                  className={`w-1/2 ml-[-2px] px-4 py-2 border text-gray-700 rounded-sm focus:outline-none focus:ring-[0.5px] focus:ring-gray-300 ${getFieldErrorClass('paymentStreetAddress2')}`}
                />
              </div>
            </div>
          )}

          {/* Security Badges */}
          <div className="flex items-center justify-end mt-6 gap-6">
            <div className="flex items-center gap-2 text-green-600">
              <img src={safe} alt="Safe Purchase" className="h-10" />
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <img src={optimal} alt="SSL Secure" className="h-10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;