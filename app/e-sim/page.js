'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ESimComp from '../Component/AllComponent/ESimComp';
import { apilink } from '../Component/common';
import { useSearchParams, useRouter } from 'next/navigation';

const SkeletonLoader = () => (
  <div className="border rounded-lg p-4 shadow-lg animate-pulse">
    <div className="h-6 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded mt-4"></div>
  </div>
);

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const searchParams = useSearchParams(); // Ensure this is defined
  const router = useRouter();
  const country = searchParams ? searchParams.get('country') || '' : ''; // Safe access

  useEffect(() => {
    const fetchData = async () => {
     
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${apilink}/matrix/plans?page=${currentPage}`
        );
        console.log('Full API response:', response);
        const fetchedPlans = Array.isArray(response.data.data) ? response.data.data : [];
        if (fetchedPlans.length === 0) {
          console.warn('No plans found for', country);
        }
        setPlans(fetchedPlans);
        setLastPage(response.data.pagination?.last_page || 1); // Adjust based on API response
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err.response?.data?.errors || 'Failed to fetch plans');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage > lastPage && lastPage > 0) {
      setCurrentPage(lastPage);
    }
  }, [lastPage, currentPage]);

  const handleBuy = (plan) => {

   router.push(
    `/e-sim/buy-esim?planId=${plan.id}&planName=${encodeURIComponent(plan.planName)}` +
    `&dataCapacity=${encodeURIComponent(plan.dataCapacity)}` +
    `&dataCapacityUnit=${encodeURIComponent(plan.dataCapacityUnit)}` +
    `&validity=${plan.validity}&totalPrice=${plan.totalPrice}` +
    `&currency=${encodeURIComponent(plan.currency)}` +
    `&coverages=${encodeURIComponent(plan.coverages)}` +
    `&isRechargeable=${plan.isRechargeable}&country=${encodeURIComponent(country)}`
  );
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <ESimComp />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">eSIM Plans </h2>
        {error ? (
          <p className="mt-4 text-red-500">
            
          </p>
        ) : isLoading ? (
          <div className="grid grid-cols-1 my-2 lg:my-[61px] px-[4%] lg:px-[8%] md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(9)
              .fill()
              .map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
          </div>
        ) : plans.length === 0 ? (
          <p className="mt-4">No eSIM plans available for {country}.</p>
        ) : (
          <div className="grid grid-cols-1 px-[4%] my-2 lg:my-[61px] lg:px-[8%] md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) =>
              plan.id && plan.planName && plan.totalPrice ? (
                <div
                  key={plan.id}
                  className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto"
                >
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                    Trial Plan
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">{plan.planName}</h3>
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
                        <span className="font-semibold">Data:</span> {plan.dataCapacity} {plan.dataCapacityUnit}
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
                        <span className="font-semibold">Validity:</span> {plan.validity} days
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
                        <span className="font-semibold">Price:</span> {plan.totalPrice} {plan.currency}
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
                        {plan.coverages.split(',').slice(0, 3).map((country) => country.trim()).join(', ')}
                        {plan.coverages.split(',').length > 3 && (
                          <span className="text-blue-500 cursor-pointer hover:underline" title={plan.coverages}>
                            {' '}
                            +{plan.coverages.split(',').length - 3} more
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <p className="text-gray-700 font-medium">
                        <span className="font-semibold">Rechargeable:</span> {plan.isRechargeable ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                  {plan.description.includes('Calls Restrictions') && (
                    <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                      <strong>Note:</strong> Calling facility not available in USA, Singapore, and Australia.
                    </div>
                  )}
                  <button
                    onClick={() => handleBuy(plan)}
                    className="mt-6 w-full bg-blue-950 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                  >
                    Buy Now
                  </button>
                </div>
              ) : null
            )}
          </div>
        )}
        <div className="mt-6 flex my-5 justify-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {lastPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === lastPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default PlansPage;