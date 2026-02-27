const StickyCTA = ({ lawyerId }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-3 justify-end">
        <button
          className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
          onClick={() => {
            // future: open chat / discussion
            alert("Chat feature coming soon");
          }}
        >
          💬 Chat
        </button>

        <button
          className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          onClick={() => {
            // future: open booking modal / page
            alert("Booking feature coming next");
          }}
        >
          📅 Book Consultation
        </button>
      </div>
    </div>
  );
};

export default StickyCTA;
