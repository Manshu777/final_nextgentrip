"use client";

import { useState, useRef, useEffect } from "react";
import TravellerDropDownhotels from "../TravellerDropDownhotels";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AutoSearchcity from "../AutoSearchcity";
import { Calendar } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import Navbar from "../Navbar";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import TypeWriterHeaderEffect from "../TypeWriterHeaderEffect";
import MiniNav from "../MiniNav";
import { useDispatch, useSelector } from "react-redux";
import { getAllCountries } from "../../Store/slices/citysearchSlice";

const HotelsComp = () => {
  const route = useRouter();
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const localTimeZone = getLocalTimeZone();
  const [isVisible, setIsVisible] = useState("");
  const defalinfo = JSON.parse(localStorage.getItem("hotelItems"));
  const [isOpen, setIsOpen] = useState(false);
  const [city, setcity] = useState(
    (defalinfo && defalinfo.place) || { Name: "delhi", Code: "130443" }
  );
  const currentDate = today(localTimeZone);
  // Initialize Check In to today's date in local timezone
  const [arivitime, setarivitime] = useState(
    defalinfo && defalinfo.checkIntime
      ? new Date(defalinfo.checkIntime)
      : currentDate.toDate(localTimeZone)
  );
  // Initialize Check Out to the day after Check In or stored value
  const [checkOut, setcheckOut] = useState(
    defalinfo && defalinfo.checkouttime
      ? new Date(defalinfo.checkouttime)
      : new Date(currentDate.toDate(localTimeZone).setDate(currentDate.day + 1))
  );
  const [adultcount, setadultcount] = useState(
    (defalinfo && defalinfo.adultcount) || 1
  );
  const [childcount, setchildcount] = useState(
    (defalinfo && defalinfo.childcount) || 0
  );
  const [cnCoide, setcnCoide] = useState("IN");
  const [numberOfRoom, setNumberOfRoom] = useState(
    (defalinfo && defalinfo.numberOfRoom) || 1
  );
  const [childAges, setChildAges] = useState(() => {
    const storedAges = defalinfo && defalinfo.childAges ? defalinfo.childAges : [];
    const validAges = storedAges
      .slice(0, childcount)
      .filter((age) => age >= 1 && age <= 18);
    return Array(childcount).fill(1).map((_, i) => validAges[i] || 1);
  });
  const handleCitySelect = (city) => {
    // Validate city object
    if (!city || !city.Name || !city.Code) {
      console.error("Invalid city object:", city);
      return;
    }
    console.log("Selected city:", city); // Debug log
    setcity({ Name: city.Name, Code: city.Code }); // Ensure only Name and Code are set
    setIsVisible("");
  };

  const handleVisibilityChange = (value) => {
    setIsVisible(value);
  };

  const handleClick = (option) => {
    setIsVisible(option);
  };

  const handelreturn = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day);
    const nextdate = new Date(newRange.year, newRange.month - 1, newRange.day + 1);
    setarivitime(date);
    setcheckOut(nextdate);
    setIsVisible("");
    console.log("City after date change:", city); // Debug log
  };
  // const handelreturn2 = (newRange) => {
  //   const date = new Date(newRange.year, newRange.month - 1, newRange.day);
  //   setcheckOut(date);
  //   setIsVisible("");
  // };

  useEffect(() => {
    dispatch(getAllCountries());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to format date to YYYY-MM-DD in local timezone
  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // const handlehotelSearch = () => {
  //   const validChildAges = childAges.filter(
  //     (age) => age !== undefined && !isNaN(age) && age >= 1 && age <= 18
  //   );

  //   console.log('city.Code ',city.Code)
  //   if (validChildAges.length !== childcount) {
  //     alert("Please provide valid ages (1–18) for all children.");
  //     return;
  //   }

  //   localStorage.setItem(
  //     "hotelItems",
  //     JSON.stringify({
  //       place: { Name: city.Name, code: city.Code },
  //       checkIntime: arivitime,
  //       checkouttime: checkOut,
  //       adultcount,
  //       childcount,
  //       childAges: validChildAges,
  //       numberOfRoom,
  //     })
  //   );



   
  //   // Use local timezone date formatting
  //   const checkInDate = formatDateToLocal(arivitime);
  //   const checkOutDate = formatDateToLocal(checkOut);

  //   const childAgesQuery =
  //     validChildAges.length > 0
  //       ? `&childAges=${encodeURIComponent(validChildAges.join(","))}`
  //       : "";

  //   route.push(
  //     `/hotels/cityName=${encodeURIComponent(
  //       city.Name
  //     )}&citycode=${city.Code}&checkin=${checkInDate}&checkout=${checkOutDate}&adult=${adultcount}&child=${childcount}${childAgesQuery}&roomes=${numberOfRoom}&page=0&star=0`
  //   );
  // };


  const handelreturn2 = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day);
    setcheckOut(date);
    setIsVisible("");
    console.log("City after checkout date change:", city); // Debug log
  };

  const handlehotelSearch = () => {
    console.log("City in search:", city); // Debug log
    if (!city.Code) {
      alert("Please select a valid city.");
      return;
    }

    const validChildAges = childAges.filter(
      (age) => age !== undefined && !isNaN(age) && age >= 1 && age <= 18
    );

    if (validChildAges.length !== childcount) {
      alert("Please provide valid ages (1–18) for all children.");
      return;
    }

    localStorage.setItem(
      "hotelItems",
      JSON.stringify({
        place: { Name: city.Name, Code: city.Code },
        checkIntime: arivitime,
        checkouttime: checkOut,
        adultcount,
        childcount,
        childAges: validChildAges,
        numberOfRoom,
      })
    );

    const checkInDate = formatDateToLocal(arivitime);
    const checkOutDate = formatDateToLocal(checkOut);

    const childAgesQuery =
      validChildAges.length > 0
        ? `&childAges=${encodeURIComponent(validChildAges.join(","))}`
        : "";

    route.push(
      `/hotels/cityName=${encodeURIComponent(
        city.Name
      )}&citycode=${city.Code}&checkin=${checkInDate}&checkout=${checkOutDate}&adult=${adultcount}&child=${childcount}${childAgesQuery}&roomes=${numberOfRoom}&page=0&star=0`
    );
  };

  const maxAdultsPerRoom = 8;
  const maxChildrenPerRoom = 4;

  const [search, setSearch] = useState("");
  const { countries = [], isLoading = false, isError = false, error = null } =
    useSelector((state) => state.citysearch || {});

  const filteredCountries = countries.filter((country) =>
    country.Name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (country) => {
    setSearch(country.Name);
    setcnCoide(country.Code);
    setIsOpen(false);
  };

  return (
    <div className="header relative md:px-5 lg:px-12 xl:px-24">
      <div className="bg-[#002043] h-[12rem] absolute inset-0 -z-10" />
      <MiniNav />
      <h5 className="text-white font-bold text-xl lg:text-2xl py-2 px-2 text-center md:text-start mt-4 lg:mt-6"></h5>
      <TypeWriterHeaderEffect />
      <div className="flex flex-col bg-white lg:block rounded-lg text-white">
        <div className="bg-gray-200 rounded-sm shadow">
          <Navbar />
        </div>
        <div className="px-4 border-b-2 shadow-sm space-y-1 py-3">
          <div className="tabs FromDateDeapt flex flex-col lg:flex-row justify-between gap-4">
          
            <div className="relative w-full lg:w-[50%]">
              <div
                onClick={() => handleClick("city")}
                className="relative rounded gap-3 h-full min-h-[3rem] flex items-center px-2 w-full border border-slate-400 text-black"
              >
                <IoLocationSharp className="text-xl" />
                <button className="absolute rounded-full text-white bg-gray-400 right-0 -top-[2px]"></button>
                <div className="flex flex-col">
                  <span className="text-[12px] md:text-xl text-black font-bold capitalize">
                    {city.Name}
                  </span>
                </div>
              </div>
              {isVisible === "city" && (
                <div>
                  <AutoSearchcity
                    value="From"
                    handleClosed={handleVisibilityChange}
                    onSelect={handleCitySelect}
                    visible={setIsVisible}
                    countercode={cnCoide}
                  />
                </div>
              )}
            </div>
            <div className="relative w-full lg:w-[20%]">
              <div
                onClick={() => handleClick("date")}
                className="flex items-center gap-2 px-3 py-1 border-2 text-black border-slate-200 rounded-md"
              >
                <div className="text-slate-400">
                  {arivitime && (
                    <>
                      <div className="flex items-baseline text-black">
                        <span className="text-xl md:text-2xl pr-1 font-bold">
                          {arivitime.getDate()}
                        </span>
                        <span className="text-sm font-semibold">
                          {arivitime.toLocaleString("default", { month: "short" })}
                        </span>
                        <span className="text-sm font-semibold">
                          {arivitime.getFullYear()}
                        </span>
                      </div>
                      <p className="text-black text-xs">Check In</p>
                    </>
                  )}
                </div>
              </div>
              {isVisible === "date" && (
                <div
                  className="bg-white text-black p-5 shadow-2xl absolute top-full left-0 mt-2 z-10"
                  onMouseLeave={() => setIsVisible("")}
                >
                  <Calendar
                    aria-label="Select a date"
                    value=""
                    onChange={handelreturn}
                    minValue={currentDate}
                  />
                </div>
              )}
            </div>
            <div className="relative w-full lg:w-[20%]">
              <div
                onClick={() => handleClick("checkout")}
                className="flex items-center gap-2 px-3 py-1 border-2 text-black border-slate-200 rounded-md"
              >
                <div className="text-slate-400">
                  {checkOut && (
                    <>
                      <div className="flex items-baseline text-black">
                        <span className="text-xl md:text-2xl pr-1 font-bold">
                          {checkOut.getDate()}
                        </span>
                        <span className="text-sm font-semibold">
                          {checkOut.toLocaleString("default", { month: "short" })}
                        </span>
                        <span className="text-sm font-semibold">
                          {checkOut.getFullYear()}
                        </span>
                      </div>
                      <p className="text-black text-xs">Check Out</p>
                    </>
                  )}
                </div>
              </div>
              {isVisible === "checkout" && (
                <div className="bg-white text-black p-5 shadow-2xl absolute top-full left-0 mt-2 z-10">
                  <Calendar
                    aria-label="Select a date"
                    value=""
                    onChange={handelreturn2}
                    minValue={currentDate}
                  />
                </div>
              )}
            </div>
            <div className="relative w-full lg:w-[15%]">
              <div
                onClick={() => setIsVisible("roomcheck")}
                className="flex items-center justify-between px-3 py-1 border-2 text-black border-slate-200 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <h5 className="font-bold text-lg text-black">{adultcount + childcount}</h5>
                    <p className="text-slate-400 text-xs">Travellers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineMeetingRoom className="text-xl" />
                  <div>
                    <h5 className="font-bold text-lg text-black">{numberOfRoom}</h5>
                    <p className="text-slate-400 text-xs">Rooms</p>
                  </div>
                </div>
              </div>
              {isVisible === "roomcheck" && (
                <div
                  className="absolute w-fit top-full bg-white rounded-lg shadow-md z-50"
                  onMouseLeave={() => setIsVisible("")}
                >
                  <div className="shadow-2xl rounded-md bg-white flex flex-col gap-4 p-4">
                    {/* Adult Count */}
                    <div className="flex gap-3 justify-between">
                      <p className="text-nowrap text-gray-700">Adult Count</p>
                      <div className="flex items-center gap-3">
                        <button
                          className="px-2 border text-black"
                          onClick={() => {
                            if (adultcount > 1) {
                              setadultcount(adultcount - 1);
                              const totalPeople = adultcount - 1 + childcount;
                              const requiredRooms = Math.max(
                                Math.ceil(totalPeople / maxAdultsPerRoom),
                                Math.ceil(childcount / maxChildrenPerRoom)
                              );
                              if (requiredRooms <= numberOfRoom) {
                                setNumberOfRoom(requiredRooms);
                              }
                            }
                          }}
                        >
                          -
                        </button>
                        <p className="px-2 border text-gray-700">{adultcount}</p>
                        <button
                          className="px-2 text-black border"
                          onClick={() => {
                            const newAdultCount = adultcount + 1;
                            const totalPeople = newAdultCount + childcount;
                            const requiredRooms = Math.max(
                              Math.ceil(totalPeople / maxAdultsPerRoom),
                              Math.ceil(childcount / maxChildrenPerRoom)
                            );
                            setadultcount(newAdultCount);
                            if (requiredRooms > numberOfRoom) {
                              setNumberOfRoom(requiredRooms);
                            }
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Child Count */}
                    <div className="flex gap-3 justify-between">
                      <p className="text-nowrap text-gray-700">Child Count</p>
                      <div className="flex items-center gap-3">
                        <button
                          className="px-2 border text-black"
                          onClick={() => {
                            if (childcount > 0) {
                              setchildcount(childcount - 1);
                              setChildAges(childAges.slice(0, -1));
                              const totalPeople = adultcount + (childcount - 1);
                              const requiredRooms = Math.max(
                                Math.ceil(totalPeople / maxAdultsPerRoom),
                                Math.ceil((childcount - 1) / maxChildrenPerRoom)
                              );
                              if (requiredRooms <= numberOfRoom) {
                                setNumberOfRoom(requiredRooms);
                              }
                            }
                          }}
                        >
                          -
                        </button>
                        <p className="px-2 border text-gray-700">{childcount}</p>
                        <button
                          className="px-2 text-black border"
                          onClick={() => {
                            const newChildCount = childcount + 1;
                            const totalPeople = adultcount + newChildCount;
                            const requiredRooms = Math.max(
                              Math.ceil(totalPeople / maxAdultsPerRoom),
                              Math.ceil(newChildCount / maxChildrenPerRoom)
                            );
                            setchildcount(newChildCount);
                            setChildAges([...childAges, 1]);
                            if (requiredRooms > numberOfRoom) {
                              setNumberOfRoom(requiredRooms);
                            }
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Child Ages */}
                    {childcount > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-700">Child Ages</p>
                        {Array.from({ length: childcount }).map((_, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <label className="text-gray-700" htmlFor={`child-age-${index}`}>
                              Child {index + 1} Age:
                            </label>
                            <input
                              type="number"
                              id={`child-age-${index}`}
                              value={childAges[index] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const newAges = [...childAges];
                                if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 18)) {
                                  newAges[index] = value === "" ? 0 : parseInt(value);
                                  setChildAges(newAges);
                                } else {
                                  alert("Child age must be between 1 and 18.");
                                }
                              }}
                              min="0"
                              max="18"
                              placeholder="1-18"
                              className="p-1 border rounded text-gray-700 w-16"
                              aria-label={`Enter age for child ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Room Count */}
                    <div className="flex gap-3 justify-between">
                      <p className="text-nowrap text-gray-700">Room Count</p>
                      <div className="flex items-center gap-3">
                        <button
                          className="px-2 border text-black"
                          onClick={() => {
                            const totalPeople = adultcount + childcount;
                            const requiredRooms = Math.max(
                              Math.ceil(totalPeople / maxAdultsPerRoom),
                              Math.ceil(childcount / maxChildrenPerRoom)
                            );
                            if (numberOfRoom > requiredRooms) {
                              setNumberOfRoom(numberOfRoom - 1);
                            }
                          }}
                        >
                          -
                        </button>
                        <p className="px-2 border">{numberOfRoom}</p>
                        <button
                          className="px-2 text-black border"
                          onClick={() => {
                            setNumberOfRoom(numberOfRoom + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Search Hotels Button */}
            <div className="flex justify-center items-center">
              <button
                onClick={handlehotelSearch}
                className="bg-[#0A5EB0] w-full md:w-fit text-nowrap py-2 px-4 font-semibold text-lg rounded-md text-white"
              >
                Search Hotels
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelsComp;