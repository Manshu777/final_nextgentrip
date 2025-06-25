"use client";
import React, { useState, useMemo } from "react";
import { TbAirConditioning, TbAirConditioningDisabled } from "react-icons/tb";
import { GiNightSleep } from "react-icons/gi";
import { MdEventSeat } from "react-icons/md";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";

const BusFilter = ({ busData, onFilterChange }) => {
  const [openDropdowns, setOpenDropdowns] = useState({
    boardingPoints: false,
    droppingPoints: false,
    busOperators: false,
  });

  const [filters, setFilters] = useState({
    acType: null, // "ac" or "nonac"
    seatType: null, // "sleeper" or "seater"
    boardingPoints: [],
    droppingPoints: [],
    busOperators: [],
    priceRange: { min: null, max: null },
    departureTimeSlots: [],
    minSeats: null,
    mTicket: false,
    liveTracking: false,
  });

  const [searchTerms, setSearchTerms] = useState({
    boardingPoints: "",
    droppingPoints: "",
    busOperators: "",
  });

  // Extract filter options from busData
  const { boardingPoints, droppingPoints, busOperators, priceBounds } = useMemo(() => {
    const boardingSet = new Set();
    const droppingSet = new Set();
    const operatorSet = new Set();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    if (Array.isArray(busData)) {
      busData?.forEach((bus) => {
        bus.BoardingPointsDetails?.forEach((point) => {
          if (point.CityPointName) boardingSet.add(point.CityPointName);
        });
        bus.DroppingPointsDetails?.forEach((point) => {
          if (point.CityPointName) droppingSet.add(point.CityPointName);
        });
        if (bus.TravelName) operatorSet.add(bus.TravelName);
        if (bus.BusPrice?.OfferedPrice) {
          minPrice = Math.min(minPrice, bus.BusPrice.OfferedPrice);
          maxPrice = Math.max(maxPrice, bus.BusPrice.OfferedPrice);
        }
      });
    }

    return {
      boardingPoints: Array.from(boardingSet).sort(),
      droppingPoints: Array.from(droppingSet).sort(),
      busOperators: Array.from(operatorSet).sort(),
      priceBounds: { min: Math.floor(minPrice), max: Math.ceil(maxPrice) },
    };
  }, [busData]);

  // Define departure time slots
  const timeSlots = [
    { label: "Before 6 AM", range: [0, 6] },
    { label: "6 AM - 12 PM", range: [6, 12] },
    { label: "12 PM - 6 PM", range: [12, 18] },
    { label: "After 6 PM", range: [18, 24] },
  ];

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelect = (category, value) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [category]: prev[category] === value ? null : value,
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const currentValues = prev[category];
      let newValues;
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((item) => item !== value);
      } else {
        newValues = [...currentValues, value];
      }
      const newFilters = { ...prev, [category]: newValues };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (field, value) => {
    setFilters((prev) => {
      const newPriceRange = { ...prev.priceRange, [field]: value ? parseInt(value) : null };
      const newFilters = { ...prev, priceRange: newPriceRange };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleMinSeatsChange = (value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, minSeats: value ? parseInt(value) : null };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleToggle = (category) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [category]: !prev[category] };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSearchChange = (category, value) => {
    setSearchTerms((prev) => ({ ...prev, [category]: value }));
  };

  const clearFilters = () => {
    const newFilters = {
      acType: null,
      seatType: null,
      boardingPoints: [],
      droppingPoints: [],
      busOperators: [],
      priceRange: { min: null, max: null },
      departureTimeSlots: [],
      minSeats: null,
      mTicket: false,
      liveTracking: false,
    };
    setFilters(newFilters);
    setSearchTerms({ boardingPoints: "", droppingPoints: "", busOperators: "" });
    onFilterChange(newFilters);
  };

  const isSelected = (category, value) => filters[category] === value;

  const filteredBoardingPoints = boardingPoints.filter((point) =>
    point.toLowerCase().includes(searchTerms.boardingPoints.toLowerCase())
  );
  const filteredDroppingPoints = droppingPoints.filter((point) =>
    point.toLowerCase().includes(searchTerms.droppingPoints.toLowerCase())
  );
  const filteredBusOperators = busOperators.filter((operator) =>
    operator.toLowerCase().includes(searchTerms.busOperators.toLowerCase())
  );

  return (
    <div className="bg-white shadow-md rounded-md p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <button
          className="text-sm text-gray-500 font-semibold hover:underline"
          onClick={clearFilters}
          aria-label="Clear all filters"
        >
          CLEAR ALL
        </button>
      </div>

      <ul className="space-y-6">
        {/* AC Type */}
        <li>
          <h4 className="text-gray-700 font-medium mb-2">AC Type</h4>
          <div className="flex gap-3">
            <div
              onClick={() => handleSelect("acType", "ac")}
              className={`w-full border rounded-md p-3 cursor-pointer flex items-center justify-center gap-2 ${
                isSelected("acType", "ac") ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <TbAirConditioning className="text-xl" />
              <span className="text-sm">AC</span>
            </div>
            <div
              onClick={() => handleSelect("acType", "nonac")}
              className={`w-full border rounded-md p-3 cursor-pointer flex items-center justify-center gap-2 ${
                isSelected("acType", "nonac") ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <TbAirConditioningDisabled className="text-xl" />
              <span className="text-sm">Non AC</span>
            </div>
          </div>
        </li>

        {/* Seat Type */}
        <li>
          <h4 className="text-gray-700 font-medium mb-2">Seat Type</h4>
          <div className="flex gap-3">
            <div
              className={`w-full border rounded-md p-3 cursor-pointer flex items-center justify-center gap-2 ${
                isSelected("seatType", "sleeper") ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => handleSelect("seatType", "sleeper")}
            >
              <GiNightSleep className="text-xl" />
              <span className="text-sm">Sleeper</span>
            </div>
            <div
              className={`w-full border rounded-md p-3 cursor-pointer flex items-center justify-center gap-2 ${
                isSelected("seatType", "seater") ? "border-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => handleSelect("seatType", "seater")}
            >
              <MdEventSeat className="text-xl" />
              <span className="text-sm">Seater</span>
            </div>
          </div>
        </li>

        {/* Bus Operators */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleDropdown("busOperators")}
          >
            <h4 className="text-gray-700 font-medium">Bus Operators</h4>
            <span className="text-gray-400">
              {openDropdowns?.busOperators ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {openDropdowns.busOperators && (
            <>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search Operators"
                  className="w-full border p-2 pr-10 text-sm rounded-md"
                  value={searchTerms?.busOperators}
                  onChange={(e) => handleSearchChange("busOperators", e.target.value)}
                />
                <FaSearch className="absolute top-3 right-3 text-gray-400" />
              </div>
              <ul className="max-h-40 overflow-y-auto">
                {filteredBusOperators?.length > 0 ? (
                  filteredBusOperators?.map((operator) => (
                    <li
                      key={operator}
                      className="flex items-center justify-between text-sm mb-2"
                    >
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters?.busOperators.includes(operator)}
                          onChange={() => handleCheckboxChange("busOperators", operator)}
                        />
                        <span>{operator}</span>
                      </label>
                      <span className="text-gray-500">
                        (
                        {
                          busData?.filter((bus) => bus.TravelName === operator).length
                        }
                        )
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-600">No operators found</li>
                )}
              </ul>
            </>
          )}
        </li>

        {/* Price Range */}
        <li>
          <h4 className="text-gray-700 font-medium mb-2">Price Range (₹)</h4>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder={`Min (${priceBounds.min})`}
              className="w-1/2 border p-2 text-sm rounded-md"
              value={filters?.priceRange.min || ""}
              onChange={(e) => handlePriceChange("min", e.target.value)}
            />
            <input
              type="number"
              placeholder={`Max (${priceBounds.max})`}
              className="w-1/2 border p-2 text-sm rounded-md"
              value={filters?.priceRange.max || ""}
              onChange={(e) => handlePriceChange("max", e.target.value)}
            />
          </div>
        </li>

        {/* Departure Time Slots */}
        <li>
          <h4 className="text-gray-700 font-medium mb-2">Departure Time</h4>
          <ul className="space-y-2">
            {timeSlots?.map((slot) => (
              <li key={slot.label} className="flex items-center gap-2 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters?.departureTimeSlots.includes(slot.label)}
                    onChange={() => handleCheckboxChange("departureTimeSlots", slot.label)}
                  />
                  <span>{slot.label}</span>
                </label>
                <span className="text-gray-500">
                  (
                  {
                    busData?.filter((bus) => {
                      const hour = new Date(bus.DepartureTime).getHours();
                      return hour >= slot.range[0] && hour < slot.range[1];
                    }).length
                  }
                  )
                </span>
              </li>
            ))}
          </ul>
        </li>

        {/* Minimum Available Seats */}
        <li>
          <h4 className="text-gray-700 font-medium mb-2">Minimum Available Seats</h4>
          <input
            type="number"
            placeholder="Enter number of seats"
            className="w-full border p-2 text-sm rounded-md"
            value={filters?.minSeats || ""}
            onChange={(e) => handleMinSeatsChange(e.target.value)}
          />
        </li>

        {/* Mobile Ticket */}
        <li>
          <h4 className="text-gray-700 font-medium mb-2">Mobile Ticket</h4>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters?.mTicket}
              onChange={() => handleToggle("mTicket")}
            />
            <span>Show only buses with mobile tickets</span>
          </label>
        </li>

        {/* Live Tracking */}
        <li>
          <h4 className="text-gray-700 font-medium mb-2">Live Tracking</h4>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters?.liveTracking}
              onChange={() => handleToggle("liveTracking")}
            />
            <span>Show only buses with live tracking</span>
          </label>
        </li>

        {/* Boarding Points */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleDropdown("boardingPoints")}
          >
            <h4 className="text-gray-700 font-medium">Boarding Points</h4>
            <span className="text-gray-400">
              {openDropdowns.boardingPoints ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {openDropdowns.boardingPoints && (
            <>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full border p-2 pr-10 text-sm rounded-md"
                  value={searchTerms.boardingPoints}
                  onChange={(e) => handleSearchChange("boardingPoints", e.target.value)}
                />
                <FaSearch className="absolute top-3 right-3 text-gray-400" />
              </div>
              <ul className="max-h-40 overflow-y-auto">
                {filteredBoardingPoints.length > 0 ? (
                  filteredBoardingPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-center justify-between text-sm mb-2"
                    >
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters?.boardingPoints.includes(point)}
                          onChange={() => handleCheckboxChange("boardingPoints", point)}
                        />
                        <span>{point}</span>
                      </label>
                      <span className="text-gray-500">
                        (
                        {
                          busData?.filter((bus) =>
                            bus.BoardingPointsDetails.some((p) => p.CityPointName === point)
                          ).length
                        }
                        )
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-600">No boarding points found</li>
                )}
              </ul>
            </>
          )}
        </li>

        {/* Dropping Points */}
        <li>
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleDropdown("droppingPoints")}
          >
            <h4 className="text-gray-700 font-medium">Dropping Points</h4>
            <span className="text-gray-400">
              {openDropdowns.droppingPoints ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {openDropdowns.droppingPoints && (
            <>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full border p-2 pr-10 text-sm rounded-md"
                  value={searchTerms.droppingPoints}
                  onChange={(e) => handleSearchChange("droppingPoints", e.target.value)}
                />
                <FaSearch className="absolute top-3 right-3 text-gray-400" />
              </div>
              <ul className="max-h-40 overflow-y-auto">
                {filteredDroppingPoints.length > 0 ? (
                  filteredDroppingPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-center justify-between text-sm mb-2"
                    >
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters?.droppingPoints.includes(point)}
                          onChange={() => handleCheckboxChange("droppingPoints", point)}
                        />
                        <span>{point}</span>
                      </label>
                      <span className="text-gray-500">
                        (
                        {
                          busData?.filter((bus) =>
                            bus.DroppingPointsDetails.some((p) => p.CityPointName === point)
                          ).length
                        }
                        )
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-600">No dropping points found</li>
                )}
              </ul>
            </>
          )}
        </li>
      </ul>
    </div>
  );
};

export default BusFilter;