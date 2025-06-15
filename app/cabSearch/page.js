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
import { FaMapMarkerAlt, FaClock, FaUserFriends, FaSuitcase, FaMoneyBillWave, FaTag, FaInfoCircle } from "react-icons/fa";
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
  const currency = vehicle.TransferPrice.CurrencyCode;
  const cancellationDate = new Date(vehicle.LastCancellationDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const cancellationCharge = vehicle.TransferCancellationPolicy[0].Charge;
  const isPanMandatory = transfer.IsPANMandatory || vehicle.IsPANMandatory;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-8 transform transition-all duration-300 hover:shadow-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col lg:flex-row p-6 lg:p-8 gap-6 bg-gradient-to-br from-blue-50 via-white to-gray-50">
        {/* Left Section: Transfer Details */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{transfer.TransferName}</h3>
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {vehicle.Vehicle}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
            {/* Pickup Details */}
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="text-blue-600 mt-1" size={18} />
              <div>
                <p className="font-semibold text-blue-600">Pickup</p>
                <p className="font-medium">{transfer.PickUp.PickUpName} ({transfer.PickUp.PickUpDetailCode})</p>
                <p className="text-gray-500">
                  {transfer.PickUp.PickUpTime}, {transfer.PickUp.PickUpDate}
                </p>
              </div>
            </div>

            {/* Drop-off Details */}
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="text-blue-600 mt-1" size={18} />
              <div>
                <p className="font-semibold text-blue-600">Drop-off</p>
                <p className="font-medium">{transfer.DropOff.DropOffName} ({transfer.DropOff.DropOffDetailCode})</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-2">
              <FaClock className="text-blue-600" size={18} />
              <p>
                <span className="font-semibold text-blue-600">Duration: </span>
                {transfer.ApproximateTransferTime} hours
              </p>
            </div>

            {/* Passengers and Luggage */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <FaUserFriends className="text-blue-600" size={18} />
                <p>{vehicle.VehicleMaximumPassengers} Passengers</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <FaSuitcase className="text-blue-600" size={18} />
                <p>{vehicle.VehicleMaximumLuggage} Luggage</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaInfoCircle className="text-blue-600" size={16} />
            <p>
              {isPanMandatory && (
                <span className="text-red-500 font-medium mr-2">PAN Mandatory</span>
              )}
              {transfer.Condition && transfer.Condition.length > 0 && (
                <span className="italic">{transfer.Condition[0]}</span>
              )}
            </p>
          </div>
        </div>

        {/* Right Section: Price and Booking */}
        <div className="flex flex-col items-center lg:items-end justify-between w-full lg:w-64 bg-gray-100 p-4 rounded-lg">
          <div className="text-center lg:text-right">
            <p className="text-3xl font-extrabold text-blue-700 mb-2">{formattedPrice}</p>
            {vehicle.TransferPrice.Discount > 0 && (
              <p className="text-sm text-green-600">
                <FaTag className="inline mr-1" /> Save {vehicle.TransferPrice.Discount}% off
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Incl. {vehicle.TransferPrice.GST.IGSTRate}% IGST
            </p>
          </div>

          <motion.button
            className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Book Now
          </motion.button>

          <p className="text-xs text-red-500 font-medium mt-3 text-center lg:text-right">
            <FaMoneyBillWave className="inline mr-1" /> {cancellationCharge}% cancellation charge after {cancellationDate}
          </p>
        </div>
      </div>

      {/* Footer: Additional Details */}
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 border-t border-gray-200">
        <p>Category ID: {transfer.CategoryId} | Transfer Code: {transfer.TransferCode}</p>
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