"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import Navbar from "../Navbar";
import { IoLocationSharp } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";
import TypeWriterHeaderEffect from "../TypeWriterHeaderEffect";
import MiniNav from "../MiniNav";
import { useDispatch, useSelector } from "react-redux";
import { getAllCountries } from "../../Store/slices/citysearchSlice";
import AutoSearchcity from "../AutoSearchcity";
import TravellerDropDownhotels from "../TravellerDropDownhotels";

const HotelsComp = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const localTimeZone = getLocalTimeZone();
  const currentDate = today(localTimeZone);

  // Initialize Check In to current date
  const [arivitime, setarivitime] = useState(currentDate.toDate(localTimeZone));

  // Initialize Check Out to next day
  const [checkOut, setcheckOut] = useState(() => {
    const nextDay = currentDate.toDate(localTimeZone);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  });

  const [isVisible, setIsVisible] = useState("");
  // Updated state to differentiate between city and hotel
  const [city, setCity] = useState({ Name: "delhi", Code: "130443", isHotel: false });
  const [adultcount, setadultcount] = useState(1);
  const [childcount, setchildcount] = useState(0);
  const [numberOfRoom, setNumberOfRoom] = useState(1);
  const [childAges, setChildAges] = useState([]);
  const [cnCoide, setcnCoide] = useState("IN");
  const [isOpen, setIsOpen] = useState(false);

  const handleCitySelect = (selectedItem) => {
    if (typeof selectedItem !== "object" || !selectedItem) {
      console.error("Invalid selection:", selectedItem);
      alert("Please select a valid city or hotel.");
      return;
    }

    // Check if the selection is a hotel
    if (selectedItem.hotel_name && selectedItem.hotel_code) {
      console.log("Selected hotel:", selectedItem);
      setCity({
        Name: selectedItem.hotel_name,
        Code: selectedItem.hotel_code,
        cityCode: selectedItem.city_code, // Store city_code for reference
        cityName: selectedItem.city_name,
        isHotel: true,
      });

      // Save to Top Hotels
      saveToLocalStorage("TopHotels", {
        hotelName: selectedItem.hotel_name,
        hotelCode: selectedItem.hotel_code,
        cityCode: selectedItem.city_code,
        cityName: selectedItem.city_name,
      });
    } else if (selectedItem.city_name && selectedItem.city_code) {
      console.log("Selected city:", selectedItem);
      setCity({
        Name: selectedItem.city_name,
        Code: selectedItem.city_code,
        isHotel: false,
      });

      // Save to Top Cities
      saveToLocalStorage("TopCities", {
        Name: selectedItem.city_name,
        Code: selectedItem.city_code,
      });
    } else {
      console.error("Invalid selection:", selectedItem);
      alert("Please select a valid city or hotel.");
      return;
    }

    setIsVisible(false);
  };

  const saveToLocalStorage = (key, newItem, maxItems = 5) => {
    try {
      const items = JSON.parse(localStorage.getItem(key)) || [];
      const updatedItems = items.filter(
        (item) => item.Code !== newItem.Code && item.hotelCode !== newItem.hotelCode
      );
      updatedItems.unshift(newItem);
      if (updatedItems.length > maxItems) updatedItems.pop();
      localStorage.setItem(key, JSON.stringify(updatedItems));
    } catch (error) {
      console.error(`Error saving to ${key}:`, error);
      alert(`Failed to save ${key}. Please try again.`);
    }
  };

  const handleVisibilityChange = (value) => {
    setIsVisible(value);
  };

  const handleClick = (option) => {
    setIsVisible(option);
  };

  // Update Check In date
  const handelreturn = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    setarivitime(date);
    setcheckOut(nextDate);
    setIsVisible("");
  };

  // Update Check Out date
  const handelreturn2 = (newRange) => {
    const date = new Date(newRange.year, newRange.month - 1, newRange.day);
    if (date <= arivitime) {
      alert("Check Out date must be after Check In date.");
      return;
    }
    setcheckOut(date);
    setIsVisible("");
  };

  useEffect(() => {
    dispatch(getAllCountries());
  }, [dispatch]);

  useEffect(() => {
    const topCities = JSON.parse(localStorage.getItem("TopCities")) || [];
    if (topCities.length > 0) {
      setCity({ ...topCities[0], isHotel: false });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handlehotelSearch = () => {
  if (!city.Code || !city.Name) {
    alert("Please select a valid city or hotel.");
    return;
  }

  if (!arivitime || !checkOut || isNaN(new Date(arivitime)) || isNaN(new Date(checkOut))) {
    alert("Please provide valid check-in and check-out dates.");
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
      place: { Name: city.Name, Code: city.Code, isHotel: city.isHotel, cityCode: city.cityCode },
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

  // Determine if it's a hotel or city search
  const isHotel = city.isHotel;
  const nameKey = isHotel ? "hotelName" : "cityName";
  const nameValue = encodeURIComponent(city.Name);
  // Always use cityCode, whether it's a hotel or city
  const codeValue = encodeURIComponent(city.isHotel ? city.cityCode : city.Code);

  console.log("Selected Name:", city.Name, "Is Hotel:", isHotel, "City Code:", codeValue);

  router.push(
    `/hotels/${nameKey}=${nameValue}&citycode=${codeValue}&checkin=${encodeURIComponent(
      checkInDate
    )}&checkout=${encodeURIComponent(checkOutDate)}&adult=${encodeURIComponent(
      adultcount
    )}&child=${encodeURIComponent(childcount)}${childAgesQuery}&rooms=${encodeURIComponent(
      numberOfRoom
    )}&page=0&star=0`
  );
};
  const maxAdultsPerRoom = 8;
  const maxChildrenPerRoom = 4;

  return (
    <div className="header relative md:px-5 lg:px-12 xl:px-24">
      <div className="bg-[#002043] h-[12rem] absolute inset-0 -z-10" />
      <MiniNav />
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
                <div className="flex flex-col">
                  <span className="text-[12px] md:text-xl text-black font-bold capitalize">
                    {city.Name}
                  </span>
                </div>
              </div>
              {isVisible === "city" && (
                <AutoSearchcity
                  value="From"
                  handleClosed={handleVisibilityChange}
                  onSelect={handleCitySelect}
                  visible={setIsVisible}
                  countercode={cnCoide}
                />
              )}
            </div>
            {/* Check In Date */}
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
                    aria-label="Select check-in date"
                    value={currentDate}
                    onChange={handelreturn}
                    minValue={currentDate}
                  />
                </div>
              )}
            </div>
            {/* Check Out Date */}
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
                    aria-label="Select check-out date"
                    value={currentDate.add({ days: 1 })}
                    onChange={handelreturn2}
                    minValue={currentDate.add({ days: 1 })}
                  />
                </div>
              )}
            </div>
            {/* Travellers and Rooms */}
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