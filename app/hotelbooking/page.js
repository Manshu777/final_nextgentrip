
'use client';

import { useState } from 'react';

export default function BookingDetails() {
  const [formData, setFormData] = useState({
    BookingId: '',
    EndUserIp: '',
    TokenId: '',
  });
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const res = await fetch('/api/hotel/bookdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa('Apkatrip:Apkatrip@1234'),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResponseData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Hotel Booking Details
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Enter the details below to fetch your booking information.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label
                htmlFor="BookingId"
                className="block text-sm font-medium text-gray-700"
              >
                Booking ID
              </label>
              <input
                type="text"
                name="BookingId"
                id="BookingId"
                value={formData.BookingId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter Booking ID"
              />
            </div>
            <div>
              <label
                htmlFor="EndUserIp"
                className="block text-sm font-medium text-gray-700"
              >
                End User IP
              </label>
              <input
                type="text"
                name="EndUserIp"
                id="EndUserIp"
                value={formData.EndUserIp}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter IP Address"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="TokenId"
                className="block text-sm font-medium text-gray-700"
              >
                Token ID
              </label>
              <input
                type="text"
                name="TokenId"
                id="TokenId"
                value={formData.TokenId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter Token ID"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Fetching...' : 'Fetch Booking Details'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Booking Details */}
        {responseData && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">
              Booking Details
            </h3>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Booking ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {responseData.BookingId || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {responseData.ResponseStatus === 1 ? 'Confirmed' : 'Failed'}
                  </dd>
                </div>
                {/* Add more fields as per API response */}
                {responseData.HotelDetails && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Hotel Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {responseData.HotelDetails.HotelName || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Check-in Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {responseData.HotelDetails.CheckInDate || 'N/A'}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}