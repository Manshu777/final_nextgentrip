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
  const [tripType, setTripType] = useState("oneway");
  const [specialFare, setSpecialFare] = useState(null);
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
    wikipedia_link:
      "https://en.wikipedia.org/wiki/Indira_Gandhi_International_Airport",
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
    wikipedia_link:
      "https://en.wikipedia.org/wiki/Chhatrapati_Shivaji_International_Airport",
    keywords: "Bombay, Sahar International Airport",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [preferredAirline, setPreferredAirline] = useState(null);
  const t = useTranslations("Navbar2");
  const [displayDate, setDisplayDate] = useState("");
  const [toogleBtnn, settoogleBtnn] = useState(false);

  // State for multicity segments
  const [segments, setSegments] = useState([
    { from: fromCity, to: toCity, date: new Date() },
  ]);

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
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T00:00:00`;
    setDateOfJourney(formattedDate);
    setDisplayDate(formattedDate);
    setIsVisible(false);
  };

  const handleReturnDateChange = (date) => {
    setSelectedReturn(date);
    setIsVisible(false);
    setTripType("roundtrip");
  };

  const handleDateChangeMulticity = (date, index) => {
    console.log("Selected date for segment", index, ":", date);
    const updatedSegments = [...segments];
    updatedSegments[index].date = date;
    setSegments(updatedSegments);
    setIsVisible(false);
  };

  const handleCitySelect = (city, index = null) => {
    if (index !== null) {
      const updatedSegments = [...segments];
      if (selectedOption === `from-${index}`)
        updatedSegments[index].from = city;
      if (selectedOption === `to-${index}`) updatedSegments[index].to = city;
      setSegments(updatedSegments);
    } else {
      if (selectedOption === "from") setFromCity(city);
      if (selectedOption === "to") setToCity(city);
    }
    setIsVisible(false);
  };

  const handleAddCity = () => {
    if (segments.length < 5) {
      setSegments([
        ...segments,
        { from: fromCity, to: toCity, date: new Date() },
      ]);
    }
  };

  const handleRemoveCity = (index) => {
    if (segments.length > 1) {
      setSegments(segments.filter((_, i) => i !== index));
    }
  };

  const handleVisibilityChange = (value) => {
    console.log("Visibility changed to:", value);
    setIsVisible(value);
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
            const formattedDate = `${storedDate.getFullYear()}-${String(
              storedDate.getMonth() + 1
            ).padStart(2, "0")}-${String(storedDate.getDate()).padStart(
              2,
              "0"
            )}T00:00:00`;
            setDateOfJourney(formattedDate);
            setDisplayDate(formattedDate);
          } else {
            setSelected(new Date());
            setDateOfJourney(getCurrentDateTime());
            setDisplayDate(getCurrentDateTime());
          }

          if (!isNaN(storedDate2)) {
            setSelectedReturn(storedDate2);
            setTripType("roundtrip");
          }

          if (parsedData?.segments && parsedData.journytype === 3) {
            setSegments(
              parsedData.segments.map((segment) => ({
                from: segment.from || fromCity,
                to: segment.to || toCity,
                date: new Date(segment.date),
              }))
            );
            setTripType("multicity");
          }
        } catch (error) {
          console.error("Error parsing flight data:", error);
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
          if (flightData?.journytype) {
            const typeMap = { 1: "oneway", 2: "roundtrip", 3: "multicity" };
            setTripType(typeMap[flightData.journytype] || "oneway");
          }
        } catch (error) {
          console.error("Error parsing stored flight data:", error);
        }
      }
    }
  }, []);

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

  const handelSwap = () => {
    if (tripType === "multicity") {
      setSegments(
        segments.map((segment) => ({
          ...segment,
          from: segment.to,
          to: segment.from,
        }))
      );
    } else {
      setFromCity(toCity);
      setToCity(fromCity);
    }
    settoogleBtnn(!toogleBtnn);
  };

  const handelSearch = () => {
    if (!selected && tripType !== "multicity") {
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

    const journeyTypeMap = { oneway: 1, roundtrip: 2, multicity: 3 };
    const journeyType = journeyTypeMap[tripType];

    const date = new Date(selected);
    const localFormattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T00:00:00`;

    localStorage.setItem(
      "defaultflight",
      JSON.stringify({
        from: fromCity,
        to: toCity,
        timeDate: localFormattedDate,
        retuntime: selectedReturn ? selectedReturn.toISOString() : null,
        journytype: journeyType,
        segments: tripType === "multicity" ? segments : undefined,
      })
    );

    let searchUrl;
    if (tripType === "oneway") {
      searchUrl = `/flightto=${fromCity.iata}&from=${
        toCity.iata
      }&date=${localFormattedDate}&prfdate=${localFormattedDate}&JourneyType=${journeyType}&adultcount=${adultCount}&childCount=${childCount}&infantCount=${infantCount}&selectedClass=${selectedClass}&PreferredAirlines=${
        preferredAirline || ""
      }${specialFare ? `&specialFare=${specialFare}` : ""}`;
    } else if (tripType === "roundtrip") {
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
      ).padStart(2, "0")}-${String(returnDate.getDate()).padStart(
        2,
        "0"
      )}T00:00:00`;
      searchUrl = `/flightto=${fromCity.iata}&from=${
        toCity.iata
      }&date=${localFormattedDate}&prfdate=${localFormattedDate}&JourneyType=${journeyType}&adultcount=${adultCount}&childCount=${childCount}&infantCount=${infantCount}&selectedClass=${selectedClass}&returndate=${returnFormattedDate}&PreferredAirlines=${
        preferredAirline || ""
      }${specialFare ? `&specialFare=${specialFare}` : ""}`;
    } else if (tripType === "multicity") {
      for (let i = 0; i < segments.length; i++) {
        const fromValid =
          segments[i].from &&
          typeof segments[i].from === "object" &&
          segments[i].from.iata;
        const toValid =
          segments[i].to &&
          typeof segments[i].to === "object" &&
          segments[i].to.iata;
        const dateValid =
          segments[i].date instanceof Date && !isNaN(segments[i].date);
        if (!fromValid || !toValid || !dateValid) {
          toast.warn(
            `Please select both cities and a departure date for segment ${
              i + 1
            }`,
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            }
          );
          return;
        }
      }

      const segmentParams = segments
        .map((segment, index) => {
          const date = new Date(segment.date);
          const formattedDate = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(
            2,
            "0"
          )}T00:00:00`;
          return `from${index + 1}=${segment.from.iata}&to${index + 1}=${
            segment.to.iata
          }&date${index + 1}=${formattedDate}`;
        })
        .join("&");

      searchUrl = `/multicity?${segmentParams}&JourneyType=${journeyType}&adultcount=${adultCount}&childCount=${childCount}&infantCount=${infantCount}&selectedClass=${selectedClass}&PreferredAirlines=${
        preferredAirline || ""
      }${specialFare ? `&specialFare=${specialFare}` : ""}`;
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
      if (
        dropCoachandCheap.current &&
        !dropCoachandCheap.current.contains(event.target)
      ) {
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

  const getCal = useSelector((state) => state.calendar);

  const [calData, setcalData] = useState({
    JourneyType: tripType === "oneway" ? 1 : tripType === "roundtrip" ? 2 : 3,
    EndUserIp: "223.178.208.151",
    Segments:
      tripType === "multicity"
        ? segments.map((segment) => ({
            Origin: segment.from.iata,
            Destination: segment.to.iata,
            PreferredDepartureTime: segment.date
              ? `${segment.date.getFullYear()}-${String(
                  segment.date.getMonth() + 1
                ).padStart(2, "0")}-${String(segment.date.getDate()).padStart(
                  2,
                  "0"
                )}T00:00:00`
              : "",
            FlightCabinClass: 1,
          }))
        : [
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
      JourneyType: tripType === "oneway" ? 1 : tripType === "roundtrip" ? 2 : 3,
      EndUserIp: "223.178.208.151",
      Segments:
        tripType === "multicity"
          ? segments.map((segment) => ({
              Origin: segment.from.iata,
              Destination: segment.to.iata,
              PreferredDepartureTime: segment.date
                ? `${segment.date.getFullYear()}-${String(
                    segment.date.getMonth() + 1
                  ).padStart(2, "0")}-${String(segment.date.getDate()).padStart(
                    2,
                    "0"
                  )}T00:00:00`
                : "",
              FlightCabinClass: 1,
            }))
          : [
              {
                Origin: fromCity.iata,
                Destination: toCity.iata,
                PreferredDepartureTime: dateOfJourney,
                FlightCabinClass: 1,
              },
            ],
    };
    if (
      (tripType !== "multicity" && fromCity.iata && toCity.iata) ||
      (tripType === "multicity" &&
        segments.every((s) => s.from?.iata && s.to?.iata))
    ) {
      dispatch(getCalendarFare(updatedCalData));
    }
  }, [dispatch, fromCity.iata, toCity.iata, dateOfJourney, tripType, segments]);

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
          const { Fare, BaseFare, IsLowestFareOfMonth, AirlineCode } =
            fareDataForDate;
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
      <div className="header relative md:px-6 lg:px-6 xl:px-6">
        <div className="bg-[#002043] h-[15rem] absolute inset-0 -z-10" />
        <MiniNav />
        <TypeWriterHeaderEffect />

        <div className="flex flex-col bg-white lg:block rounded-lg text-white">
          <div className="bg-gray-200 rounded-sm shadow">
            <Navbar />
          </div>

          <div className="px-4 border-b-2 shadow-sm space-y-2 py-3">
            <div className="flex gap-3 mb-4">
              {["oneway", "roundtrip", "multicity"].map((type) => (
                <button
                  key={type}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    tripType === type
                      ? "bg-white text-[#0A5EB0] border-[#0A5EB0] shadow-md"
                      : "bg-[#003366] text-white border-white/30 hover:bg-white hover:text-[#0A5EB0]"
                  }`}
                  onClick={() => setTripType(type)}
                >
                  {type === "oneway"
                    ? "One Way"
                    : type === "roundtrip"
                    ? "Round Trip"
                    : "Multicity"}
                </button>
              ))}
            </div>

            {tripType === "multicity" ? (
              <>
                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-2 xl:grid-cols-3 mb-3 items-center"
                  >
                    <div className="relative">
                      <div
                        onClick={() => {
                          setSelectedOption(`from-${index}`);
                          setIsVisible(true);
                        }}
                        className="relative rounded gap-1 h-[4rem] flex items-center px-3 border border-slate-400 text-black"
                      >
                        <IoLocationSharp className="text-[20px]" />
                        <div className="flex flex-col">
                          <span className="text-[18px] lg:text-xl text-black font-bold">
                            {(segment.from.city || segment.from.municipality) ??
                              "Unknown"}
                          </span>
                          <p className="text-black text-[10px] truncate">
                            [{segment.from.name}] {segment.from.iata}
                          </p>
                        </div>
                      </div>
                      {isVisible && selectedOption === `from-${index}` && (
                        <AutoSearch
                          value="From"
                          Click={setIsVisible}
                          handleClosed={handleVisibilityChange}
                          onSelect={(city) => handleCitySelect(city, index)}
                        />
                      )}
                    </div>
                    <div
                      onClick={() => {
                        setSelectedOption(`to-${index}`);
                        setIsVisible(true);
                      }}
                      className="relative rounded gap-1 h-[4rem] flex items-center px-3 border border-slate-400 text-black"
                    >
                      <IoLocationSharp className="text-xl" />
                      <div className="flex flex-col">
                        <span className="text-[18px] lg:text-xl text-black font-bold">
                          {(segment.to.city || segment.to.municipality) ??
                            "Unknown"}
                        </span>
                        <p className="text-black text-[10px] truncate">
                          [{segment.to.name}] {segment.to.iata}
                        </p>
                      </div>
                    </div>
                    {isVisible && selectedOption === `to-${index}` && (
                      <AutoSearch
                        value="To"
                        fromCity={segment.from}
                        Click={setIsVisible}
                        handleClosed={handleVisibilityChange}
                        onSelect={(city) => handleCitySelect(city, index)}
                      />
                    )}
                    <div className="relative flex items-center gap-2">
                      <div
                        onClick={() => {
                          setSelectedOption(`date-${index}`);
                          setIsVisible(true);
                        }}
                        className="flex items-center h-[4rem] gap-1 px-2 py-1 border-2 text-black border-slate-200 rounded-md"
                      >
                        <div className="text-slate-400 w-full h-full flex items-center">
                          {segment.date && (
                            <>
                              <div className="flex items-baseline text-black text-xs w-full">
                                <span className="text-sm font-bold">
                                  {segment.date.getDate()}
                                </span>
                                <span className="text-sm font-semibold">
                                  {segment.date.toLocaleString("default", {
                                    month: "short",
                                  })}
                                </span>
                                <span className="text-sm font-semibold">
                                  {segment.date.getFullYear()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {isVisible && selectedOption === `date-${index}` && (
                        <div className="bg-white text-black w-[352px] p-2 lg:w-[400px] shadow-2xl text-[10px] md:text-lg absolute top-full mt-2 z-10 left-0 lg:-left-4">
                          <Calendar
                            onChange={(date) =>
                              handleDateChangeMulticity(date, index)
                            }
                            value={segment.date}
                            minDate={new Date()}
                            tileContent={tileContent2}
                          />
                        </div>
                      )}
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveCity(index)}
                          className="text-red-500 hover:text-red-700 text-xl"
                        >
                          <RxCross2 />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
               <div className="ml-auto">
  <div className="flex flex-col justify-end items-end gap-2">

    {/* 👇 Passenger Count Box */}
    <div className="flex items-start max-w-[200px] gap-2 px-3 py-2 border-2 text-black border-slate-200 rounded-md relative">
      <FaUserLarge className="text-lg mt-1" />
      <div className="text-slate-400">
        <h5 className="font-bold text-lg text-black">
          {adultCount + childCount + infantCount}
        </h5>
      </div>
      <button
        onClick={() => {
          setIsVisible(true);
          setSelectedOption("count");
        }}
      >
        Edit
      </button>
      {isVisible && selectedOption === "count" && (
        <div className="absolute top-[100%] right-0 min-w-full min-h-[10rem] z-10">
          <div className="shadow-2xl rounded-md bg-white mt-2 flex flex-col gap-4 p-4">
            <div className="flex gap-3 justify-between">
              <p className="text-nowrap">Adult Count</p>
              <div className="flex items-center gap-3">
                <button
                  className="px-2 border"
                  onClick={() => adultCount > 1 && setAdultCount(adultCount - 1)}
                >
                  -
                </button>
                <p className="px-2 border">{adultCount}</p>
                <button
                  className="px-2 border"
                  onClick={() => setAdultCount(adultCount + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-3 justify-between">
              <p className="text-nowrap">Child Count</p>
              <div className="flex items-center gap-3">
                <button
                  className="px-2 border"
                  onClick={() => childCount > 0 && setChildCount(childCount - 1)}
                >
                  -
                </button>
                <p className="px-2 border">{childCount}</p>
                <button
                  className="px-2 border"
                  onClick={() => setChildCount(childCount + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-3 justify-between">
              <p className="text-nowrap">Infant Count</p>
              <div className="flex items-center gap-3">
                <button
                  className="px-2 border"
                  onClick={() => infantCount > 0 && setInfantCount(infantCount - 1)}
                >
                  -
                </button>
                <p className="px-2 border">{infantCount}</p>
                <button
                  className="px-2 border"
                  onClick={() => setInfantCount(infantCount + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* 👇 Search & Add City Buttons */}
    <button
      onClick={handelSearch}
      className="bg-[#0A5EB0] w-full md:w-fit text-nowrap py-2 px-3 font-semibold text-md rounded-md text-white"
    >
      Search Flights
    </button>
    {segments.length < 5 && (
      <button
        className="border border-[#0A5EB0] text-[#0A5EB0] px-4 py-2 rounded-md font-semibold"
        onClick={handleAddCity}
      >
        + ADD CITY
      </button>
    )}
  </div>
</div>

              </>
            ) : (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-3">
                <div className="grid relative gap-3 md:grid-cols-2">
                  <div className="relative">
                    <div
                      onClick={() => {
                        setSelectedOption("from");
                        setIsVisible(true);
                      }}
                      className="relative rounded gap-1 h-[4rem] flex items-center px-3 border border-slate-400 text-black"
                    >
                      <IoLocationSharp className="text-[20px]" />
                      <div className="flex flex-col">
                        <span className="text-[18px] lg:text-xl text-black font-bold">
                          {(fromCity.city || fromCity.municipality) ??
                            "Unknown"}
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
                      toogleBtnn
                        ? "rotate-180 md:rotate-180"
                        : "rotate-90 md:rotate-0"
                    }`}
                  >
                    <FaArrowRightLong className="text-lg" />
                    <FaArrowRightLong className="rotate-180 text-lg" />
                  </div>
                  <div className="relative">
                    <div
                      onClick={() => {
                        setSelectedOption("to");
                        setIsVisible(true);
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
                        setSelectedOption("date");
                        setIsVisible(true);
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
                                {selected.toLocaleString("default", {
                                  month: "short",
                                })}
                                '
                              </span>
                              <span className="text-md font-semibold">
                                {selected.getFullYear()}
                              </span>
                            </div>
                            <p className="text-black text-xs pb-2">
                              {selected.toLocaleDateString()}
                            </p>
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

                  {tripType !== "oneway" && (
                    <div className="relative">
                      <div
                        onClick={() => {
                          setSelectedOption("return");
                          setIsVisible(true);
                        }}
                        className="flex items-center h-[4rem] gap-2 px-4 py-1 border-2 border-slate-200 rounded-md cursor-pointer"
                      >
                        {selectedReturn ? (
                          <div className="text-slate-400">
                            <div className="flex items-baseline text-black">
                              <span className="text-md py-1 pr-1 text-black font-bold">
                                {selectedReturn.getDate()}
                              </span>
                              <span className="text-md font-semibold">
                                {selectedReturn.toLocaleString("default", {
                                  month: "short",
                                })}
                                '
                              </span>
                              <span className="text-md font-semibold">
                                {selectedReturn.getFullYear()}
                              </span>
                            </div>
                            <p className="text-black text-xs pb-2">
                              {selectedReturn.toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <div className="text-slate-400">
                            <div className="text-black">
                              <p className="text-[10px] font-bold">
                                Return Date
                              </p>
                            </div>
                          </div>
                        )}
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
                  )}

                  <div className="flex items-start max-w-[115px] gap-2 px-3 py-2 border-2 text-black border-slate-200 rounded-md relative">
                    <FaUserLarge className="text-lg mt-1" />
                    <div className="text-slate-400">
                      <h5 className="font-bold text-lg text-black">
                        {adultCount + childCount + infantCount}
                      </h5>
                    </div>
                    <button
                      onClick={() => {
                        setIsVisible(true);
                        setSelectedOption("count");
                      }}
                    >
                      Edit
                    </button>
                    {isVisible && selectedOption === "count" && (
                      <div className="absolute top-[80%] min-w-full min-h-[10rem] left-1 md:-left-10 z-10">
                        <div className="shadow-2xl rounded-md bg-white mt-[10%] flex flex-col gap-4 p-4">
                          <div className="flex gap-3 justify-between">
                            <p className="text-nowrap">Adult Count</p>
                            <div className="flex items-center gap-3">
                              <button
                                className="px-2 border"
                                onClick={() =>
                                  adultCount > 1 &&
                                  setAdultCount(adultCount - 1)
                                }
                              >
                                -
                              </button>
                              <p className="px-2 border">{adultCount}</p>
                              <button
                                className="px-2 border"
                                onClick={() => setAdultCount(adultCount + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-3 justify-between">
                            <p className="text-nowrap">Child Count</p>
                            <div className="flex items-center gap-3">
                              <button
                                className="px-2 border"
                                onClick={() =>
                                  childCount > 0 &&
                                  setChildCount(childCount - 1)
                                }
                              >
                                -
                              </button>
                              <p className="px-2 border">{childCount}</p>
                              <button
                                className="px-2 border"
                                onClick={() => setChildCount(childCount + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-3 justify-between">
                            <p className="text-nowrap">Infant Count</p>
                            <div className="flex items-center gap-3">
                              <button
                                className="px-2 border"
                                onClick={() =>
                                  infantCount > 0 &&
                                  setInfantCount(infantCount - 1)
                                }
                              >
                                -
                              </button>
                              <p className="px-2 border">{infantCount}</p>
                              <button
                                className="px-2 border"
                                onClick={() => setInfantCount(infantCount + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-auto">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <button
                        onClick={handelSearch}
                        className="bg-[#0A5EB0] w-full md:w-fit text-nowrap py-2 px-3 font-semibold text-md rounded-md text-white"
                      >
                        Search Flights
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[#0A5EB0] p-2 rounded-b-md">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Special Fares (Optional):</span>
                {[
                  { id: 1, label: "Defence Forces" },
                  { id: 2, label: "Students" },
                  { id: 3, label: "Senior Citizens" },
                  { id: 4, label: "Doctors & Nurses" },
                ].map((fare) => (
                  <label
                    key={fare.id}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="specialFare"
                      value={fare.id}
                      checked={specialFare === fare.id}
                      onChange={() => setSpecialFare(fare.id)}
                      className="hidden"
                    />
                    <span
                      className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                        specialFare === fare.id
                          ? "border-[#0A5EB0] bg-[#0A5EB0]"
                          : "border-[#0A5EB0]"
                      }`}
                    >
                      {specialFare === fare.id && (
                        <IoIosCheckmark className="text-white text-xs" />
                      )}
                    </span>
                    <span className="text-sm">{fare.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
