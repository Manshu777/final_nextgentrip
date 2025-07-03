'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EsimComp from '../Component/AllComponent/EsimComp';
import { apilink } from '../Component/common';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from "lucide-react";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const country = searchParams ? searchParams.get('country_covered') || '' : '';
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState(country);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCountriesLoading, setIsCountriesLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Fetch countries
  useEffect(() => {
    const getCountries = async () => {
      setIsCountriesLoading(true);
      try {
        const response = await axios.get(`${apilink}/matrix/countries`);
        if (response.data.status === 1) {
          setCountries(response.data.data || []);
        } else {
          setError(response.data.message || 'Failed to fetch countries');
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to fetch countries');
      } finally {
        setIsCountriesLoading(false);
      }
    };
    getCountries();
  }, []);

  // Update filtered countries based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = countries.filter((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredCountries([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, countries]);

  // Fetch plans based on country and page
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          page_no: currentPage.toString(),
          ...(country && { country_covered: country }),
        }).toString();
        const response = await axios.get(`${apilink}/matrix/plans?${query}`);
        if (response.data.status === 1) {
          setPlans(Array.isArray(response.data.data) ? response.data.data : []);
          setLastPage(response.data.pagination?.last_page || 1);
        } else {
          setPlans([]);
          setError(response.data.message || 'No plans found');
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err.response?.data?.message || 'Failed to fetch plans');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, country]);

  // Handle pagination edge case
  useEffect(() => {
    if (currentPage > lastPage && lastPage > 0) {
      setCurrentPage(lastPage);
    }
  }, [lastPage, currentPage]);

  // Handle clicking outside search bar to hide suggestions

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


 
  const handleBuy = (plan) => {
    const query = new URLSearchParams({
      planId: plan.id,
      planName: plan.planName,
      dataCapacity: plan.dataCapacity.toString(),
      dataCapacityUnit: plan.dataCapacityUnit,
      validity: plan.validity.toString(),
      totalPrice: plan.totalPrice.toString(),
      currency: plan.currency,
      coverages: plan.coverages,
      isRechargeable: plan.isRechargeable.toString(),
      country: country || selectedCountry,
    }).toString();
    router.push(`/e-sim/buy-esim?${query}`);
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

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCountry(e.target.value);
  };


  const handleCountrySelect = (country) => {
    setSearchQuery(country);
    setSelectedCountry(country);
    setIsOpen(false);
    router.push(`/e-sim/plans?country_covered=${encodeURIComponent(country)}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCountry(e.target.value);
  };

 


  const handleKeyDown = (e) => {
    if (!isOpen || filteredCountries.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCountries.length) {
          handleCountrySelect(filteredCountries[selectedIndex]);
        } else if (searchQuery) {
          router.push(`/e-sim/plans?country_covered=${encodeURIComponent(searchQuery)}`);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <>
    <EsimComp />
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-3xl font-bold  text-center text-gray-800">Discover eSIM Plans</h2>

      <div className="w-full max-w-md mx-auto p-4">
          <div className="relative">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                placeholder="Search for a country..."
                aria-label="Search countries"
                aria-expanded={isOpen}
                aria-controls="country-list"
                aria-autocomplete="list"
              />
            </div>

            {isOpen && (
              <div
                ref={dropdownRef}
                id="country-list"
                className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                role="listbox"
              >
                {isCountriesLoading ? (
                  <div className="px-4 py-2 text-gray-500">Loading countries...</div>
                ) : filteredCountries.length > 0 ? (
                  <ul className="py-1 max-h-60 overflow-y-auto">
                    {filteredCountries.map((country, index) => (
                      <li
                        key={country}
                        role="option"
                        aria-selected={selectedIndex === index}
                        className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                          selectedIndex === index
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleCountrySelect(country)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        {country}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-2 text-gray-500">No matches found</div>
                )}
              </div>
            )}
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>


      <div
        className="relative bg-cover bg-center"
       
      >
        {error && !isLoading && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 my-2 lg:my-[61px] px-[4%] lg:px-[8%] md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(9)
              .fill()
              .map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
          </div>
        ) : plans.length === 0 ? (
          <p className="mt-4 text-white text-center">
            No eSIM plans available for {country || selectedCountry || 'the selected country'}.
          </p>
        ) : (
          <div className="grid grid-cols-1 px-[4%]  lg:my-[px] lg:px-[5%] md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) =>
              plan.id && plan.planName && plan.totalPrice ? (
                <div
                  key={plan.id}
                  className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto"
                >
                  <img
                      src={`/images/${plan.coverages.split(',')[0].trim()} eSIM.png`}
                      alt={`${plan.coverages.split(',')[0].trim()} eSIM`}
                      width={300}
                      height={128}
                      className="w-full h-[19rem] object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop in case fallback also fails
                        e.target.src = '/images/Global eSIM.png';
                        e.target.alt = 'Global eSIM';
                      }}

                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">{plan.planName}</h3>
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
                  <button
                    onClick={() => handleBuy(plan)}
                    className="mt-6 w-full bg-blue-950 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-all duration-300"
                  >
                    Buy Now
                  </button>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

     
    </div>
  </>
  );
};

export default PlansPage;