'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { apilink } from '../../Component/common';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    customerFirstName: '',
    customerLastName: '',
    customerDOB: '',
    customerPassportNo: '',
    travelStartDate: '',
    travelEndDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validatedOrder, setValidatedOrder] = useState({ validatedOrderId: '', sessionKey: '' });
  const [orderDetails, setOrderDetails] = useState({ orderNo: '', simNo: '' });
  const [documentForm, setDocumentForm] = useState({
    mobileNo: '',
    passportF: null,
    passportB: null,
    eTicket1: null,
  });
  const [showDocumentForm, setShowDocumentForm] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${apilink}/matrix/countries`);
        console.log('countries', response);
        if (response.data.status === 1) {
          setCountries(response.data.data || []);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message || 'Failed to fetch countries',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching countries',
        });
      }
    };
    fetchCountries();
  }, []);

  // Fetch plans when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    const fetchPlans = async () => {
      setIsLoading(true);

        const response = await axios.get(`${apilink}/matrix/plans`, {
          params: { country_covered: selectedCountry },
        });
        console.log('response',response.data.data )
    
          setPlans(response?.data?.data || []);

            setIsLoading(false);
     
   
    }
    
    
    fetchPlans();
  }, [selectedCountry]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle document input changes
  const handleDocumentChange = (e) => {
    const { name, files, value } = e.target;
    if (files) {
      // Validate file size (2MB max)
      if (files[0].size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${name} must be less than 2MB`,
        });
        return;
      }
      setDocumentForm({ ...documentForm, [name]: files[0] });
    } else {
      setDocumentForm({ ...documentForm, [name]: value });
    }
  };

  // Validate dates client-side
  const validateDates = () => {
    if (!formData.travelStartDate || !formData.travelEndDate || !selectedPlan) return false;
    const startDate = new Date(formData.travelStartDate);
    const endDate = new Date(formData.travelEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start date must be today or later
    if (startDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Travel start date must be today or later',
      });
      return false;
    }

    // Start date must be within 100 days
    const maxStartDate = new Date(today);
    maxStartDate.setDate(today.getDate() + 100);
    if (startDate > maxStartDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Travel start date must be within 100 days from today',
      });
      return false;
    }

    // End date must be after or equal to start date
    if (endDate < startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Travel end date must be on or after start date',
      });
      return false;
    }

    // End date must be within 90 days of start date
    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(startDate.getDate() + 90);
   
    // Check plan validity (e.g., 2 days for trial plans)
    const daysDifference = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (daysDifference > selectedPlan.validity) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: `Travel end date must be within ${selectedPlan.validity} days for this plan`,
      });
      return false;
    }

    return true;
  };

  // Validate order
  const handleValidateOrder = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a plan',
      });
      return;
    }
    if (!validateDates()) {
      return;
    }
    setIsLoading(true);
    Swal.fire({
      title: 'Validating Order...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.post(`${apilink}/matrix/validate-order`, {
        request: [
          {
            id: selectedPlan.id,
            planName: selectedPlan.planName,
            ...formData,
          },
        ],
      });
      console.log('validateOrder response', response.data);
      if (response.data.status === 1) {
        setValidatedOrder({
          validatedOrderId: response.data.validatedOrderId,
          sessionKey: response.data.sessionKey,
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Order validated successfully',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to validate order',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error validating order',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create order
  const handleCreateOrder = async () => {
    if (!validatedOrder.validatedOrderId || !validatedOrder.sessionKey) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please validate the order first',
      });
      return;
    }
    setIsLoading(true);
    Swal.fire({
      title: 'Creating Order...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.post(`${apilink}/matrix/create-order`, {
        validatedOrderId: validatedOrder.validatedOrderId,
        sessionKey: validatedOrder.sessionKey,
      });
      console.log('createOrder response', response.data);
      if (response.data.status === 1) {
        setOrderDetails({
          orderNo: response.data.orderNo,
          simNo: response.data.simNo,
        });
        // Assume KYC is required unless API indicates otherwise
        setShowDocumentForm(true);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Order created successfully! Please upload KYC documents.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to create order',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error creating order',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload documents
  const handleUploadDocuments = async (e) => {
    e.preventDefault();
    if (!documentForm.passportF || !documentForm.passportB || !documentForm.mobileNo) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please provide mobile number and passport images',
      });
      return;
    }
    setIsLoading(true);
    Swal.fire({
      title: 'Uploading Documents...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const formData = new FormData();
    formData.append('orderNo', orderDetails.orderNo);
    formData.append('simNo', orderDetails.simNo);
    formData.append('mobileNo', documentForm.mobileNo);
    formData.append('passportF', documentForm.passportF);
    formData.append('passportB', documentForm.passportB);
    if (documentForm.eTicket1) {
      formData.append('eTicket1', documentForm.eTicket1);
    }

    try {
      const response = await axios.post(`${apilink}/matrix/upload-documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('uploadDocuments response', response.data);
      if (response.data.status === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Documents uploaded successfully! Check your email for eSIM details.',
        });
        // Reset state
        setFormData({
          customerFirstName: '',
          customerLastName: '',
          customerDOB: '',
          customerPassportNo: '',
          travelStartDate: '',
          travelEndDate: '',
        });
        setSelectedPlan(null);
        setSelectedCountry('');
        setPlans([]);
        setValidatedOrder({ validatedOrderId: '', sessionKey: '' });
        setOrderDetails({ orderNo: '', simNo: '' });
        setDocumentForm({ mobileNo: '', passportF: null, passportB: null, eTicket1: null });
        setShowDocumentForm(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to upload documents',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error uploading documents',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Buy eSIM</h1>
          <p className="text-xl mb-8">
            Instant eSIM activation for global travel. KYC may be required for some plans.
          </p>
          <Image
            src="/esim-hero.png"
            alt="eSIM Illustration"
            width={400}
            height={300}
            className="mx-auto"
          />
        </div>
      </section>

      {/* Country and Plan Selection */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="max-w-md mx-auto mb-8">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Select Country
            </label>
            <select
              id="country"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center">Loading plans...</div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105 ${
                    selectedPlan?.id === plan.id ? 'border-2 border-primary bg-blue-50' : 'bg-white'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <h3 className="text-xl font-semibold mb-2">{plan.planName}</h3>
                  <p className="text-gray-600 mb-2">
                    {plan.dataCapacity} {plan.dataCapacityUnit}
                  </p>
                  <p className="text-gray-600 mb-2">Validity: {plan.validity} days</p>
                  <p className="text-2xl font-bold text-primary">
                    {plan.totalPrice} {plan.currency}
                  </p>
                  {plan.isRechargeable && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Rechargeable
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : selectedCountry ? (
            <p className="text-center text-gray-600">No plans available for {selectedCountry}</p>
          ) : null}
        </div>
      </section>

      {/* Order Form */}
      {selectedPlan && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Complete Your Order</h2>
            <form onSubmit={handleValidateOrder} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="customerFirstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="customerFirstName"
                    name="customerFirstName"
                    value={formData.customerFirstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="customerLastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="customerLastName"
                    name="customerLastName"
                    value={formData.customerLastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="customerDOB" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="customerDOB"
                    name="customerDOB"
                    value={formData.customerDOB}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                    max={new Date().toISOString().split('T')[0]} // Prevent future DOB
                  />
                </div>
                <div>
                  <label htmlFor="customerPassportNo" className="block text-sm font-medium text-gray-700">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    id="customerPassportNo"
                    name="customerPassportNo"
                    value={formData.customerPassportNo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="travelStartDate" className="block text-sm font-medium text-gray-700">
                    Travel Start Date
                  </label>
                  <input
                    type="date"
                    id="travelStartDate"
                    name="travelStartDate"
                    value={formData.travelStartDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(new Date().setDate(new Date().getDate() + 100)).toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label htmlFor="travelEndDate" className="block text-sm font-medium text-gray-700">
                    Travel End Date
                  </label>
                  <input
                    type="date"
                    id="travelEndDate"
                    name="travelEndDate"
                    value={formData.travelEndDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                    min={formData.travelStartDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Validating...' : 'Validate Order'}
                </button>
              </div>
            </form>

            {validatedOrder.validatedOrderId && !showDocumentForm && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleCreateOrder}
                  className="bg-secondary text-white py-3 px-8 rounded-md hover:bg-emerald-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Order...' : 'Confirm & Buy Now'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Document Upload Form */}
      {showDocumentForm && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Upload KYC Documents</h2>
            <form onSubmit={handleUploadDocuments} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">
                    Mobile Number (with country code, e.g., +1234567890)
                  </label>
                  <input
                    type="text"
                    id="mobileNo"
                    name="mobileNo"
                    value={documentForm.mobileNo}
                    onChange={handleDocumentChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label htmlFor="passportF" className="block text-sm font-medium text-gray-700">
                    Passport Front (JPG, max 2MB)
                  </label>
                  <input
                    type="file"
                    id="passportF"
                    name="passportF"
                    accept="image/jpeg"
                    onChange={handleDocumentChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="passportB" className="block text-sm font-medium text-gray-700">
                    Passport Back (JPG, max 2MB)
                  </label>
                  <input
                    type="file"
                    id="passportB"
                    name="passportB"
                    accept="image/jpeg"
                    onChange={handleDocumentChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="eTicket1" className="block text-sm font-medium text-gray-700">
                    E-Ticket (JPG, max 2MB, optional)
                  </label>
                  <input
                    type="file"
                    id="eTicket1"
                    name="eTicket1"
                    accept="image/jpeg"
                    onChange={handleDocumentChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-700"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Uploading Documents...' : 'Upload Documents'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 eSIM Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}