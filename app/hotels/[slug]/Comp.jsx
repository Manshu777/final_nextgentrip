"use client";
import HotelsComp from "../../Component/AllComponent/formMaincomp/HotelsComp";
import { getAllhotelsapi } from "../../Component/Store/slices/hotelsSlices";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShareAlt, FaStar } from "react-icons/fa";
import { MdOutlineCancel, MdFilterList } from "react-icons/md";
import { BiRefresh } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Comp = ({ slug }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const allhoteldata = useSelector((state) => state.hotelsSlice);
  const currencylist = useSelector((state) => state.currencySlice);
  const defaultcurrency = JSON.parse(localStorage.getItem("usercurrency")) || {
    symbol: "₹",
    code: "INR",
    country: "India",
  };
  const cuntryprice = currencylist?.info?.rates?.[defaultcurrency.code];

  // Parse URL parameters
  const decodedSlug = decodeURIComponent(slug);
  const params = new URLSearchParams(decodedSlug);
  const cityCode = params.get("citycode");
  const cityName = params.get("cityName");
  const checkIn = params.get("checkin");
  const checkOut = params.get("checkout");
  const adults = Number(params.get("adult"));
  const children = Number(params.get("child"));
  const roomes = params.get("roomes");
  const childAgesString = params.get("childAges");
  const childAges = useMemo(() => {
    return childAgesString
      ? childAgesString.split(",").map((age) => Number(age.trim()))
      : [];
  }, [childAgesString]);
  const page = params.get("page");

  // State management
  const [allhotel, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hotalbackup, setHotalBackup] = useState(null);
  const [showImg, setShowImg] = useState(null);
  const [seepagination, setPagination] = useState(true);
  const [selectedStars, setSelectedStars] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortOption, setSortOption] = useState(null);

  // Render star ratings
  const renderStars = (rating) => {
    const starCount = Math.round(Number(rating));
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <FaStar key={index} className={index < starCount ? "text-yellow-400" : "text-gray-300"} />
        ))}
      </div>
    );
  };

  // Get images with fallback
  const getImages = (hotelDetails) => {
    return hotelDetails?.HotelDetails?.[0]?.Images || hotelDetails?.HotelDetails?.[0]?.images || [];
  };

  // Fetch hotels on mount
  useEffect(() => {
    dispatch(
      getAllhotelsapi({
        cityCode,
        checkIn,
        checkOut,
        adults,
        childAges,
        children,
        page,
      })
    );
  }, [dispatch, cityCode, checkIn, checkOut, adults, children, page, childAgesString]);

  // Update hotel data when Redux state changes
  useEffect(() => {
    if (allhoteldata.info?.totalHotels && !allhoteldata.isLoading) {
      setAllHotels(allhoteldata.info.totalHotels);
      setFilteredHotels(allhoteldata.info.totalHotels);
      setHotalBackup(allhoteldata);
    }
  }, [allhoteldata]);

  // Filter and sort hotels
  const applyFilters = () => {
    let filtered = [...allhotel];

    // Filter by star rating
    if (selectedStars) {
      const starValue = parseInt(selectedStars.replace("star", ""));
      filtered = filtered.filter(
        (hotel) => hotel.hotelDetails.HotelDetails[0].HotelRating === starValue
      );
    }

    // Filter by price range
    if (selectedPriceRange) {
      filtered = filtered.filter((hotel) => {
        const minPrice = Math.min(
          ...hotel.searchResults.Rooms.map((room) => room.TotalFare)
        );
        switch (selectedPriceRange) {
          case "price1":
            return minPrice >= 0 && minPrice <= 1500;
          case "price2":
            return minPrice > 1500 && minPrice <= 3500;
          case "price3":
            return minPrice > 3500 && minPrice <= 7500;
          case "price4":
            return minPrice > 7500 && minPrice <= 11500;
          case "price5":
            return minPrice > 11500 && minPrice <= 15000;
          case "price6":
            return minPrice > 15000;
          default:
            return true;
        }
      });
    }

    // Sort hotels
    if (sortOption) {
      filtered.sort((a, b) => {
        const aPrice = Math.min(
          ...a.searchResults.Rooms.map((room) => room.TotalFare)
        );
        const bPrice = Math.min(
          ...b.searchResults.Rooms.map((room) => room.TotalFare)
        );
        switch (sortOption) {
          case "L-H":
            return aPrice - bPrice;
          case "H-L":
            return bPrice - aPrice;
          case "bestRating":
            return (
              b.hotelDetails.HotelDetails[0].HotelRating -
              a.hotelDetails.HotelDetails[0].HotelRating
            );
          case "newest":
            return (
              parseInt(b.searchResults.HotelCode) -
              parseInt(a.searchResults.HotelCode)
            );
          default:
            return 0;
        }
      });
    }

    setFilteredHotels(filtered);
    setPagination(false);
  };

  // Apply filters when state changes
  useEffect(() => {
    applyFilters();
  }, [selectedStars, selectedPriceRange, sortOption, allhotel]);

  // Reset filters
  const resetFilters = () => {
    setSelectedStars(null);
    setSelectedPriceRange(null);
    setSortOption(null);
    setFilteredHotels(allhotel);
    setPagination(true);
  };

  // Handle filter changes
  const handleStarChange = (e) => {
    setSelectedStars(e.target.value);
  };

  const handlePriceChange = (e) => {
    setSelectedPriceRange(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (hotalbackup?.info?.len && page < hotalbackup.info.len - 1) {
      resetFilters();
      router.push(
        `/hotels/cityName=${cityName}&citycode=${cityCode}&checkin=${checkIn}&checkout=${checkOut}&adult=${adults}&child=${children}&roomes=${roomes}&page=${Number(page) + 1
        }`
      );
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      resetFilters();
      router.push(
        `/hotels/cityName=${cityName}&citycode=${cityCode}&checkin=${checkIn}&checkout=${checkOut}&adult=${adults}&child=${children}&roomes=${roomes}&page=${Number(page) - 1
        }`
      );
    }
  };

  return (
    <>
      <HotelsComp />

      {allhoteldata.isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="loader"></div>
          <p className="ml-4 text-lg font-semibold text-gray-700">Loading</p>
        </div>
      ) : null}

      <div className="p-4 flex gap-4 relative max-w-7xl mx-auto">
        {/* Filter Section */}
        <div className="hidden lg:flex w-1/4 p-4 sticky top-24 h-[85vh] bg-white border border-gray-200 rounded-lg shadow-lg hover:border-blue-600 transition-all duration-300 flex-col">
          <div className="flex items-center gap-3 text-lg font-semibold text-gray-700 mb-4">
            <MdFilterList className="text-2xl text-blue-600" /> Filters
          </div>

          {/* Star Rating Filter */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-2">By Stars</p>
            <div className="flex flex-col gap-2 pl-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="star"
                    value={`star${star}`}
                    checked={selectedStars === `star${star}`}
                    onChange={handleStarChange}
                    className="text-blue-600 focus:ring-blue-500"
                    aria-label={`${star} Star rating`}
                  />
                  <span className="flex items-center gap-1 text-gray-700 hover:text-blue-600">
                    {[...Array(star)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                    <span className="ml-1">{star} Star{star > 1 ? "s" : ""}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-2">Price per Night</p>
            <div className="flex flex-col gap-2 pl-4">
              {[
                { id: "price1", range: "₹0 - ₹1500" },
                { id: "price2", range: "₹1500 - ₹3500" },
                { id: "price3", range: "₹3500 - ₹7500" },
                { id: "price4", range: "₹7500 - ₹11500" },
                { id: "price5", range: "₹11500 - ₹15000" },
                { id: "price6", range: "₹15000+" },
              ].map((price) => (
                <label key={price.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value={price.id}
                    checked={selectedPriceRange === price.id}
                    onChange={handlePriceChange}
                    className="text-blue-600 focus:ring-blue-500"
                    aria-label={price.range}
                  />
                  <span className="text-gray-700 hover:text-blue-600">{price.range}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sorting Options */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-2">Sort By</p>
            <div className="grid grid-cols-2 gap-2 pl-4">
              {[
                { id: "L-H", label: "Price: Low to High" },
                { id: "H-L", label: "Price: High to Low" },
                { id: "bestRating", label: "Best Rating" },
                { id: "newest", label: "Newest" },
              ].map((sort) => (
                <label key={sort.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value={sort.id}
                    checked={sortOption === sort.id}
                    onChange={handleSortChange}
                    className="text-blue-600 focus:ring-blue-500"
                    aria-label={sort.label}
                  />
                  <span className="text-gray-700 hover:text-blue-600">{sort.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center mt-auto">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Reset <BiRefresh className="text-xl" />
            </button>
          </div>
        </div>

        {/* Hotel List */}
        <div className="w-full lg:w-3/4 flex flex-col">
          {allhoteldata.isLoading ? (
            <div className="p-5 text-center text-gray-500">Loading hotels...</div>
          ) : allhoteldata.error ? (
            <div className="p-5 text-center text-red-500">
              Failed to load hotels: {allhoteldata.error.message || "Unknown error"}
            </div>
          ) : filteredHotels.length > 0 ? (
            filteredHotels.map((hotel, index_num) => (
              <div
                key={index_num}
                className="bg-white border hover:border-blue-600 mb-5 rounded-lg shadow-lg"
              >
                {showImg === index_num && (
                  <div className="fixed top-16 left-0 z-40 w-full h-[90vh] border-8 border-white bg-white overflow-scroll grid grid-cols-3 gap-2">
                    <MdOutlineCancel
                      onClick={() => setShowImg(null)}
                      className="fixed top-24 cursor-pointer right-10 text-orange-500 text-5xl"
                    />
                    {getImages(hotel?.hotelDetails).map((imgs) => (
                      <img
                        key={imgs}
                        src={imgs}
                        className="h-[25rem] w-full object-cover"
                        alt="hotel"
                      />
                    ))}
                  </div>
                )}

                <div className="block md:flex relative p-5">
                  <div className="relative">
                    <div className="relative">
                      <img
                        src={getImages(hotel?.hotelDetails)[0] || "/images/not_found_img.png"}
                        alt="hotelImg"
                        className="object-cover w-full h-[10rem] lg:w-[35rem] lg:h-[15rem] rounded-md"
                      />
                      <div className="absolute bottom-2 right-2">
                        <button className="bg-blue-600 text-white rounded-full w-20 h-8 flex items-center justify-center">
                          <span className="text-xs flex items-center gap-2">
                            Share <FaShareAlt />
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center md:justify-start mt-2 space-x-2">
                      {getImages(hotel?.hotelDetails)
                        .slice(1, 5)
                        .map((image, index) => (
                          <div key={index} className="relative rounded-sm">
                            <img
                              src={image}
                              alt={`hotel_image_${index + 1}`}
                              className="object-cover rounded-sm h-[3rem] w-[5rem]"
                            />
                            {index === 3 && (
                              <span
                                onClick={() => setShowImg(index_num)}
                                className="cursor-pointer absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-xs rounded-sm"
                              >
                                View All
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex-1 pl-0 md:pl-5">
                    <div className="my-5 md:my-0 flex justify-between items-center">
                      <p className="text-base md:text-2xl font-black">
                        {hotel?.hotelDetails?.HotelDetails?.[0]?.HotelName}
                      </p>
                      <div>
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white px-2 text-sm rounded-full">
                            {hotel?.hotelDetails?.HotelDetails?.[0]?.HotelRating}
                          </span>
                          <span className="ml-2 text-blue-600">
                            {hotel?.hotelDetails?.HotelDetails?.[0]?.HotelRating}
                          </span>
                        </div>
                        <div className="hidden md:flex items-center justify-center mt-2">
                          {renderStars(hotel?.hotelDetails?.HotelDetails?.[0]?.HotelRating)}
                        </div>
                      </div>
                    </div>

                    <div className="text-gray-500">
                      <span className="text-blue-600">
                        {hotel?.hotelDetails?.HotelDetails?.[0]?.Address}
                      </span>
                    </div>

                    {hotel?.searchResults?.Status?.Code === 200 &&
                      hotel?.searchResults?.Rooms?.length > 0 ? (
                      hotel.searchResults.Rooms.map((items_price, roomIndex) => (
                        <div key={roomIndex}>
                          <div className="flex items-end justify-between">
                            <div className="mt-4">
                              <p className="text-xl font-black">
                                {defaultcurrency.symbol}
                                {Math.floor(items_price.TotalFare - items_price.TotalTax)}
                              </p>
                              <p className="text-gray-500">
                                + {defaultcurrency.symbol}
                                {items_price.TotalTax} taxes & fees
                              </p>
                              <p className="text-sm text-gray-500 mt-2">Per Night</p>
                            </div>
                            <Link
                              href={`/hotelSearchCheckin/cityName=${encodeURIComponent(
                                cityName
                              )}&checkin=${checkIn}&checkout=${checkOut}&adult=${adults}&child=${children}&roomes=${roomes}&hotelcode=${hotel.searchResults.HotelCode
                                }${childAges.length > 0 ? `&childAges=${childAges.join(",")}` : ""}`}
                              className="bg-orange-600 text-white rounded-full w-28 h-8 flex items-center justify-center"
                            >
                              <span className="text-xs flex items-center gap-2">View Room</span>
                            </Link>
                          </div>
                          <div className="hidden md:block bg-[#ECF5FE] px-5 py-2 text-sm shadow-lg">
                            <span className="text-gray-700">
                              Exclusive offer on Canara Bank Credit Cards. Get {defaultcurrency.symbol}241 off
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-5 mt-10">No available rooms</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-5 text-center text-gray-500">No hotels available</div>
          )}

          {/* Pagination */}
          {seepagination && hotalbackup?.info?.len > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handlePrevPage}
                disabled={page <= 0}
                className={`px-4 py-2 rounded-lg font-semibold ${page <= 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                Previous
              </button>
              <span className="flex items-center text-gray-700">
                Page {Number(page) + 1} of {hotalbackup?.info?.len}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page >= hotalbackup?.info?.len - 1}
                className={`px-4 py-2 rounded-lg font-semibold ${page >= hotalbackup?.info?.len - 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Comp;