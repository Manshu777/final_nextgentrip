'use client';

'use client';
import { useState, useEffect } from 'react';
import { apilink } from '../../Component/common'; 

export default function HotelCancellation() {
  const [ipAddress, setIpAddress] = useState('Fetching...');
  const [ipError, setIpError] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [remarks, setRemarks] = useState('Cancellation requested by user');
  const [apiError, setApiError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

  // Fetch IP address
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch(() => {
        setIpError('Failed to fetch IP address');
        setIpAddress('203.134.211.76'); // Fallback IP
      });
  }, []);

  // Handle cancellation request
  const handleCancel = async (e) => {
    e.preventDefault();
    setCancelLoading(true);
    setCancelMessage(null);
    setApiError(null);

    try {
      const authString = btoa('Apkatrip:Apkatrip@1234');
      const cancelPayload = {
        BookingMode: 5, // Adjust based on requirements
        ChangeRequestId: 1, // Adjust as needed
        EndUserIp: ipAddress !== 'Fetching...' ? ipAddress : '203.134.211.76',
        BookingId: parseInt(bookingId),
        RequestType: '4',
        Remarks: remarks,
      };

      const response = await fetch(`${apilink}/v1/hotel-cancellation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authString}`,
        },
        body: JSON.stringify(cancelPayload),
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to process cancellation request');
      }

      setCancelMessage('Booking cancelled successfully!');
      setBookingId('');
      setRemarks('Cancellation requested by user');
    } catch (err) {
      setApiError(err.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  // Handle retry
  const handleRetry = () => {
    setBookingId('');
    setRemarks('Cancellation requested by user');
    setApiError(null);
    setCancelMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Cancel Hotel Booking
        </h1>

        {/* Form */}
        {!cancelMessage && (
          <form onSubmit={handleCancel} className="mb-8">
            <div className="mb-4">
              <label
                htmlFor="bookingId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Booking ID
              </label>
              <input
                type="number"
                id="bookingId"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="Enter your booking ID"
                required
                aria-describedby="bookingId-error"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="remarks"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Remarks
              </label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="Enter cancellation remarks"
                rows="3"
                required
                aria-describedby="remarks-error"
              />
            </div>
            <button
              type="submit"
              disabled={cancelLoading || ipAddress === 'Fetching...' || ipError}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
                cancelLoading || ipAddress === 'Fetching...' || ipError
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              aria-label="Cancel booking"
            >
              {cancelLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                  Cancelling...
                </span>
              ) : (
                'Cancel Booking'
              )}
            </button>
            {apiError && (
              <p
                id="bookingId-error"
                className="mt-2 text-sm text-red-600 text-center"
                role="alert"
              >
                {apiError}
              </p>
            )}
          </form>
        )}

        {/* IP Address */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600">
            Your IP Address:{' '}
            <span className="font-semibold">{ipError || ipAddress}</span>
          </p>
        </div>

        {/* Success Message for Cancellation */}
        {cancelMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              Cancellation Successful
            </h2>
            <p className="text-gray-600 mb-4">{cancelMessage}</p>
            <button
              onClick={handleRetry}
              className="inline-block py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              aria-label="Cancel another booking"
            >
              Cancel Another Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}