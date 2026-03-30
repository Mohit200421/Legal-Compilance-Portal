// src/components/lawyer/Location.jsx
import { MapPin, Building, Navigation, Clock, Phone, Mail, Globe, ChevronRight, Landmark, Users } from "lucide-react";
import { useState } from "react";

const Location = ({ location, lawyer }) => {
  const [showMap, setShowMap] = useState(false);

  const city = typeof location?.city === "string" ? location.city.trim() : "";
  const state = typeof location?.state === "string" ? location.state.trim() : "";
  const address = typeof location?.address === "string" ? location.address.trim() : "";
  const pincode = typeof location?.pincode === "string" ? location.pincode.trim() : "";
  const landmark = typeof location?.landmark === "string" ? location.landmark.trim() : "";

  const hasLocation = city || state || address;
  const fullAddress = [address, landmark, city, state, pincode].filter(Boolean).join(", ");

  // Generate Google Maps URL
  const getMapsUrl = () => {
    const query = encodeURIComponent(fullAddress || `${city} ${state}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Office hours (if available)
  const officeHours = location?.officeHours || [
    { day: "Mon - Fri", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-orange-100 rounded-xl">
            <MapPin className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Office Location</h2>
        </div>
        
        {hasLocation && (
          <a
            href={getMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700 font-medium group"
          >
            <span>View on map</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        )}
      </div>

      {hasLocation ? (
        <div className="space-y-6">
          {/* Main Location Card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Building className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                  {city && state ? `${city}, ${state}` : city || state}
                </p>
                {address && (
                  <p className="text-sm text-gray-600 mb-1">
                    📍 {address}
                  </p>
                )}
                {landmark && (
                  <p className="text-sm text-gray-500">
                    Near: {landmark}
                  </p>
                )}
                {pincode && (
                  <p className="text-sm text-gray-500 mt-1">
                    📮 {pincode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions - Mobile */}
          <div className="md:hidden grid grid-cols-3 gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
            >
              <Navigation className="h-5 w-5 text-orange-600 mb-1" />
              <span className="text-xs text-gray-600">Directions</span>
            </a>
            {lawyer?.phone && (
              <a
                href={`tel:${lawyer.phone}`}
                className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
              >
                <Phone className="h-5 w-5 text-orange-600 mb-1" />
                <span className="text-xs text-gray-600">Call</span>
              </a>
            )}
            {lawyer?.email && (
              <a
                href={`mailto:${lawyer.email}`}
                className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
              >
                <Mail className="h-5 w-5 text-orange-600 mb-1" />
                <span className="text-xs text-gray-600">Email</span>
              </a>
            )}
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Clock className="h-4 w-4 text-orange-600 mr-2" />
              Office Hours
            </h3>
            <div className="space-y-2">
              {officeHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{schedule.day}</span>
                  <span className="font-medium text-gray-900">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
            {lawyer?.consultationFee && (
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Landmark className="h-3.5 w-3.5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Consultation</p>
                  <p className="text-sm font-semibold text-gray-900">${lawyer.consultationFee}</p>
                </div>
              </div>
            )}
            
            {lawyer?.availableForOnline && (
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Online</p>
                  <p className="text-sm font-semibold text-green-600">Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Map Preview (if showMap is true) */}
          {showMap && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 h-48 bg-gray-100 relative">
              <iframe
                title="Office Location"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(fullAddress)}`}
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-8 px-4">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-gray-500 italic mb-2">
            Location not specified
          </p>
          <p className="text-xs text-gray-400">
            The lawyer hasn't added their office location yet
          </p>
          
          {/* Contact options when location is missing */}
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
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Email</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Desktop Quick Actions */}
      {hasLocation && (
        <div className="hidden md:flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              <span>Get Directions</span>
            </a>
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>{showMap ? "Hide Map" : "Show Map"}</span>
            </button>
          </div>
          
          <div className="flex space-x-3">
            {lawyer?.phone && (
              <a href={`tel:${lawyer.phone}`} className="text-gray-600 hover:text-orange-600 transition-colors">
                <Phone className="h-4 w-4" />
              </a>
            )}
            {lawyer?.email && (
              <a href={`mailto:${lawyer.email}`} className="text-gray-600 hover:text-orange-600 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;