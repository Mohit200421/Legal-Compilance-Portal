const AboutSection = ({ bio }) => {
  if (!bio || bio.trim() === "") {
    return (
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-gray-500 italic">
          Lawyer has not added a bio yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-3">About</h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {bio}
      </p>
    </div>
  );
};

export default AboutSection;
