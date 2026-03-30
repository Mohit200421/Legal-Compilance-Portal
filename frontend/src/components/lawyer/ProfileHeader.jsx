// src/components/lawyer/ProfileHeader.jsx
import {
  MapPin,
  Star,
  Award,
  Briefcase,
  Calendar,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Shield,
  Users,
  Scale,
} from "lucide-react";
import { useState } from "react";

const ProfileHeader = ({ lawyer, isOwnProfile }) => {
  const [imageError, setImageError] = useState(false);

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(lawyer?.name || "Lawyer") +
    "&background=6366f1&color=fff&size=200";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
        {/* Profile Image */}
        <div className="flex justify-center md:justify-start">
          <div className="relative group">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden ring-4 ring-purple-100 shadow-xl transform group-hover:scale-105 transition-transform duration-300">
              <img
                src={
                  imageError
                    ? defaultAvatar
                    : lawyer.profileImage && lawyer.profileImage !== ""
                    ? lawyer.profileImage
                    : defaultAvatar
                }
                alt={lawyer.name || "Lawyer"}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            {lawyer.verified && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-white shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          {/* Name and Title */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Adv. {lawyer.name}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {lawyer.title || "Legal Professional"}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mb-4">
            {lawyer.experience && (
              <div className="flex items-center space-x-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span className="text-xs md:text-sm font-medium text-blue-700">
                  {lawyer.experience}+ years
                </span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 bg-yellow-50 px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 text-yellow-600 fill-current" />
              <span className="text-xs md:text-sm font-medium text-yellow-700">
                {lawyer.rating?.average?.toFixed(1) || "4.9"} (
                {lawyer.rating?.count || 128})
              </span>
            </div>

            {lawyer.casesHandled && (
              <div className="flex items-center space-x-1.5 bg-green-50 px-3 py-1.5 rounded-full">
                <Scale className="h-4 w-4 text-green-600" />
                <span className="text-xs md:text-sm font-medium text-green-700">
                  {lawyer.casesHandled}+ cases
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          {lawyer.location && (
            <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-gray-600 mb-4">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>
                {lawyer.location.city || lawyer.location.city},{" "}
                {lawyer.location.state || lawyer.location.state}
              </span>
            </div>
          )}

          {/* Contact Info - Mobile */}
          <div className="md:hidden flex flex-wrap justify-center gap-2 mb-4">
            {lawyer.phone && (
              <a
                href={`tel:${lawyer.phone}`}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Phone className="h-4 w-4 text-gray-600" />
              </a>
            )}
            {lawyer.email && (
              <a
                href={`mailto:${lawyer.email}`}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Mail className="h-4 w-4 text-gray-600" />
              </a>
            )}
            {lawyer.website && (
              <a
                href={lawyer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Globe className="h-4 w-4 text-gray-600" />
              </a>
            )}
          </div>

          {/* CTA Button - Only show for public profiles, not for own profile */}
          {!isOwnProfile && (
            <button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group">
              <span>Book Consultation</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Contact Info - Desktop */}
      <div className="hidden md:flex items-center justify-start space-x-4 mt-6 pt-6 border-t border-gray-200">
        {lawyer.phone && (
          <a
            href={`tel:${lawyer.phone}`}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>{lawyer.phone}</span>
          </a>
        )}
        {lawyer.email && (
          <a
            href={`mailto:${lawyer.email}`}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>{lawyer.email}</span>
          </a>
        )}
        {lawyer.website && (
          <a
            href={lawyer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Website</span>
          </a>
        )}
        {lawyer.barCouncilId && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Award className="h-4 w-4" />
            <span>Bar ID: {lawyer.barCouncilId}</span>
          </div>
        )}
      </div>

      {/* Stats Grid - Mobile */}
      <div className="md:hidden grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">Experience</p>
          <p className="text-sm font-bold text-gray-900">
            {lawyer.experience || 15}+ yrs
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Cases</p>
          <p className="text-sm font-bold text-gray-900">
            {lawyer.casesHandled || 500}+
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Success</p>
          <p className="text-sm font-bold text-green-600">
            {lawyer.successRate || 95}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
