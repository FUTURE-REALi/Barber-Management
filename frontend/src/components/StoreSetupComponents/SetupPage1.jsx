import React from 'react';

const SetupPage1 = ({
  storename, setStoreName,
  ownername, setOwnerName,
  email, setEmail,
  phone, setPhone,
  building, setBuilding,
  city, setCity,
  state, setState,
  zip, setZip,
  handleNextStep,
  handlePreviousStep,
  activeStep
}) => (
  <form
    className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6"
    onSubmit={handleNextStep}
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Store Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-medium mb-1">Store Name</label>
        <input
          type="text"
          placeholder="Store Name"
          value={storename}
          onChange={e => setStoreName(e.target.value)}
          required
          className="input input-bordered w-full bg-blue-50 focus:bg-blue-100 border-blue-300 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Owner Name</label>
        <input
          type="text"
          placeholder="Owner Name"
          value={ownername}
          onChange={e => setOwnerName(e.target.value)}
          required
          className="input input-bordered w-full bg-green-50 focus:bg-green-100 border-green-300 focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="input input-bordered w-full bg-yellow-50 focus:bg-yellow-100 border-yellow-300 focus:border-yellow-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Phone</label>
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="input input-bordered w-full bg-purple-50 focus:bg-purple-100 border-purple-300 focus:border-purple-500"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-gray-700 font-medium mb-1">Building/Street</label>
        <input
          type="text"
          placeholder="Building/Street"
          value={building}
          onChange={e => setBuilding(e.target.value)}
          required
          className="input input-bordered w-full bg-pink-50 focus:bg-pink-100 border-pink-300 focus:border-pink-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">City</label>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
          className="input input-bordered w-full bg-orange-50 focus:bg-orange-100 border-orange-300 focus:border-orange-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">State</label>
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={e => setState(e.target.value)}
          required
          className="input input-bordered w-full bg-teal-50 focus:bg-teal-100 border-teal-300 focus:border-teal-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">ZIP</label>
        <input
          type="text"
          placeholder="ZIP"
          value={zip}
          onChange={e => setZip(e.target.value)}
          required
          className="input input-bordered w-full bg-red-50 focus:bg-red-100 border-red-300 focus:border-red-500"
        />
      </div>
    </div>
    <div className="flex gap-4 justify-end mt-4">
      {activeStep > 1 && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={handlePreviousStep}
        >
          Previous
        </button>
      )}
      <button
        type="submit"
        className="btn btn-primary px-8"
      >
        Next
      </button>
    </div>
  </form>
);

export default SetupPage1;