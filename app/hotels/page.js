"use client";
import React, { useEffect, useState } from "react";
import CustomSlider from "../Component/AllComponent/Slider";
import FAQSection from "../Component/AllComponent/FAQ";
import Link from "next/link";
import HotelChains from "../Component/AllComponent/HotelChain";
import HotelComp from "../Component/AllComponent/formMaincomp/HotelsComp";
import Hotelmobileheader from "../Component/AllComponent/Hotelmobilheader";
import { FaStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getAllRegHotels } from "../Component/Store/slices/getReqHotels";
import { imgurl } from "../Component/common";
import TypeWriterHeaderEffect from "../Component/AllComponent/TypeWriterHeaderEffect";
import HotelsComp from "../Component/AllComponent/formMaincomp/HotelsComp";
import HotelSliderCompo from "./HotelSliderCompo";
import Header from "../Component/AllComponent/Header";

const Page = () => {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const allReghotels = useSelector((state) => state.getRegHotelsSlice);

  useEffect(() => {
    dispatch(getAllRegHotels());
  }, [dispatch]);

  // Function to handle button click
  const handleViewAll = () => {
    setShowAll(!showAll);
  };

  // Filter hotels to only include entries with non-empty hotel arrays
  const validHotels = allReghotels?.info
    ?.filter((item) => item.hotel && item.hotel.length > 0)
    .flatMap((item) => item.hotel);

  // Determine which hotels to show
  const displayedHotels = showAll ? validHotels : validHotels?.slice(0, 6);

  return (
    <>
      <head>
        <title>Book Hotels Online | Exclusive Deals on NextGenTrip</title>
        <meta
          name="description"
          content="Plan your perfect stay with NextGenTrip. Explore exclusive hotel deals, compare prices, read verified reviews, and book trusted stays instantly for your trip"
        />
        
      </head>
      <HotelsComp />
      <div className="hidden md:block">
        <CustomSlider />
      </div>
      <div className="px-0 lg:px-20">
        <h2 className="text-lg text-center lg:text-2xl font-semibold md:mb-2 mt-5 sm:mt-0">
          Book Hotels at Popular Destinations
        </h2>

        <div className="_polrdestnbx md:mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:p-5">
          {displayedHotels?.map((hotel, index) => (
            <Link
              key={index}
              href={`/hotels/book/${hotel.slug}`}
              className="card-container border border-[#5c6fff] hover:border-[#ffd94f] shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out"
            >
              <div className="flex gap-4 p-4">
                <div className="w-2/3 relative">
                  <img
                    src={`${imgurl}/${hotel?.hotel_img[0]}`}
                    alt={hotel?.hotel_img[0]}
                    className="rounded-md w-full h-52 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white opacity-80 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {hotel.rating} <FaStar className="inline text-yellow-500" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {hotel.hotel_img?.slice(0, 3).map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={`${imgurl}/${image}`}
                        alt={`Hotel Image ${imgIndex}`}
                        className="rounded-md w-14 h-14 object-cover border-2 border-white shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                <div className="w-1/3 flex flex-col justify-between">
                  <h5 className="text-lg font-semibold mb-1 text-gray-800 truncate">
                    {hotel.property_name}
                  </h5>
                  <p className="text-sm text-gray-600 truncate">
                    <div dangerouslySetInnerHTML={{ __html: hotel.address }} />
                  </p>
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: hotel.rating }).map(
                      (_, starIndex) => (
                        <FaStar key={starIndex} className="text-lg" />
                      )
                    )}
                  </div>

                  <div className="flex flex-col items-end mt-4">
                    <div className="text-lg font-semibold text-black">
                      ₹{hotel.price.replace(/[^0-9.-]+/g, "")}
                      <span className="text-sm text-gray-500"> / night</span>
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₹
                      {(
                        Number(hotel.price.replace(/[^0-9.-]+/g, "")) +
                        (Number(hotel.price.replace(/[^0-9.-]+/g, "")) * 6) /
                          100
                      ).toFixed(0)}
                    </div>
                    <button className="mt-3 bg-[#5c6fff] text-white py-2 px-6 rounded-lg hover:bg-[#4a5ccd] transition duration-200">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-2 text-center">
          <button
            onClick={handleViewAll}
            className="bg-[#2196F3] text-white py-2 px-4 rounded-full"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      </div>
      <div className="px-4 md:px-32 my-3 md:my-6">
        <HotelSliderCompo />
      </div>
      <div className="pb-3">
        <FAQSection />
      </div>
    </>
  );
};

export default Page;
