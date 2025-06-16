"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getCountriesApi } from "../Store/slices/getCountriesApi";
import { Calendar } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
// import { getEsimPlans } from "../../Store/slices/esimSlice";

import { getEsimplansApi } from "../Store/slices/getEsimplans";

import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { FaCalendarWeek, FaCalendarAlt, FaUserLarge } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import TypeWriterHeaderEffect from "./TypeWriterHeaderEffect";


const ESimComp = () => {
  const [selected, setSelected] = useState("");
  const defaultStore = JSON.parse(localStorage.getItem("esimSearch"));



  const [isVisible, setIsVisible] = useState(false);
  const [travelerCount, setTravelerCount] = useState(1);
  const [country, setCountry] = useState(
    (defaultStore && defaultStore.country) || {
      CountryId: "US",
      CountryName: "United States",
    }
  );
  const localTimeZone = getLocalTimeZone();
  const currentDate = today(localTimeZone);
  const [activationDate, setActivationDate] = useState(
    (defaultStore && new Date(defaultStore.activationDate)) || new Date(Date.now())
  );



  const router = useRouter();
  const dispatch = useDispatch();

  const handleRangeChange = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day + 1);
    setActivationDate(date);
    setSelected("");
  };


  const handleSearch = () => {
    localStorage.setItem(
      "esimSearch",
      JSON.stringify({ country, activationDate })
    );
    const newDate = activationDate.toISOString().split("T")[0];
    router.push(
      `/esim/CountryId=${country.CountryId}&ActivationDate=${newDate}&travelers=${travelerCount}`
    );
  };

  useEffect(() => {

    dispatch(getCountriesApi());

    dispatch(getEsimplansApi());


  }, [dispatch]);

  const handleCountrySelect = (data) => {
    setCountry(data);
    setSelected("date");
  };

  const TravelerDropdown = ({ travelerCount, setTravelerCount }) => {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg">
        <div className="flex justify-between items-center">
          <span>Travelers</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
            >
              -
            </button>
            <span>{travelerCount}</span>
            <button onClick={() => setTravelerCount(travelerCount + 1)}>+</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="header relative md:px-5  lg:px-12 xl:px-24 pt-10 md:pt-14">
        <div className="bg-[#002043] h-[12rem] absolute inset-0 -z-10"></div>
        <TypeWriterHeaderEffect text="Find the Best eSIM Plans for Your Trip" />
        <div className="flex flex-col bg-white lg:block rounded-lg text-white">
          <div className="bg-gray-200 rounded-sm shadow">
            <Navbar />
          </div>
          {/* <div className="px-4 border-b-2 shadow-sm space-y-1 py-3">
            <div className="tabs grid lg:grid-cols-4 gap-4">
              <div className="relative">
                <div
                  onClick={() => setSelected("country")}
                  className="cursor-pointer relative rounded gap-3 h-full flex items-center py-1 lg:py-0 px-2 w-full truncate border border-slate-400 text-black"
                >
                  <IoLocationSharp className="text-xl" />
                  <div className="flex flex-col">
                    <span className="text-[12px] text-black font-bold">
                      {country.CountryName}
                    </span>
                  </div>
                </div>
                {selected === "country" && (
                  <SearchComponents
                    type={selected}
                    handleCountry={handleCountrySelect}
                  />
                )}
              </div>
              <div className="relative">
                <div
                  onClick={() => setSelected("date")}
                  className="flex items-center cursor-pointer gap-2 px-3 py-2 border-2 text-black border-slate-200 rounded-md"
                >
                  <FaCalendarAlt className="" />
                  <div className="text-slate-400">
                    <div className="flex items-baseline text-black">
                      <span className="text-xl py-1 pr-1 text-black font-bold">
                        {activationDate.getDate()}
                      </span>
                      <span className="text-sm font-semibold">
                        {activationDate.toLocaleString("en-US", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-sm font-semibold">
                        {activationDate.getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
                {selected === "date" && (
                  <div className="bg-white text-black p-5 shadow-2xl absolute top-full left-0 mt-2 z-10">
                    <Calendar
                      aria-label="Select activation date"
                      value=""
                      onChange={handleRangeChange}
                      minValue={currentDate}
                    />
                  </div>
                )}
              </div>
               <div className="flex items-start w-[150px] gap-2 px-3 py-1 border-2 text-black border-slate-200 rounded-md relative">
            //     <div className="text-slate-400">
            //       <h5 className="font-bold text-lg text-black">{travelerCount}</h5>
            //       <p className="text-slate-400 text-xs">Traveler(s)</p>
            //     </div>
            //     <button
            //       onClick={() => {
            //         setIsVisible(true);
            //         setSelected("count");
            //       }}
            //     >
            //       Edit
            //     </button>
            //     {isVisible && selected === "count" && (
            //       <div className="absolute top-[80%] min-w-full min-h-[10rem] left-1 md:-left-10 z-10">
            //         <TravelerDropdown
            //           travelerCount={travelerCount}
            //           setTravelerCount={setTravelerCount}
            //         />
            //       </div>
            //     )}
           </div>
              <div className="flex justify-center items-center">
                <button
                  onClick={handleSearch}
                  className="bg-[#0A5EB0] w-full md:w-fit py-2 px-3 text-nowrap font-semibold text-lg rounded-md text-white"
                >
                  Search eSIM Plans
                </button>
              </div>
            </div>
          </div> */}
        </div>




      </div>

    </>
  );
};

const SearchComponents = ({ handleCountry }) => {
  const [searchParam, setSearchParam] = useState("");
  const dispatch = useDispatch();
   const { countries, isLoading, error } = useSelector((state) => {

    console.log("esimSearchSlice state:", state.countries);
    return state.countries; 
  });

  console.log('countries',countries)

  useEffect(() => {
    dispatch(getCountriesApi({ search: searchParam }));
  }, [dispatch, searchParam]);

  return (
    <div className="absolute top-[53%] bg-white w-full z-30 shadow-md rounded-md mt-1">
      <input
        type="text"
        value={searchParam}
        className="w-full text-black px-3 py-2 border-b outline-none"
        placeholder="Search country..."
        onChange={(e) => setSearchParam(e.target.value)}
      />
      <div className="max-h-60 overflow-y-scroll custom-scroll">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-2 border-b animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          countries?.map((item) => (
            <p
              key={item.CountryId}
              className="border-b px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 transition-all"
              onClick={() =>
                handleCountry({
                  CountryId: item.CountryId,
                  CountryName: item.CountryName,
                })
              }
            >
              {item}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default ESimComp;