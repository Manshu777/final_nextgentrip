"use client";
import HotelsComp from "../../Component/AllComponent/formMaincomp/HotelsComp";
import { getAllhotelsapi } from "../../Component/Store/slices/hotelsSlices";
import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  const cuntryprice = currencylist?.info?.rates?.[defaultcurrency.code] || 1;

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
  const page = Number(params.get("page")) || 1; // Backend uses 1-based indexing

  // State management
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [showImg, setShowImg] = useState(null);
  const [selectedStars, setSelectedStars] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortOption, setSortOption] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Render star ratings
  const renderStars = useCallback((rating) => {
    const starCount = Math.round(Number(rating));
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <FaStar key={index} className={index < starCount ? "text-yellow-400" : "text-gray-300"} />
        ))}
      </div>
    );
  }, []);



  // Get images with fallback
  const getImages = useCallback((hotelDetails) => {
    return hotelDetails?.HotelDetails?.[0]?.Images || hotelDetails?.HotelDetails?.[0]?.images || [];
  }, []);

  // Fetch hotels on mount or when parameters change
  useEffect(() => {
    dispatch(
      getAllhotelsapi({
        cityCode,
        checkIn,
        checkOut,
        adults,
        children,
        childAges,
        guestNationality: defaultcurrency.country === "India" ? "IN" : "US", // Adjust based on currency
        page,
        per_page: 10, // Match backend default
      })
    );
  }, [dispatch, cityCode, checkIn, checkOut, adults, children, childAges, page, defaultcurrency.country]);

  // Filter and sort hotels
  const applyFilters = useCallback(() => {
    let filtered = [...(allhoteldata.info?.totalHotels || [])];

    // Apply star rating filter
    if (selectedStars) {
      const starValue = parseInt(selectedStars.replace("star", ""));
      filtered = filtered.filter(
        (hotel) => hotel?.hotelDetails?.HotelDetails?.[0]?.HotelRating === starValue
      );
    }

    // Apply price range filter
    if (selectedPriceRange) {
      filtered = filtered.filter((hotel) => {
        const minPrice = Math.min(
          ...(hotel?.searchResults?.Rooms?.map((room) => room?.TotalFare) || [Infinity])
        ) * cuntryprice;
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

    // Apply sorting
    if (sortOption) {
      filtered.sort((a, b) => {
        const aPrice = Math.min(
          ...(a?.searchResults?.Rooms?.map((room) => room?.TotalFare) || [Infinity])
        ) * cuntryprice;
        const bPrice = Math.min(
          ...(b?.searchResults?.Rooms?.map((room) => room?.TotalFare) || [Infinity])
        ) * cuntryprice;
        switch (sortOption) {
          case "L-H":
            return aPrice - bPrice;
          case "H-L":
            return bPrice - aPrice;
          case "ベスト評価":
            return (
              (b?.hotelDetails?.HotelDetails?.[0]?.HotelRating || 0) -
              (a?.hotelDetails?.HotelDetails?.[0]?.HotelRating || 0)
            );
          case "newest":
            return (
              parseInt(b?.searchResults?.HotelCode || 0) -
              parseInt(a?.searchResults?.HotelCode || 0)
            );
          default:
            return 0;
        }
      });
    }

    setFilteredHotels(filtered);
    setIsFiltered(!!selectedStars || !!selectedPriceRange || !!sortOption);
  }, [allhoteldata.info?.totalHotels, selectedStars, selectedPriceRange, sortOption, cuntryprice]);

  // Apply filters when data or filter options change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedStars(null);
    setSelectedPriceRange(null);
    setSortOption(null);
    setIsFiltered(false);
  }, []);

  const handlePageChange = useCallback((pageNum) => {
    resetFilters();
    router.push(
      `/hotels/cityName=${encodeURIComponent(cityName)}&citycode=${cityCode}&checkin=${checkIn}&checkout=${checkOut}&adult=${adults}&child=${children}&roomes=${roomes}${childAges.length > 0 ? `&childAges=${childAges.join(",")}` : ""
      }&page=${pageNum}`
    );
  }, [router, cityName, cityCode, checkIn, checkOut, adults, children, roomes, childAges, resetFilters]);

  // Handle filter changes
  const handleStarChange = useCallback((e) => {
    setSelectedStars(e.target.value);
  }, []);

  const handlePriceChange = useCallback((e) => {
    setSelectedPriceRange(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
  }, []);

  // Retry on error
  const handleRetry = useCallback(() => {
    dispatch(
      getAllhotelsapi({
        cityCode,
        checkIn,
        checkOut,
        adults,
        children,
        childAges,
        guestNationality: defaultcurrency.country === "India" ? "IN" : "US",
        page,
        per_page: 10,
      })
    );
  }, [dispatch, cityCode, checkIn, checkOut, adults, children, childAges, page, defaultcurrency.country]);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    const totalPages = allhoteldata.info?.pagination?.total_pages || 1;
    if (page < totalPages) {
      resetFilters();
      router.push(
        `/hotels/cityName=${encodeURIComponent(cityName)}&citycode=${cityCode}&checkin=${checkIn}&checkout=${checkOut}&adult=${adults}&child=${children}&roomes=${roomes}${childAges.length > 0 ? `&childAges=${childAges.join(",")}` : ""}&page=${page + 1}`
      );
    }
  }, [page, allhoteldata.info?.pagination?.total_pages, router, cityName, cityCode, checkIn, checkOut, adults, children, roomes, childAges, resetFilters]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      resetFilters();
      router.push(
        `/hotels/cityName=${encodeURIComponent(cityName)}&citycode=${cityCode}&checkin=${checkIn}&checkout=${checkOut}&adult=${adults}&child=${children}&roomes=${roomes}${childAges.length > 0 ? `&childAges=${childAges.join(",")}` : ""}&page=${page - 1}`
      );
    }
  }, [page, router, cityName, cityCode, checkIn, checkOut, adults, children, roomes, childAges, resetFilters]);

  return (
    <>
      <HotelsComp />

      {allhoteldata.isLoading ? (
        <div className="space-y-6">
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="loader"></div>
          <p className="ml-4 text-lg font-semibold text-gray-700">Loading hotels...</p>
        </div>
        </div>
      ) : null}

      <div className="p-4 flex gap-4 relative max-w-7xl mx-auto">
        {/* Filter Section */}
        <div className="hidden lg:flex w-1/4 p-4 sticky top-24 h-[120vh] bg-white border border-gray-200 rounded-lg shadow-lg hover:border-blue-600 transition-all duration-300 flex-col">
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
            <p className="font-semibold text-gray-800 mb-2">Price per Night ({defaultcurrency.symbol})</p>
            <div className="flex flex-col gap-2 pl-4">
              {[
                { id: "price1", range: `${defaultcurrency.symbol}0 - ${defaultcurrency.symbol}1500` },
                { id: "price2", range: `${defaultcurrency.symbol}1500 - ${defaultcurrency.symbol}3500` },
                { id: "price3", range: `${defaultcurrency.symbol}3500 - ${defaultcurrency.symbol}7500` },
                { id: "price4", range: `${defaultcurrency.symbol}7500 - ${defaultcurrency.symbol}11500` },
                { id: "price5", range: `${defaultcurrency.symbol}11500 - ${defaultcurrency.symbol}15000` },
                { id: "price6", range: `${defaultcurrency.symbol}15000+` },
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
              <button
                onClick={handleRetry}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
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
                      <Image
                        src={getImages(hotel?.hotelDetails)[0] || "/images/not_found_img.png"}
                        alt="hotelImg"
                        width={350}
                        height={150}
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
                            <Image
                              src={image}
                              alt={`hotel_image_${index + 1}`}
                              width={80}
                              height={48}
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
                        {hotel?.hotelDetails?.HotelDetails?.[0]?.HotelName || "Unknown Hotel"}
                      </p>
                      <div>
                        <div className="flex items-center">
                          <span className="bg-blue-500 text-white px-2 text-sm rounded-full">
                            {hotel?.hotelDetails?.HotelDetails?.[0]?.HotelRating || "N/A"}
                          </span>
                          <span className="ml-2 text-blue-600">
                            {hotel?.hotelDetails?.HotelDetails?.[0]?.HotelRating || "N/A"}
                          </span>
                        </div>
                        <div className="hidden md:flex items-center justify-center mt-2">
                          {renderStars(hotel?.hotelDetails?.HotelDetails?.[0]?.HotelRating || 0)}
                        </div>
                      </div>
                    </div>

                    <div className="text-gray-500">
                      <span className="text-blue-600">
                        {hotel?.hotelDetails?.HotelDetails?.[0]?.Address || "No address available"}
                      </span>
                    </div>
                    {hotel?.searchResults?.Status?.Code === 200 &&
                      hotel?.searchResults?.Rooms?.length > 0 ? (
                      <div>
                        <div key={0}>
                          <div className="flex items-end justify-between">
                            <div className="mt-4">
                              <p className="text-xl font-black">
                                {defaultcurrency.symbol}
                                {Math.floor(
                                  (hotel.searchResults.Rooms[0].TotalFare -
                                    hotel.searchResults.Rooms[0].TotalTax) *
                                  cuntryprice
                                )}
                              </p>
                              <p className="text-gray-500">
                                + {defaultcurrency.symbol}
                                {Math.floor(hotel.searchResults.Rooms[0].TotalTax * cuntryprice)}{" "}
                                taxes & fees
                              </p>
                              <p className="text-sm text-gray-500 mt-2">Per Night</p>
                            </div>
                            <Link
                              href={`/hotelSearchCheckin/cityName=${encodeURIComponent(
                                cityName
                              )}&checkin=${checkIn}&checkout=${checkOut}&adult=${adults}&child=${children}&roomes=${roomes}&hotelcode=${hotel.searchResults.HotelCode}${childAges.length > 0 ? `&childAges=${childAges.join(",")}` : ""
                                }`}
                              className="bg-orange-600 text-white rounded-full w-28 h-8 flex items-center justify-center"
                            >
                              <span className="text-xs flex items-center gap-2">View Room</span>
                            </Link>
                          </div>
                          <div className="hidden md:block bg-[#ECF5FE] px-5 py-2 text-sm shadow-lg">
                            <span className="text-gray-700">
                              Exclusive offer on Canara Bank Credit Cards. Get {defaultcurrency.symbol}
                              {Math.floor(241 * cuntryprice)} off
                            </span>
                          </div>
                        </div>
                      </div>
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
          {allhoteldata.info?.pagination?.total_pages > 1 && (
  <div className="flex flex-wrap justify-center gap-4 mt-6 items-center">
    {/* Previous Button */}
    <button
      onClick={handlePrevPage}
      disabled={page <= 1}
      className={`px-4 py-2 rounded-lg font-semibold ${
        page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      Previous
    </button>

    {/* Simplified Page Numbers */}
    <div className="flex gap-2">
      {[page - 1, page, page + 1].map((pageNumber) => {
        if (
          pageNumber < 1 ||
          pageNumber > (allhoteldata.info?.pagination?.total_pages || 1)
        )
          return null;
        return (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-3 py-1 rounded-lg font-semibold ${
              page === pageNumber
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>

    {/* Jump to page input */}
    <div className="flex items-center gap-2">
      <label htmlFor="jumpPage" className="text-gray-700 text-sm">
        Go to page:
      </label>
      <input
        id="jumpPage"
        type="number"
        min={1}
        max={allhoteldata.info?.pagination?.total_pages}
        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = parseInt(e.target.value);
            if (
              value >= 1 &&
              value <= (allhoteldata.info?.pagination?.total_pages || 1)
            ) {
              handlePageChange(value);
            }
          }
        }}
        placeholder="Pg"
      />
    </div>

    {/* Page Info */}
    <span className="text-gray-700 text-sm">
      Page {page} of {allhoteldata.info?.pagination?.total_pages}
    </span>

    {/* Next Button */}
    <button
      onClick={handleNextPage}
      disabled={page >= (allhoteldata.info?.pagination?.total_pages || 1)}
      className={`px-4 py-2 rounded-lg font-semibold ${
        page >= (allhoteldata.info?.pagination?.total_pages || 1)
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