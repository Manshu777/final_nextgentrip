'use client';
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { apilink } from '../../Component/common';
import Skeleton from 'react-loading-skeleton';

const BuyESIM = () => {
  const [formData, setFormData] = useState({
    customerFirstName: '',
    customerLastName: '',
    customerDOB: '',
    customerPassportNo: '',
    travelStartDate: '',
    travelEndDate: '',
  });
  const [files, setFiles] = useState({
    passportF: null,
    passportB: null,
    visaCopy1: null,
    eTicket1: null,
    eTicket2: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // Toggle between cart and form
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract plan details from query parameters
  const planId = searchParams.get('planId');
  const planName = searchParams.get('planName');
  const dataCapacity = searchParams.get('dataCapacity');
  const dataCapacityUnit = searchParams.get('dataCapacityUnit');
  const validity = searchParams.get('validity');
  const totalPrice = searchParams.get('totalPrice');
  const currency = searchParams.get('currency');
  const coverages = searchParams.get('coverages');
  const isRechargeable = searchParams.get('isRechargeable') === 'true';
  const country = searchParams.get('country');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };


  const travelStart = new Date(formData.travelStartDate);
const travelEnd = new Date(formData.travelEndDate);
const dayDiff = (travelEnd - travelStart) / (1000 * 60 * 60 * 24);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (dayDiff > 90) {
  setError('Travel End Date must be within 90 days of Start Date');
  setIsLoading(false);
  return;
}
    try {
      // Validate Order
      const validateResponse = await axios.post(`${apilink}/matrix/validate-order`, {
        request: [{
          id: planId,
          planName: planName,
          ...formData,
        }],
      });

      if (!validateResponse.data.validatedOrderId) {
        throw new Error('Order validation failed');
      }

      // Create Order
      const createResponse = await axios.post(`${apilink}/matrix/create-order`, {
        validatedOrderId: validateResponse.data.validatedOrderId,
      });

      if (!createResponse.data.orderNo || !createResponse.data.simNo) {
        throw new Error('Order creation failed');
      }

      // Upload Documents
      const formDataFiles = new FormData();
      formDataFiles.append('passportF', files.passportF);
      formDataFiles.append('passportB', files.passportB);
      formDataFiles.append('visaCopy1', files.visaCopy1);
      formDataFiles.append('eTicket1', files.eTicket1);
      formDataFiles.append('eTicket2', files.eTicket2);
      formDataFiles.append('orderNo', createResponse.data.orderNo);
      formDataFiles.append('simNo', createResponse.data.simNo);

      await axios.post(`${apilink}/matrix/upload-documents`, formDataFiles, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push(`/activate-esim?simNo=${createResponse.data.simNo}`);
    } catch (err) {
      setError(err.response?.data?.errors || err.message || 'Failed to process order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    setShowForm(true);
  };

  const handleBackToPlans = () => {
    router.push(`/plans?country=${encodeURIComponent(country || '')}`);
  };

  if (!planId || !planName) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Buy eSIM</h2>
        <p className="text-red-500">Please select a plan to proceed.</p>
        <button
          onClick={handleBackToPlans}
          className="mt-4 bg-blue-950 text-white px-6 py-3 rounded-lg"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-[5%] lg:px-[8%] py-8">
      <h2 className="text-2xl font-bold mb-4">Your eSIM Cart</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {!showForm ? (
        // Cart View
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 border border-gray-200 rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{planName}</h3>
                <button
                  onClick={handleBackToPlans}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Change Plan
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  <p className="text-gray-700 font-medium">
                    <span className="font-semibold">Data:</span> {dataCapacity || 'N/A'} {dataCapacityUnit || ''}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-700 font-medium">
                    <span className="font-semibold">Validity:</span> {validity || 'N/A'} days
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-700 font-medium">
                    <span className="font-semibold">Price:</span> {totalPrice || 'N/A'} {currency || ''}
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-700 font-medium">
                    <span className="font-semibold">Covered Countries:</span>{' '}
                    {coverages
                      ? coverages.split(',').slice(0, 3).map((country) => country.trim()).join(', ')
                      : 'N/A'}
                    {coverages && coverages.split(',').length > 3 && (
                      <span className="text-blue-500 cursor-pointer hover:underline" title={coverages}>
                        {' '}
                        +{coverages.split(',').length - 3} more
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <p className="text-gray-700 font-medium">
                    <span className="font-semibold">Rechargeable:</span> {isRechargeable ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md sticky top-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan:</span>
                <span className="text-gray-800 font-medium">{planName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price:</span>
                <span className="text-gray-800 font-medium">
                  {totalPrice || 'N/A'} {currency || ''}
                </span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between mb-4">
                <span className="text-gray-800 font-semibold">Total:</span>
                <span className="text-gray-800 font-semibold">
                  {totalPrice || 'N/A'} {currency || ''}
                </span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-blue-950 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all duration-300"
                disabled={isLoading}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Form View
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Enter Your Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">First Name</label>
                <input
                  type="text"
                  name="customerFirstName"
                  value={formData.customerFirstName}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Last Name</label>
                <input
                  type="text"
                  name="customerLastName"
                  value={formData.customerLastName}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium">Date of Birth</label>
              <input
                type="date"
                name="customerDOB"
                value={formData.customerDOB}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Passport Number</label>
              <input
                type="text"
                name="customerPassportNo"
                value={formData.customerPassportNo}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Travel Start Date</label>
                <input
                  type="date"
                  name="travelStartDate"
                  value={formData.travelStartDate}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Travel End Date</label>
                <input
                  type="date"
                  name="travelEndDate"
                  value={formData.travelEndDate}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium">Passport Front</label>
              <input
                type="file"
                name="passportF"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf"
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Passport Back</label>
              <input
                type="file"
                name="passportB"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf"
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Visa Copy</label>
              <input
                type="file"
                name="visaCopy1"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf"
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">e-Ticket 1</label>
              <input
                type="file"
                name="eTicket1"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf"
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">e-Ticket 2</label>
              <input
                type="file"
                name="eTicket2"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf"
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-950 text-white font-semibold px-6 py-3 rounded-lg disabled:bg-gray-300 hover:bg-blue-800 transition-all duration-300"
              >
                {isLoading ? 'Processing...' : 'Buy eSIM'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BuyESIM;