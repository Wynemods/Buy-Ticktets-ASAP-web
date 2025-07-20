import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-3">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-blue-500 text-white px-2.5 py-1 rounded text-sm font-bold mr-3">
                ASAP
              </div>
              <div className="text-gray-600">
                <div className="text-black font-medium text-base leading-tight">tickets</div>
                <div className="text-xs text-gray-500 leading-tight">20+ years</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <a href="#" className="text-gray-600 text-sm font-normal">About Us</a>
              <a href="#" className="text-gray-600 text-sm font-normal">Reviews</a>
              <a href="#" className="text-gray-600 text-sm font-normal">Privacy Policy</a>
              <a href="#" className="text-gray-600 text-sm font-normal">Terms & Conditions</a>
            </div>
          </div>

          {/* Right side - Language, Agent Info */}
          <div className="flex items-center space-x-8">
            {/* Language Selector */}
            <div className="flex items-center text-gray-600 text-sm">
              <span>Language (English)</span>
              <svg className="w-3 h-3 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Agent Info */}
            <div className="text-right">
              <div className="text-xs text-gray-500 font-normal">Travel agent</div>
              <div className="text-xs text-blue-600 underline font-normal">vasan.oneill.w@asaptickets.com</div>
            </div>

            <div className="text-right">
              <div className="text-sm font-normal text-gray-800">Vasan Oneill</div>
              <div className="text-sm text-gray-800 font-normal">(888) 806 - 4059</div>
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-blue-500 text-white px-2.5 py-1 rounded text-sm font-bold mr-3">
              ASAP
            </div>
            <div className="text-gray-600">
              <div className="text-black font-medium text-base leading-tight">tickets</div>
              <div className="text-xs text-gray-500 leading-tight">20+ years</div>
            </div>
          </div>

          {/* Navigation Links - Condensed */}
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 text-sm font-normal">About</a>
            <a href="#" className="text-gray-600 text-sm font-normal">Reviews</a>
            <a href="#" className="text-gray-600 text-sm font-normal">Privacy</a>
            <a href="#" className="text-gray-600 text-sm font-normal">Terms</a>
          </div>

          {/* Agent Info - Condensed */}
          <div className="text-right">
            <div className="text-sm font-normal text-gray-800">Vasan Oneill</div>
            <div className="text-sm text-gray-800 font-normal">(888) 806-4059</div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-blue-500 text-white px-2.5 py-1 rounded text-sm font-bold mr-3">
                ASAP
              </div>
              <div className="text-gray-600">
                <div className="text-black font-medium text-base leading-tight">tickets</div>
                <div className="text-xs text-gray-500 leading-tight">20+ years</div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 pb-4 border-t border-gray-300 pt-4">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-gray-600 text-sm font-normal py-2">About Us</a>
                <a href="#" className="text-gray-600 text-sm font-normal py-2">Reviews</a>
                <a href="#" className="text-gray-600 text-sm font-normal py-2">Privacy Policy</a>
                <a href="#" className="text-gray-600 text-sm font-normal py-2">Terms & Conditions</a>
                
                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="text-xs text-gray-500 font-normal mb-1">Travel agent</div>
                  <div className="text-xs text-blue-600 underline font-normal mb-2">vasan.oneill.w@asaptickets.com</div>
                  <div className="text-sm font-normal text-gray-800">Vasan Oneill</div>
                  <div className="text-sm text-gray-800 font-normal">(888) 806 - 4059</div>
                  
                  <div className="flex items-center text-gray-600 mt-3 text-sm">
                    <span>Language (English)</span>
                    <svg className="w-3 h-3 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}