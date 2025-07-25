"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaCalendarWeek, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import AutoSearch from "./AutoSearch";
import TravellerDropdown from "./TravellerDropdown";
import Link from "next/link";
import "react-day-picker/style.css";
import { useDispatch, useSelector } from "react-redux";
import { getTopAirPorts } from "../Store/slices/topPortsSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { today, getLocalTimeZone } from "@internationalized/date";
import { getip } from "../Store/slices/ipslice";
import { toast, Bounce } from "react-toastify";
import { useTranslations } from "next-intl";
import Navbar from "./Navbar";
import { IoIosArrowDown, IoIosCheckmark } from "react-icons/io";
import { getCalendarFare } from "../Store/slices/calenderData";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IoLocationSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaArrowRightLong, FaUserLarge } from "react-icons/fa6";
import TypeWriterHeaderEffect from "../AllComponent/TypeWriterHeaderEffect";
import MiniNav from "../AllComponent/MiniNav";

const Header = () => {
  const dispatch = useDispatch();
  const localTimeZone = getLocalTimeZone();
  const [currentDateComponents, setCurrentDateComponents] = useState({});
  const currentDate = today(localTimeZone);
  const [futureDateComponents, setFutureDateComponents] = useState({});
  const [selected, setSelected] = useState(new Date());
  const [selectedReturn, setSelectedReturn] = useState();
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [isGroup, setIsGroup] = useState(false);
  const [selectedClass, setSelectedClass] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const ipstate = useSelector((state) => state.ipslice);
  const route = useRouter();
  const searchParams = useSearchParams();
  const [fromCity, setFromCity] = useState({
    id: 26555,
    ident: "VIDP",
    type: "large_airport",
    name: "Indira Gandhi International Airport",
    latitude_deg: "28.55563",
    longitude_deg: "77.09519",
    elevation_ft: "777",
    continent: "AS",
    iso_country: "IN",
    iso_region: "IN-DL",
    city: "New Delhi",
    scheduled_service: "yes",
    gps_code: "VIDP",
    iata: "DEL",
    local_code: "",
    home_link: "http://www.newdelhiairport.in/",
    wikipedia_link: "https://en.wikipedia.org/wiki/Indira_Gandhi_International_Airport",
    keywords: "Palam Air Force Station",
  });
  const [toCity, setToCity] = useState({
    id: 26434,
    ident: "VABB",
    type: "large_airport",
    name: "Chhatrapati Shivaji International Airport",
    latitude_deg: "19.0886993408",
    longitude_deg: "72.8678970337",
    elevation_ft: "39",
    continent: "AS",
    iso_country: "IN",
    iso_region: "IN-MM",
    city: "Mumbai",
    scheduled_service: "yes",
    gps_code: "VABB",
    iata: "BOM",
    local_code: "",
    home_link: "http://www.csia.in/",
    wikipedia_link: "https://en.wikipedia.org/wiki/Chhatrapati_Shivaji_International_Airport",
    keywords: "Bombay, Sahar International Airport",
  });
  const [JourneyType, setjurnytype] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [preferredAirline, setPreferredAirline] = useState(null);
  const t = useTranslations("Navbar2");
  const [displayDate, setDisplayDate] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getCurrentDateTime = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = `0${today.getDate()}`.slice(-2);
    return `${year}-${month}-${day}T00:00:00`;
  };

  const [dateOfJourney, setDateOfJourney] = useState(getCurrentDateTime());

  const handleDateChange = (date) => {
    setSelected(date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}T00:00:00`;
    setDateOfJourney(formattedDate);
    setDisplayDate(formattedDate);
    setIsVisible(false);
  };

  const handleReturnDateChange = (date) => {
    setSelectedReturn(date);
    setIsVisible(false);
  };

  const handleTabClick = (tabIndex) => {
    setjurnytype(tabIndex);
  };

  useEffect(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    setFutureDateComponents({
      day: futureDate.getDate(),
      month: futureDate.getMonth(),
      year: futureDate.getFullYear(),
    });
  }, []);

  useEffect(() => {
    const today = new Date();
    setCurrentDateComponents({
      day: today.getDate(),
      month: today.toLocaleString("default", { month: "long" }),
      year: today.getFullYear(),
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getedate = localStorage.getItem("defaultflight");
      if (getedate) {
        try {
          const parsedData = JSON.parse(getedate);
          const parsedDate = parsedData.timeDate;
          const parsedDate2 = parsedData.retuntime;
          const storedDate = new Date(parsedDate);
          const storedDate2 = new Date(parsedDate2);
          if (!isNaN(storedDate)) {
            setSelected(storedDate);
            const formattedDate = `${storedDate.getFullYear()}-${String(storedDate.getMonth() + 1).padStart(2, "0")}-${String(
              storedDate.getDate()
            ).padStart(2, "0")}T00:00:00`;
            setDateOfJourney(formattedDate);
            setDisplayDate(formattedDate);
          } else {
            setSelected(new Date());
            setDateOfJourney(getCurrentDateTime());
            setDisplayDate(getCurrentDateTime());
          }
          if (!isNaN(storedDate2)) {
            setSelectedReturn(storedDate2);
          }
        } catch (error) {
          setSelected(new Date());
          setDateOfJourney(getCurrentDateTime());
          setDisplayDate(getCurrentDateTime());
        }
      } else {
        setSelected(new Date());
        setDateOfJourney(getCurrentDateTime());
        setDisplayDate(getCurrentDateTime());
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFlight = localStorage.getItem("defaultflight");
      if (storedFlight) {
        try {
          const flightData = JSON.parse(storedFlight);
          if (flightData?.from) setFromCity(flightData.from);
          if (flightData?.to) setToCity(flightData.to);
          if (flightData?.journytype) setjurnytype(flightData.journytype);
        } catch (error) {}
      }
    }
  }, []);

  const handleCitySelect = (city) => {
    if (selectedOption === "from") {
      setFromCity(city);
    } else if (selectedOption === "to") {
      setToCity(city);
    }
    setIsVisible(false);
  };

  const handleVisibilityChange = (value) => {
    setIsVisible(value);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(getTopAirPorts());
    dispatch(getip());
  }, []);

  const handleClick = (option) => {
    setSelectedOption(option);
    setIsVisible(true);
  };

  const handelSearch = () => {
    if (!selected) {
      toast.warn("Please select a departure date", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    const date = new Date(selected);
    const localFormattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}T00:00:00`;

    localStorage.setItem(
      "defaultflight",
      JSON.stringify({
        from: fromCity,
        to: toCity,
        timeDate: localFormattedDate,
        retuntime: selectedReturn ? selectedReturn.toISOString() : null,
        journytype: JourneyType,
      })
    );

    let searchUrl;
    if (JourneyType === 1) {
      searchUrl = `/flightto=${fromCity.iata}&from=${toCity.iata}&date=${localFormattedDate}&prfdate=${localFormattedDate}&JourneyType=${JourneyType}&adultcount=${adultCount}&childCount=${childCount}&infantCount=${infantCount}&selectedClass=${selectedClass}&PreferredAirlines=${preferredAirline || ''}`;
    } else if (JourneyType === 2) {
      if (!selectedReturn) {
        toast.warn("Select Return Date", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }
      const returnDate = new Date(selectedReturn);
      const returnFormattedDate = `${returnDate.getFullYear()}-${String(
        returnDate.getMonth() + 1
      ).padStart(2, "0")}-${String(returnDate.getDate()).padStart(2, "0")}T00:00:00`;
      searchUrl = `/flightto=${fromCity.iata}&from=${toCity.iata}&date=${localFormattedDate}&prfdate=${localFormattedDate}&JourneyType=${JourneyType}&adultcount=${adultCount}&childCount=${childCount}&infantCount=${infantCount}&selectedClass=${selectedClass}&returndate=${returnFormattedDate}&PreferredAirlines=${preferredAirline || ''}`;
    }

    setDisplayDate(localFormattedDate);
    route.push(searchUrl);
  };

  const handleRangeChange = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day);
    setSelected(date);
    handleClick("");
  };

  const handelreturn = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day);
    setSelectedReturn(date);
    handleClick("");
  };

  const [dropdowns, setDropdowns] = useState({
    coach: {
      isOpen: false,
      selected: "Coach",
      data: ["Coach", "Premium Economy", "Business", "First"],
    },
    cheapFlight: {
      isOpen: false,
      selected: "Cheap Flights",
      data: [
        { name: "AirAsia", code: "AK" },
        { name: "IndiGo", code: "6E" },
        { code: "SG", name: "SpiceJet" },
        { name: "AkasaAir", code: "QP" },
      ],
    },
  });

  const dropCoachandCheap = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropCoachandCheap.current && !dropCoachandCheap.current.contains(event.target)) {
        setDropdowns((prev) => ({
          coach: { ...prev.coach, isOpen: false },
          cheapFlight: { ...prev.cheapFlight, isOpen: false },
        }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownToggle = (type) => {
    setDropdowns((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        isOpen: !prev[type].isOpen,
      },
    }));
  };

  const handleSelectOption = (type, value) => {
    setDropdowns((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        isOpen: false,
        selected: value,
      },
    }));
  };

  const [DefnceStudentMore, setDefnceStudentMore] = useState(null);
  const DefnceStudentMoreHandler = (selectedOption) => {
    setDefnceStudentMore((prevVal) =>
      prevVal && prevVal.id === selectedOption.id ? null : selectedOption
    );
  };

  const options = [
    { id: 1, label: "Defence Force" },
    { id: 2, label: "Student" },
    { id: 3, label: "Senior Citizens" },
    { id: 4, label: "Doctors & Nurses" },
  ];

  const [toogleBtnn, settoogleBtnn] = useState(false);
  const [fromcity, setfromcity] = useState("FromCity");
  const [AnyWhere, setAnyWhere] = useState("anyWhere");

  const getCal = useSelector((state) => state.calendar);

  const [calData, setcalData] = useState({
    JourneyType: 1,
    EndUserIp: "223.178.208.151",
    Segments: [
      {
        Origin: fromCity.iata,
        Destination: toCity.iata,
        PreferredDepartureTime: dateOfJourney,
        FlightCabinClass: 1,
      },
    ],
  });

  useEffect(() => {
    const updatedCalData = {
      JourneyType: 1,
      EndUserIp: "223.178.208.151",
      Segments: [
        {
          Origin: fromCity.iata,
          Destination: toCity.iata,
          PreferredDepartureTime: dateOfJourney,
          FlightCabinClass: 1,
        },
      ],
    };
    if (fromCity.iata && toCity.iata) {
      dispatch(getCalendarFare(updatedCalData));
    }
  }, [dispatch, fromCity.iata, toCity.iata, dateOfJourney]);

  const handelSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
    settoogleBtnn(!toogleBtnn);
  };

  const CaldataOrg = getCal?.fares?.Response;

  const tileContent2 = ({ date, view }) => {
    if (view === "month") {
      const dateKey = date.toISOString().split("T")[0];
      const localDateKey = date.toLocaleDateString("en-CA");
      const getFAreData = CaldataOrg?.SearchResults;

      if (Array.isArray(getFAreData)) {
        const fareDataForDate = getFAreData.find(
          (item) => item.DepartureDate.split("T")[0] === localDateKey
        );
        if (fareDataForDate) {
          const { Fare, BaseFare, IsLowestFareOfMonth, AirlineCode } = fareDataForDate;
          return (
            <div className="">
              <div>{formatPrice(Fare)}</div>
            </div>
          );
        }
      }
    }
    return null;
  };

  function formatPrice(amount, currency = "INR", locale = "en-US") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "No date selected";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="header relative md:px-5 lg:px-12 xl:px-24">
        <div className="bg-[#002043] h-[15rem] absolute inset-0 -z-10" />
        <MiniNav />
        <TypeWriterHeaderEffect />

        <div className="flex flex-col bg-white lg:block rounded-lg text-white">
          <div className="bg-gray-200 rounded-sm shadow">
            <Navbar />
          </div>

          <div className="px-4 border-b-2 shadow-sm space-y-2 py-3">
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-3">
              <div className="grid relative gap-3 md:grid-cols-2">
                <div className="relative">
                  <div
                    onClick={() => {
                      setSelectedOption("from"), setIsVisible(true);
                    }}
                    className="relative rounded gap-1 h-[4rem] flex items-center px-3 border border-slate-400 text-black"
                  >
                    <IoLocationSharp className="text-[20px]" />
                    <div className="flex flex-col">
                      <span className="text-[18px] lg:text-xl text-black font-bold">
                        {(fromCity.city || fromCity.municipality) ?? "Unknown"}
                      </span>
                      <p className="text-black text-[10px] truncate">
                        [{fromCity.name}] {fromCity.iata}
                      </p>
                    </div>
                  </div>
                  {isVisible && selectedOption === "from" && (
                    <AutoSearch
                      value="From"
                      Click={setIsVisible}
                      handleClosed={handleVisibilityChange}
                      onSelect={handleCitySelect}
                    />
                  )}
                </div>
                <div
                  onClick={handelSwap}
                  className={`absolute z-10 right-[45%] top-14 md:left-[48%] lg:left-[47%] md:top-4 border py-[2px] border-gray-800 bg-white h-8 w-8 lg:h-[34px] lg:w-[34px] rounded-full flex justify-center items-center flex-col text-black transition-transform duration-300 ${
                    toogleBtnn ? "rotate-180 md:rotate-180" : "rotate-90 md:rotate-0"
                  }`}
                >
                  <FaArrowRightLong className="text-lg" />
                  <FaArrowRightLong className="rotate-180 text-lg" />
                </div>
                <div className="relative">
                  <div
                    onClick={() => {
                      setSelectedOption("to"), setIsVisible(true);
                    }}
                    className="relative rounded gap-1 h-[4rem] flex items-center px-3 border border-slate-400 text-black"
                  >
                    <IoLocationSharp className="text-xl" />
                    <div className="flex flex-col">
                      <span className="text-[18px] lg:text-xl text-black font-bold">
                        {(toCity.city || toCity.municipality) ?? "Unknown"}
                      </span>
                      <p className="text-black text-[10px] truncate">
                        [{toCity.name}] {toCity.iata}
                      </p>
                    </div>
                  </div>
                  {isVisible && selectedOption === "to" && (
                    <AutoSearch
                      value="To"
                      fromCity={fromCity}
                      Click={setIsVisible}
                      handleClosed={handleVisibilityChange}
                      onSelect={handleCitySelect}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <div className="relative">
                  <div
                    onClick={() => {
                      setSelectedOption("date"), setIsVisible(true);
                    }}
                    className="flex items-center h-[4rem] gap-2 px-4 py-1 border-2 text-black border-slate-200 rounded-md"
                  >
                    <div className="text-slate-400">
                      {selected && (
                        <>
                          <div className="flex items-baseline text-black">
                            <span className="text-md py-1 pr-1 text-black font-bold">
                              {selected.getDate()}
                            </span>
                            <span className="text-md font-semibold">
                              {selected.toLocaleString("default", { month: "short" })}'
                            </span>
                            <span className="text-md font-semibold">
                              {selected.getFullYear()}
                            </span>
                          </div>
                          <p className="text-black text-xs pb-2">{selected.toLocaleDateString()}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {isVisible && selectedOption === "date" && (
                    <div className="bg-white text-black w-[352px] p-2 lg:w-[400px] shadow-2xl text-[10px] md:text-lg absolute top-full mt-2 z-10 left-0 lg:-left-4">
                      <Calendar
                        onChange={handleDateChange}
                        value={selected}
                        minDate={new Date()}
                        tileContent={tileContent2}
                      />
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div
                    onClick={() => {
                      setSelectedOption("return");
                      setIsVisible(true);
                    }}
                    className="flex items-center h-[4rem] gap-2 px-4 py-1 border-2 border-slate-200 rounded-md cursor-pointer"
                  >
                    <div className="text-slate-400">
                      <div className="text-black">
                        <p className="text-[10px] font-bold">Return Date</p>
                        <p className="text-[11px] text-slate-400 -mt-1">
                          Tap to add a Return date
                        </p>
                      </div>
                    </div>
                  </div>
                  {isVisible && selectedOption === "return" && (
                    <div className="bg-white w-[352px] p-2 lg:w-[400px] text-black shadow-2xl text-[10px] md:text-lg absolute top-full mt-2 z-10 left-0 lg:-left-4 md:left-0">
                      <Calendar
                        onChange={handleReturnDateChange}
                        value={selectedReturn}
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-start max-w-[115px] gap-2 px-3 py-2 border-2 text-black border-slate-200 rounded-md relative" onMouseLeave={() => setIsVisible(false)}>
                  <FaUserLarge className="text-lg mt-1" />
                  <div className="text-slate-400">
                    <h5 className="font-bold text-lg text-black">{adultCount + childCount + infantCount}</h5>
                  </div>
                  <button onClick={() => { setIsVisible(true), setSelectedOption("count") }}>Edit</button>
                  {isVisible && selectedOption === "count" && (
                    <div className="absolute top-[80%] min-w-full min-h-[10rem] left-1 md:-left-10 z-10">
                      <div className="shadow-2xl rounded-md bg-white mt-[10%] flex flex-col gap-4 p-4">
                        <div className="flex gap-3 justify-between">
                          <p className="text-nowrap">Adult Count</p>
                          <div className="flex items-center gap-3">
                            <button className="px-2 border" onClick={() => { adultCount > 1 ? setAdultCount(adultCount - 1) : null }}>-</button>
                            <p className="px-2 border">{adultCount}</p>
                            <button className="px-2 border" onClick={() => setAdultCount(adultCount + 1)}>+</button>
                          </div>
                        </div>
                        <div className="flex gap-3 justify-between">
                          <p className="text-nowrap">Child Count</p>
                          <div className="flex items-center gap-3">
                            <button className="px-2 border" onClick={() => { childCount > 0 ? setChildCount(childCount - 1) : null }}>-</button>
                            <p className="px-2 border">{childCount}</p>
                            <button className="px-2 border" onClick={() => setChildCount(childCount + 1)}>+</button>
                          </div>
                        </div>
                        <div className="flex gap-3 justify-between">
                          <p className="text-nowrap">Infant Count</p>
                          <div className="flex items-center gap-3">
                            <button className="px-2 border" onClick={() => { infantCount > 0 ? setInfantCount(infantCount - 1) : null }}>-</button>
                            <p className="px-2 border">{infantCount}</p>
                            <button className="px-2 border" onClick={() => setInfantCount(infantCount + 1)}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center items-center">
                  <button
                    onClick={handelSearch}
                    className="bg-[#0A5EB0] w-full md:w-fit text-nowrap py-2 px-3 font-semibold text-md rounded-md text-white"
                  >
                    Search Flights
                  </button>
                </div>
              </div>
            </div>

            <div className="flex relative gap-4 flex-col lg:flex-row mt-3 lg:justify-between lg:items-center">
              <nav className="defenceColm flex justify-center md:justify-between" id="divFamilyFare">
                <ul className="grid grid-cols-2 justify-center md:grid-cols-3 lg:flex md:flex-nowrap md:justify-start gap-3 lg:gap-2 text-xs items-center p-0 m-0">
                  <li className="w-fit">
                    <div className="relative" ref={dropCoachandCheap}>
                      <button
                        onClick={() => handleDropdownToggle("cheapFlight")}
                        className="flex items-center hidden w-full h-full px-3 py-2 md:p-0 justify-center gap-2 font-medium bg-blue-500 hover:bg-blue-600 text-white md:px-4 md:py-3 lg:py-[3px] rounded-md shadow-md transition-all duration-300"
                        aria-expanded={dropdowns.cheapFlight.isOpen ? "true" : "false"}
                      >
                        {dropdowns.cheapFlight.selected}
                        <span>
                          <IoIosArrowDown
                            className={`transition-transform font-extrabold duration-300 ${
                              dropdowns.cheapFlight.isOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </span>
                      </button>
                      {dropdowns.cheapFlight.isOpen && (
                        <div className="absolute bg-white left-0 z-50 mt-2 py-2 w-max border border-gray-200 rounded-lg shadow-lg">
                          {dropdowns.cheapFlight.data.map((airline, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setPreferredAirline(airline.code);
                                handleDropdownToggle("cheapFlight");
                              }}
                              className="flex items-center justify-start px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
                            >
                              <span className="font-semibold text-gray-800">{airline.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;