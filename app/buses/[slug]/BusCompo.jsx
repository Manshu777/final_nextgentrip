"use client";

import React, { useEffect, useState,useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getbuses } from '../../Component/Store/slices/busslices';
import { getBusSeatLayout } from '../../Component/Store/slices/busSeatlayout';
import BusComp from '../../Component/AllComponent/formMaincomp/BusComp';
import BusFilter from '../../Component/Filter/BusFilter';
import Slider from 'react-slick';
import { FaChevronDown, FaFilter, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { TbBus } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

const timeSlots = [
  { label: "Before 6 AM", range: [0, 6] },
  { label: "6 AM - 12 PM", range: [6, 12] },
  { label: "12 PM - 6 PM", range: [12, 18] },
  { label: "After 6 PM", range: [18, 24] },
];

const BusCompo = ({ slug }) => {
  const router = useRouter();
  const decodeslug = decodeURIComponent(slug);
  const params = new URLSearchParams(decodeslug);
  const OriginId = params.get('OriginId');
  const DestinationId = params.get('DestinationId');
  const DateOfJourney = params.get('DateOfJourney');

  const currencylist = useSelector((state) => state.currencySlice);
  const defaultcurrency = JSON.parse(localStorage.getItem('usercurrency')) || {
    symble: '₹',
    code: 'INR',
    country: 'India',
  };
  const cuntryprice = currencylist?.info?.rates?.[defaultcurrency.code];
  const dispatch = useDispatch();
  const state = useSelector((state) => state.busslice);

  useEffect(() => {
    dispatch(getbuses({ DateOfJourney, OriginId, DestinationId }));
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 8,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

const [busData, setBusData] = useState();

  useEffect(() => {
    setBusData(
      state.info.BusSearchResult &&
      state.info.BusSearchResult.BusResults &&
      state.info.BusSearchResult.BusResults
    );
  }, [state]);

  const handelGetSeat = (ResultIndex) => {
    dispatch(
      getBusSeatLayout({
        TraceId: state.info.BusSearchResult.TraceId,
        ResultIndex,
      })
    );
  };

  const handleSelectSeats = (bus) => {
    localStorage.setItem('selectedBus', JSON.stringify(bus));
    router.push(
      `/buses/selectseat/index=${state.info.BusSearchResult.TraceId}&resultindex=${bus.ResultIndex}`
    );
  };

  
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    acType: null,
    seatType: null,
    boardingPoints: [],
    droppingPoints: [],
  });

const filteredBusData = useMemo(() => {
  return busData?.filter((bus) => {
    // AC Type filter
    if (filters?.acType) {
      const isAC = bus?.BusType?.toLowerCase().includes("a/c");
      if (filters?.acType === "ac" && !isAC) return false;
      if (filters?.acType === "nonac" && isAC) return false;
    }

    // Seat Type filter
    if (filters?.seatType) {
      const isSleeper = bus.BusType.toLowerCase().includes("sleeper");
      const isSeater = bus.BusType.toLowerCase().includes("seater");
      if (filters?.seatType === "sleeper" && !isSleeper) return false;
      if (filters?.seatType === "seater" && !isSeater) return false;
    }

    // Bus Operators filter
    if (filters?.busOperators?.length > 0) {
      if (!filters?.busOperators.includes(bus.TravelName)) return false;
    }

    // Price Range filter
    if (filters?.priceRange?.min && bus.BusPrice?.OfferedPrice < filters?.priceRange?.min) return false;
    if (filters?.priceRange?.max && bus.BusPrice?.OfferedPrice > filters?.priceRange?.max) return false;

    // Departure Time Slots filter
    if (filters?.departureTimeSlots?.length > 0) {
      const hour = new Date(bus.DepartureTime).getHours();
      const slotLabels = filters?.departureTimeSlots;
      const matchesSlot = slotLabels.some((label) => {
        const slot = timeSlots?.find((s) => s.label === label);
        return hour >= slot?.range[0] && hour < slot?.range[1];
      });
      if (!matchesSlot) return false;
    }

    // Minimum Available Seats filter
    if (filters?.minSeats && bus.AvailableSeats < filters?.minSeats) return false;

    // Mobile Ticket filter
    if (filters?.mTicket && !bus.MTicketEnabled) return false;

    // Live Tracking filter
    if (filters?.liveTracking && !bus.LiveTrackingAvailable) return false;

    // Boarding Points filter
    if (filters?.boardingPoints.length > 0) {
      const hasBoardingPoint = bus.BoardingPointsDetails.some((point) =>
        filters?.boardingPoints.includes(point.CityPointName)
      );
      if (!hasBoardingPoint) return false;
    }

    // Dropping Points filter
    if (filters?.droppingPoints.length > 0) {
      const hasDroppingPoint = bus.DroppingPointsDetails.some((point) =>
        filters?.droppingPoints.includes(point.CityPointName)
      );
      if (!hasDroppingPoint) return false;
    }

    return true;
  });
}, [busData, filters]);
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <BusComp />
      <div className="block md:flex px-0 lg:px-28 items-start gap-3 my-5">
        <div className="hidden md:block w-1/4 sticky top-24">
        <BusFilter busData={busData} onFilterChange={handleFilterChange} />
        </div>

        <div className="w-full md:w-3/4">
          <div className="myshadow bg-white flex items-center">
            <Slider {...settings} className="custom-slider flex w-full items-center">
              {/* Slider content */}
            </Slider>
          </div>

          <div>
            {state.isLoading && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                  <h4 className="mt-4 text-white text-lg font-semibold">Loading...</h4>
                </div>
              </div>
            )}

            {busData && filteredBusData.length > 0 ? (
              filteredBusData.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white hover:shadow-lg hover:border-blue-600 transition-all duration-300 p-5 my-5 border rounded-2xl"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Travel Info */}
                    <div className="flex flex-col gap-1 lg:w-1/4">
                      <p className="text-xl font-bold text-gray-800">{bus.TravelName}</p>
                      <p className="text-sm text-gray-500">{bus.BusType}</p>
                      <span className="text-xs text-white bg-[#1a7971] w-max px-2 py-1 rounded mt-1">
                        {bus.ServiceName}
                      </span>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center justify-between gap-4 flex-1">
                      <div className="text-center">
                        <p className="text-base font-semibold text-black">
                          {new Date(bus.DepartureTime).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(bus.DepartureTime).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="flex-1 h-px bg-gray-300 mx-2 lg:mx-4"></div>
                      <div className="text-gray-400 text-4xl">
                        <TbBus className="text-4xl text-green-500" />
                      </div>
                      <div className="flex-1 h-px bg-gray-300 mx-2 lg:mx-4"></div>

                      <div className="text-center">
                        <p className="text-base font-semibold text-black">
                          {new Date(bus.ArrivalTime).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(bus.ArrivalTime).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Price & Seats */}
                    <div className="flex flex-col justify-between items-end lg:w-1/4 text-right">
                      <div>
                        <span className="text-xl font-bold text-green-600">
                          {defaultcurrency.symble}
                          {(() => {
                            const publishedPrice = Number(bus.BusPrice?.PublishedPrice || 0);
                            const agentCommission = Number(bus.BusPrice?.AgentCommission || 0);
                            const totalPrice = (publishedPrice + agentCommission) * cuntryprice;
                            return totalPrice.toFixed(2);
                          })()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {bus.AvailableSeats} Seats Left
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
                    <button
                      onClick={() => handleSelectSeats(bus)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      Select Seats
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white p-6 rounded-lg shadow-lg text-center">
                <TbBus className="text-6xl text-gray-400 mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Oops! No Buses Found
                </h2>
                <p className="text-sm md:text-base text-gray-500 mb-6 max-w-md">
                  It looks like there are no buses available for this route. Try a different location or date, and we'll add this route as soon as possible!
                </p>
                <Link href="/buses">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm md:text-base font-semibold transition-all duration-300">
                    Try Another Location
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusCompo;