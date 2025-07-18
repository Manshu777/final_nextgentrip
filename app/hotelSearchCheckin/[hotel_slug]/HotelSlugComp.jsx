'use client';
import React, { useEffect, useState } from 'react';
import { getSingleHotel } from '../../Component/Store/slices/getHotelSlice';
import { useDispatch, useSelector } from 'react-redux';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import {
  MdDinnerDining, MdRoomService, MdOutlineBreakfastDining, MdOutlineLocalLaundryService, MdPool, MdFitnessCenter,
  MdOutlineHealthAndSafety, MdCancel, MdOutlineCancel
} from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { GiElevator, GiCoffeeCup } from "react-icons/gi";
import {
  FaCheck, FaChevronCircleRight, FaChevronDown, FaChevronRight, FaLocationArrow, FaShareAlt, FaStar, FaTimes, FaWifi
} from "react-icons/fa";
import { FaBath, FaCarSide, FaMapLocationDot } from "react-icons/fa6";
import { IoWifiOutline } from "react-icons/io5";
import { RiWheelchairFill } from "react-icons/ri";
import { PiBowlSteamDuotone } from "react-icons/pi";
import { ImCancelCircle } from "react-icons/im";
import { gethotelPreBookingApi } from '../../Component/Store/slices/hotelpreBookslice';
import { useRouter } from 'next/navigation';

const HotelSlugComp = ({ slugs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hotel, sethotel] = useState();
  const router = useRouter();
  const decodedSlug = decodeURIComponent(slugs);
  const params = new URLSearchParams(decodedSlug);
  const checkIn = params.get("checkin");
  const checkOut = params.get("checkout");
  const adults = Number(params.get("adult"));
  const children = Number(params.get("child"));
  const roomes = params.get("roomes");
  const HotelCode = params.get("hotelcode");
  const dispatch = useDispatch();
  const state = useSelector(state => state.gethotelslice);
  const preBookinghotelState = useSelector(state => state.preBookSlice);
  const [imgToggle, setimgToggle] = useState(false);
  const [hotelinfo, sethotelinfo] = useState();
  const [isOpenSecond, setisopen] = useState(false);
  const [handelpricesection, sethandelpriceSection] = useState(false);
  const [description, setDescription] = useState(false);
  const [showingsection, setShowingsection] = useState("");
  const [viewmore, setViewmore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getSingleHotel({ HotelCode, checkIn, checkOut, adults, children, roomes }));
  }, []);

  useEffect(() => {
    sethotelinfo(state);
  }, [state]);

  const handlePreBooking = async (BookingCode) => {
    setLoading(true);
    await dispatch(gethotelPreBookingApi({ BookingCode }));
  };

  useEffect(() => {
    if (
      preBookinghotelState?.info?.HotelResult &&
      preBookinghotelState.info.HotelResult.length > 0
    ) {
      const hotelData = preBookinghotelState.info.HotelResult[0];
      const cancellationPolicies = hotelData.Rooms?.[0]?.CancelPolicies;
      const validationPolicies = preBookinghotelState.info?.ValidationInfo;

      localStorage.setItem("cancellationPolicies", JSON.stringify(cancellationPolicies));
      localStorage.setItem("validationPolicies", JSON.stringify(validationPolicies));
      sethotel(hotelData);
      setIsOpen(true);
      setLoading(false);
    }
  }, [preBookinghotelState]);

  const togglePopup = () => setIsOpen(!isOpen);

  const routeCheckOutPage = () => {
    setIsOpen(false);
    localStorage.setItem("hotelinfo", JSON.stringify(hotelinfo));
    localStorage.setItem("hotelcheckdata", JSON.stringify(hotel));
    router.push('/hotels/checkout');
  };

  return (
    <>
      {isOpen && hotel && (
        <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[#0000008a] z-50 overflow-y-scroll md:pt-16'>
          <div className="bg-white shadow-xl w-full max-h-[80vh] overflow-y-auto max-w-3xl mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{hotel.Rooms[0].Name[0]}</h2>
              <button onClick={togglePopup} className="text-red-500 font-bold text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Room Information:</h3>
                <p>{hotel.Rooms[0].Inclusion}</p>
                <p className="font-semibold text-gray-700">
                  Price per Night: ₹{hotel.Rooms[0].DayRates[0][0].BasePrice} INR
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Fare:</h3>
                <p>₹{hotel.Rooms[0].TotalFare}</p>
                <p className="text-sm text-gray-600">Including taxes: ₹{hotel.Rooms[0].TotalTax}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Cancellation Policy:</h3>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  {hotel.Rooms[0].CancelPolicies.map((policy, index) => (
                    <li key={index}>
                      <span className="font-semibold">{policy.FromDate}:</span>
                      {policy.CancellationCharge === 0 ? "Free cancellation" : `Charge: ₹${policy.CancellationCharge}`}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Amenities:</h3>
                {!viewmore && (
                  <ul className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                    {hotel?.Rooms[0]?.Amenities?.slice(0, 11).map((amenity, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">✓</span>{amenity}
                      </li>
                    ))}
                    {hotel?.Rooms[0]?.Amenities?.length > 11 && (
                      <li className='text-blue-600 cursor-pointer flex items-center' onClick={() => setViewmore(true)}>View More</li>
                    )}
                  </ul>
                )}
                {viewmore && (
                  <ul className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                    {hotel.Rooms[0].Amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">✓</span>{amenity}
                      </li>
                    ))}
                    <li className='text-green-800 cursor-pointer flex items-center' onClick={() => setViewmore(false)}>View less</li>
                  </ul>
                )}
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => routeCheckOutPage()}
                className="w-full bg-blue-600 text-white py-2 hover:bg-blue-500 transition-all"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:px-20 py-5">
        {hotelinfo && hotelinfo.isLoading ? (
          <div className="animate-pulse">
            <div className="flex space-x-2 mt-5 mb-5">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="p-6 bg-white rounded-3xl flex myshadow">
              <div className="lg:w-2/3">
                <div className="flex items-center justify-between mb-5">
                  <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
                <div className="lg:flex gap-5 mb-5">
                  <div className="w-full lg:w-[600px] h-[200px] lg:h-[340px] mb-4 bg-gray-200"></div>
                  <div>
                    <div className="w-full lg:w-[302px] h-40 mb-4 bg-gray-200 rounded-2xl"></div>
                    <div className="w-full lg:w-[302px] h-40 bg-gray-200 rounded-2xl"></div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="space-y-2 w-5/6">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded mt-2"></div>
                </div>
                <div className="mb-5">
                  <h2 className="text-xl font-semibold">Services</h2>
                  <div className="flex mt-4 space-x-4">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 hidden lg:block">
                <div className="border-2 rounded-2xl p-3">
                  <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-5 border-2 rounded-2xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-3xl my-5 shadow-lg">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="w-full h-96 bg-gray-200"></div>
                <div className="lg:w-2/6 space-y-4">
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex space-x-2 text-sm text-gray-600 mt-5 mb-5" id="detpg_bread_crumbs">
              <li><Link href="/hotels" className="text-blue-600 font-semibold">Home</Link></li>
              <li><span> / {hotelinfo?.info?.hoteldetail1?.[0].CityName}</span></li>
              <li><span>/ {hotelinfo?.info?.hoteldetail1?.[0].HotelName} </span></li>
              <li></li>
            </ul>
            {hotelinfo && !hotelinfo.isLoading && hotelinfo.info && hotelinfo.info.hoteldetail1 && (
              <>
                <div className="p-6 bg-white rounded-3xl flex flex-col lg:flex-row w-full justify-between myshadow">
                  <div className="lg:w-2/3 relative">
                    <div className="flex items-center justify-between mb-5" id="WBTH">
                      <h2 className="text-2xl font-bold flex items-center gap-4">
                        {hotelinfo.info.hoteldetail1[0].HotelName}
                        <span className="flex text-base gap-1">
                          {imgToggle && (
                            <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center p-4 z-50 bg-[#000000bc]">
                              <div className="absolute top-20 right-4 z-[999]">
                                <MdOutlineCancel
                                  className="cursor-pointer text-4xl text-[#c1c1c1] hover:text-white transition-colors"
                                  onClick={() => setimgToggle(false)}
                                />
                              </div>
                              <div className="w-full max-w-4xl h-[80vh] overflow-y-auto bg-white rounded-lg p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  {hotelinfo.info.hoteldetail1[0].Images.slice(0, 3).map((img, index) => (
                                    <img
                                      key={index}
                                      src={img}
                                      alt={`Hotel image ${index + 1}`}
                                      className="w-full h-48 object-cover rounded-md"
                                    />
                                  ))}
                                </div>
                                {hotelinfo.info.hoteldetail1[0].Images.length > 3 && (
                                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {hotelinfo.info.hoteldetail1[0].Images.slice(3).map((img, index) => (
                                      <img
                                        key={index}
                                        src={img}
                                        alt={`Hotel image ${index + 4}`}
                                        className="w-full h-48 object-cover rounded-md"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {Array.from({ length: hotelinfo.info.hoteldetail1[0].HotelRating }, (_, index) => (
                            <FaStar key={index} className="text-yellow-400" />
                          ))}
                        </span>
                      </h2>
                    </div>
                    <div className="lg:flex gap-5 mb-5">
                      <div>
                        <div className="relative w-full lg:w-[400px] h-[200px] lg:h-[340px] mb-4">
                          <img
                            src={hotelinfo.info?.hoteldetail1[0]?.Images?.[0] || '/Images/not_found_img.png'}
                            alt="hotel image"
                            className="w-full lg:w-[480px] h-[200px] lg:h-[340px]"
                            layout="fill"
                            objectFit="cover"
                          />
                          <div onClick={() => setimgToggle(true)} className="cursor-pointer absolute bottom-0 left-0 w-full p-2 rounded-b-lg bg-opacity-75 bg-gray-800 text-white text-center">
                            +{hotelinfo.info.hoteldetail1[0]?.Images?.length} property photos
                          </div>
                        </div>
                        {isOpenSecond && (
                          <div className="fixed top-24 left-0 w-screen h-screen overflow-x-auto bg-white flex items-center justify-center z-40">
                            <div className="grid grid-cols-4 gap-4 h-full p-4">
                              {hotelinfo.info.hoteldetail1[0].Images.map((image, index) => (
                                <div key={index} className="relative w-full h-full">
                                  <img
                                    src={image || '/Images/not_found_img.png'}
                                    alt={`Image ${index + 1}`}
                                    className="h-[20rem] w-full lg:w-[600px] lg:h-[340px]"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="relative w-full lg:w-[302px] h-40 mb-4 rounded-2xl">
                          <img
                            src={hotelinfo.info.hoteldetail1[0]?.Images?.[1] || '/Images/not_found_img.png'}
                            alt="hotel image"
                            layout="fill"
                            objectFit="cover"
                            className="w-full lg:w-[302px] h-40"
                          />
                        </div>
                        <div className="relative w-full lg:w-[302px] h-40">
                          <img
                            src={hotelinfo.info.hoteldetail1[0]?.Images?.[2] || '/Images/not_found_img.png'}
                            alt="hotel image"
                            layout="fill"
                            objectFit="cover"
                            className="w-full lg:w-[302px] h-40"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-5">
                      <p>
                        <div
                          className={` ${description ? "h-full" : "h-[9.1rem]"} overflow-hidden w-full `}
                          dangerouslySetInnerHTML={{ __html: hotelinfo.info.hoteldetail1[0].Description }}
                        ></div>
                        <button onClick={() => setDescription(!description)} className="font-bold text-blue-600">
                          {description ? "Read less" : "Read more"}
                        </button>
                      </p>
                    </div>
                    <div className="mb-5">
                      <h2 className="text-xl font-semibold">Services</h2>
                      <ul className="flex mt-4 space-x-4 text-sm">
                        <li className="flex gap-2 items-center"><FaCheck className="text-green-600" /> Wi-Fi</li>
                        <li className="flex gap-2 items-center"><MdRoomService /> Room Service</li>
                        <li className="flex gap-2 items-center"><TbAirConditioning /> Air Conditioning</li>
                        <li>
                          <button onClick={() => sethandelpriceSection("services")} className="text-blue-600 font-semibold">
                            + 14 Services
                          </button>
                        </li>
                      </ul>
                    </div>
                    {handelpricesection === "services" && (
                      <div className='absolute top-0 left-0 h-full w-full bg-white'>
                        <ImCancelCircle className='absolute top-0 right-10 text-3xl' onClick={() => sethandelpriceSection("")} />
                        <div className='grid grid-cols-3 p-4 overflow-y-auto h-full w-full'>
                          {hotelinfo.info.hoteldetail1[0].HotelFacilities.map((service_items) => (
                            <p key={service_items} className='flex flex-col gap-2 my-2 items-center'>
                              {service_items.toLowerCase().includes("wifi") ? <FaWifi className='text-xl' /> :
                                service_items.toLowerCase().includes("wheelchair") ? <RiWheelchairFill className='text-xl' /> :
                                  service_items.toLowerCase().includes("breakfast") ? <MdOutlineBreakfastDining className='text-xl' /> :
                                    service_items.toLowerCase().includes("bathroom") ? <FaBath className='text-xl' /> :
                                      service_items.toLowerCase().includes("parking") ? <FaCarSide className='text-xl' /> :
                                        service_items.toLowerCase().includes("elevator") ? <GiElevator className='text-xl' /> :
                                          service_items.toLowerCase().includes("laundry") ? <MdOutlineLocalLaundryService className='text-xl' /> :
                                            service_items.toLowerCase().includes("pools") ? <MdPool className='text-xl' /> :
                                              service_items.toLowerCase().includes("fitness") ? <MdFitnessCenter className='text-xl' /> :
                                                service_items.toLowerCase().includes("coffee") ? <GiCoffeeCup className='text-xl' /> :
                                                  service_items.toLowerCase().includes("health") ? <MdOutlineHealthAndSafety className='text-xl' /> :
                                                    <MdRoomService className='text-xl' />}
                              {service_items}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {hotelinfo.info.hoteldetail2[0].Rooms[0].RoomPromotion && (
                      <p className="text-sm text-green-600 font-semibold">
                        Promotion: {hotelinfo.info.hoteldetail2[0].Rooms[0].RoomPromotion.join(", ").replace(/\|/g, "")}
                      </p>
                    )}
                  </div>
                  <div className="lg:w-[30%] hidden lg:block lg:sticky lg:top-24 h-full">
                    <div className="mb-5 border-2 rounded-2xl p-3">
                      <div className="mt-5">
                        <p className="text-lg line-through text-gray-500">
                          {hotelinfo.info.hoteldetail2[0].Rooms[0].TotalFare}
                        </p>
                        <p className="text-2xl font-bold text-black">
                          ₹ {Math.floor(hotelinfo.info.hoteldetail2[0].Rooms[0].TotalFare - hotelinfo.info.hoteldetail2[0].Rooms[0].TotalTax)}
                        </p>
                        <p className="text-sm text-gray-700">+ ₹ {hotelinfo.info.hoteldetail2[0].Rooms[0].TotalTax} taxes & fees</p>
                      </div>
                      <div className="mt-5 flex items-center">
                        <button
                          onClick={() => handlePreBooking(hotelinfo.info.hoteldetail2[0].Rooms[0].BookingCode)}
                          className={`px-5 py-2 text-white font-bold rounded-xl transition-all duration-200 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                              </svg>
                              Loading...
                            </span>
                          ) : (
                            "BOOK THIS NOW"
                          )}
                        </button>
                        <button className="ml-8 text-blue-600" onClick={() => sethandelpriceSection("price")}>Price List</button>
                      </div>
                    </div>
                    <div className="mt-5 border-2 rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white text-lg font-bold p-2 rounded-full">4.8</div>
                        <div>
                          <span className="font-bold">Excellent</span>
                          <span className="ml-2 text-gray-600 text-sm">(16 RATINGS)</span>
                          <p className="text-gray-600 text-sm">94% guests rated this property 4</p>
                        </div>
                        <button className="ml-5 text-blue-600 text-sm">All Reviews</button>
                      </div>
                      <hr className="my-5 border-gray-300" />
                      <div className="flex gap-3 items-center">
                        <img src="/images/google-maps.webp" alt="Candolim" className="mr-2 lg:w-10 h-full" />
                        <div>
                          <p className="font-bold">Candolim</p>
                          <p className="text-gray-600 text-sm">5 minutes walk to Candolim Beach</p>
                        </div>
                        <a target='_blank' href={`http://maps.google.com/maps?q=${hotelinfo.info.hoteldetail1[0].Map.split("|")[0]},${hotelinfo.info.hoteldetail1[0].Map.split("|")[1]}&z=15&output=embed`} className="ml-5 text-blue-600 text-sm">
                          See on Map
                        </a>
                      </div>
                    </div>
                    {handelpricesection === "price" && (
                      <div className='absolute top-0 h-full overflow-y-scroll w-full bg-white p-4'>
                        <p className='text-center my-2 text-2xl'>Price List</p>
                        <ImCancelCircle className='absolute top-0 right-0 text-3xl' onClick={() => sethandelpriceSection("")} />
                        <div className='flex flex-col gap-4'>
                          {hotelinfo.info.hoteldetail2[0].Rooms[0].DayRates[0].map((info_p, indp) => (
                            <div key={indp} className='flex gap-3'>
                              <p>Day {indp + 1}</p> : <p> ₹ {info_p.BasePrice}</p>
                            </div>
                          ))}
                          <div className='flex gap-3'>
                            <p className='font-semibold'>Taxs</p> : <p>₹ {hotelinfo.info.hoteldetail2[0].Rooms[0].TotalTax}</p>
                          </div>
                        </div>
                        <div className='flex gap-3 my-9 font-bold text-2xl'>
                          <p>Total</p> : <p> ₹{hotelinfo.info.hoteldetail2[0].Rooms[0].TotalFare}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 bg-white my-5 myshadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">Change Dates and Guest(s)</p>
                      <p className="text-sm mt-1">
                        Check-in: {hotelinfo.info.hoteldetail1[0].CheckInTime} | Check-out: {hotelinfo.info.hoteldetail1[0].CheckOutTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Address:</p>
                      <p className="text-sm mt-1 flex justify-center items-center gap-2">
                        <FaMapLocationDot className='text-xl text-[#000000c9]' /> {hotelinfo.info.hoteldetail1[0].Address}
                      </p>
                    </div>
                  </div>
                  <div className="xl:w-1/3 flex lg:hidden flex-col md:flex-row md:justify-around h-full">
                    <div className="mb-5 border-2 rounded-2xl p-3">
                      <h3 className="text-lg font-bold">Classic</h3>
                      <p className="mt-2 text-gray-700">Fits 2 Adults</p>
                      <div className="mt-5">
                        <p className="text-lg line-through text-gray-500">
                          {hotelinfo.info.hoteldetail2[0].Rooms[0].TotalFare}
                        </p>
                        <p className="text-2xl font-bold text-black">
                          ₹ {Math.floor(hotelinfo.info.hoteldetail2[0].Rooms[0].TotalFare - hotelinfo.info.hoteldetail2[0].Rooms[0].TotalTax)}
                        </p>
                        <p className="text-sm text-gray-700">+ ₹ {hotelinfo.info.hoteldetail2[0].Rooms[0].TotalTax} taxes & fees</p>
                      </div>
                      <div className="mt-5 flex items-center">
                        <button
                          onClick={() => handlePreBooking(hotelinfo.info.hoteldetail2[0].Rooms[0].BookingCode)}
                          className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                        >
                          BOOK THIS NOW
                        </button>
                        <button className="ml-8 text-blue-600" onClick={() => sethandelpriceSection("price")}>Price List</button>
                      </div>
                    </div>
                    <div className="mt-5 border-2 rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white text-lg font-bold p-2 rounded-full">4.8</div>
                        <div>
                          <span className="font-bold">Excellent</span>
                          <span className="ml-2 text-gray-600 text-sm">(16 RATINGS)</span>
                          <p className="text-gray-600 text-sm">94% guests rated this property 4</p>
                        </div>
                        <button className="ml-5 text-blue-600 text-sm">All Reviews</button>
                      </div>
                      <hr className="my-5 border-gray-300" />
                      <div className="flex gap-3 items-center">
                        <div>
                          <p className="font-bold">Candolim</p>
                          <p className="text-gray-600 text-sm">5 minutes walk to Candolim Beach</p>
                        </div>
                        <a target='_blank' href={`http://maps.google.com/maps?q=${hotelinfo.info.hoteldetail1[0].Map.split("|")[0]},${hotelinfo.info.hoteldetail1[0].Map.split("|")[1]}&z=15&output=embed`} className="ml-5 text-blue-600 text-sm">
                          See on Map
                        </a>
                      </div>
                    </div>
                    {handelpricesection === "price" && (
                      <div className='absolute top-0 h-full overflow-y-scroll w-full bg-white p-4'>
                        <p className='text-center my-2 text-2xl'>Price List</p>
                        <ImCancelCircle className='absolute top-0 right-0 text-3xl' onClick={() => sethandelpriceSection("")} />
                        <div className='flex flex-col gap-4'>
                          {hotelinfo.info.hoteldetail2[0].Rooms[0].DayRates[0].map((info_p, indp) => (
                            <div key={indp} className='flex gap-3'>
                              <p>Day {indp + 1}</p> : <p> ₹ {info_p.BasePrice}</p>
                            </div>


                          ))}
                          <div className='flex gap-3'>
                            <p className='font-semibold'>Taxes</p> : <p>₹ {hotelinfo.info.hoteldetail2[0].Rooms[0].TotalTax}</p>
                          </div>
                        </div>
                        <div className='flex gap-3 my-9 font-bold text-2xl'>
                          <p>Total</p> : <p> ₹{hotelinfo.info.hoteldetail2[0].Rooms[0].TotalFare}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* New Available Rooms Section */}
                <section className="p-6 bg-white rounded-3xl my-5 shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotelinfo.info.hoteldetail2[0].Rooms.map((room, index) => (
                      <div key={index} className="border rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold">{room.Name[0]}</h3>
                        <p className="text-sm text-gray-600 mt-1">Inclusion: {room.Inclusion}</p>
                        <p className="text-sm text-gray-600">Meal Type: {room.MealType.replace('_', ' ')}</p>
                        {room.RoomPromotion && (
                          <p className="text-sm text-green-600 font-semibold mt-1">
                            Promotion: {room.RoomPromotion.join(", ").replace(/\|/g, "")}
                          </p>
                        )}
                        <div className="mt-3">
                          <p className="text-lg line-through text-gray-500">₹{room.TotalFare}</p>
                          <p className="text-xl font-bold text-black">
                            ₹{Math.floor(room.TotalFare - room.TotalTax)}
                          </p>
                          <p className="text-sm text-gray-700">+ ₹{room.TotalTax} taxes & fees</p>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold">Cancellation Policy:</h4>
                          <ul className="list-disc pl-5 text-sm text-gray-600">
                            {room.CancelPolicies.map((policy, idx) => (
                              <li key={idx}>
                                From {policy.FromDate}: {policy.CancellationCharge === 0 ? "Free cancellation" : `${policy.ChargeType} charge: ${policy.CancellationCharge}%`}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => handlePreBooking(room.BookingCode)}
                            className={`w-full py-2 text-white font-bold rounded-xl transition-all duration-200 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                            disabled={loading}
                          >
                            {loading ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Loading...
                              </span>
                            ) : (
                              "Book This Room"
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="p-6 bg-white rounded-3xl my-5 shadow-lg" id="">
                  <p className="text-lg font-semibold mb-1">Location</p>
                  <span className="text-sm font-semibold">
                    The Location of Super Townhouse Candolim has been rated 4.9 by 19 guests
                  </span>
                  <div className="flex flex-col lg:flex-row gap-10 mt-5">
                    <div className="flex justify-center items-center lg:w-4/6">
                      <iframe
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-96 lg:w-full md:h-[475px]"
                        src={`http://maps.google.com/maps?q=${hotelinfo.info.hoteldetail1[0].Map.split("|")[0]},${hotelinfo.info.hoteldetail1[0].Map.split("|")[1]}&z=15&output=embed`}
                      ></iframe>
                    </div>
                    <div className="lg:w-2/6">
                      <div>
                        <div className="selected flex items-center gap-4 cursor-pointer py-5 border-b" onClick={() => setShowingsection("contact")}>
                          <img src="/images/location2.webp" alt="CategoryIcon" width={22} height={32} />
                          <p className="ml-2 flex w-full justify-between items-center">
                            <span>Contacts</span>
                            {showingsection === "contact" ? <FaChevronDown /> : <FaChevronRight />}
                          </p>
                        </div>
                        {showingsection === "contact" && (
                          <ul className="space-y-4 w-full overflow-hidden h-[200px] custom-scrollbar overflow-y-auto p-3">
                            <li>
                              <span className="flex items-center gap-4">
                                <div className="ml-4 w-full flex flex-col gap-2">
                                  <div className='flex items-center gap-2'>
                                    <div>Number :</div>
                                    <a href={`tel:${hotelinfo.info.hoteldetail1[0].PhoneNumber}`} className="bg-blue-500 w-max px-3 text-white text-nowrap font-semibold p-1 rounded mb-1">
                                      + {hotelinfo.info.hoteldetail1[0].PhoneNumber}
                                    </a>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <div>Fax-number :</div>
                                    <a href={`tel:${hotelinfo.info.hoteldetail1[0].FaxNumber}`} className="bg-blue-500 w-max px-3 text-white text-nowrap font-semibold p-1 rounded mb-1">
                                      + {hotelinfo.info.hoteldetail1[0].FaxNumber}
                                    </a>
                                  </div>
                                </div>
                              </span>
                            </li>
                          </ul>
                        )}
                      </div>
                      <div>
                        <div className="selected flex items-center gap-4 cursor-pointer py-5 border-b" onClick={() => setShowingsection("attractions")}>
                          <img src="/images/cameraonr.webp" alt="CategoryIcon" width={22} height={39} />
                          <p className="ml-2 flex w-full justify-between items-center">
                            <span>Attractions</span>
                            {showingsection === "attractions" ? <FaChevronDown /> : <FaChevronRight />}
                          </p>
                        </div>
                        {showingsection === "attractions" && (
                          <ul className="space-y-4 w-full overflow-hidden h-[200px] custom-scrollbar overflow-y-auto p-3">
                            <li>
                              <span className="flex items-center gap-4">
                                <div dangerouslySetInnerHTML={{ __html: hotelinfo.info.hoteldetail1[0].Attractions["1) "] }}></div>
                              </span>
                            </li>
                          </ul>
                        )}
                      </div>
                      <div>
                        <div className="selected flex w-full items-center gap-4 cursor-pointer py-5 border-b" onClick={() => setShowingsection("transport")}>
                          <img src="/images/flight_train.webp" alt="CategoryIcon" width={22} height={40} />
                          <p className="ml-2 flex w-full justify-between items-center">
                            <span>Transport</span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="selected flex items-center gap-4 cursor-pointer py-5 border-b" onClick={() => setShowingsection("restaurants")}>
                          <img src="/images/restaurant.webp" alt="CategoryIcon" width={22} height={40} />
                          <p className="ml-2 flex w-full justify-between items-center">
                            <span>Restaurants</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default HotelSlugComp;