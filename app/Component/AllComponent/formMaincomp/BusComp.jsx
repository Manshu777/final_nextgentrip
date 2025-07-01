"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getBuscityapi } from "../../Store/slices/busSearchSlice";
import { Calendar } from "@nextui-org/react";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import Navbar from "../Navbar";
import TypeWriterHeaderEffect from "../TypeWriterHeaderEffect";

const BusComp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const localTimeZone = "Asia/Kolkata"; // Force IST timezone
  const currentDate = today(localTimeZone);

  // Initialize state from localStorage, URL, or defaults
  const [fromCity, setFromCity] = useState(() => {
    const saved = localStorage.getItem("busSearch");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.fromCity || { CityId: 7485, CityName: "Hyderabad" };
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("OriginId")
      ? { CityId: parseInt(params.get("OriginId")), CityName: "Hyderabad" }
      : { CityId: 7485, CityName: "Hyderabad" };
  });

  const [toCity, setToCity] = useState(() => {
    const saved = localStorage.getItem("busSearch");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.toCity || { CityId: 6395, CityName: "Bangalore" };
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("DestinationId")
      ? { CityId: parseInt(params.get("DestinationId")), CityName: "Bangalore" }
      : { CityId: 6395, CityName: "Bangalore" };
  });

  const [pickupdate, setpickdate] = useState(() => {
    const saved = localStorage.getItem("busSearch");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.pickupdate ? new Date(parsed.pickupdate) : currentDate.toDate(localTimeZone);
    }
    const params = new URLSearchParams(window.location.search);
    const dateFromUrl = params.get("DateOfJourney");
    return dateFromUrl ? new Date(dateFromUrl) : currentDate.toDate(localTimeZone);
  });

  const [calendarValue, setCalendarValue] = useState(() => {
    const dateStr = pickupdate.toISOString().split("T")[0];
    return parseDate(dateStr);
  });

  const [adultCount, setAdultCount] = useState(() => {
    const saved = localStorage.getItem("busSearch");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.travellers?.adultCount || 1;
    }
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("adult")) || 1;
  });

  const [childCount, setChildCount] = useState(() => {
    const saved = localStorage.getItem("busSearch");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.travellers?.childCount || 0;
    }
    return 0;
  });

  const [infantCount, setInfantCount] = useState(() => {
    const saved = localStorage.getItem("busSearch");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.travellers?.infantCount || 0;
    }
    return 0;
  });

  const [selected, setselected] = useState("");
  const [isTravellerDropdownVisible, setIsTravellerDropdownVisible] = useState(false);

  useEffect(() => {
    dispatch(getBuscityapi());
    // Sync calendarValue with pickupdate
    setCalendarValue(parseDate(pickupdate.toISOString().split("T")[0]));
  }, [dispatch, pickupdate]);

  const handleRangeChange = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day);
    setpickdate(date);
    setCalendarValue(newRange);
    setselected("");
  };

  const handelSearch = () => {
    // Format date as YYYY-MM-DD in local timezone
    const year = pickupdate.getFullYear();
    const month = String(pickupdate.getMonth() + 1).padStart(2, "0");
    const day = String(pickupdate.getDate()).padStart(2, "0");
    const newdate = `${year}-${month}-${day}`;

    // Save to localStorage
    localStorage.setItem(
      "busSearch",
      JSON.stringify({
        fromCity,
        toCity,
        pickupdate: newdate,
        travellers: { adultCount },
      })
    );

    // Navigate to search results
    router.push(
      `/buses/DateOfJourney=${newdate}&OriginId=${fromCity.CityId}&DestinationId=${toCity.CityId}&adult=${adultCount}`
    );
  };

  const handelfromcity = (data) => {
    setFromCity(data);
    setselected("to");
  };

  const handeltocity = (data) => {
    setToCity(data);
    setselected("date");
  };

  const TravellerDropdown = ({ adultCount, setAdultCount, childCount, setChildCount, infantCount, setInfantCount }) => {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg absolute top-[80%] min-w-full left-1 md:-left-10 z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-black">Adults</span>
          <div className="flex items-center gap-2">
            <button
              className="px-2 border text-black"
              onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
            >
              -
            </button>
            <span className="px-2 border text-black">{adultCount}</span>
            <button
              className="px-2 border text-black"
              onClick={() => setAdultCount(adultCount + 1)}
            >
              +
            </button>
          </div>
        </div>
       
      </div>
    );
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
          <div className="tabs FromDateDeapt grid lg:grid-cols-5 gap-4">
            {/* From City */}
            <div className="relative">
              <div
                onClick={() => setselected("form")}
                className="cursor-pointer relative rounded gap-3 h-full flex items-center py-1 lg:py-0 px-2 w-full truncate border border-slate-400 text-black"
              >
                <IoLocationSharp className="text-xl" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-black font-bold">
                    {fromCity.CityName}
                  </span>
                </div>
              </div>
              {selected === "form" && (
                <SearchCompnents type={selected} handelcity={handelfromcity} />
              )}
            </div>
            {/* To City */}
            <div className="relative">
              <div
                onClick={() => setselected("to")}
                className="cursor-pointer relative rounded gap-3 h-full flex items-center py-1 lg:py-0 px-2 w-full truncate border border-slate-400 text-black"
              >
                <IoLocationSharp className="text-xl" />
                <div className="flex flex-col">
                  <span className="text-[12px] text-black font-bold">
                    {toCity.CityName}
                  </span>
                </div>
              </div>
              {selected === "to" && (
                <SearchCompnents type={selected} handelcity={handeltocity} />
              )}
            </div>
            {/* Pickup Date */}
            <div className="relative">
              <div
                onClick={() => setselected("date")}
                className="flex items-center cursor-pointer gap-2 px-[5px] py-[12px] border-2 text-black border-[1px] border-slate-400 rounded-md"
              >
                <FaCalendarAlt className="" />
                <div className="text-slate-400">
                  <div className="flex items-baseline text-black">
                    <span className="text-xl py-1 pr-1 text-black font-bold">
                      {pickupdate.getDate()}
                    </span>
                    <span className="text-sm font-semibold">
                      {pickupdate.toLocaleString("en-US", { month: "short" })}
                    </span>
                    <span className="text-sm font-semibold">
                      {pickupdate.getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
              {selected === "date" && (
                <div className="bg-white text-black p-5 shadow-2xl absolute top-full left-0 mt-2 z-10">
                  <Calendar
                    aria-label="Select a date"
                    value={calendarValue}
                    onChange={handleRangeChange}
                    minValue={currentDate}
                  />
                </div>
              )}
            </div>
            {/* Travellers */}
            <div
              className="flex items-start gap-2 px-3 py-1 justify-between md:justify-start text-black border-[1px] border-slate-400 rounded-md relative"
              onMouseLeave={() => setIsTravellerDropdownVisible(false)}
            >
              <div className="text-slate-400">
                <h5 className="font-bold text-lg text-black">{adultCount + childCount + infantCount}</h5>
                <p className="text-slate-400 text-xs">Traveller(s)</p>
              </div>
              <button
                onClick={() => setIsTravellerDropdownVisible(!isTravellerDropdownVisible)}
                className="text-black"
              >
                Edit
              </button>
              {isTravellerDropdownVisible && (
                <TravellerDropdown
                  adultCount={adultCount}
                  setAdultCount={setAdultCount}
                  childCount={childCount}
                  setChildCount={setChildCount}
                  infantCount={infantCount}
                  setInfantCount={setInfantCount}
                />
              )}
            </div>
            {/* Search Button */}
            <div className="flex justify-center items-center">
              <button
                onClick={handelSearch}
                className="bg-[#0A5EB0] w-full md:w-fit py-2 px-3 text-nowrap font-semibold text-lg rounded-md text-white"
              >
                Search Bus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusComp;

const SearchCompnents = ({ handelcity }) => {
  const [searchparam, setsearchparam] = useState("");
  const dispatch = useDispatch();
  const { info, isLoading } = useSelector((state) => state.busCityslice);

  useEffect(() => {
    dispatch(getBuscityapi({ limit: 100, offset: 0, search: searchparam }));
  }, [dispatch, searchparam]);

  return (
    <div className="absolute top-[53%] bg-white w-full z-30 shadow-md rounded-md mt-1">
      <input
        type="text"
        value={searchparam}
        className="w-full text-black px-3 py-2 border-b outline-none"
        placeholder="Search city..."
        onChange={(e) => setsearchparam(e.target.value)}
      />
      <div className="max-h-60 overflow-y-scroll custom-scroll">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="p-2 border-b animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))
        ) : (
          info?.BusCities?.map((item) => (
            <p
              key={item.CityId}
              className="border-b px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 transition-all"
              onClick={() =>
                handelcity({
                  CityId: item.CityId,
                  CityName: item.CityName,
                })
              }
            >
              {item.CityName}
            </p>
          ))
        )}
      </div>
    </div>
  );
};