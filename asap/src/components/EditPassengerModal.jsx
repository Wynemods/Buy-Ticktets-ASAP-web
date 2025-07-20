import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditPassenger = ({ 
  isOpen, 
  onClose, 
  passenger, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    gender: '',
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: ''
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when modal opens or passenger changes
  useEffect(() => {
    if (passenger) {
      setFormData({
        gender: passenger.gender || '',
        firstName: passenger.firstName || '',
        lastName: passenger.lastName || '',
        middleName: passenger.middleName || '',
        dateOfBirth: passenger.dateOfBirth || ''
      });
    }
  }, [passenger]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.gender) {
      newErrors.gender = true;
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = true;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = true;
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      gender: passenger?.gender || '',
      firstName: passenger?.firstName || '',
      lastName: passenger?.lastName || '',
      middleName: passenger?.middleName || '',
      dateOfBirth: passenger?.dateOfBirth || ''
    });
    setErrors({});
    onClose();
  };

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

  // Custom Date Input Component
  const DateInput = ({ value, onChange, placeholder, hasError, ...props }) => {
    const [displayValue, setDisplayValue] = useState(formatDateForDisplay(value) || '');

    useEffect(() => {
      setDisplayValue(formatDateForDisplay(value) || '');
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
        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
    );
  };

  // Prevent background scroll when modal is open
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className={`
        relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Passenger</h2>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Warning Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4 flex items-start gap-3">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 flex-shrink-0">!</div>
            <p className="text-sm text-orange-800">
              Traveler names must match the government-issued identification document intended to use during travel
            </p>
          </div>
          
          {/* Form */}
          <div className="space-y-4">
            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
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
                      ? 'border-blue-500 bg-blue-500' 
                      : errors.gender 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                  }`}>
                    {formData.gender === 'Male' && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
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
                      ? 'border-blue-500 bg-blue-500' 
                      : errors.gender 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                  }`}>
                    {formData.gender === 'Female' && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">Please select gender</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="ONOME"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">Last name is required</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="MAUREEN"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">First name is required</p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input 
                type="text" 
                placeholder="OSUETHA"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <DateInput
                value={formData.dateOfBirth}
                onChange={(value) => handleInputChange('dateOfBirth', value)}
                placeholder="DD/MM/YYYY"
                hasError={errors.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">Please select date of birth</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Confirm changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPassenger;