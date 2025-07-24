"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaLock, FaRupeeSign, FaSpinner, FaBusAlt } from "react-icons/fa";
import { apilink } from "../../../Component/common";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [boardingData, setBoardingData] = useState(null);
  const [selectedBusData, setSelectedBusData] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize booking data
  useEffect(() => {
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

        if (parsedBooking.Seats && Array.isArray(parsedBooking.Seats)) {
          setPassengers(
            parsedBooking.Seats.map((seat, index) => ({
              Title: "",
              FirstName: "",
              LastName: "",
              Gender: "",
              DateOfBirth: "",
              Address: index === 0 ? "" : undefined,
              City: index === 0 ? "" : undefined,
              ContactNo: "",
              Email: index === 0 ? "" : undefined,
              Seat: {
                SeatIndex: seat.SeatIndex || (index + 1).toString(),
                SeatName: seat.SeatName || (index + 1).toString(),
                Price: seat.Price || { PublishedPrice: seat.SeatFare || 0 },
              },
            }))
          );
        } else {
          setError("No valid seat data found in booking");
        }
        source = "localStorage";
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setError("Error retrieving data from localStorage");
    }

    const data = searchParams.get("data");
    if (data) {
      try {
        const decodedData = decodeURIComponent(data.replace(/\/$/, ""));
        if (decodedData && decodedData.startsWith("{") && decodedData.endsWith("}")) {
          const parsed = JSON.parse(decodedData);
          setBookingData(parsed);

          if (parsed.Seats && Array.isArray(parsed.Seats)) {
            setPassengers(
              parsed.Seats.map((seat, index) => ({
                Title: "",
                FirstName: "",
                LastName: "",
                Gender: "",
                DateOfBirth: "",
                Address: index === 0 ? "" : undefined,
                City: index === 0 ? "" : undefined,
                ContactNo: "",
                Email: index === 0 ? "" : undefined,
                Seat: {
                  SeatIndex: seat.SeatIndex || (index + 1).toString(),
                  SeatName: seat.SeatName || (index + 1).toString(),
                  Price: seat.Price || { PublishedPrice: seat.SeatFare || 0 },
                },
              }))
            );
          } else {
            setError("No valid seat data found in query parameter");
          }
          source = "query";
          localStorage.setItem("busBookingData", JSON.stringify(parsed));
        } else {
          setError("Invalid JSON format in query parameter");
        }
      } catch (error) {
        setError("Error parsing query data: " + error.message);
      }
    } else {
      setError("No booking data available");
    }
    console.log("Data source:", source);
  }, [searchParams]);

  // Countdown timer for session expiration
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/bus");
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Your session has expired. Please search for a bus again.",
            confirmButtonText: "OK",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Format countdown time
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle input changes
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });

    if (!value) {
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
  };

  // Calculate age for passenger
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Validate passenger data
  const validateForm = () => {
    const validationErrors = {};
    passengers.forEach((passenger, index) => {
      const requiredFields = [
        "Title",
        "FirstName",
        "LastName",
        "Gender",
        "DateOfBirth",
        "ContactNo",
      ];
      if (index === 0) {
        requiredFields.push("Address", "City", "Email");
      }
      requiredFields.forEach((field) => {
        if (!passenger[field]) {
          validationErrors[`${field}_${index}`] = `${field} is required`;
        }
      });

      // Validate Date of Birth
      if (passenger.DateOfBirth) {
        const dob = new Date(passenger.DateOfBirth);
        const today = new Date();
        if (dob > today) {
          validationErrors[`DateOfBirth_${index}`] = "Date of Birth cannot be in the future";
        } else {
          const age = calculateAge(passenger.DateOfBirth);
          if (age < 0 || age > 100) {
            validationErrors[`DateOfBirth_${index}`] = "Invalid Date of Birth";
          }
        }
      }

      // Validate Contact Number
      if (passenger.ContactNo && !/^\d{10}$/.test(passenger.ContactNo)) {
        validationErrors[`ContactNo_${index}`] = "Contact Number must be 10 digits";
      }

      // Validate Email
      if (
        index === 0 &&
        passenger.Email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.Email)
      ) {
        validationErrors[`Email_${index}`] = "Invalid Email Address";
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle booking and payment
  const handleBooking = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill out all required fields and fix the errors before submitting.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Assume PublishedPrice is in paise
    const totalAmount = passengers.reduce(
      (total, p) => total + (p.Seat?.Price?.PublishedPrice || 0),
      0
    );

    if (totalAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "The total amount is invalid. Please reselect your seats.",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);
    const requestId = uuidv4();
    const requestLog = {
      requestId,
      timestamp: new Date().toISOString(),
      endpoint: "",
      payload: {},
      response: null,
    };

    try {
      const leadPassenger = passengers[0];

      // Log seat prices for debugging
      console.log("Seat Prices:", passengers.map(p => ({
        SeatName: p.Seat.SeatName,
        PublishedPrice: p.Seat.Price.PublishedPrice,
        PublishedPriceInRupees: (p.Seat.Price.PublishedPrice / 100).toFixed(2),
      })));
      console.log("Total Amount (paise):", totalAmount);
      console.log("Total Amount (rupees):", (totalAmount / 100).toFixed(2));

      // Create Razorpay order
      const orderResponse = await axios.post(`${apilink}/create-razorpay-order`, {
        amount: totalAmount, // In paise
        currency: "INR",
        receipt: `bus_booking_${Date.now()}`,
        user_email: leadPassenger.Email,
        user_name: `${leadPassenger.FirstName} ${leadPassenger.LastName || ""}`,
        user_phone: leadPassenger.ContactNo || "9999999999",
      });

      const { order_id } = orderResponse.data;

      const options = {
        key: "rzp_live_GHQAKE32vCoZBA", // Live Razorpay key
        amount: totalAmount, // In paise
        currency: "INR",
        name: "Next Gen Trip Pvt Ltd",
        description: "Bus Booking Payment",
        order_id,
        handler: async (response) => {
          try {
            const mappedPassengers = passengers.map((passenger, index) => ({
              LeadPassenger: index === 0,
              PassengerId: 0,
              Title: passenger.Title,
              Address: passenger.Address || "",
              Age: calculateAge(passenger.DateOfBirth),
              Email: passenger.Email || "",
              FirstName: passenger.FirstName,
              Gender: passenger.Gender === "Male" ? 1 : passenger.Gender === "Female" ? 2 : 3,
              IdNumber: passenger.PassportNo || "null",
              IdType: passenger.PassportNo ? 10 : 0,
              LastName: passenger.LastName,
              Phoneno: passenger.ContactNo,
              Seat: {
                ColumnNo: passenger.Seat?.ColumnNo || "000",
                Height: 1,
                IsLadiesSeat: passenger.Seat?.IsLadiesSeat || false,
                IsMalesSeat: passenger.Seat?.IsMalesSeat || false,
                IsUpper: passenger.Seat?.IsUpper || false,
                RowNo: passenger.Seat?.RowNo || "000",
                SeatIndex: passenger.Seat?.SeatIndex || (index + 1).toString(),
                SeatName: passenger.Seat?.SeatName || (index + 1).toString(),
                SeatStatus: true,
                SeatType: passenger.Seat?.SeatType || 1,
                Width: 1,
                Price: passenger.Seat?.Price || { PublishedPrice: 0 },
              },
            }));

            const blockPayload = {
              EndUserIp: "223.178.213.196",
              ResultIndex: bookingData?.ResultIndex || selectedBusData?.ResultIndex || 16,
              TraceId: bookingData?.TraceId || "9a76f39f-dd53-4431-b010-0e4208d74422",
              BoardingPointId: bookingData?.BoardingPointId || 1,
              DroppingPointId: bookingData?.DroppingPointId || 1,
              Passenger: mappedPassengers,
            };

            requestLog.endpoint = `${apilink}/bus/busblock`;
            requestLog.payload = blockPayload;

            const blockResponse = await axios.post(`${apilink}/bus/busblock`, blockPayload);

            if (!blockResponse.data?.status) {
              throw new Error(blockResponse.data?.message || "Failed to block bus seats");
            }

            const blockResult = blockResponse.data;

            const bookPayload = {
              ...blockPayload,
              BlockKey: blockResult?.BlockKey,
              BookingId: blockResult?.BookingId,
              InventoryItems: blockResult?.InventoryItems,
            };

            requestLog.endpoint = `${apilink}/bus/book`;
            requestLog.payload = bookPayload;

            const bookResponse = await axios.post(`${apilink}/bus/book`, bookPayload);

            if (!bookResponse.data?.status) {
              throw new Error(bookResponse.data?.message || "Booking failed");
            }

            const bookResult = bookResponse.data;

            // Capture payment
            await axios.post(`${apilink}/capture-razorpay-payment`, {
              payment_id: response.razorpay_payment_id,
              amount: totalAmount / 100, // Convert to rupees
            });

            requestLog.response = bookResponse.data;
            localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));

            // Send invoice
            const busTicket = {
              boarding_point: boardingData?.BoardingPointsDetails[0]?.CityPointName,
              dropping_point: boardingData?.DroppingPointsDetails[0]?.CityPointName,
              boarding_time: boardingData?.BoardingPointsDetails[0]?.CityPointTime,
              dropping_time: boardingData?.DroppingPointsDetails[0]?.CityPointTime,
              passenger_name: `${passengers[0].Title} ${passengers[0].FirstName} ${passengers[0].LastName}`,
              email: passengers[0].Email,
              booking_id: bookResult?.BookingId || bookingData?.TraceId,
              route: `${boardingData?.BoardingPointsDetails[0]?.CityPointName} → ${boardingData?.DroppingPointsDetails[0]?.CityPointName}`,
              date: new Date(boardingData?.BoardingPointsDetails[0]?.CityPointTime).toLocaleDateString(),
              total_bdt: (totalAmount / 100).toFixed(2), // Convert to rupees
              payment_status: "Completed",
            };

            await axios.post("http://your-laravel-api/send-invoice", busTicket);

            Swal.fire({
              icon: "success",
              title: "Booking and Payment Successful",
              text: `Booking ID: ${bookResult?.BookingId || "N/A"}\nPayment ID: ${response.razorpay_payment_id}`,
              confirmButtonText: "OK",
            });

            localStorage.removeItem("busBookingData");
            localStorage.removeItem("busBoardingData");
            localStorage.removeItem("selectedBus");
            router.push("/booking-confirmation");
          } catch (err) {
            console.error("Booking Error:", err);
            requestLog.response = { error: err.message };
            localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));

            Swal.fire({
              icon: "error",
              title: "Booking Failed",
              text: err.message || "Please contact support.",
              confirmButtonText: "OK",
            });
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: `${leadPassenger.FirstName} ${leadPassenger.LastName || ""}`,
          email: leadPassenger.Email || "",
          contact: leadPassenger.ContactNo || "",
        },
        theme: {
          color: "#0086da",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            Swal.fire({
              icon: "error",
              title: "Payment Cancelled",
              text: "The payment was cancelled. Please try again.",
              confirmButtonText: "OK",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setIsLoading(false);
        requestLog.response = { error: response.error.description };
        localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));

        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: response.error.description || "Payment was not successful. Please try again.",
          confirmButtonText: "OK",
        });
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment Initialization Error:", error);
      requestLog.response = { error: error.message };
      localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message || "Something went wrong during payment.",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
    }
  };

  // Render
  return (
    <div className="grid max-w-[100rem] mx-auto grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="FirstChild border rounded-lg shadow-lg md:col-span-1">
        <div className="flex justify-end mb-4">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
            Time Left: {formatCountdown(countdown)}
          </div>
        </div>
        <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="border-4 bg-white border-orange-100 h-10 w-10 flex justify-center items-center text-2xl rounded-full">
              <FaBusAlt />
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
              <p className="text-sm text-gray-500">Express AC Bus - Approx. 6h</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Departure:{" "}
              {boardingData?.BoardingPointsDetails[0]?.CityPointTime
                ? new Date(boardingData.BoardingPointsDetails[0].CityPointTime).toLocaleTimeString()
                : "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Arrival:{" "}
              {boardingData?.DroppingPointsDetails[0]?.CityPointTime
                ? new Date(boardingData.DroppingPointsDetails[0].CityPointTime).toLocaleTimeString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold">ADULT</h3>
          {passengers?.map((passenger, index) => (
            <div key={index} className="m-4 rounded-lg shadow-lg border-2 bg-white">
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-md shadow-lg">
                {[
                  { name: "Title", type: "select", options: ["Mr", "Ms", "Mrs"] },
                  { name: "FirstName", type: "text" },
                  { name: "LastName", type: "text" },
                  { name: "Gender", type: "select", options: ["Male", "Female", "Other"] },
                  { name: "DateOfBirth", type: "date" },
                  { name: "Address", type: "text", required: index === 0 },
                  { name: "City", type: "text", required: index === 0 },
                  { name: "ContactNo", type: "text" },
                  { name: "Email", type: "email", required: index === 0 },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-[10px] font-bold text-gray-900 mb-1">{field.name}</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={passenger[field.name] || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required={field.required !== undefined ? field.required : true}
                      >
                        <option value="">Select {field.name}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={passenger[field.name] || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required={field.required !== undefined ? field.required : true}
                      />
                    )}
                    {errors[`${field.name}_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`${field.name}_${index}`]}</p>
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

      <div className="rightSide space-y-4 md:px-4 md:col-span-1">
        <div className="sticky top-4">
          <div className="priceBoxAndDetails border rounded shadow-lg">
            <div className="border rounded-t flex items-center px-3 py-2 bg-[#D1EAFF]">
              <h3>Price Summary</h3>
            </div>
            <div className="flex justify-between px-3 py-3 text-sm border-b">
              <p>Adult x {passengers?.length}</p>
              <p className="flex items-center font-bold text-xs">
                <FaRupeeSign />
                {passengers.reduce((total, p) => total + (p.Seat?.Price?.PublishedPrice || 0), 0).toLocaleString("en-IN")}
              </p>
            </div>
            {passengers.map((p, index) => (
              <div key={index} className="flex justify-between px-3 py-2 text-sm text-gray-600 border-b">
                <p>Seat {p.Seat?.SeatName || "N/A"}</p>
                <p className="flex items-center">
                  <FaRupeeSign />
                  {(p.Seat?.Price?.PublishedPrice || 0).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <div className="booking flex justify-center items-center mt-3">
            <button
              className={`bg-[#DA5200] text-sm lg:text-lg tracking-normal text-white rounded-full w-full md:w-[80%] py-2 flex justify-center items-center ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
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