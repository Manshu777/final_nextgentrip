"use client";

import { apilink } from '../../Component/common';
import { useState } from 'react';

export default function CancelBookingPage() {
  const [bookingId, setBookingId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBookingIdChange = (e) => {
    setBookingId(e.target.value);
    setError('');
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const handleFetchDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${apilink}/hotel/booking-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();

      if (data.status === 'error') {
        setError(data.message || 'Failed to fetch booking details');
        setIsLoading(false);
        return;
      }

      setBookingDetails(data.data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      setError('Failed to fetch booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    const payload = {
      bookingId: bookingDetails.bookingId,
      tokenId: bookingDetails.tokenId,
      changeRequestId: bookingDetails.changeRequestId || Math.floor(100000 + Math.random() * 900000), // Generate if not provided
      remarks,
      bookingMode: '5',
      requestType: '4',
      endUserIp: bookingDetails.endUserIp || '223.178.209.233', // Fallback default
    };

    try {
      const res = await fetch(`${apilink}/hotel/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(data);
      setIsDetailsModalOpen(false);
      setIsResponseModalOpen(true);
    } catch (error) {
      setResponse({ status: 'error', message: 'Failed to process request' });
      setIsResponseModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Cancel Your Hotel Booking
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your Booking ID to start the cancellation process.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleFetchDetails}>
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="bookingId" className="sr-only">
                  Booking ID
                </label>
                <input
                  id="bookingId"
                  name="bookingId"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Booking ID"
                  value={bookingId}
                  onChange={handleBookingIdChange}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Fetching Details...' : 'Fetch Booking Details'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal for Remarks and Confirmation */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900">Confirm Cancellation</h3>
            <p className="mt-2 text-sm text-gray-600">
              Booking ID: {bookingDetails?.bookingId}
            </p>
            <div className="mt-4">
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                Reason for Cancellation
              </label>
              <textarea
                id="remarks"
                name="remarks"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter reason for cancellation"
                value={remarks}
                onChange={handleRemarksChange}
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !remarks}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Response */}
      {isResponseModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900">
              {response?.status === 'success' ? 'Cancellation Successful' : 'Cancellation Failed'}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {response?.status === 'success'
                ? `Your booking has been cancelled. Change Request ID: ${response.data?.HotelChangeRequestStatusResult?.ChangeRequestId}`
                : response?.message || 'An error occurred.'}
            </p>
            {response?.status === 'success' && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Refunded Amount: ₹{response.data?.HotelChangeRequestStatusResult?.RefundedAmount}</p>
                <p>Credit Note: {response.data?.HotelChangeRequestStatusResult?.CreditNoteNo}</p>
              </div>
            )}
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsResponseModalOpen(false);
                  setBookingId('');
                  setRemarks('');
                  setBookingDetails(null);
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}