"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { GiAirplaneDeparture } from "react-icons/gi";
import { FaLock, FaRupeeSign, FaSpinner, FaBusAlt } from "react-icons/fa";
import { apilink } from "../../../Component/common";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [boardingData, setBoardingData] = useState(null);
  const [selectedBusData, setSelectedBusData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (isDataLoaded) return;

    let source = "none";
    try {
      const storedBookingData = localStorage.getItem("busBookingData");
      const storedBoardingData = localStorage.getItem("busBoardingData");
      const storedSelectedBus = localStorage.getItem("selectedBus");
      if (storedBookingData && storedBoardingData && storedSelectedBus) {
        const parsedBooking = JSON.parse(storedBookingData);
        const parsedBoarding = JSON.parse(storedBoardingData);
        const parsedSelectedBus = JSON.parse(storedSelectedBus);
        setBookingData(parsedBooking);
        setBoardingData(parsedBoarding);
        setSelectedBusData(parsedSelectedBus);

        console.log("Parsed booking data from localStorage:", parsedBooking);
        if (parsedBooking.Seats && Array.isArray(parsedBooking.Seats)) {
          setPassengers(
            parsedBooking.Seats.map((seat, index) => ({
              Title: "",
              FirstName: "",
              LastName: "",
              Email: index === 0 ? "" : undefined,
              Phoneno: "",
              Gender: "",
              IdType: "",
              IdNumber: "",
              Address: index === 0 ? "" : undefined,
              Age: 0,
              Seat: {
                SeatIndex: seat.SeatIndex || 0,
                SeatName: seat.SeatName || "",
                SeatType: seat.SeatType || 1,
                IsLadiesSeat: seat.IsLadiesSeat || false,
                IsMalesSeat: seat.IsMalesSeat || false,
                IsUpper: seat.IsUpper || false,
                RowNo: seat.RowNo || "000",
                SeatStatus: seat.SeatStatus || true,
                SeatFare: seat.SeatFare || 0,
                ColumnNo: seat.ColumnNo || "000",
              },
              Price: {
                CurrencyCode: seat.Price?.CurrencyCode || "INR",
                BasePrice: seat.Price?.BasePrice || 0,
                Tax: seat.Price?.Tax || 0,
                OtherCharges: seat.Price?.OtherCharges || 0,
                Discount: seat.Price?.Discount || 0,
                PublishedPrice: seat.Price?.PublishedPrice || 0,
                PublishedPriceRoundedOff: seat.Price?.PublishedPriceRoundedOff || 0,
                OfferedPrice: seat.Price?.OfferedPrice || 0,
                OfferedPriceRoundedOff: seat.Price?.OfferedPriceRoundedOff || 0,
                AgentCommission: seat.Price?.AgentCommission || 0,
                AgentMarkUp: seat.Price?.AgentMarkUp || 0,
                TDS: seat.Price?.TDS || 0,
                GST: {
                  CGSTAmount: seat.Price?.GST?.CGSTAmount || 0,
                  CGSTRate: seat.Price?.GST?.CGSTRate || 0,
                  CessAmount: seat.Price?.GST?.CessAmount || 0,
                  CessRate: seat.Price?.GST?.CessRate || 0,
                  IGSTAmount: seat.Price?.GST?.IGSTAmount || 0,
                  IGSTRate: seat.Price?.GST?.IGSTRate || 0,
                  SGSTAmount: seat.Price?.GST?.SGSTAmount || 0,
                  SGSTRate: seat.Price?.GST?.SGSTRate || 0,
                  TaxableAmount: seat.Price?.GST?.TaxableAmount || 0,
                },
              },
              LeadPassenger: index === 0,
            }))
          );
        } else {
          setError("No valid seat data found in booking");
        }
        console.log("Data from localStorage - bookingData:", parsedBooking);
        console.log("Data from localStorage - busBoardingData:", parsedBoarding);
        console.log("Data from localStorage - selectedBus:", parsedSelectedBus);
        source = "localStorage";
        setIsDataLoaded(true);
        return;
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setError("Error retrieving data from localStorage");
      setIsDataLoaded(true);
    }

    const data = searchParams.get("data");

    if (data) {
      try {
        const decodedData = decodeURIComponent(data.replace(/\/$/, ""));
        if (decodedData && decodedData.startsWith("{") && decodedData.endsWith("}")) {
          const parsed = JSON.parse(decodedData);
          setBookingData(parsed);

          console.log("Parsed booking data from query:", parsed);
          if (parsed.Seats && Array.isArray(parsed.Seats)) {
            setPassengers(
              parsed.Seats.map((seat, index) => ({
                Title: "",
                FirstName: "",
                LastName: "",
                Email: index === 0 ? "" : undefined,
                Phoneno: "",
                Gender: "",
                IdType: "",
                IdNumber: "",
                Address: index === 0 ? "" : undefined,
                Age: 0,
                Seat: {
                  SeatIndex: seat.SeatIndex || 0,
                  SeatName: seat.SeatName || "",
                  SeatType: seat.SeatType || 1,
                  IsLadiesSeat: seat.IsLadiesSeat || false,
                  IsMalesSeat: seat.IsMalesSeat || false,
                  IsUpper: seat.IsUpper || false,
                  RowNo: seat.RowNo || "000",
                  SeatStatus: seat.SeatStatus || true,
                  SeatFare: seat.SeatFare || 0,
                  ColumnNo: seat.ColumnNo || "000",
                },
                Price: {
                  CurrencyCode: seat.Price?.CurrencyCode || "INR",
                  BasePrice: seat.Price?.BasePrice || 0,
                  Tax: seat.Price?.Tax || 0,
                  OtherCharges: seat.Price?.OtherCharges || 0,
                  Discount: seat.Price?.Discount || 0,
                  PublishedPrice: seat.Price?.PublishedPrice || 0,
                  PublishedPriceRoundedOff: seat.Price?.PublishedPriceRoundedOff || 0,
                  OfferedPrice: seat.Price?.OfferedPrice || 0,
                  OfferedPriceRoundedOff: seat.Price?.OfferedPriceRoundedOff || 0,
                  AgentCommission: seat.Price?.AgentCommission || 0,
                  AgentMarkUp: seat.Price?.AgentMarkUp || 0,
                  TDS: seat.Price?.TDS || 0,
                  GST: {
                    CGSTAmount: seat.Price?.GST?.CGSTAmount || 0,
                    CGSTRate: seat.Price?.GST?.CGSTRate || 0,
                    CessAmount: seat.Price?.GST?.CessAmount || 0,
                    CessRate: seat.Price?.GST?.CessRate || 0,
                    IGSTAmount: seat.Price?.GST?.IGSTAmount || 0,
                    IGSTRate: seat.Price?.GST?.IGSTRate || 0,
                    SGSTAmount: seat.Price?.GST?.SGSTAmount || 0,
                    SGSTRate: seat.Price?.GST?.SGSTRate || 0,
                    TaxableAmount: seat.Price?.GST?.TaxableAmount || 0,
                  },
                },
                LeadPassenger: index === 0,
              }))
            );
          } else {
            setError("No valid seat data found in query parameter");
          }
          console.log("Data from query:", parsed);
          source = "query";
          localStorage.setItem("busBookingData", JSON.stringify(parsed));
          console.log("Stored query data in localStorage:", parsed);
          setIsDataLoaded(true);
        } else {
          setError("Invalid JSON format in query parameter");
          console.error("Invalid JSON format:", decodedData);
          setIsDataLoaded(true);
        }
      } catch (error) {
        setError("Error parsing query data: " + error.message);
        console.error("Error parsing query data:", error.message, error.stack);
        setIsDataLoaded(true);
      }
    } else {
      setError("No booking data available");
      console.log("No query data available");
      setIsDataLoaded(true);
    }
    console.log("Data source:", source);
  }, [searchParams, isDataLoaded]);

  const handleChange = useCallback((e, index) => {
    const { name, value } = e.target;
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });

    if (!value && name !== "IdNumber" && !(name === "Email" && index !== 0) && !(name === "Address" && index !== 0)) {
      setErrors((prev) => ({
        ...prev,
        [`${name}_${index}`]: `${name} is required`,
      }));
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[`${name}_${index}`];
        return updatedErrors;
      });
    }
  }, []);

  const calculateAge = useCallback((dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  const validatePassengers = useCallback(() => {
    const validationErrors = {};
    passengers.forEach((passenger, index) => {
      ["Title", "FirstName", "LastName", "Phoneno", "Gender", "Age"].forEach((field) => {
        if (!passenger[field] || (field === "Age" && passenger[field] <= 0)) {
          validationErrors[`${field}_${index}`] = `${field} is required`;
        }
      });
      if (index === 0 && !passenger.Email) {
        validationErrors[`Email_${index}`] = `Email is required for lead passenger`;
      }
      if (index === 0 && !passenger.Address) {
        validationErrors[`Address_${index}`] = `Address is required for lead passenger`;
      }
      if (!passenger.IdType) {
        validationErrors[`IdType_${index}`] = `IdType is required`;
      }
      if (!passenger.IdNumber) {
        validationErrors[`IdNumber_${index}`] = `IdNumber is required`;
      }
    });
    setErrors((prev) => ({ ...prev, ...validationErrors }));
    return Object.keys(validationErrors).length === 0;
  }, [passengers]);

  console.log("Query parameter data:", passengers);

  const handleBooking = async () => {
    // Validation is commented out in the provided code, but UI relies on it
    // if (!validatePassengers()) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Validation Error",
    //     text: "Please fill out all required fields and ensure all passengers have assigned seats.",
    //   });
    //   return;
    // }

    setIsLoading(true);

    try {
      const mappedPassengers = passengers.map((passenger, index) => ({
        LeadPassenger: index === 0,
        Title: passenger.Title,
        FirstName: passenger.FirstName,
        LastName: passenger.LastName,
        Email: passenger.Email || "null",
        Phoneno: passenger.Phoneno,
        Gender: passenger.Gender === "Male" ? 1 : passenger.Gender === "Female" ? 2 : 3,
        IdType: passenger.IdType || "null",
        IdNumber: passenger.IdNumber || "null",
        Address: passenger.Address || "null",
        Age: passenger.Age,
        Seat: passenger.Seat,
        Price: passenger.Price,
      }));

      const blockPayload = {
        EndUserIp: bookingData?.EndUserIp || "223.178.213.196",
        TokenId: bookingData?.TokenId || "fb8f5b1a-6d20-4238-b7de-d78e61d2e386",
        TraceId: bookingData?.TraceId || "7cbdcb28-c0c0-4b0f-9c3f-5bd5bbb4b3e9",
        ResultIndex: parseInt(bookingData?.ResultIndex || selectedBusData?.ResultIndex || "194"),
        BoardingPointId: bookingData?.BoardingPointId || boardingData?.BoardingPointsDetails[0]?.CityPointIndex || 1,
        DroppingPointId: bookingData?.DropingPointId || boardingData?.DroppingPointsDetails[0]?.CityPointIndex || 1,
        Passenger: mappedPassengers,
      };

      const blockResponse = await axios.post(`${apilink}/bus/busblock`, blockPayload);
      if (blockResponse.data.ResponseStatus !== 1) {
        throw new Error(blockResponse.data.Error.ErrorMessage || "Failed to block bus seats");
      }

      const bookPayload = {
        ...blockPayload,
        BlockKey: blockResponse.data.BlockResult?.BlockKey,
        BookingId: blockResponse.data.BlockResult?.BookingId,
        InventoryItems: blockResponse.data.BlockResult?.InventoryItems,
      };

         console.log("Booking Payload:", bookPayload);
      const bookResponse = await axios.post(`${apilink}/bus/book`, bookPayload);
      if (bookResponse.data.BookResult.ResponseStatus !== 1) {
        throw new Error(bookResponse.data.BookResult.Error.ErrorMessage || "Booking failed");
      }

      Swal.fire({
        icon: "success",
        title: "Booking Confirmed",
        text: `Booking ID: ${bookResponse.data.BookResult?.BookingId || "N/A"}\nTicket No: ${bookResponse.data.BookResult.TicketNo}`,
      });

      localStorage.removeItem("busBookingData");
      localStorage.removeItem("busBoardingData");
      localStorage.removeItem("selectedBus");
      localStorage.removeItem("selectedSeatDetails");
      router.push("/booking-confirmation");
    } catch (error) {
      console.error("Booking Error:", error);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error.message || "Please contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[100rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-[5%]">
      {error && (
        <div className="col-span-1 md:col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="border rounded-lg shadow-lg md:col-span-2 bg-white">
        <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="border-4 bg-white border-orange-100 h-10 w-10 flex justify-center items-center text-2xl rounded-full">
              <GiAirplaneDeparture />
            </div>
            <div>
              <span className="text-sm md:text-xl font-medium">Traveller Details</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 border-b shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FaBusAlt className="text-blue-600 text-2xl" />
            <div>
              <p className="text-lg font-bold text-gray-800">
                {boardingData?.BoardingPointsDetails[0]?.CityPointName || "Unknown"} ➜{" "}
                {boardingData?.DroppingPointsDetails[0]?.CityPointName || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">{selectedBusData?.BusType || "Express AC Bus"} - Approx. 6h</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Departure:{" "}
              {boardingData?.BoardingPointsDetails[0]?.CityPointTime
                ? new Date(boardingData.BoardingPointsDetails[0].CityPointTime).toLocaleString()
                : "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Arrival:{" "}
              {boardingData?.DroppingPointsDetails[0]?.CityPointTime
                ? new Date(boardingData.DroppingPointsDetails[0].CityPointTime).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
          {passengers.map((passenger, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                Passenger {index + 1} {index === 0 ? "(Lead Passenger)" : ""} - Seat: {passenger.Seat?.SeatName || "Not assigned"}
              </h4>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Title", type: "select", options: ["Mr", "Ms", "Mrs"], required: true },
                  { name: "FirstName", type: "text", placeholder: "Enter first name", required: true },
                  { name: "LastName", type: "text", placeholder: "Enter last name", required: true },
                  { name: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
                  { name: "DateOfBirth", type: "date", placeholder: "Select date of birth", required: true },
                  { name: "Address", type: "text", placeholder: "Enter address", required: index === 0 },
                  { name: "Phoneno", type: "tel", placeholder: "Enter contact number", required: true },
                  { name: "Email", type: "email", placeholder: "Enter email", required: index === 0 },
                  {
                    name: "IdType",
                    type: "select",
                    options: ["PAN card", "Voter ID", "Passport"],
                    required: true,
                  },
                  { name: "IdNumber", type: "text", placeholder: "Enter ID number", required: true },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.name} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={passenger[field.name] || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        required={field.required}
                      >
                        <option value="">{`Select ${field.name}`}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={passenger[field.name] || ""}
                        onChange={(e) => handleChange(e, index)}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        required={field.required}
                      />
                    )}
                    {errors[`${field.name}_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${field.name}_${index}`]}</p>
                    )}
                  </div>
                ))}
              </form>
            </div>
          ))}
        </div>

        <div className="p-4 text-gray-500 text-sm flex items-center gap-1">
          <FaLock /> Secure Booking & Data Protection
        </div>
      </div>

      <div className="w-full md:col-span-1 space-y-4">
        <div className="sticky top-4">
          <div className="border rounded-lg shadow-lg bg-white">
            <div className="bg-[#D1EAFF] px-4 py-3 rounded-t-lg">
              <h3 className="text-lg font-semibold">Price Summary</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <p>Adult x {passengers.length}</p>
                <p className="flex items-center font-bold">
                  <FaRupeeSign />
                  {passengers.reduce((total, p) => total + (p.Price?.OfferedPriceRoundedOff || 0), 0)}
                </p>
              </div>
              {passengers.map((p, index) => (
                <div key={index} className="flex justify-between text-sm text-gray-600">
                  <p>Seat {p.Seat?.SeatName || "N/A"} (Fare: {p.Seat?.SeatFare || 0})</p>
                  <p className="flex items-center">
                    <FaRupeeSign />
                    {p.Price?.OfferedPriceRoundedOff || 0}
                  </p>
    </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-sm">
                <p>Total</p>
                <p className="flex items-center">
                  <FaRupeeSign />
                  {passengers.reduce((total, p) => total + (p.Price?.OfferedPriceRoundedOff || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg shadow-lg bg-white">
            <div className="bg-[#2196F3] px-4 py-2 text-white rounded-t-lg">Offers and Promo Codes</div>
            <div className="p-4">
              <input
                type="text"
                placeholder="Enter promo code"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
              <button className="mt-2 w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition">
                Apply Promo
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              className={`bg-[#DA5200] text-white rounded-full w-full py-3 flex justify-center items-center font-semibold ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#b54300] transition"
              }`}
              onClick={handleBooking}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Booking...
                </>
              ) : (
                "Continue Booking"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;