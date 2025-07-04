"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCabCityApi, searchCabApi } from "../../Store/slices/cabSearchSlice";
import { Calendar } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import TypeWriterHeaderEffect from "../TypeWriterHeaderEffect";
import {
  getDestinationSearchData,
  setSearchParams,
} from "../../Store/slices/destinationSearchSlice";

const languageMap = {
  NotSpecified: 0,
  Arabic: 1,
  Cantonese: 2,
  Danish: 3,
  English: 4,
  French: 5,
  German: 6,
  Hebrew: 7,
  Italian: 8,
  Japanese: 9,
  Korean: 10,
  Mandarin: 11,
  Portuguese: 12,
  Russian: 13,
  Spanish: 14,
};

const CabComp = () => {
  const [selected, setSelected] = useState("");
  const defaultStore = JSON.parse(localStorage.getItem("cabSearch")) || {};
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [endUserIp, setEndUserIp] = useState(defaultStore.endUserIp || "");
  const [searchType, setSearchType] = useState(defaultStore.searchType || "1");

  // State for cab-specific fields
  const [pickup, setPickup] = useState(
    defaultStore.pickup || {
      CityId: 1234,
      CityName: "Hyderabad",
      PickUpCode: 1,
      PickUpPointCode: "HYD",
    }
  );
  const [dropoff, setDropoff] = useState(
    defaultStore.dropoff || {
      CityId: 5678,
      CityName: "Bengaluru",
      DropOffCode: 1,
      DropOffPointCode: "BLR",
    }
  );
  const [transferDate, setTransferDate] = useState(
    (defaultStore.transferDate && new Date(defaultStore.transferDate)) ||
      new Date()
  );
  const [transferTime, setTransferTime] = useState(
    defaultStore.transferTime || "1000"
  ); // hhmm format
  const [adultCount, setAdultCount] = useState(defaultStore.adultCount || 1);
  const [preferredLanguage, setPreferredLanguage] = useState(
    defaultStore.preferredLanguage || 4 // English
  );
  const [alternateLanguage, setAlternateLanguage] = useState(
    defaultStore.alternateLanguage || 0 // NotSpecified
  );
  const [countryCode, setCountryCode] = useState(
    defaultStore.countryCode || "IN"
  );
  const [tokenId, setTokenId] = useState(
    defaultStore.tokenId || "SAMPLE_TOKEN"
  ); // Replace with actual token

  const localTimeZone = getLocalTimeZone();
  const currentDate = today(localTimeZone);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(setSearchParams({ searchType, countryCode }));
    dispatch(getDestinationSearchData({ searchType, countryCode }))
      .unwrap()
      .catch((error) => console.error("Failed to fetch destinations:", error))
      .finally(() => setLoading(false));
  }, [dispatch, searchType, countryCode]);

  // Fetch IP address
  useEffect(() => {
    if (!endUserIp) {
      fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => setEndUserIp(data.ip))
        .catch((err) => console.error("Failed to fetch IP:", err));
    }
  }, [endUserIp]);

  // Fetch cab cities
  useEffect(() => {
    setLoading(true);
    dispatch(getCabCityApi())
      .unwrap()
      .catch((error) => console.error("Failed to fetch cab cities:", error))
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Handle date selection
  const handleRangeChange = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day);
    setTransferDate(date);
    setSelected("");
  };

  // Format time to hhmm
  const formatTime = (time) => {
    return time.replace(":", "");
  };

  const handleSearch = async () => {
    // Validation
    if (!endUserIp) {
      alert("End user IP is required.");
      return;
    }
    if (!tokenId) {
      alert("Token ID is required.");
      return;
    }
    if (pickup.CityId === dropoff.CityId) {
      alert("Pickup and dropoff locations cannot be the same.");
      return;
    }
    if (new Date(transferDate) < new Date()) {
      alert("Transfer date must be in the future.");
      return;
    }
    if (!transferTime.match(/^\d{4}$/)) {
      alert("Transfer time must be in hhmm format (e.g., 1030).");
      return;
    }

    const searchData = {
      EndUserIp: endUserIp,
      TokenId: tokenId,
      CountryCode: countryCode,
      CityId: pickup.CityId,
      PickUpCode: pickup.PickUpCode,
      PickUpPointCode: pickup.PickUpPointCode,
      DropOffCode: dropoff.DropOffCode,
      DropOffPointCode: dropoff.DropOffPointCode,
      TransferDate: transferDate.toISOString().split("T")[0],
      TransferTime: transferTime,
      AdultCount: adultCount,
      PreferredLanguage: preferredLanguage,
      AlternateLanguage: alternateLanguage,
      PreferredCurrency: "INR",
      IsBaseCurrencyRequired: false,
    };

    // Construct URL with query parameters
    const queryParams = new URLSearchParams({
      EndUserIp: searchData.EndUserIp,
      TokenId: searchData.TokenId,
      CountryCode: searchData.CountryCode,
      CityId: searchData.CityId,
      PickUpCode: searchData.PickUpCode,
      PickUpPointCode: searchData.PickUpPointCode,
      DropOffCode: searchData.DropOffCode,
      DropOffPointCode: searchData.DropOffPointCode,
      TransferDate: searchData.TransferDate,
      TransferTime: searchData.TransferTime,
      AdultCount: searchData.AdultCount.toString(),
      PreferredLanguage: searchData.PreferredLanguage,
      AlternateLanguage: searchData.AlternateLanguage,
      PreferredCurrency: searchData.PreferredCurrency,
      IsBaseCurrencyRequired: searchData.IsBaseCurrencyRequired.toString(),
    }).toString();

    const searchUrl = `/cabSearch?${queryParams}`;

    // Save to localStorage
    localStorage.setItem("cabSearch", JSON.stringify(searchData));

    router.push(searchUrl);
  };

  // Handle pickup and dropoff selection
  const handlePickup = (data) => {
    setPickup(data);
    setSelected("dropoff");
  };

  const handleDropoff = (data) => {
    setDropoff(data);
    setSelected("date");
  };

  return (
    <div className="header relative md:px-5 lg:px-12 xl:px-24 pt-10 md:pt-14">
      <div className="bg-[#002043] h-[12rem] absolute inset-0 -z-10"></div>
      <TypeWriterHeaderEffect />
      <div className="flex flex-col bg-white lg:block rounded-lg text-white">
        <div className="bg-gray-200 rounded-sm shadow">
          <Navbar />
        </div>
        <div className="px-4 border-b-2 shadow-sm space-y-1 py-3">
          <div className="tabs FromDateDeapt grid items-center lg:grid-cols-8 gap-4">
            <div className="relative">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-md text-black"
              >
                <option value="1">City</option>
                <option value="2">Hotel</option>
              </select>
            </div>

            <div className="relative">
              <div
                onClick={() => setSelected("pickup")}
                className="cursor-pointer relative rounded gap-3 h-full flex items-center py-1 lg:py-0 px-2 w-full truncate border border-slate-400 text-black"
              >
                <IoLocationSharp className="text-xl" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-black font-bold">
                    {pickup.CityName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {pickup.PickUpPointCode}
                  </span>
                </div>
              </div>
              {selected === "pickup" && (
                <SearchComponents
                  type={selected}
                  handelcity={handlePickup}
                  searchType={searchType}
                />
              )}
            </div>

            {/* Dropoff */}
            <div className="relative">
              <div
                onClick={() => setSelected("dropoff")}
                className="cursor-pointer relative rounded gap-3 h-full flex items-center py-1 lg:py-0 px-2 w-full truncate border border-slate-400 text-black"
              >
                <IoLocationSharp className="text-xl" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-black font-bold">
                    {dropoff.CityName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {dropoff.DropOffPointCode}
                  </span>
                </div>
              </div>
              {selected === "dropoff" && (
                <SearchComponents
                  type={selected}
                  handelcity={handleDropoff}
                  searchType={searchType}
                />
              )}
            </div>

            <div className="relative">
              <div
                onClick={() => setSelected("date")}
                className="flex items-center cursor-pointer gap-1 px-1 py-18px border-2 text-black border-slate-200 rounded-md"
              >
                <FaCalendarAlt className="text-8px" />
                <div className="text-slate-400">
                  <div className="flex items-baseline text-black">
                    <span className="text-sm py-2 pr-1 text-black font-bold">
                      {transferDate.getDate()}
                    </span>
                    <span className="text-sm font-semibold">
                      {transferDate.toLocaleString("en-US", { month: "short" })}
                      '
                    </span>
                    <span className="text-sm font-semibold">
                      {" "}
                      {transferDate.getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
              {selected === "date" && (
                <div className="bg-white text-black p-5 shadow-2xl absolute top-full left-0 mt-2 z-10">
                  <Calendar
                    aria-label="Select a date"
                    onChange={handleRangeChange}
                    minValue={currentDate}
                  />
                </div>
              )}
            </div>

            {/* Transfer Time */}
            <div className="relative">
              <input
                type="time"
                value={
                  transferTime.match(/(\d{2})(\d{2})/)?.[1] +
                    ":" +
                    transferTime.match(/(\d{2})(\d{2})/)?.[2] || transferTime
                }
                onChange={(e) => setTransferTime(formatTime(e.target.value))}
                className="w-full px-3 py-1 border-2 border-slate-200 rounded-md text-black"
              />
            </div>

            {/* Adult Count */}
            <div className="relative">
              <div
                onClick={() => setIsVisible(!isVisible)}
                className="flex items-center cursor-pointer gap-2 px-2 py-14px border-2 text-black border-slate-200 rounded-md"
              >
                <div className="text-slate-400">
                  <div className="flex items-baseline text-black">
                    <span className="text-xl py-1 pr-1 text-black font-bold">
                      {adultCount}
                    </span>
                    <span className="text-sm font-semibold">Traveller(s)</span>
                  </div>
                </div>
              </div>
              {isVisible && (
                <div className="absolute top-[80%] min-w-full min-h-[5rem] left-1 md:-left-10 z-10">
                  <div className="shadow-2xl rounded-md bg-white mt-[10%] flex flex-col gap-4 p-3">
                    <div className="flex gap-3 justify-between">
                      <p className="text-nowrap text-gray-600">Adult Count</p>
                      <div className="flex items-center gap-3">
                        <button
                          className="px-2 text-gray-600 border"
                          onClick={() =>
                            adultCount > 1 && setAdultCount(adultCount - 1)
                          }
                        >
                          -
                        </button>
                        <p className="px-2 text-gray-600 border">
                          {adultCount}
                        </p>
                        <button
                          className="px-2 text-gray-600 border"
                          onClick={() => setAdultCount(adultCount + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preferred Language */}
            <div className="relative">
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-md text-black"
              >
                {Object.entries(languageMap).map(([lang, value]) => (
                  <option key={value} value={value}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex justify-center items-center gap-4 flex-wrap px-4 sm:px-6 md:px-0">
              {/* <span className="text-lg font-semibold text-gray-800">
                Search Cab
              </span> */}
              <button
                onClick={handleSearch}
                className="bg-[#0A5EB0] w-full max-w-sm md:w-auto py-2 px-4 text-base md:text-lg font-semibold rounded-md text-white transition duration-300 hover:bg-[#084c91]"
              >
                Search 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchComponents = ({ type, handelcity, searchType }) => {
  const [searchParam, setSearchParam] = useState("");
  const { destinations, loading } = useSelector((state) => state.destinations);

  // Filter destinations based on search input
  const filteredDestinations = destinations?.data?.filter((item) =>
    searchType === "2"
      ? item.hotel_name?.toLowerCase().includes(searchParam.toLowerCase()) ||
        item.city_name?.toLowerCase().includes(searchParam.toLowerCase())
      : item.city_name?.toLowerCase().includes(searchParam.toLowerCase())
  );

  // Map Type to PickUpCode/DropOffCode
  const mapTypeToCode = (type) => {
    return type === 1 ? 1 : 0; // City → Airport (1), Hotel → Accommodation (0)
  };

  return (
    <div className="absolute w-[300px] top-[53%] bg-white  z-30 shadow-md rounded-md mt-1">
      <input
        type="text"
        value={searchParam}
        className="w-full text-black px-3 py-2 border-b outline-none"
        placeholder={`Search ${type === "pickup" ? "pickup" : "dropoff"} ${
          searchType === "1" ? "city" : "hotel"
        }...`}
        onChange={(e) => setSearchParam(e.target.value)}
      />
      <div className="max-h-60 overflow-y-scroll custom-scroll">
        {loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="p-2 border-b animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))
          : filteredDestinations?.map((item) => (
              <p
                key={item.destination_id}
                className="border-b px-3 py-2 cursor-pointer text-gray-700 transition-all"
                onClick={() => {
                  handelcity({
                    CityId: item.destination_id.toString(),
                    CityName:
                      searchType === "2" ? item.hotel_name : item.city_name,
                    [type === "pickup" ? "PickUpCode" : "DropOffCode"]:
                      mapTypeToCode(item.type),
                    [type === "pickup"
                      ? "PickUpPointCode"
                      : "DropOffPointCode"]: item.city_name
                      .slice(0, 3)
                      .toUpperCase(),
                  });
                  setSearchParam("");
                }}
              >
                {searchType === "2"
                  ? `${item.hotel_name}, ${item.city_name}`
                  : `${item.city_name} (${item.city_name
                      .slice(0, 3)
                      .toUpperCase()})`}
              </p>
            ))}
      </div>
    </div>
  );
};

export default CabComp;
