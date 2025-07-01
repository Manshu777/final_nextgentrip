"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBusSeatLayout } from "../../../Component/Store/slices/busSeatlayout";
import { FaChair, FaMapMarkerAlt, FaClock, FaPhoneAlt } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { toast } from "react-toastify";
import axios from "axios";
import { apilink } from "../../../Component/common";
import { useRouter } from "next/navigation";

const SelectSeaCompo = ({ slug }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.busSeatSlice);
  const currencylist = useSelector((state) => state.currencySlice);
  const defaultcurrency = JSON.parse(localStorage.getItem("usercurrency")) || {
    symble: "₹",
    code: "INR",
    country: "India",
  };
  const cuntryprice = currencylist?.info?.rates?.[defaultcurrency.code];

  const decodeslug = decodeURIComponent(slug);
  const params = new URLSearchParams(decodeslug);
  const resultindex = params.get("resultindex");
  const index = params.get("index");

  const [busSeatInfo, setBusSeatInfo] = useState(null);
  const [busBoarding, setBusBoarding] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [adultCount, setAdultCount] = useState(() => {
    const saved = localStorage.getItem("busSearch");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.travellers?.adultCount || 1;
    }
    return 1;
  });

  useEffect(() => {
    dispatch(getBusSeatLayout({ TraceId: index, ResultIndex: resultindex }));
  }, [dispatch, index, resultindex]);

  useEffect(() => {
    setBusSeatInfo(state?.info?.buslayout?.GetBusSeatLayOutResult);
    setBusBoarding(state?.info?.busbording?.GetBusRouteDetailResult);
  }, [state]);

  const handleSeatSelect = (seat) => {
    if (!seat.SeatStatus) {
      toast.error("This seat is already booked!");
      return;
    }

    setSelectedSeats((prev) => {
      let updatedSeats;
      if (prev.some((s) => s.SeatIndex === seat.SeatIndex)) {
        // Deselect seat
        updatedSeats = prev.filter((s) => s.SeatIndex !== seat.SeatIndex);
      } else if (prev.length < adultCount) {
        // Select seat if under adultCount limit
        updatedSeats = [...prev, seat];
      } else {
        toast.warning(`You can only select ${adultCount} seats!`);
        return prev;
      }

      // Save updated seats to localStorage
      const seatDetails = updatedSeats.map((s) => ({
        SeatIndex: s.SeatIndex,
        SeatName: s.SeatName,
        SeatFare: s.SeatFare,
        SeatType: s.SeatType,
        IsLadiesSeat: s.IsLadiesSeat,
        IsMalesSeat: s.IsMalesSeat,
        IsUpper: s.IsUpper,
        RowNo: s.RowNo,
        ColumnNo: s.ColumnNo,
        Price: {
          CurrencyCode: s.Price.CurrencyCode,
          BasePrice: s.Price.BasePrice,
          Tax: s.Price.Tax,
          OtherCharges: s.Price.OtherCharges,
          Discount: s.Price.Discount,
          PublishedPrice: s.Price.PublishedPrice,
          PublishedPriceRoundedOff: s.Price.PublishedPriceRoundedOff,
          OfferedPrice: s.Price.OfferedPrice,
          OfferedPriceRoundedOff: s.Price.OfferedPriceRoundedOff,
          AgentCommission: s.Price.AgentCommission,
          AgentMarkUp: s.Price.AgentMarkUp,
          TDS: s.Price.TDS,
          GST: {
            CGSTAmount: s.Price.GST.CGSTAmount,
            CGSTRate: s.Price.GST.CGSTRate,
            CessAmount: s.Price.GST.CessAmount,
            CessRate: s.Price.GST.CessRate,
            IGSTAmount: s.Price.GST.IGSTAmount,
            IGSTRate: s.Price.GST.IGSTRate,
            SGSTAmount: s.Price.GST.SGSTAmount,
            SGSTRate: s.Price.GST.SGSTRate,
            TaxableAmount: s.Price.GST.TaxableAmount,
          },
        },
      }));
      localStorage.setItem("selectedSeatDetails", JSON.stringify(seatDetails));
      return updatedSeats;
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length !== adultCount) {
      toast.error(`Please select exactly ${adultCount} seats!`);
      return;
    }

    const updatedData = {
      TraceId: index,
      ResultIndex: resultindex,
      BoardingPointId: busBoarding?.BoardingPointsDetails[0]?.CityPointIndex,
      DropingPointId: busBoarding?.DroppingPointsDetails[0]?.CityPointIndex,
      Seats: selectedSeats.map((seat) => ({
        SeatIndex: seat.SeatIndex,
        SeatName: seat.SeatName,
        SeatFare: seat.SeatFare,
        SeatType: seat.SeatType,
        IsLadiesSeat: seat.IsLadiesSeat,
        IsMalesSeat: seat.IsMalesSeat,
        IsUpper: seat.IsUpper,
        RowNo: seat.RowNo,
        ColumnNo: seat.ColumnNo,
        Price: {
          CurrencyCode: seat.Price.CurrencyCode,
          BasePrice: seat.Price.BasePrice,
          Tax: seat.Price.Tax,
          OtherCharges: seat.Price.OtherCharges,
          Discount: seat.Price.Discount,
          PublishedPrice: seat.Price.PublishedPrice,
          PublishedPriceRoundedOff: seat.Price.PublishedPriceRoundedOff,
          OfferedPrice: seat.Price.OfferedPrice,
          OfferedPriceRoundedOff: seat.Price.OfferedPriceRoundedOff,
          AgentCommission: seat.Price.AgentCommission,
          AgentMarkUp: seat.Price.AgentMarkUp,
          TDS: seat.Price.TDS,
          GST: {
            CGSTAmount: seat.Price.GST.CGSTAmount,
            CGSTRate: seat.Price.GST.CGSTRate,
            CessAmount: seat.Price.GST.CessAmount,
            CessRate: seat.Price.GST.CessRate,
            IGSTAmount: seat.Price.GST.IGSTAmount,
            IGSTRate: seat.Price.GST.IGSTRate,
            SGSTAmount: seat.Price.GST.SGSTAmount,
            SGSTRate: seat.Price.GST.SGSTRate,
            TaxableAmount: seat.Price.GST.TaxableAmount,
          },
        },
      })),
    };

    try {
      localStorage.setItem("busBookingData", JSON.stringify(updatedData));
      localStorage.setItem("busBoardingData", JSON.stringify(busBoarding));
      const query = encodeURIComponent(JSON.stringify(updatedData));
      router.push(`/buses/checkout/data=${query}`);
    } catch (error) {
      console.error("Error in handleBooking:", error);
      toast.error("Failed to proceed with booking!");
    }
  };

  const formatPrice = (price) => {
    const offeredPrice = Number(price || 0);
    const priceString = offeredPrice.toFixed(2);
    const [integerPart, decimalPart] = priceString.split(".");
    return `${defaultcurrency.symble} ${integerPart},${decimalPart || "00"}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {state.isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            <h4 className="mt-4 text-white text-lg font-semibold">Loading...</h4>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {busSeatInfo && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 slelect your seat mb-8">
              Select Your Seats
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold text-gray-700">
                  Select {adultCount} Seat{adultCount > 1 ? "s" : ""} (Selected: {selectedSeats.length})
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <FaChair className="text-green-500 text-lg" />
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaChair className="text-red-500 text-lg" />
                    <span className="text-sm text-gray-600">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaChair className="text-blue-500 text-lg" />
                    <span className="text-sm text-gray-600">Selected</span>
                  </div>
                </div>
              </div>
              <div className="grid graind cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {busSeatInfo?.SeatLayoutDetails?.SeatLayout?.SeatDetails?.map((setRow, rowIndex) =>
                  setRow.map((seat, index) => (
                    <div
                      key={`${rowIndex}-${index}`}
                      className={`relative flex flex-col items-center p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer transform hover:scale-105
                        ${!seat.SeatStatus ? "bg-red-50 border-red-300 opacity-70" : "bg-green-50 border-green-300 hover:bg-green-100"}
                        ${selectedSeats.some((s) => s.SeatIndex === seat.SeatIndex) ? "bg-blue-100 border-blue-400" : ""}`}
                      onClick={() => handleSeatSelect(seat)}
                    >
                      {selectedSeats.some((s) => s.SeatIndex === seat.SeatIndex) && (
                        <TiTick className="absolute top-2 right-2 text-blue-600 text-xl" />
                      )}
                      <FaChair
                        className={`text-3xl ${!seat.SeatStatus ? "text-red-600" : selectedSeats.some((s) => s.SeatIndex === seat.SeatIndex) ? "text-blue-600" : "text-green-600"}`}
                      />
                      <span className="mt-2 text-sm font-semibold text-gray-800">{seat.SeatName}</span>
                      <span className="text-xs text-gray-500">{formatPrice(seat.Price?.PublishedPriceRoundedOff)}</span>
                      <span
                        className={`text-xs font-bold uppercase mt-1 ${!seat.SeatStatus ? "text-red-500" : selectedSeats.some((s) => s.SeatIndex === seat.SeatIndex) ? "text-blue-500" : "text-green-500"}`}
                      >
                        {!seat.SeatStatus ? "Booked" : selectedSeats.some((s) => s.SeatIndex === seat.SeatIndex) ? "Selected" : "Available"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {busBoarding && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Bus Route Details</h2>
            <div className="flex flex-col lg:flex-row lg:justify-around gap-6">
              <div className="lg:w-1/3 w-full">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Boarding Points</h3>
                {busBoarding?.BoardingPointsDetails?.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border-b border-gray-200 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <FaMapMarkerAlt className="text-blue-600 text-2xl mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{point.CityPointName}</h4>
                      <p className="text-gray-600 text-sm">
                        <FaClock className="inline-block mr-1 text-gray-500" />
                        Time: {new Date(point.CityPointTime).toLocaleString()}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <FaPhoneAlt className="inline-block mr-1 text-gray-500" />
                        Contact: {point.CityPointContactNumber}
                      </p>
                      <p className="text-gray-600 text-sm">Landmark: {point.CityPointLandmark}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center lg:items-start">
                <button
                  onClick={handleBooking}
                  disabled={selectedSeats.length !== adultCount}
                  className={`flex flex-col gap-[1px] rounded-lg group ${selectedSeats.length !== adultCount ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition-transform"}`}
                >
                  <div className="h-1 bg-orange-500 w-full group-hover:w-[0px] duration-300 rounded-t-full"></div>
                  <div className="bg-orange-500 text-white font-semibold p-2 px-5 rounded-md text-center">
                    Book Now
                  </div>
                  <div className="h-1 bg-orange-500 w-full group-hover:w-[0px] duration-300 rounded-b-full"></div>
                </button>
              </div>

              <div className="lg:w-1/3 w-full">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Dropping Points</h3>
                {busBoarding?.DroppingPointsDetails?.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border-b border-gray-200 hover:bg-green-50 rounded-lg transition-all"
                  >
                    <FaMapMarkerAlt className="text-green-600 text-2xl mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{point.CityPointName}</h4>
                      <p className="text-gray-600 text-sm">
                        <FaClock className="inline-block mr-1 text-gray-500" />
                        Time: {new Date(point.CityPointTime).toLocaleString()}
                      </p>
                      <p className="text-gray-600 text-sm">Location: {point.CityPointLocation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectSeaCompo;