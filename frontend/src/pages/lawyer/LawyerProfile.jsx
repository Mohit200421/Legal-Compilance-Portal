// src/pages/lawyer/LawyerProfile.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { getLawyerProfile } from "../../api/lawyerApi";

import ProfileHeader from "../../components/lawyer/ProfileHeader";
import AboutSection from "../../components/lawyer/AboutSection";
import PracticeAreas from "../../components/lawyer/PracticeAreas";
import Services from "../../components/lawyer/Services";
import Location from "../../components/lawyer/Location";
import Reviews from "../../components/lawyer/Reviews";
import StickyCTA from "../../components/lawyer/StickyCTA";

const LawyerProfile = () => {
  const { id } = useParams(); // public profile → has id
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
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
        setLawyer(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!lawyer)
    return <div className="p-6 text-center text-red-500">Lawyer not found</div>;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-28">
        <ProfileHeader lawyer={lawyer} />

        <AboutSection bio={lawyer.bio} />

        <PracticeAreas areas={lawyer.practiceAreas || []} />

        <Services services={lawyer.services || []} />

        <Location location={lawyer.location} />

        <Reviews rating={lawyer.rating} />
      </div>

      {/* CTA only for public users */}
      {id && <StickyCTA lawyerId={lawyer.lawyerId} />}
    </>
  );
};

export default LawyerProfile;
