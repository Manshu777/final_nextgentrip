"use client"


import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getbuses } from '../../Component/Store/slices/busslices'
import { getBusSeatLayout } from "../../Component/Store/slices/busSeatlayout"
import BusComp from '../../Component/AllComponent/formMaincomp/BusComp'
import BusFilter from "../../Component/Filter/BusFilter";
import Slider from "react-slick";
import { FaChevronDown, FaFilter, FaTimes } from "react-icons/fa";
import Link from 'next/link'
import { TbBus } from "react-icons/tb";

import { useRouter } from 'next/navigation';

const BusCompo = ({ slug }) => {
  const router = useRouter();
  const decodeslug = decodeURIComponent(slug);
  const params = new URLSearchParams(decodeslug)
  const OriginId = params.get("OriginId")
  const DestinationId = params.get("DestinationId")

  const DateOfJourney = params.get("DateOfJourney")

  const currencylist = useSelector(state => state.currencySlice);
  const defaultcurrency = JSON.parse(localStorage.getItem("usercurrency")) || { symble: "₹", code: "INR", country: "India", }
  const cuntryprice = currencylist?.info?.rates?.[`${defaultcurrency.code}`]
  const dispatch = useDispatch()
  const state = useSelector(state => state.busslice)
  useEffect(() => {
    dispatch(getbuses({ DateOfJourney, OriginId, DestinationId }))

  }, [])







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
    setBusData(state.info.BusSearchResult && state.info.BusSearchResult.BusResults && state.info.BusSearchResult.BusResults)
  }, [state])


  const handelGetSeat = (ResultIndex) => {
    dispatch(getBusSeatLayout({ TraceId: state.info.BusSearchResult.TraceId, ResultIndex }))
  }




  const handleSelectSeats = (bus) => {
    // console.log("bus", bus);

    // Save data to localStorage
    localStorage.setItem("selectedBus", JSON.stringify(bus));



    router.push(`/buses/selectseat/index=${state.info.BusSearchResult.TraceId}&resultindex=${bus.ResultIndex}`);
  };



  return (
    <>  <BusComp />
      <div className="block md:flex px-0 lg:px-28 items-start gap-3 my-5">
        <div className="hidden md:block w-1/4 sticky top-24">
          <BusFilter />
        </div>

        <div className="w-full md:w-3/4  ">
          <div className="myshadow bg-white flex items-center">
            <Slider {...settings} className="custom-slider flex w-full items-center">
              {/* {items.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center px-3 md:px-5 py-2 md:py-4 border justify-center ${
                    activeIndex === index ? "text-blue-600 border-blue-600" : ""
                  }`}
                >
                  <div className="flex text-xs text-center font-semibold items-center  justify-center">
                    {item.time}
                  </div>
                </div>
              ))} */}
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



            {busData && busData.map((bus) => (
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
                    {/* Departure */}
                    <div className="text-center">
                      <p className="text-base font-semibold text-black">
                        {new Date(bus.DepartureTime).toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(bus.DepartureTime).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="flex-1 h-px bg-gray-300 mx-2 lg:mx-4"></div>


                    <div className="text-gray-400 text-4xl">
                      <TbBus className='text-4xl  text-green-500'/>
                    </div>



                    <div className="flex-1 h-px bg-gray-300 mx-2 lg:mx-4"></div>

                    {/* Arrival */}
                    <div className="text-center">
                      <p className="text-base font-semibold text-black">
                        {new Date(bus.ArrivalTime).toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(bus.ArrivalTime).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}
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

                {/* Bottom Section */}
                <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button
                    onClick={() => handleSelectSeats(bus)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </>
  )
}

export default BusCompo
