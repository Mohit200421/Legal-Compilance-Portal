// src/components/lawyer/ProfileHeader.jsx
const ProfileHeader = ({ lawyer }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex gap-6">
      {/* PROFILE IMAGE */}
      <img
        src={lawyer.profileImage && lawyer.profileImage !== ""
          ? lawyer.profileImage
          : "/avatar.png"}
        alt={lawyer.name || "Lawyer"}
        className="w-28 h-28 rounded-full object-cover border"
      />

      <div className="flex-1">
        {/* NAME */}
        <h1 className="text-2xl font-semibold text-gray-900">
          {lawyer.name}
        </h1>

        {/* EXPERIENCE */}
        {lawyer.experience ? (
          <p className="text-gray-600">
            {lawyer.experience}+ years experience
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            Experience not specified
          </p>
        )}

        {/* RATING (OPTIONAL / FUTURE SAFE) */}
        <p className="mt-2 text-sm text-gray-700">
          ⭐ {lawyer.rating?.average ?? 0} (
          {lawyer.rating?.count ?? 0} reviews)
        </p>

        {/* CTA */}
        <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded transition">
          Book Consultation
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
