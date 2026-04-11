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

import { Scale, AlertCircle, ArrowLeft } from "lucide-react";

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState(null);
  const [categories, setCategories] = useState([]); // ✅ ADDED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  const isOwnProfile = !id;

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError(null);
        let res;

        if (id) {
          res = await getLawyerProfile(id);
        } else {
          res = await API.get("/lawyer/profile");
        }

        setLawyer(res.data?.data || null);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  /* ================= LOAD CATEGORIES (FIX) ================= */
  useEffect(() => {
    API.get("/public/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => console.log("Failed to load categories"));
  }, []);

  const handleGoBack = () => navigate(-1);

  const tabs = [
    { id: "about", label: "About", icon: "📋" },
    { id: "practice", label: "Practice Areas", icon: "⚖️" },
    { id: "services", label: "Services", icon: "🛠️" },
    { id: "location", label: "Location", icon: "📍" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
  ];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Scale className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-10 w-10 text-red-600 mb-2" />
        <p>{error}</p>
        <button onClick={handleGoBack}>Go Back</button>
      </div>
    );
  }

  if (!lawyer) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 bg-white border-b p-3 md:hidden flex items-center">
        <button onClick={handleGoBack}>
          <ArrowLeft />
        </button>
        <h1 className="ml-3 font-semibold">{lawyer.name}</h1>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex overflow-x-auto border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 ${
              activeTab === tab.id ? "text-blue-600 border-b-2" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <ProfileHeader lawyer={lawyer} isOwnProfile={isOwnProfile} />

        {/* Mobile */}
        <div className="md:hidden">
          {activeTab === "about" && <AboutSection bio={lawyer.bio} />}

          {activeTab === "practice" && (
            <PracticeAreas
              areas={lawyer.practiceAreas || []}
              categories={categories} // ✅ FIX
            />
          )}

          {activeTab === "services" && (
            <Services services={lawyer.services || []} />
          )}

          {activeTab === "location" && (
            <Location location={lawyer.location} />
          )}

          {activeTab === "reviews" && (
            <Reviews rating={lawyer.rating} />
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:block space-y-6">
          <AboutSection bio={lawyer.bio} />

          <PracticeAreas
            areas={lawyer.practiceAreas || []}
            categories={categories} // ✅ FIX
          />

          <Services services={lawyer.services || []} />

          <Location location={lawyer.location} />

          <Reviews rating={lawyer.rating} />
        </div>
      </div>

      {/* CTA */}
      {id && <StickyCTA lawyerId={lawyer.lawyerId} lawyer={lawyer} />}
    </>
  );
};

export default LawyerProfile;