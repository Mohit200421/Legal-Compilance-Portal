const PracticeAreas = ({ areas = [] }) => {
  if (!areas.length) {
    return (
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Practice Areas</h2>
        <p className="text-gray-500 italic">
          No practice areas listed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Practice Areas</h2>

      <div className="flex flex-wrap gap-2">
        {areas.map((area) => (
          <span
            key={area.id || area._id}
            className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-200"
          >
            {area.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PracticeAreas;
