// src/components/lawyer/Services.jsx
import { Sparkles, Clock, IndianRupee, Calendar, Phone, Video, MessageCircle, CheckCircle, ChevronRight, Award, Star, Users, Shield, Zap, TrendingUp, Info } from "lucide-react";
import { useState } from "react";

const Services = ({ services = [], lawyer }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const displayedServices = showAllServices ? services : services.slice(0, 4);

  // Service type icons
  const getServiceIcon = (serviceName) => {
    const name = serviceName?.toLowerCase() || '';
    
    if (name.includes('consultation') || name.includes('advice')) return MessageCircle;
    if (name.includes('video') || name.includes('online')) return Video;
    if (name.includes('phone') || name.includes('call')) return Phone;
    if (name.includes('document') || name.includes('review')) return CheckCircle;
    if (name.includes('court') || name.includes('hearing')) return Shield;
    if (name.includes('emergency') || name.includes('urgent')) return Zap;
    if (name.includes('package') || name.includes('plan')) return TrendingUp;
    
    return Sparkles;
  };

  // Format currency
  const formatPrice = (price) => {
    if (!price) return "Contact for price";
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!services || services.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Consultation Services</h2>
        </div>
        
        <div className="text-center py-8 px-4">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-gray-500 italic mb-2">
            No services available yet
          </p>
          <p className="text-xs text-gray-400">
            This lawyer hasn't added any consultation services
          </p>
          
          {/* Contact options */}
          <div className="flex justify-center space-x-4 mt-6">
            {lawyer?.phone && (
              <a
                href={`tel:${lawyer.phone}`}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Call</span>
              </a>
            )}
            {lawyer?.email && (
              <a
                href={`mailto:${lawyer.email}`}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Email</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Consultation Services</h2>
        </div>
        
        <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          <Award className="h-3 w-3 mr-1" />
          {services.length} {services.length === 1 ? 'Service' : 'Services'}
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedServices.map((service, index) => {
          const Icon = getServiceIcon(service.name);
          const isSelected = selectedService === index;
          
          return (
            <div
              key={service.id || index}
              className={`group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                isSelected 
                  ? "border-purple-600 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-300"
              }`}
              onClick={() => setSelectedService(isSelected ? null : index)}
            >
              {/* Popular Badge */}
              {service.popular && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs px-2 py-0.5 rounded-full shadow-lg flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Popular
                </span>
              )}

              <div className="flex items-start space-x-3 mb-3">
                <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                  isSelected 
                    ? "bg-purple-600 text-white" 
                    : "bg-white text-purple-600 group-hover:scale-110"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                    {service.name}
                  </h3>
                  
                  {/* Duration */}
                  {service.duration && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {service.duration} minutes
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {service.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {service.description}
                </p>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="space-y-1 mb-3">
                  {service.features.slice(0, 2).map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                  {service.features.length > 2 && (
                    <p className="text-xs text-gray-400">
                      +{service.features.length - 2} more features
                    </p>
                  )}
                </div>
              )}

              {/* Price and Action */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Starting from</p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatPrice(service.price)}
                  </p>
                </div>
                
                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                  isSelected
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-200 text-gray-700 hover:bg-purple-600 hover:text-white"
                }`}>
                  <span>Book</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Availability Badge */}
              {service.available && (
                <div className="absolute top-2 left-2 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-green-600 font-medium">Available today</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      {services.length > 4 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAllServices(!showAllServices)}
            className="inline-flex items-center px-6 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-sm font-medium transition-all border border-purple-200 hover:border-purple-300"
          >
            {showAllServices ? (
              <>
                Show Less
                <ChevronRight className="h-4 w-4 ml-1 rotate-90" />
              </>
            ) : (
              <>
                View All {services.length} Services
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Consultation Options Banner */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Users className="h-4 w-4 text-purple-600 mr-2" />
          Consultation Options
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white rounded-lg">
              <Video className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">Video Call</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white rounded-lg">
              <Phone className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">Phone Call</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white rounded-lg">
              <MessageCircle className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">Chat</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white rounded-lg">
              <Calendar className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">In-Person</span>
          </div>
        </div>
      </div>

      {/* Service Details Modal (simplified version) */}
      {selectedService !== null && (
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {services[selectedService].name} - Details
            </h3>
            <button
              onClick={() => setSelectedService(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {services[selectedService].description || "Detailed information about this service will be available during booking."}
          </p>
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
            Proceed to Book
          </button>
        </div>
      )}

      {/* Stats Row - Mobile */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 md:hidden">
        <div className="text-center">
          <p className="text-xs text-gray-500">Services</p>
          <p className="text-base font-bold text-purple-600">{services.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Starting</p>
          <p className="text-base font-bold text-gray-900">
            {services[0]?.price ? formatPrice(services[0].price) : 'Contact'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Quickest</p>
          <p className="text-base font-bold text-green-600">
            {Math.min(...services.map(s => s.duration || 30))} min
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;