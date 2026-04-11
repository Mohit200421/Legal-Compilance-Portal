// src/components/lawyer/ProfileHeader.jsx

import {
  MapPin,
  Star,
  Award,
  Briefcase,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Shield,
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

  // ✅ FINAL FIX (SUPPORT BOTH BACKEND FORMATS)
  const locationText =
    [
      lawyer?.location?.city || lawyer?.city?.name,
      lawyer?.location?.state || lawyer?.state?.name,
    ]
      .filter(Boolean)
      .join(", ") || "Location not available";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">

        {/* Profile Image */}
        <div className="flex justify-center md:justify-start">
          <div className="relative group">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden ring-4 ring-purple-100 shadow-xl">
              <img
                src={
                  imageError
                    ? defaultAvatar
                    : lawyer?.profileImage || defaultAvatar
                }
                alt={lawyer?.name || "Lawyer"}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>

            {lawyer?.verified && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-white">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">

          {/* Name */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Adv. {lawyer?.name || "Lawyer"}
            </h1>
            <p className="text-sm text-gray-600">
              {lawyer?.title || "Legal Professional"}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">

            {lawyer?.experience && (
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                <Briefcase className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-700">
                  {lawyer.experience}+ years
                </span>
              </div>
            )}

            <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 text-yellow-600 fill-current mr-1" />
              <span className="text-sm text-yellow-700">
                {lawyer?.rating?.average?.toFixed(1) || "4.5"} (
                {lawyer?.rating?.count || 128})
              </span>
            </div>

            {lawyer?.casesHandled && (
              <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full">
                <Scale className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-700">
                  {lawyer.casesHandled}+ cases
                </span>
              </div>
            )}
          </div>

          {/* ✅ FIXED LOCATION */}
          <div className="flex items-center justify-center md:justify-start text-sm text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span>{locationText}</span>
          </div>

          {/* CTA */}
          {!isOwnProfile && (
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto md:mx-0 hover:bg-purple-700 transition">
              Book Consultation
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-6 pt-6 border-t flex flex-wrap gap-4 text-sm text-gray-600">

        {lawyer?.phone && (
          <span className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            {lawyer.phone}
          </span>
        )}

        {lawyer?.email && (
          <span className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            {lawyer.email}
          </span>
        )}

        {lawyer?.website && (
          <a
            href={lawyer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-purple-600"
          >
            <Globe className="h-4 w-4" />
            Website
          </a>
        )}

        {lawyer?.barCouncilId && (
          <span className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            Bar ID: {lawyer.barCouncilId}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;