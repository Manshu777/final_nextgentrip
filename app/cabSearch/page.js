"use client";
import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaFilter, FaTimes } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import CabFilter from "../Component/Filter/CabFilter";
import CabsComp from "../Component/AllComponent/formMaincomp/CabsComp";
import axios from "axios";
import { apilink } from "../Component/common";

// Replace with your API base URL


// Skeleton Loader for TransferCard
const SkeletonCard = () => {
  return (
    <div className="w-full h-[300px] bg-white rounded-xl shadow-md flex items-center p-8 mb-6 border border-gray-200 animate-pulse">
      <div className="flex w-full items-center space-x-8">
        <div className="flex-1">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="flex space-x-4">
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between h-full">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          <div className="h-3 w-32 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
    </div>
  );
};

// TransferCard Component

const TransferCard = ({ transfer }) => {
  const vehicle = transfer.Vehicles[0];
  const price = vehicle.TransferPrice.OfferedPriceRoundedOff;
  const cancellationDate = new Date(vehicle.LastCancellationDate).toLocaleDateString();
  const cancellationCharge = vehicle.TransferCancellationPolicy[0].Charge;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <motion.div
      className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6 transform transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)" }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center p-6 md:p-8 gap-6 bg-gradient-to-r from-gray-50 to-white">
        {/* Left Section: Transfer Details */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{transfer.TransferName}</h3>
          <div className="space-y-3 text-gray-700 text-sm">
            <p className="flex items-center">
              <span className="font-semibold text-blue-600 mr-2">From:</span>
              <span className="font-medium">{transfer.PickUp.PickUpDetailName}</span>
              <span className="ml-2 text-gray-500">at {transfer.PickUp.PickUpTime}, {transfer.PickUp.PickUpDate}</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold text-blue-600 mr-2">To:</span>
              <span className="font-medium">{transfer.DropOff.DropOffDetailName}</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold text-blue-600 mr-2">Duration:</span>
              <span>{transfer.ApproximateTransferTime} hours</span>
            </p>
            <div className="flex gap-6">
              <p className="flex items-center">
                <span className="font-semibold text-blue-600 mr-2">Passengers:</span>
                <span>{vehicle.VehicleMaximumPassengers}</span>
              </p>
              <p className="flex items-center">
                <span className="font-semibold text-blue-600 mr-2">Luggage:</span>
                <span>{vehicle.VehicleMaximumLuggage}</span>
              </p>
            </div>
            {transfer.Condition && transfer.Condition.length > 0 && (
              <p className="text-xs text-gray-500 italic mt-2">{transfer.Condition[0]}</p>
            )}
          </div>
        </div>

        {/* Right Section: Price and Booking */}
        <div className="flex flex-col items-end justify-between w-full md:w-auto">
          <p className="text-3xl font-extrabold text-blue-700 mb-4">{formattedPrice}</p>
          <motion.button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Book Now
          </motion.button>
          <p className="text-xs text-red-500 font-medium mt-3">
            {cancellationCharge}% cancellation charge after {cancellationDate}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Page = () => {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Toggle popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Fetch cab search data
  useEffect(() => {
    const fetchCabSearch = async () => {
      const searchData = {
        EndUserIp: searchParams.get("EndUserIp") || "",
        CountryCode: searchParams.get("CountryCode") || "",
        CityId: searchParams.get("CityId") || "",
        PickUpCode: searchParams.get("PickUpCode") || "",
        PickUpPointCode: searchParams.get("PickUpPointCode") || "",
        DropOffCode: searchParams.get("DropOffCode") || "",
        DropOffPointCode: searchParams.get("DropOffPointCode") || "",
        TransferDate: searchParams.get("TransferDate") || "",
        TransferTime: searchParams.get("TransferTime") || "",
        AdultCount: Number(searchParams.get("AdultCount")) || 1,
        PreferredLanguage: searchParams.get("PreferredLanguage") || "",
        AlternateLanguage: searchParams.get("AlternateLanguage") || "",
        PreferredCurrency: searchParams.get("PreferredCurrency") || "INR",
        IsBaseCurrencyRequired: searchParams.get("IsBaseCurrencyRequired") === "true",
      };

      // Validation
      if (!searchData.EndUserIp) {
        alert("End user IP is required.");
        return;
      }
      if (searchData.CityId === searchData.DropOffPointCode) {
        alert("Pickup and dropoff locations cannot be the same.");
        return;
      }
      if (new Date(searchData.TransferDate) < new Date()) {
        alert("Transfer date must be in the future.");
        return;
      }
      if (!searchData.TransferTime.match(/^\d{4}$/)) {
        alert("Transfer time must be in hhmm format (e.g., 1030).");
        return;
      }

      // Save to localStorage
      localStorage.setItem("cabSearch", JSON.stringify(searchData));

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(`${apilink}/transfer-search`, searchData);

        console.log("Transfer Search Response:", response.data.TransferSearchResult.TransferSearchResults);

        setSearchResults(response.data.TransferSearchResult.TransferSearchResults || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load transfer options. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCabSearch();
  }, [searchParams]); 

  return (
    <>
      <CabsComp />
      <div className="block md:flex px-0 lg:px-28 items-start gap-3 my-5">
        <div className="hidden md:block w-1/4 sticky top-24">
          <CabFilter />
        </div>
        <div className="myshadow w-full md:w-3/4 bg-white px-5 py-3">
          <div className="max-w-7xl mx-auto">
            {/* <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Airport Transfer Options: Gatwick to Heathrow
            </h1> */}

            {/* Transfer Cards */}
            {loading ? (
              <div className="flex flex-col space-y-6">
                {[...Array(3)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 text-center">Error: {error}</p>
            ) : searchResults?.length > 0 ? (
              <div className="flex flex-col space-y-6">
                {searchResults.map((transfer) => (
                  <TransferCard key={transfer.TransferCode} transfer={transfer} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">No transfer options available for the selected criteria.</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Popup */}
      <div className="block md:hidden">
        <div className="icon-container fixed bottom-5 right-4 z-[9999] grid" onClick={togglePopup}>
          <FaFilter className="bg-[#52c3f1] text-white p-1 text-3xl rounded cursor-pointer" />
        </div>
        {isPopupOpen && (
          <div className="popup fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[10000]">
            <div className="popup-content shadow-lg">
              <button
                onClick={togglePopup}
                className="px-4 py-2 bg-blue-500 flex justify-between items-center w-full text-white"
              >
                Filter <FaTimes />
              </button>
              <CabFilter />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;