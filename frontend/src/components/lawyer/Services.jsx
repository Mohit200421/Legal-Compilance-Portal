const Services = ({ services = [] }) => {
  if (!services.length) {
    return (
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Consultation Services</h2>
        <p className="text-gray-500 italic">
          No consultation services available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Consultation Services</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-gray-500">
                {service.duration} minutes
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-indigo-600">
                ₹{service.price}
              </p>
              <button className="mt-2 text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
