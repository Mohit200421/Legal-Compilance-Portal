// src/components/lawyer/AboutSection.jsx
import { User, Calendar, Award, BookOpen, ChevronDown, ChevronUp, GraduationCap, Languages, Heart, Scale } from "lucide-react";
import { useState } from "react";

const AboutSection = ({ bio, lawyer }) => {
  const [expanded, setExpanded] = useState(false);
  const isLongBio = bio?.length > 200;

  if (!bio || bio.trim() === "") {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-purple-100 rounded-xl">
            <User className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">About Me</h2>
        </div>
        
        <div className="text-center py-8 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 italic mb-2">
            No bio added yet
          </p>
          <p className="text-xs text-gray-400">
            The lawyer hasn't provided a professional bio
          </p>
        </div>

        {/* Additional Info Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-6 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <GraduationCap className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Education</p>
              <p className="text-sm text-gray-400">Not specified</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Award className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Bar Admission</p>
              <p className="text-sm text-gray-400">Not specified</p>
            </div>
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
            <User className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">About Me</h2>
        </div>
        
        {/* Optional Badge */}
        {lawyer?.verified && (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <Award className="h-3 w-3 mr-1" />
            Verified
          </span>
        )}
      </div>

      {/* Bio Content */}
      <div className="prose prose-sm md:prose-base max-w-none">
        <div className={`text-gray-700 leading-relaxed whitespace-pre-line ${!expanded && isLongBio ? 'line-clamp-3 md:line-clamp-4' : ''}`}>
          {bio}
        </div>
        
        {isLongBio && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-purple-600 text-sm font-medium mt-3 hover:text-purple-700 transition-colors group"
          >
            {expanded ? (
              <>
                Show less 
                <ChevronUp className="h-4 w-4 ml-1 group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                Read more 
                <ChevronDown className="h-4 w-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Additional Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        
        {/* Education */}
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group">
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Education</p>
            <p className="text-sm font-medium text-gray-900">
              {lawyer?.education || "LL.B., University of Law"}
            </p>
          </div>
        </div>

        {/* Bar Admission */}
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group">
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
            <Award className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Bar Admission</p>
            <p className="text-sm font-medium text-gray-900">
              {lawyer?.barAdmission || "2010"}
            </p>
          </div>
        </div>

        {/* Languages */}
        {lawyer?.languages && lawyer.languages.length > 0 && (
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group">
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <Languages className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Languages</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {lawyer.languages.map((lang, index) => (
                  <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Specialization Tags */}
        {lawyer?.specializations && lawyer.specializations.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-3 flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Scale className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {lawyer.specializations.map((spec, index) => (
                  <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium border border-purple-200">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Philosophy or Approach (if available) */}
      {lawyer?.philosophy && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-900">My Approach</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {lawyer.philosophy}
          </p>
        </div>
      )}

      {/* Stats Row - Mobile Optimized */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 md:hidden">
        <div className="text-center">
          <p className="text-xs text-gray-500">Experience</p>
          <p className="text-base font-bold text-gray-900">{lawyer?.experience || 15}+ yrs</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Cases</p>
          <p className="text-base font-bold text-gray-900">{lawyer?.casesHandled || 500}+</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Success</p>
          <p className="text-base font-bold text-green-600">{lawyer?.successRate || 95}%</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;