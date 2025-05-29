import React from 'react';

const SetupPage2 = ({
  openingTime,
  setOpeningTime,
  closingTime,
  setClosingTime,
  handleNextStep,
  handlePreviousStep,
  activeStep
}) => (
  <form
    className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 flex flex-col gap-8"
    onSubmit={handleNextStep}
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Store Timings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-700 font-medium mb-1">Opening Time</label>
        <input
          type="time"
          value={openingTime}
          onChange={e => setOpeningTime(e.target.value)}
          required
          className="input input-bordered w-full bg-blue-50 focus:bg-blue-100 border-blue-300 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Closing Time</label>
        <input
          type="time"
          value={closingTime}
          onChange={e => setClosingTime(e.target.value)}
          required
          className="input input-bordered w-full bg-pink-50 focus:bg-pink-100 border-pink-300 focus:border-pink-500"
        />
      </div>
    </div>
    <div className="flex gap-4 justify-end mt-4">
      <button
        type="button"
        className="btn btn-outline"
        onClick={handlePreviousStep}
      >
        Previous
      </button>
      <button
        type="submit"
        className="btn btn-primary px-8"
      >
        Next
      </button>
    </div>
  </form>
);

export default SetupPage2;