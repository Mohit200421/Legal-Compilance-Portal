// src/components/lawyer/Location.jsx
const Location = ({ location }) => {
  const city =
    typeof location?.city === "string" ? location.city.trim() : "";

  const state =
    typeof location?.state === "string" ? location.state.trim() : "";

  const hasLocation = city || state;

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-3">Location</h2>

      {hasLocation ? (
        <p className="text-gray-700 text-base">
          📍 {city}
          {city && state ? ", " : ""}
          {state}
        </p>
      ) : (
        <p className="text-gray-500 italic">
          Location not specified.
        </p>
      )}
    </div>
  );
};

export default Location;
