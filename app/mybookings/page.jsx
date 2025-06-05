'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { apilink } from '../Component/common';

export default function MyBookings() {
  const [formData, setFormData] = useState({
    BookingId: '',
    PNR: '',
    EndUserIp: '',
   
  });
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null); // Track which booking is being cancelled

  // Fetch user's IP address
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setFormData((prev) => ({ ...prev, EndUserIp: response.data.ip }));
      } catch (err) {
        setError('Failed to fetch IP address. Please try again.');
      }
    };
    fetchIp();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFetchBookings = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${apilink}/get-booking-details`, {
        EndUserIp: formData.EndUserIp,
        PNR: formData.PNR,
        BookingId: formData.BookingId,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status === 'success') {
        const bookingData = response.data.data.FlightItinerary;
        setBookings([{
          PNR: bookingData.PNR || 'N/A',
          BookingId: bookingData.BookingId || 'N/A',
          Origin: bookingData.Segments[0]?.Origin.Airport?.CityName || 'N/A',
          Destination: bookingData.Segments[0]?.Destination?.Airport?.CityName || 'N/A',
          AirlineName: bookingData.Segments[0]?.Airline?.AirlineName || 'N/A',
          FlightNumber: bookingData.Segments[0]?.Airline?.FlightNumber || 'N/A',
          DepTime: bookingData.Segments[0]?.Origin?.DepTime || 'N/A',
          ArrTime: bookingData.Segments[0]?.Destination?.ArrTime || 'N/A',
          InvoiceAmount: bookingData.InvoiceAmount || 0,
          Currency: bookingData.Fare?.Currency || 'INR',
        }]);
        console.log(bookingData.Segments[0])
        setMessage('Booking details fetched successfully.');
      } else {
        setError(response.data.message || 'Failed to fetch booking details.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    setMessage('');
    setError('');
    setCancelLoading(booking.BookingId);

    try {
      const response = await axios.post(`${apilink}/cancel-ticket`, {
        BookingId: String(booking.BookingId),
        PNR: booking.PNR,
        EndUserIp: formData.EndUserIp,
        Remarks: 'Cancellation requested from My Bookings page',
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status === 'success') {
        setMessage(`Cancellation request for Booking ID ${booking.BookingId} processed successfully.`);
        setBookings(bookings.filter((b) => b.BookingId !== booking.BookingId)); // Remove cancelled booking
      } else {
        setError(response.data.message || 'Cancellation failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while processing the cancellation.');
    } finally {
      setCancelLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">My Bookings</h1>

        {/* Form to Fetch Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter Booking Details</h2>
          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleFetchBookings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="BookingId" className="block text-sm font-medium text-gray-700">
                  Booking ID
                </label>
                <input
                  type="text"
                  name="BookingId"
                  id="BookingId"
                  value={formData.BookingId}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Booking ID"
                />
              </div>
              <div>
                <label htmlFor="PNR" className="block text-sm font-medium text-gray-700">
                  PNR
                </label>
                <input
                  type="text"
                  name="PNR"
                  id="PNR"
                  value={formData.PNR}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PNR"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !formData.EndUserIp}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading || !formData.EndUserIp ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Fetching...' : 'Fetch Bookings'}
            </button>
          </form>
        </div>

        {/* Bookings Display */}
        {bookings.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PNR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.BookingId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.BookingId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.PNR}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.AirlineName} ({booking.FlightNumber})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.Origin} → {booking.Destination}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.ArrTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.DepTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.Currency} {booking.InvoiceAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          disabled={cancelLoading === booking.BookingId}
                          className={`py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                            cancelLoading === booking.BookingId ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {cancelLoading === booking.BookingId ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No bookings found. Please enter your booking details above.</p>
        )}
      </div>
    </div>
  );
}