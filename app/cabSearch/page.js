"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import CabFilter from "../Component/Filter/CabFilter";
import { FaFilter, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CabsComp from "../Component/AllComponent/formMaincomp/CabsComp";
import { useDispatch, useSelector } from "react-redux";
import { searchCabApi } from "../Component/Store/slices/cabSearchSlice";
import { motion } from "framer-motion";

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

// Skeleton Loader for Slider
const SkeletonSlider = () => {
  return (
    <div className="mb-5 animate-pulse">
      <div className="flex space-x-2">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="w-24 h-16 bg-gray-200 rounded-md"></div>
        ))}
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
      className="w-full h-[300px] bg-white rounded-xl shadow-md flex items-center p-8 mb-6 border border-gray-200"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01, boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex w-full items-center space-x-8">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{transfer.TransferName}</h3>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>
              <span className="font-medium">From:</span> {transfer.PickUp.PickUpDetailName} at {transfer.PickUp.PickUpTime}, {transfer.PickUp.PickUpDate}
            </p>
            <p>
              <span className="font-medium">To:</span> {transfer.DropOff.DropOffDetailName}
            </p>
            <p>
              <span className="font-medium">Duration:</span> {transfer.ApproximateTransferTime} hours
            </p>
            <div className="flex space-x-4">
              <p>
                <span className="font-medium">Passengers:</span> {vehicle.VehicleMaximumPassengers}
              </p>
              <p>
                <span className="font-medium">Luggage:</span> {vehicle.VehicleMaximumLuggage}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between h-full">
          <p className="text-2xl font-bold text-gray-900">{formattedPrice}</p>
          <motion.button
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Now
          </motion.button>
          <p className="text-xs text-gray-500 mt-2">
            {cancellationCharge}% charge after {cancellationDate}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Page = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { searchResults,loading , error } = useSelector((state) => state.cabSearch?.info || {});
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Slider settings
  const settings = {
    infinite: true,
    slidesToShow: 8,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

  

  // Toggle popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Fetch cab search data
  useEffect(() => {
    const searchData = {
      EndUserIp: searchParams.get("EndUserIp") || "",
      TokenId: searchParams.get("TokenId") || "",
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
    if (!searchData.TokenId) {
      alert("Token ID is required.");
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

    // Dispatch API call
    dispatch(searchCabApi(searchData));
  }, [searchParams, dispatch]);

  // Sample transferData (for fallback or testing)
  const transferData = [
    {
      IsPANMandatory: true,
      ResultIndex: 1,
      TransferCode: "1551356",
      TransferName: "Premium Car",
      CityCode: "126632",
      ApproximateTransferTime: 1.53,
      CategoryId: 7,
      PickUp: {
        PickUpCode: 1,
        PickUpName: "Airport",
        PickUpDetailCode: "LGW",
        PickUpDetailName: "London Gatwick Airport",
        IsPickUpAllowed: true,
        IsPickUpTimeRequired: true,
        PickUpTime: "1030",
        PickUpDate: "22/05/2025",
      },
      DropOff: {
        DropOffCode: 1,
        DropOffName: "Airport",
        DropOffDetailCode: "LHR",
        DropOffDetailName: "London Heathrow Airport",
        DropOffAllowForCheckInTime: 0,
        IsDropOffAllowed: true,
      },
      Vehicles: [
        {
          IsPANMandatory: false,
          LastCancellationDate: "2025-05-16T23:59:59",
          TransferCancellationPolicy: [
            {
              Charge: 100,
              ChargeType: 2,
              Currency: "INR",
              FromDate: "2025-05-17T00:00:00",
              ToDate: "2025-05-18T23:59:59",
            },
          ],
          VehicleIndex: 1,
          Vehicle: "Premium Car",
          VehicleCode: "1",
          VehicleMaximumPassengers: 3,
          VehicleMaximumLuggage: 3,
          Language: "NotSpecified",
          LanguageCode: 0,
          TransferPrice: {
            CurrencyCode: "INR",
            BasePrice: 10081.88,
            Tax: 0,
            Discount: 0,
            PublishedPrice: 10081.88,
            PublishedPriceRoundedOff: 10082,
            OfferedPrice: 9073.69,
            OfferedPriceRoundedOff: 9074,
            AgentCommission: 1008.19,
            AgentMarkUp: 0,
            ServiceTax: 0,
            TCS: 0,
            TDS: 403.28,
            PriceType: 0,
            SubagentCommissionInPriceDetailResponse: 0,
            SubagentCommissionTypeInPriceDetailResponse: 0,
            DistributorCommissionInPriceDetailResponse: 0,
            DistributorCommissionTypeInPriceDetailResponse: 0,
            ServiceCharge: 0,
            TotalGSTAmount: 0,
            GST: {
              CGSTAmount: 0,
              CGSTRate: 0,
              CessAmount: 0,
              CessRate: 0,
              IGSTAmount: 0,
              IGSTRate: 18,
              SGSTAmount: 0,
              SGSTRate: 0,
              TaxableAmount: 0,
            },
          },
        },
      ],
      Condition: ["Our representative monitors your landing hour and waits 60 minutes since the time of actual landing"],
    },
    // Additional transferData objects omitted for brevity
  ];

  return (
    <>
      <CabsComp />
      <div className="block md:flex px-0 lg:px-28 items-start gap-3 my-5">
        <div className="hidden md:block w-1/4 sticky top-24">
          <CabFilter />
        </div>
        <div className="myshadow w-full md:w-3/4 bg-white px-5 py-3">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
              Airport Transfer Options: Gatwick to Heathrow
            </h1>

           

            {/* Transfer Cards */}
            {loading ? (
              <div className="flex flex-col space-y-6">
                {[...Array(3)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 text-center">Error: Failed to load transfer options. Please try again.</p>
            ) : searchResults?.length > 0 ? (
              <div className="flex flex-col space-y-6">
                {searchResults.map((transfer) => (
                  <TransferCard key={transfer.TransferCode} transfer={transfer} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                {transferData.map((transfer) => (
                  <TransferCard key={transfer.TransferCode} transfer={transfer} />
                ))}
              </div>
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