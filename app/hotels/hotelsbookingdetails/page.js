'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHotel, FaCheckCircle, FaUser, FaCalendarAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

export default function BookingPage() {
  const [bookingId, setBookingId] = useState('');
  const [ipAddress, setIpAddress] = useState(null);
  const [ipError, setIpError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch IP address on component mount
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
          throw new Error('Failed to fetch IP address');
        }
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (err) {
        setIpError('Could not fetch IP address. Please try again later.');
      }
    };
    fetchIpAddress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ipAddress) {
      setError('IP address not available. Please try again.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/hotel/bookdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BookingId: bookingId,
          EndUserIp: ipAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const data = await response.json();
      if (data.status === 'success') {
        setBookingData(data);
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching booking details');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse cancellation policy
  const parseCancellationPolicy = (policy) => {
    if (!policy) return [];
    const policyParts = policy.split('#^#')[1]?.split('|') || [];
    return policyParts
      .filter((part) => part.trim())
      .map((part) => part.trim());
  };

  return (
    <>
      <Head>
        <title>Hotel Booking Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Check your hotel booking details" />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Form Section */}
          <div className="bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
              <FaHotel className="text-indigo-600" /> Check Your Booking
            </h1>
            {ipError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-red-600 text-center font-medium"
                aria-live="assertive"
              >
                {ipError}
              </motion.p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Booking Details Form">
              <div>
                <label
                  htmlFor="bookingId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Booking ID
                </label>
                <input
                  type="text"
                  id="bookingId"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 p-3 bg-gray-50"
                  placeholder="Enter Booking ID"
                  required
                  aria-label="Booking ID"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading || !ipAddress}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300 font-semibold"
                aria-label={loading ? 'Loading' : 'Check Booking'}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Check Booking'
                )}
              </motion.button>
            </form>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-red-600 text-center font-medium"
                  aria-live="assertive"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Booking Details Section */}
          <AnimatePresence>
            {bookingData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Booking Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <FaHotel className="text-indigo-500" />
                      <span className="font-medium">Hotel:</span> {bookingData.data.HotelName}
                    </p>
                    <p>
                      <span className="font-medium">Booking ID:</span> {bookingData.data.BookingId}
                    </p>
                    <p>
                      <span className="font-medium">Confirmation No:</span>{' '}
                      {bookingData.data.ConfirmationNo}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                        <FaCheckCircle /> {bookingData.data.HotelBookingStatus}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-500" />
                      <span className="font-medium">Check-in:</span>{' '}
                      {new Date(bookingData.data.CheckInDate).toLocaleDateString('en-IN')}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-500" />
                      <span className="font-medium">Check-out:</span>{' '}
                      {new Date(bookingData.data.CheckOutDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Address:</span>{' '}
                      {bookingData.data.AddressLine1}, {bookingData.data.City}
                    </p>
                    <p>
                      <span className="font-medium">Star Rating:</span>{' '}
                      {'★'.repeat(bookingData.data.StarRating)}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-indigo-500" />
                      <span className="font-medium">Total:</span>{' '}
                      {bookingData.data.InvoiceAmount}{' '}
                      {bookingData.data.Rooms[0].PriceBreakUp.CurrencyCode}
                    </p>
                    <p>
                      <span className="font-medium">Booking Date:</span>{' '}
                      {new Date(bookingData.data.BookingDate).toLocaleDateString('en-IN')}
                    </p>
                    <p>
                      <span className="font-medium">No. of Rooms:</span>{' '}
                      {bookingData.data.NoOfRooms}
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Details</h3>
                {bookingData.data.Rooms.map((room, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="border-t pt-6 mt-6 first:border-t-0"
                  >
                    <p>
                      <span className="font-semibold">Room Type:</span> {room.RoomTypeName}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUser className="text-indigo-500" />
                      <span className="font-semibold">Guests:</span> {room.AdultCount} Adult
                      {room.AdultCount > 1 ? 's' : ''}, {room.ChildCount} Child
                      {room.ChildCount > 1 ? 'ren' : ''}
                    </p>
                    <p>
                      <span className="font-semibold">Amenities:</span> {room.Amenities.join(', ')}
                    </p>
                    <div className="mt-4">
                      <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaClock className="text-indigo-500" /> Cancellation Policy
                      </p>
                      <ul className="space-y-3 ml-4">
                        {parseCancellationPolicy(room.CancellationPolicy).map((policy, pIndex) => (
                          <motion.li
                            key={pIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: pIndex * 0.1 }}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="text-indigo-500 mt-1">•</span>
                            <span className="bg-gray-50 p-2 rounded-md flex-1">{policy}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold text-gray-700 mb-2">Guest Details:</p>
                      {room.HotelPassenger.map((passenger, pIndex) => (
                        <div key={pIndex} className="ml-6 bg-gray-50 p-3 rounded-lg mb-2">
                          <p className="font-medium">
                            {passenger.Title} {passenger.FirstName} {passenger.LastName}{' '}
                            {passenger.LeadPassenger ? '(Lead)' : ''}
                          </p>
                          <p className="text-sm text-gray-600">Email: {passenger.Email}</p>
                          <p className="text-sm text-gray-600">Phone: {passenger.Phoneno}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}