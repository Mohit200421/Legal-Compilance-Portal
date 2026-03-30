// src/components/lawyer/StickyCTA.jsx
import { MessageCircle, Calendar, Phone, Video, X, ChevronUp, Clock, IndianRupee, CheckCircle, Star, Users, Award, Shield, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StickyCTA = ({ lawyerId, lawyer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  // Handle scroll effect
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleChat = () => {
    // Navigate to chat or open chat modal
    if (lawyerId) {
      navigate(`/chat/${lawyerId}`);
    } else {
      alert("Chat feature coming soon");
    }
  };

  const handleBooking = (type) => {
    setSelectedOption(type);
    // Here you would typically open a booking modal or navigate to booking page
    if (lawyerId) {
      // navigate(`/book/${lawyerId}?type=${type}`);
      alert(`Booking ${type} consultation with lawyer`);
    }
  };

  const bookingOptions = [
    { id: 'video', label: 'Video Call', icon: Video, duration: '30 min', price: '₹500' },
    { id: 'phone', label: 'Phone Call', icon: Phone, duration: '20 min', price: '₹300' },
    { id: 'inperson', label: 'In-Person', icon: Calendar, duration: '1 hour', price: '₹1000' },
  ];

  const quickActions = [
    { id: 'chat', label: 'Chat Now', icon: MessageCircle, action: handleChat, color: 'blue' },
    { id: 'call', label: 'Quick Call', icon: Phone, action: () => handleBooking('phone'), color: 'green' },
    { id: 'video', label: 'Video Consult', icon: Video, action: () => handleBooking('video'), color: 'purple' },
  ];

  return (
    <>
      {/* Main Sticky Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          {/* Mobile: Expandable Section */}
          <div className="md:hidden">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between mb-2 text-sm text-gray-600"
            >
              <span className="font-medium">Quick Actions</span>
              <ChevronUp className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
              <div className="mb-3 space-y-2">
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <Icon className={`h-5 w-5 text-${action.color}-600 mb-1`} />
                        <span className="text-xs text-gray-700">{action.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Booking Options */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Book Consultation</p>
                  {bookingOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleBooking(option.id)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors mb-2 last:mb-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white rounded-lg">
                            <Icon className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">{option.label}</p>
                            <p className="text-xs text-gray-500">{option.duration}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-purple-600">{option.price}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Direct Actions */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left side - Lawyer Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Adv. {lawyer?.name || "Lawyer"}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                      {lawyer?.rating || "4.9"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {lawyer?.clientCount || "500"}+ clients
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability Badge */}
              <div className="flex items-center space-x-1 bg-green-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-700 font-medium">Available now</span>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              {/* Quick Actions */}
              <div className="flex items-center space-x-2 mr-4">
                <button
                  onClick={handleChat}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Chat</span>
                </button>
                <button
                  onClick={() => handleBooking('phone')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">Call</span>
                </button>
              </div>

              {/* Main Booking Button with Options */}
              <div className="relative">
                <button
                  onClick={() => setShowBookingOptions(!showBookingOptions)}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Book Consultation</span>
                  <ChevronUp className={`h-4 w-4 ml-2 transition-transform ${showBookingOptions ? 'rotate-180' : ''}`} />
                </button>

                {/* Booking Options Dropdown */}
                {showBookingOptions && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    {bookingOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => {
                            handleBooking(option.id);
                            setShowBookingOptions(false);
                          }}
                          className="w-full flex items-center justify-between p-4 hover:bg-purple-50 transition-colors border-b last:border-b-0 border-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Icon className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">{option.label}</p>
                              <p className="text-xs text-gray-500">{option.duration}</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-purple-600">{option.price}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: Compact View */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">
                  Adv. {lawyer?.name || "Lawyer"}
                </p>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-[10px] text-gray-600">{lawyer?.rating || "4.9"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleChat}
                className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleBooking('video')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-xs font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Option Modal (for mobile) */}
      {selectedOption && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:w-96 rounded-t-2xl md:rounded-2xl p-6 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Confirm Booking
              </h3>
              <button
                onClick={() => setSelectedOption(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              You're about to book a {selectedOption} consultation.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium text-gray-900">
                  {bookingOptions.find(o => o.id === selectedOption)?.duration}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-sm font-bold text-purple-600">
                  {bookingOptions.find(o => o.id === selectedOption)?.price}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedOption(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Booking confirmed for ${selectedOption} consultation`);
                  setSelectedOption(null);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StickyCTA;