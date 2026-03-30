// src/pages/lawyer/LawyerProfile.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { getLawyerProfile } from "../../api/lawyerApi";

import ProfileHeader from "../../components/lawyer/ProfileHeader";
import AboutSection from "../../components/lawyer/AboutSection";
import PracticeAreas from "../../components/lawyer/PracticeAreas";
import Services from "../../components/lawyer/Services";
import Location from "../../components/lawyer/Location";
import Reviews from "../../components/lawyer/Reviews";
import StickyCTA from "../../components/lawyer/StickyCTA";

// Icons for loading states
import { Scale, AlertCircle, ArrowLeft, ChevronRight } from "lucide-react";

const LawyerProfile = () => {
  const { id } = useParams(); // public profile → has id
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  const isOwnProfile = !id; // If no id param, it's the logged-in lawyer's profile

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError(null);
        let res;

        if (id) {
          // 🌍 PUBLIC PROFILE (USER)
          res = await getLawyerProfile(id);
        } else {
          // 👨‍⚖️ LOGGED-IN LAWYER PROFILE
          res = await API.get("/lawyer/profile");
        }

        setLawyer(res.data?.data || null);
      } catch (err) {
        console.error("Failed to load lawyer profile", err);
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
        setLawyer(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Tabs for mobile view
  const tabs = [
    { id: "about", label: "About", icon: "📋" },
    { id: "practice", label: "Practice Areas", icon: "⚖️" },
    { id: "services", label: "Services", icon: "🛠️" },
    { id: "location", label: "Location", icon: "📍" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="relative">
            {/* Animated scale icon */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg transform animate-bounce">
                <Scale className="h-14 w-14 text-white" />
              </div>
            </div>

            {/* Loading text */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Loading Profile
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Please wait while we fetch the lawyer details...
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>

            {/* Loading steps */}
            <div className="space-y-2 text-left">
              {["Fetching profile", "Loading details", "Preparing view"].map(
                (step, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-xs"
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${
                        index === 0
                          ? "bg-blue-600 animate-pulse"
                          : index === 1
                          ? "bg-blue-400"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={
                        index === 0
                          ? "text-gray-700 font-medium"
                          : "text-gray-400"
                      }
                    >
                      {step}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={handleGoBack}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Scale className="h-10 w-10 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Lawyer Not Found
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            The lawyer profile you're looking for doesn't exist or may have been
            removed.
          </p>
          <button
            onClick={handleGoBack}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Header with Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 md:hidden">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {lawyer.name}
            </h1>
            <p className="text-xs text-gray-500 truncate">
              {lawyer.title || "Legal Professional"}
            </p>
          </div>
          {!id && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Your Profile
            </span>
          )}
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden sticky top-[57px] z-30 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex px-2 space-x-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 px-4 py-3 text-xs font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden md:block max-w-6xl mx-auto px-4 pt-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-6 pb-28 md:pb-32">
        {/* Profile Header - Always visible */}
        <div
          className={
            activeTab === "about" || window.innerWidth >= 768
              ? "block"
              : "hidden md:block"
          }
        >
          <ProfileHeader lawyer={lawyer} isOwnProfile={isOwnProfile} />
        </div>

        {/* Mobile: Show only active tab content */}
        <div className="md:hidden">
          {activeTab === "about" && <AboutSection bio={lawyer.bio} />}
          {activeTab === "practice" && (
            <PracticeAreas areas={lawyer.practiceAreas || []} />
          )}
          {activeTab === "services" && (
            <Services services={lawyer.services || []} />
          )}
          {activeTab === "location" && <Location location={lawyer.location} />}
          {activeTab === "reviews" && <Reviews rating={lawyer.rating} />}
        </div>

        {/* Desktop: Show all sections */}
        <div className="hidden md:block space-y-6">
          <AboutSection bio={lawyer.bio} />
          <PracticeAreas areas={lawyer.practiceAreas || []} />
          <Services services={lawyer.services || []} />
          <Location location={lawyer.location} />
          <Reviews rating={lawyer.rating} />
        </div>
      </div>

      {/* CTA only for public users */}
      {id && <StickyCTA lawyerId={lawyer.lawyerId} lawyer={lawyer} />}
    </>
  );
};

export default LawyerProfile;
