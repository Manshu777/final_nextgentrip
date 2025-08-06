import React, { useState, useEffect, useRef } from "react";
import {
  FaPlane,
  FaMoneyBillWave,
  FaSun,
  FaMoon,
  FaPlaneDeparture,
  FaFilter,
} from "react-icons/fa";

const FlightFilter = ({ airlines, flights, handelFilter, handelnonstop }) => {
  const [filters, setFilters] = useState({
    nonStop: false,
    refundableFares: false,
    indiGo: false,
    morningDepartures: false,
  });

  const [flightQuality, setFlightQuality] = useState({
    wifi: false,
    redEye: false,
  });

  const [initialMax, setInitialMax] = useState(50000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState();
  const [hasUserChangedPrice, setHasUserChangedPrice] = useState(false);

  const airlinesRef = useRef(null);

  useEffect(() => {
    if (flights && flights.length > 0 && !hasUserChangedPrice) {
      const prices = flights.map(
        (flight) => Number(flight.Fare?.OfferedFare) || 0
      );
      const filteredPrices = prices.filter((p) => p > 0);
      const highest = Math.max(...filteredPrices);
      const safeMax = highest || 50000;

      setInitialMax(safeMax);
      setSelectedMaxPrice(safeMax);
    }
  }, [flights, hasUserChangedPrice]);

  const handlePriceChange = (value) => {
    const cleanedValue =
      parseInt(value.toString().replace(/^0+(?!$)/, ""), 10) || 0;
    setHasUserChangedPrice(true);
    setSelectedMaxPrice(cleanedValue);
    handelFilter(`price:0-${cleanedValue}`);
  };

  const handleQualityChange = (e) => {
    const { name, checked } = e.target;
    setFlightQuality((prev) => ({
      ...prev,
      [name]: checked,
    }));
    handelFilter(`quality:${name}:${checked}`);
  };

  return (
    <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-scroll scroll-smooth scrollbar-hide bg-gradient-to-b from-white to-gray-50 myshadow px-6 py-6 w-full rounded-xl shadow-lg">
      {/* Popular Filters */}
      <div className="mb-6">
        <p className="font-extrabold text-[12px] mt-3 mb-2 text-gray-800 flex items-center">
          <FaFilter className="mr-3 text-blue-500" /> Popular Filters
        </p>
        <div className="flex justify-between w-full mb-2">
          <span className="checkmarkOuter flex items-center">
            <input
              type="radio"
              className="mr-3 h-3 w-3 accent-blue-500"
              name="timeFilter"
              value="Morning"
              onChange={(e) => handelFilter(e.target.value)}
            />
            <label className="font-medium text-[12px] text-gray-700 flex items-center">
              <FaSun className="mr-2 text-yellow-500" /> Morning Departures
            </label>
          </span>
        </div>
        <div className="flex justify-between w-full mb-6">
          <span className="checkmarkOuter flex items-center">
            <input
              type="radio"
              className="mr-3 h-3 w-3 accent-blue-500"
              name="timeFilter"
              value="Evening"
              onChange={(e) => handelFilter(e.target.value)}
            />
            <label className="font-medium text-[12px] text-gray-700 flex items-center">
              <FaMoon className="mr-2 text-purple-500" /> Evening Departures
            </label>
          </span>
        </div>
        <hr />
      </div>

      {/* Stops */}
      <div className="mb-8">
        <p className="font-extrabold text-[12px] mb-2 text-gray-800 flex items-center">
          <FaPlane className="mr-3 text-blue-500" /> Stops
        </p>
        <div className="flex justify-between w-full mb-2">
          <span className="checkmarkOuter flex items-center">
            <input
              type="radio"
              className="mr-3 h-3 w-3 accent-blue-500"
              id="nonstop"
              name="nonstop"
              value="direct"
              onChange={(e) => handelnonstop(e)}
            />
            <label
              htmlFor="nonstop"
              className="font-medium text-[12px] text-gray-700 flex items-center"
            >
              <FaPlane className="mr-2 text-blue-500" /> Non Stop
            </label>
          </span>
        </div>
        <div className="flex justify-between w-full mb-5">
          <span className="checkmarkOuter flex items-center">
            <input
              type="radio"
              className="mr-3 h-3 w-3 accent-blue-500"
              name="nonstop"
              id="1stop"
              value="indirect"
              onChange={(e) => handelnonstop(e)}
            />
            <label
              htmlFor="1stop"
              className="font-medium text-[12px] text-gray-700 flex items-center"
            >
              <FaPlane className="mr-2 text-blue-500" /> 1 Stop
            </label>
          </span>
        </div>
        <hr />
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <p className="font-extrabold text-[12px] mb-3 text-gray-800 flex items-center">
          <FaMoneyBillWave className="mr-3 text-green-500" /> Max Price
        </p>

        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={initialMax * 1.5}
            value={selectedMaxPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 bg-gray-200"
          />
          <div className="flex justify-between mt-2 text-[12px] text-gray-700">
            <span>₹0</span>
            <span>₹{selectedMaxPrice}</span>
          </div>
        </div>

        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={initialMax * 1.5}
          value={Number(selectedMaxPrice)}
          onChange={(e) => handlePriceChange(e.target.value)}
          onBlur={(e) => {
            const cleaned = e.target.value.replace(/^0+(?!$)/, "");
            setSelectedMaxPrice(Number(cleaned));
          }}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 no-spinner"
          placeholder="Enter Max Price"
        />
        <hr className="mt-6" />
      </div>

      {/* Flight Quality */}
      <div className="mb-6 mt-6">
        <p className="font-extrabold text-[12px] mb-3 text-gray-800">Flight Quality</p>

        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="wifi"
            name="wifi"
            checked={flightQuality.wifi}
            onChange={handleQualityChange}
            className="mr-2 h-4 w-4 accent-blue-500 rounded"
          />
          <label htmlFor="wifi" className="text-[13px] text-gray-700">
            Show Wi-Fi flights only
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="redEye"
            name="redEye"
            checked={flightQuality.redEye}
            onChange={handleQualityChange}
            className="mr-2 h-4 w-4 accent-blue-500 rounded"
          />
          <label htmlFor="redEye" className="text-[13px] text-gray-700">
            Show Red-Eyes
          </label>
        </div>

        <hr className="mt-4" />
      </div>

      {/* Airlines */}
      <div className="mb-6" ref={airlinesRef}>
        <p className="font-extrabold text-[12px] mb-3 text-gray-800 flex items-center">
          <FaPlaneDeparture className="mr-3 text-indigo-500" /> Airlines
        </p>
        <div className="flex justify-between w-full mb-2">
          <span className="checkmarkOuter flex items-center">
            <input
              type="radio"
              name="airlines"
              className="mr-3 h-3 w-3 accent-blue-500"
              id="All"
              value="All"
              onChange={(e) => handelFilter(e.target.value)}
            />
            <label
              htmlFor="All"
              className="font-medium text-[12px] text-gray-700 flex items-center"
            >
              <FaPlane className="mr-2 text-blue-500" /> All
            </label>
          </span>
        </div>
        {airlines.length > 0 &&
          airlines.map((info) => (
            <div className="flex justify-between w-full mb-2" key={info}>
              <span className="checkmarkOuter flex items-center">
                <input
                  type="radio"
                  className="mr-3 h-3 w-3 accent-blue-500"
                  id={info}
                  name="airlines"
                  value={info}
                  onChange={(e) => handelFilter(e.target.value)}
                />
                <label
                  htmlFor={info}
                  className="font-medium text-[12px] text-gray-700 flex items-center"
                >
                  <FaPlaneDeparture className="mr-2 text-indigo-500" /> {info}
                </label>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FlightFilter;
