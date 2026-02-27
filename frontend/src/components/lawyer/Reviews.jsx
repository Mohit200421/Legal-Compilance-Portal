const Reviews = ({ rating }) => {
  const average = rating?.average || 0;
  const count = rating?.count || 0;

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-3">Reviews</h2>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl font-bold text-indigo-600">
          {average.toFixed(1)}
        </span>
        <div>
          <p className="text-yellow-500 text-lg">
            {"★".repeat(Math.round(average))}
            {"☆".repeat(5 - Math.round(average))}
          </p>
          <p className="text-sm text-gray-500">
            {count} review{count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {count === 0 ? (
        <p className="text-gray-500 italic">
          No reviews yet. Be the first to review this lawyer.
        </p>
      ) : (
        <p className="text-gray-500">
          Detailed reviews will appear here.
        </p>
      )}
    </div>
  );
};

export default Reviews;
