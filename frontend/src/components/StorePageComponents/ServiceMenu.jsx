import React from 'react';

const ServiceMenu = ({ storeData }) => {
  const services = storeData?.services || [];

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-full p-8 mb-6 shadow-lg">
          <span className="material-icons text-7xl text-orange-400">content_cut</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Services Available</h3>
        <p className="text-gray-500 text-center max-w-md">
          This store hasn't added any services yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Our Services</h2>
          <p className="text-gray-600 font-medium">
            {services.length} {services.length === 1 ? 'Service' : 'Services'} available
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">
          <span className="material-icons">content_cut</span>
          {services.length}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((storeService, index) => {
          const service = storeService?.service;
          const serviceName = service?.name || 'Unknown Service';
          const serviceDesc = service?.description || 'No description available';
          const price = storeService?.price || 0;
          const duration = storeService?.duration || 'N/A';

          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300"
            >
              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              
              <div className="p-6">
                {/* Service Icon & Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl">
                      <span className="material-icons text-orange-600 text-2xl">content_cut</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                        {serviceName}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">{duration} mins</p>
                    </div>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl font-black text-lg shadow-lg">
                    ₹{price}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {serviceDesc}
                </p>

                {/* Book Button */}
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <span className="material-icons">event_available</span>
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default ServiceMenu;