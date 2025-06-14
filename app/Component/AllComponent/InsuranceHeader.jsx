"use client";

import Navbar from "./Navbar";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function InsuranceHeader() {
  const navigation = useRouter();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const planCategories = [
    { id: 1, title: "Domestic Travel Policy" },
    { id: 2, title: "Overseas Travel Insurance" },
    { id: 3, title: "Student Overseas Insurance" },
    { id: 4, title: "Schengen Overseas Insurance" },
    { id: 5, title: "Inbound Travel Policy" },
    { id: 6, title: "Cancellation Insurance" },
  ];

  const planCoverage = [
    { id: 1, name: "US" },
    { id: 2, name: "Non US" },
    { id: 3, name: "World Wide" },
    { id: 4, name: "India" },
    { id: 5, name: "Asia" },
    { id: 6, name: "Canada" },
    { id: 7, name: "Australia" },
  ];

  const planTypes = [
    { id: "1", name: "Single Trip" },
    { id: "2", name: "Annual Multi-Trip" },
  ];

  const [isOpen, setIsOpen] = useState(null);
  const [alldata, setAllData] = useState({
    Plan_Category: planCategories[0],
    Plan_Coverage: planCoverage[0],
    Plan_Type: planTypes[0].id,
    TravelStartDate: "",
    TravelEndDate: "",
    NoOfPax: 1,
    PaxAge: [],
  });

  const DropDownHandler = (auth) => {
    setIsOpen((prevVal) => (prevVal === auth ? null : auth));
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("insuranceData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAllData({
        ...parsedData,
        Plan_Category: planCategories.find(cat => cat.id === parsedData.Plan_Category.id) || planCategories[0],
        Plan_Coverage: planCoverage.find(cov => cov.id === parsedData.Plan_Coverage.id) || planCoverage[0],
        Plan_Type: parsedData.Plan_Type || planTypes[0].id,
      });
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("insuranceData", JSON.stringify(alldata));
  }, [alldata]);

  const handlePaxChange = (increment) => {
    const newNoOfPax = Math.max(1, alldata.NoOfPax + (increment ? 1 : -1));
    const updatedPaxAge = increment
      ? [...alldata.PaxAge, ""]
      : alldata.PaxAge.slice(0, -1);
    setAllData({
      ...alldata,
      NoOfPax: newNoOfPax,
      PaxAge: updatedPaxAge,
    });
  };

  const handleAgeChange = (index, age) => {
    const updatedAges = [...alldata.PaxAge];
    updatedAges[index] = age;
    setAllData({ ...alldata, PaxAge: updatedAges });
  };

  const handelIncSearch = () => {
    setIsLoading(true); // Show loader
    setTimeout(() => {  // Simulate async operation
      navigation.push(
        `/Insurance/plancategory=${alldata.Plan_Category.id}&plancoverage=${alldata.Plan_Coverage.id}&plantype=${alldata.Plan_Type}&travelstartdate=${encodeURIComponent(alldata.TravelStartDate)}&travelenddate=${encodeURIComponent(alldata.TravelEndDate)}&noofpax=${alldata.NoOfPax}&paxage=${encodeURIComponent(alldata.PaxAge.join(","))}`
      );
      setIsLoading(false); // Hide loader after navigation
    }, 1000); // Adjust delay as needed
  };

  return (
    <>
      <div className="relative px-5 md:px-16 xl:px-32 pt-10">
        <div className="bg-gradient-to-r from-[#002043] to-[#004080] h-[6rem] absolute inset-0 -z-10" />
        <div className="InsuranceHeader shadow-2xl bg-white rounded-md">
          <div className="bg-gray-200 border-b rounded-sm shadow">
            <Navbar />
          </div>


          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center lg:grid-cols-4 xl:grid-cols-7 gap-6">

              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Travel Start Date</label>
                <input
                  type="date"
                  value={alldata.TravelStartDate}
                  onChange={(e) => setAllData({ ...alldata, TravelStartDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                />
              </div>

              {/* 2. Travel End Date */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Travel End Date</label>
                <input
                  type="date"
                  value={alldata.TravelEndDate}
                  onChange={(e) => setAllData({ ...alldata, TravelEndDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                />
              </div>

              {/* 3. No. of Passengers */}
              <div className="col-span-1 relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">No. of Passengers</label>
                <div
                  className="flex justify-between items-center p-2 border border-gray-300 rounded-md hover:border-blue-500 bg-white cursor-pointer"
                  onMouseEnter={() => setIsVisible(true)}
                >
                  <div>
                    <p className="text-lg font-bold text-black">{alldata.NoOfPax}</p>
                    {/* <p className="text-xs text-gray-500">Traveller(s)</p> */}
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                </div>

                {/* Popover (optional dropdown) */}



                {isVisible && ( // Only show when isVisible is true
                  <div
                   onMouseLeave={()=>setIsVisible(false)}
                    className="absolute top-full left-0 z-50 mt-2 w-[300px] bg-white border border-gray-200 rounded-xl shadow-2xl p-5 transition-all duration-300"
                  >
                    {/* Passenger Count Control */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-semibold text-gray-700">Adult Count</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePaxChange(false)}
                          disabled={alldata.NoOfPax <= 1}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-red-100 disabled:opacity-50 transition"
                        >
                          <span className="text-lg font-bold text-red-500">-</span>
                        </button>
                        <span className="px-4 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-800 font-medium min-w-[40px] text-center">
                          {alldata.NoOfPax}
                        </span>
                        <button
                          onClick={() => handlePaxChange(true)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-green-100 transition"
                        >
                          <span className="text-lg font-bold text-green-600">+</span>
                        </button>
                      </div>
                    </div>

                    {/* Passenger Ages */}
                    <div className="grid grid-cols-1 gap-3">
                      {Array.from({ length: alldata.NoOfPax }).map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 whitespace-nowrap">Passenger {index + 1} Age:</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={alldata.PaxAge[index] || ""}
                            onChange={(e) => handleAgeChange(index, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}




              </div>

              {/* 4. Plan Category */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Plan Category</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                  value={alldata.Plan_Category.id}
                  onChange={(e) => {
                    const selectedCategory = planCategories.find((cat) => cat.id == e.target.value);
                    let updatedCoverage = alldata.Plan_Coverage;
                    if (selectedCategory.id === 2) {
                      updatedCoverage = planCoverage.find((cov) => cov.id === 3);
                    }
                    setAllData({
                      ...alldata,
                      Plan_Category: selectedCategory,
                      Plan_Coverage: updatedCoverage,
                    });
                  }}
                >
                  {planCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Plan Coverage */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Plan Coverage</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                  value={alldata.Plan_Coverage.id}
                  onChange={(e) =>
                    setAllData({
                      ...alldata,
                      Plan_Coverage: planCoverage.find((cov) => cov.id == e.target.value),
                    })
                  }
                >
                  {planCoverage.map((coverage) => (
                    <option key={coverage.id} value={coverage.id}>
                      {coverage.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Plan Type */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Plan Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                  value={alldata.Plan_Type}
                  onChange={(e) => setAllData({ ...alldata, Plan_Type: e.target.value })}
                >
                  {planTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Submit Button */}
              <div className="col-span-1 flex items-end justify-end">
                <button
                  className="w-full bg-[#0c3a48] mt-[14px] hover:bg-[#0a2e39] text-white px-4 py-2 rounded-md font-semibold transition"
                  onClick={handelIncSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        />
                      </svg>
                      Loading...
                    </div>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>
          </div>





        </div>
      </div>
    </>
  );
}