"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import { apilink } from "../common";

const AutoSearch = ({ value, countercode, onSelect, visible }) => {
  const addCitdef = {
    info: [
      { Code: "123456", Name: "Kolkata, West Bengal" },
      { Code: "144306", Name: "Mumbai, Maharashtra" },
      { Code: "138673", Name: "Shimla, Himachal Pradesh" },
      { Code: "111124", Name: "Bangalore, Karnataka" },
      { Code: "127352", Name: "Majorda Beach, Goa" },
      { Code: "128914", Name: "Mobor Beach, Goa" },
      { Code: "129778", Name: "Nagoa, Goa" },
      { Code: "130443", Name: "New Delhi, DELHI" },
      { Code: "147501", Name: "Rewari, Delhi National Territory" },
      { Code: "100804", Name: "Ajmer, Rajasthan" },
      { Code: "109093", Name: "Alwar, Rajasthan" },
      { Code: "111142", Name: "Barmer, Rajasthan" },
      { Code: "110564", Name: "Behror, Rajasthan" },
      { Code: "111484", Name: "Bharatpur, Rajasthan" },
      { Code: "144228", Name: "Bhiwadi, Rajasthan" },
      { Code: "111499", Name: "Bijaipur, Rajasthan" },
      { Code: "144247", Name: "Bikaner, Rajasthan" },
      { Code: "134001", Name: "Pushkar, Rajasthan" },
      { Code: "134213", Name: "Ramathra Fort, Rajasthan" },
      { Code: "133676", Name: "Ranakpur, Rajasthan" },
      { Code: "136093", Name: "Sardargarh, Rajasthan" },
      { Code: "137380", Name: "Shahpura, Rajasthan" },
      { Code: "137404", Name: "Siana, Rajasthan" },
      { Code: "136312", Name: "Sikar, Rajasthan" },
      { Code: "140098", Name: "Uchiyarda, Rajasthan" },
      { Code: "138127", Name: "Solan, Himachal Pradesh" },
      { Code: "141097", Name: "Una, Himachal Pradesh" },
    ],
  };

  const [inputValue, setInputValue] = useState(value || "");
  const [cities, setCities] = useState(
    addCitdef.info.map((city) => ({
      id: `city_${city.Code}`,
      city_code: city.Code,
      city_name: city.Name.split(", ")[0],
      country_name: "India",
      country_code: countercode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  );
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const debounceTimeoutRef = useRef(null);

  // Initialize inputValue from localStorage
  useEffect(() => {
    const savedItem = localStorage.getItem("selectedLocation");
    if (savedItem) {
      const parsedItem = JSON.parse(savedItem);
      const displayName =
        parsedItem.hotel_name ||
        parsedItem.city_name ||
        parsedItem.Name?.split(", ")[0] ||
        "Unknown City";
      setInputValue(displayName);
    }
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log("Cities state updated:", cities);
    console.log("Hotels state updated:", hotels);
  }, [cities, hotels]);

  // Fetch cities from /citieslist endpoint
  const fetchCities = async (countryCode, searchValue) => {
    try {
      const res = await axios.get(
        `${apilink}/citieslist?CountryCode=${countryCode}&search=${searchValue}`
      );
      console.log("Cities API Response:", res.data);
      return Array.isArray(res.data.cities) ? res.data.cities : [];
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  };

  // Fetch hotels from /hotels endpoint
  const fetchHotels = async (countryCode, searchValue) => {
    try {
      const res = await axios.get(
        `${apilink}/cities?CountryCode=${countryCode}&search=${searchValue}`
      );
      console.log("Hotels API Response:", res.data);
      return Array.isArray(res.data.hotels) ? res.data.hotels : [];
    } catch (error) {
      console.error("Error fetching hotels:", error);
      return [];
    }
  };

  // Debounced search for both cities and hotels
  const handleInputChange = (value) => {
    setInputValue(value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(async () => {
      if (value && countercode) {
        setIsLoading(true);
        setIsError(false);
        try {
          const [citiesData, hotelsData] = await Promise.all([
            fetchCities(countercode, value),
            fetchHotels(countercode, value),
          ]);

          if (citiesData.length === 0 && hotelsData.length === 0) {
            setIsError(true);
            setErrorMessage("No results found from API");
            setCities(
              addCitdef.info.map((city) => ({
                id: `city_${city.Code}`,
                city_code: city.Code,
                city_name: city.Name.split(", ")[0],
                country_name: "India",
                country_code: countercode,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }))
            );
            setHotels([]);
          } else {
            setCities(citiesData);
            setHotels(hotelsData);
          }
        } catch (error) {
          setIsError(true);
          setErrorMessage(error.message);
          setCities(
            addCitdef.info.map((city) => ({
              id: `city_${city.Code}`,
              city_code: city.Code,
              city_name: city.Name.split(", ")[0],
              country_name: "India",
              country_code: countercode,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }))
          );
          setHotels([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        // When input is empty, show default cities
        setCities(
          addCitdef.info.map((city) => ({
            id: `city_${city.Code}`,
            city_code: city.Code,
            city_name: city.Name.split(", ")[0],
            country_name: "India",
            country_code: countercode,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }))
        );
        setHotels([]);
      }
    }, 400);
  };

  // Handle selection
  const handleSelect = (item) => {
    onSelect(item);
    const displayName =
      item.hotel_name ||
      item.city_name ||
      item.Name?.split(", ")[0] ||
      "Unknown City";
    setInputValue(displayName);
    localStorage.setItem("selectedLocation", JSON.stringify(item));
    visible("");
  };

  // Check if the search term is a city name
  const isCitySearch = (searchValue) => {
    const searchLower = searchValue.toLowerCase().trim();
    return addCitdef.info.some(
      (city) =>
        city.Name.toLowerCase().includes(searchLower) ||
        searchLower.includes(city.Name.toLowerCase().split(", ")[0])
    );
  };

  // Combine and format results
  const getDisplayedItems = () => {
    if (isLoading) return [];
    if (isError && cities.length === 0 && hotels.length === 0) return [];

    // Prioritize cities, then hotels (limited to 5 per city)
    const result = [...cities];
    const groupedHotels = hotels.reduce((acc, item) => {
      const city = item.city_name || "Unknown City";
      if (!acc[city]) acc[city] = [];
      acc[city].push(item);
      return acc;
    }, {});

    Object.values(groupedHotels).forEach((hotelsInCity) => {
      result.push(...hotelsInCity.slice(0, 5));
    });

    return result;
  };

  // Format display name
  const getDisplayName = (item) => {
    if (item.city_name && !item.hotel_name) {
      const [city, state] = (item.city_name || "").split(", ").map((s) =>
        s.trim()
      );
      return `${city || item.city_name}, City in ${
        city || item.city_name
      }, ${state || item.country_name || "India"}`;
    } else if (item.hotel_name) {
      const [city, state] = (item.city_name || "").split(", ").map((s) =>
        s.trim()
      );
      return `${item.hotel_name}, Hotel in ${city || item.city_name}, ${
        state || item.country_name || "India"
      }`;
    } else {
      const [city, state] = (item.Name || "").split(", ").map((s) => s.trim());
      return `${city || "Unknown City"}, City in ${city || "Unknown City"}, ${
        state || "India"
      }`;
    }
  };

  const displayedItems = getDisplayedItems();

  return (
    <div className="relative w-full z-[10] max-w-[36rem] mx-auto">
      <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
        <img
          src="/images/icon-search.svg"
          alt="Search"
          className="w-5 h-5 text-gray-500"
        />
        <input
          id="a_FromSector_show"
          type="text"
          className="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          placeholder="Search hotels or cities..."
          autoComplete="off"
          value={inputValue}
          autoFocus
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </div>

      <div className="absolute w-full mt-1 max-h-80 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-100 z-10">
        {displayedItems.length > 0 && (
          <div className="bg-blue-50 py-2 px-4 text-sm font-semibold text-blue-800">
            {isCitySearch(inputValue) ? "Cities and Top Hotels" : "Search Results"}
          </div>
        )}

        <ul className="divide-y divide-gray-100">
          {isLoading ? (
            [...Array(4)].map((_, index) => (
              <li
                key={index}
                className="flex items-center gap-3 px-4 py-3 animate-pulse"
              >
                <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </li>
            ))
          ) : displayedItems.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500 text-center">
              No results found
            </li>
          ) : (
            displayedItems.map((item) => (
              <li
                key={item.id || item.Code}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all duration-150 ${
                  !item.hotel_name ? "bg-blue-100 font-semibold" : ""
                }`}
                onClick={() => handleSelect(item)}
              >
                <FaLocationDot className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getDisplayName(item).split(", ")[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getDisplayName(item).split(", ")[1]}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AutoSearch;