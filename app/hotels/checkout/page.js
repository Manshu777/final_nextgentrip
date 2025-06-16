"use client";

import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaSpinner, FaRupeeSign } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apilink } from "../../Component/common";

export default function Book() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [showForms, setShowForms] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hotelData, setHotelData] = useState(null);
  const [cancellationPolicies, setCancellationPolicies] = useState([]);
  const [validationPolicies, setValidationPolicies] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    endUserIp: "",
    guestNationality: "",
    isVoucherBooking: false,
    isPackageFare: false,
    isPackageDetailsMandatory: false,
    arrivalTransport: {
      arrivalTransportType: 0, // 0 for Flight, 1 for Surface
      transportInfoId: "",
      time: "0001-01-01T00:00:00:00",
    },
  });
  const [fareDetails, setFareDetails] = useState({
    totalFare: 0,
    taxFare: 0,
    netAmount: 0,
  });

  const [childAges, setChildAges] = useState([]);

  // Fetch IP address and hotel data

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setBookingDetails((prev) => ({ ...prev, endUserIp: response.data.ip }));
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          endUserIp: "Failed to detect IP address. Please enter manually.",
        }));
      }
    };

    fetchIpAddress();

    try {
      const hotelCheckData = JSON.parse(localStorage.getItem("hotelcheckdata"));
      const searchData = JSON.parse(localStorage.getItem("hotelSearchData"));
      const hotelItems = JSON.parse(localStorage.getItem("hotelItems"));
      const validationPolices = JSON.parse(localStorage.getItem("validationpolices"));

      setValidationPolicies(validationPolices || {});
      setCancellationPolicies(hotelCheckData.Rooms?.[0].CancelPolicies || []);
      setChildAges(hotelItems?.childAges || []); // Set childAges from hotelItems

      if (hotelCheckData && hotelItems) {
        const mappedHotelData = {
          HotelName: hotelCheckData.Rooms[0].Name[0] || "Unknown Hotel",
          CheckInDate: searchData?.CheckInDate || new Date().toISOString().split("T")[0],
          CheckOutDate: searchData?.CheckOutDate || new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          BookingCode: hotelCheckData.Rooms[0].BookingCode || "BOOK12345",
          className: "Price",
          Price: {
            TotalDisplayFare: parseFloat(hotelCheckData?.Rooms[0]?.TotalFare || 0),
          },
          IsPackageFare: hotelCheckData?.IsPackageFare || false,
          IsPackageDetails: {
            IsMandatory: hotelCheckData.IsPackageDetailsMandatory || false,
          },
          HotelRoomsDetails: hotelCheckData.Rooms?.map((room, index) => {
            const roomData = Array.isArray(hotelItems) ? hotelItems[index] : hotelItems;
            const adultCount = parseInt(roomData?.adultcount, 10) || 1;
            const childCount = parseInt(roomData?.childcount, 10) || 0;

            const guestDetails = [
              ...Array(adultCount).fill().map((_, guestIndex) => ({
                PaxType: 1,
                LeadPassenger: guestIndex === 0,
                Title: "",
                FirstName: "",
                MiddleName: "",
                LastName: "",
                Phoneno: "",
                Email: "",
                PassportNo: "",
                PassportIssueDate: "0001-01-01T00:00:00:00",
                PassportExpDate: "0001-01-01T00:00:00:00",
                PAN: "",
                Age: null,
              })),
              ...Array(childCount).fill().map(() => ({
                PaxType: 2,
                LeadPassenger: false,
                Title: "",
                FirstName: "",
                MiddleName: "",
                LastName: "",
                Email: "",
                Age: "", // Initialize as empty; user will select from childAges
                PassportNo: "",
                PassportIssueDate: "0001-01-01T00:00:00:00",
                PassportExpDate: "0001-01-01T00:00:00:00",
                PAN: "",
              })),
            ];

            return {
              RoomIndex: index + 1,
              RoomTypeName: room.Name?.[0] || "Standard Room",
              Price: {
                PublishedPrice: parseFloat(room.PriceBreakUp?.[0]?.RoomRate || 0),
              },
              GuestDetails: guestDetails,
            };
          }) || [],
        };
        setHotelData(mappedHotelData);
        setRooms(mappedHotelData.HotelRoomsDetails);
        setBookingDetails((prev) => ({
          ...prev,
          isPackageFare: mappedHotelData.IsPackageFare,
          isPackageDetailsMandatory: mappedHotelData.IsPackageDetailsMandatory,
        }));

        // Calculate fare details
        const taxRate = 0.18;
        const roomTotal = mappedHotelData.HotelRoomsDetails.reduce(
          (sum, room) => sum + (parseFloat(room.Price.PublishedPrice) || 0),
          0
        );
        const taxFare = hotelCheckData?.Rooms[0]?.TotalTax;
        const totalFare = hotelCheckData?.Rooms[0]?.TotalFare;
        const netAmount = hotelCheckData?.Rooms[0]?.NetAmount;

        console.log("Fare Calculation:", {
          roomTotal: roomTotal,
          taxRate: taxRate,
          taxFare: taxFare,
          totalFare: totalFare,
          netAmount: netAmount,
          matchesTotalDisplayFare: netAmount === parseFloat(hotelCheckData.Rooms[0].TotalFare || 0),
        });

        setFareDetails({
          totalFare: totalFare,
          taxFare: taxFare,
          netAmount: netAmount,
        });
      } else {
        throw new Error("No hotel data found in localStorage");
      }
    } catch (error) {
      console.error("Failed to parse localStorage data:", error);
      router.push("/hotels");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid or missing hotel data. Please try again.",
        confirmButtonText: "OK",
      });
    }
  }, [router]);


  // Initialize rooms based on hotel data
  useEffect(() => {
    if (hotelData?.HotelRoomsDetails) {
      const initialRooms = hotelData.HotelRoomsDetails.map((room, roomIndex) => ({
        RoomIndex: room.RoomIndex,
        RoomTypeName: room.RoomTypeName,
        Guests: room.GuestDetails?.map((guest, guestIndex) => ({
          Title: "",
          FirstName: "",
          MiddleName: "",
          LastName: "",
          Phoneno: "",
          Email: "",
          PaxType: guest.PaxType,
          LeadPassenger: guestIndex === 0 && guest.PaxType === 1,
          Age: guest.PaxType === 2 ? "" : null,
          PassportNo: "",
          PassportIssueDate: "0001-01-01T00:00:00:00",
          PassportExpDate: "0001-01-01T00:00:00:00",
          PAN: "",
        })) || [],
      }));
      setRooms(initialRooms);
      setShowForms(Array(hotelData.HotelRoomsDetails.length).fill(true));
    }
  }, [hotelData]);

  const handleChange = (e, roomIndex, guestIndex) => {
    const { name, value, type, checked } = e.target;
    let sanitizedValue = value;

    if (name === "FirstName" || name === "LastName" || name === "MiddleName") {
      if (!validationPolicies?.SpecialCharAllowed) {
        sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s]/g, "");
      }
      if (!validationPolicies?.SpaceAllowed) {
        sanitizedValue = sanitizedValue.replace(/\s/g, "");
      }
      if (validationPolicies?.CharLimit) {
        sanitizedValue = sanitizedValue.slice(0, validationPolicies.PaxNameMaxLength);
        if (sanitizedValue.length < validationPolicies.PaxNameMinLength) {
          sanitizedValue = value;
        }
      }
    } else if (name === "PAN") {
      sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    } else if (name === "arrivalTransportType") {
      sanitizedValue = parseInt(value, 10);
    }

    if (roomIndex !== undefined && guestIndex !== undefined) {
      const updatedRooms = [...rooms];
      updatedRooms[roomIndex].Guests[guestIndex][name] = type === "checkbox" ? checked : sanitizedValue;
      setRooms(updatedRooms);
    } else if (name.startsWith("arrivalTransport")) {
      const field = name.replace("arrivalTransport.", "");
      setBookingDetails((prev) => ({
        ...prev,
        arrivalTransport: {
          ...prev.arrivalTransport,
          [field]: sanitizedValue,
        },
      }));
    } else {
      setBookingDetails((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : sanitizedValue,
      }));
    }

    if (errors[`${name}_${roomIndex}_${guestIndex}`] || errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${name}_${roomIndex}_${guestIndex}`];
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const toggleFormVisibility = (index) => {
    setShowForms((prev) => {
      const updatedShowForms = [...prev];
      updatedShowForms[index] = !prev[index];
      return updatedShowForms;
    });
  };

  const validateAllForms = () => {
    const newErrors = {};

    // Validate top-level fields
    if (!bookingDetails.endUserIp || !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(bookingDetails.endUserIp)) {
      newErrors.endUserIp = "Valid IP address is required (e.g., 192.168.1.1)";
    }
    if (!bookingDetails.guestNationality || !/^[A-Z]{2}$/.test(bookingDetails.guestNationality)) {
      newErrors.guestNationality = "Valid ISO country code is required (e.g., IN, GB)";
    }
    if (bookingDetails.isVoucherBooking === null || bookingDetails.isVoucherBooking === undefined) {
      newErrors.isVoucherBooking = "Voucher booking selection is required";
    }

    // Validate arrival transport if mandatory
    if (validationPolicies?.PackageDetailsMandatory) {
      if (![0, 1].includes(bookingDetails.arrivalTransport.arrivalTransportType)) {
        newErrors.arrivalTransportType = "Arrival transport type must be Flight (0) or Surface (1)";
      }
      if (!bookingDetails.arrivalTransport.time || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}:\d{2}$/.test(bookingDetails.arrivalTransport.time)) {
        newErrors.arrivalTransportTime = "Valid arrival time is required (e.g., 0001-01-01T00:00:00:00)";
      }
    }

    // Validate guest details
    let totalPanCount = 0;
    const nameSet = validationPolicies?.SamePaxNameAllowed ? null : new Set();

    rooms.forEach((room, roomIndex) => {
      let hasLeadPassenger = false;
      room.Guests.forEach((guest, guestIndex) => {
        // Validate Title
        if (!["Mr", "Mrs", "Miss", "Ms"].includes(guest.Title)) {
          newErrors[`Title_${roomIndex}_${guestIndex}`] = "Title must be Mr, Mrs, Miss, or Ms";
        }

        // Validate FirstName and LastName
        if (!guest.FirstName || guest.FirstName.length < (validationPolicies?.PaxNameMinLength || 2)) {
          newErrors[`FirstName_${roomIndex}_${guestIndex}`] = `First Name must be at least ${validationPolicies?.PaxNameMinLength || 2} characters`;
        } else if (validationPolicies?.CharLimit && guest.FirstName.length > (validationPolicies?.PaxNameMaxLength || 50)) {
          newErrors[`FirstName_${roomIndex}_${guestIndex}`] = `First Name must not exceed ${validationPolicies?.PaxNameMaxLength || 50} characters`;
        }
        if (!guest.LastName || guest.LastName.length < (validationPolicies?.PaxNameMinLength || 2)) {
          newErrors[`LastName_${roomIndex}_${guestIndex}`] = `Last Name must be at least ${validationPolicies?.PaxNameMinLength || 2} characters`;
        } else if (validationPolicies?.CharLimit && guest.LastName.length > (validationPolicies?.PaxNameMaxLength || 50)) {
          newErrors[`LastName_${roomIndex}_${guestIndex}`] = `Last Name must not exceed ${validationPolicies?.PaxNameMaxLength || 50} characters`;
        }

        // Validate unique names
        if (!validationPolicies?.SamePaxNameAllowed && guest.FirstName && guest.LastName) {
          const fullName = `${guest.FirstName} ${guest.LastName}`;
          if (nameSet.has(fullName)) {
            newErrors[`FirstName_${roomIndex}_${guestIndex}`] = "Duplicate names are not allowed";
          } else {
            nameSet.add(fullName);
          }
        }

        // Validate PAN
        if (validationPolicies?.PanMandatory) {
          if (!guest.PAN || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(guest.PAN)) {
            newErrors[`PAN_${roomIndex}_${guestIndex}`] = "PAN must be in format AAAAA1234A";
          } else {
            totalPanCount += 1;
          }
        } else if (guest.PAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(guest.PAN)) {
          newErrors[`PAN_${roomIndex}_${guestIndex}`] = "PAN must be in format AAAAA1234A";
        }

        // Validate Passport
        if (validationPolicies?.PassportMandatory) {
          if (!guest.PassportNo) {
            newErrors[`PassportNo_${roomIndex}_${guestIndex}`] = "Passport Number is required";
          }
          if (!guest.PassportIssueDate || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}:\d{2}$/.test(guest.PassportIssueDate)) {
            newErrors[`PassportIssueDate_${roomIndex}_${guestIndex}`] = "Passport Issue Date must be in format YYYY-MM-DDTHH:MM:SS:00";
          }
          if (!guest.PassportExpDate || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}:\d{2}$/.test(guest.PassportExpDate)) {
            newErrors[`PassportExpDate_${roomIndex}_${guestIndex}`] = "Passport Expiry Date must be in format YYYY-MM-DDTHH:MM:SS:00";
          }
        } else if (guest.PassportIssueDate && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}:\d{2}$/.test(guest.PassportIssueDate)) {
          newErrors[`PassportIssueDate_${roomIndex}_${guestIndex}`] = "Passport Issue Date must be in format YYYY-MM-DDTHH:MM:SS:00";
        } else if (guest.PassportExpDate && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}:\d{2}$/.test(guest.PassportExpDate)) {
          newErrors[`PassportExpDate_${roomIndex}_${guestIndex}`] = "Passport Expiry Date must be in format YYYY-MM-DDTHH:MM:SS:00";
        }

        // Validate PaxType
        if (![1, 2].includes(guest.PaxType)) {
          newErrors[`PaxType_${roomIndex}_${guestIndex}`] = "Guest Type must be Adult or Child";
        }

        // Validate Phone Number for all adults
        { console.log('guest.Phoneno', !guest.Phoneno || !/^\+?\d{9,15}$/.test(guest.Phoneno)) }
        if (guest.PaxType === 1) {
          if (!guest.Phoneno) {
            newErrors[`Phoneno_${roomIndex}_${guestIndex}`] = "Phone number is required for adult guests";
          } else {
            const digits = guest.Phoneno.replace(/^\+?/, '').replace(/[^0-9]/g, '');
            { console.log('guest.Phoneno', digits.length) }

            if (digits.length < 10 || digits.length > 15) {
              newErrors[`Phoneno_${roomIndex}_${guestIndex}`] = "Phone number must be 10 to 15 digits long";
            }
          }
        }

        // Validate Lead Passenger fields
        if (guest.LeadPassenger) {
          if (!guest.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.Email)) {
            newErrors[`Email_${roomIndex}_${guestIndex}`] = "Valid email is required for lead guest";
          }
        }

        // Validate Child-specific fields
        if (guest.PaxType === 2) {
          if (!guest.Age || guest.Age > 12 || guest.Age < 0) {
            newErrors[`Age_${roomIndex}_${guestIndex}`] = "Age is required for children and must be ≤ 12";
          }
          if (!guest.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.Email)) {
            newErrors[`Email_${roomIndex}_${guestIndex}`] = "Valid parent email is required for child";
          }
        }

        if (guest.LeadPassenger) {
          hasLeadPassenger = true;
        }
      });

      if (!hasLeadPassenger) {
        newErrors[`LeadPassenger_${roomIndex}`] = `Room ${roomIndex + 1} must have one adult as lead passenger`;
      }
    });

    // Validate PanCountRequired
    if (validationPolicies?.PanCountRequired > 0 && totalPanCount < validationPolicies.PanCountRequired) {
      newErrors.panCount = `At least ${validationPolicies.PanCountRequired} PAN number(s) are required across all guests`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookHotel = async (e) => {
    e.preventDefault();
    const isValid = validateAllForms();
  
    const bookingCode = hotelData?.BookingCode;
  
    if (isValid) {
      setIsLoading(true);
      const payload = {
        BookingCode: bookingCode || "BOOK12345",
        EndUserIp: bookingDetails.endUserIp,
        GuestNationality: bookingDetails.guestNationality,
        IsVoucherBooking: bookingDetails.isVoucherBooking,
        IsPackageFare: bookingDetails.isPackageFare,
        IsPackageDetailsMandatory: bookingDetails.isPackageDetailsMandatory,
        NetAmount: fareDetails.netAmount,
        RequestedBookingMode: 5,
        HotelRoomsDetails: rooms.map((room) => ({
          RoomIndex: room.RoomIndex,
          HotelPassenger: room.Guests.map((guest) => {
            const passenger = {
              Title: guest.Title,
              FirstName: guest.FirstName,
              MiddleName: guest.MiddleName || "",
              LastName: guest.LastName,
              Phoneno: guest.Phoneno ? parseInt(guest.Phoneno.replace(/^\+?/, ""), 10) : null,
              Email: guest.Email || null,
              PaxType: parseInt(guest.PaxType, 10),
              LeadPassenger: guest.LeadPassenger,
              Age: guest.Age ? parseInt(guest.Age, 10) : null,
            };
  
            if (validationPolicies?.PanMandatory || (guest.PAN && guest.PAN !== "")) {
              passenger.PAN = guest.PAN || null;
            }
  
            if (
              validationPolicies?.PassportMandatory ||
              (guest.PassportNo && guest.PassportNo !== "") ||
              (guest.PassportIssueDate && guest.PassportIssueDate !== "0001-01-01T00:00:00:00") ||
              (guest.PassportExpDate && guest.PassportExpDate !== "0001-01-01T00:00:00:00")
            ) {
              passenger.PassportNo = guest.PassportNo || null;
              passenger.PassportIssueDate = guest.PassportIssueDate || null;
              passenger.PassportExpDate = guest.PassportExpDate || null;
            }
  
            return passenger;
          }),
        })),
        ...(bookingDetails.isPackageDetailsMandatory && {
          ArrivalTransport: {
            ArrivalTransportType: bookingDetails.arrivalTransport.arrivalTransportType,
            TransportInfoId: bookingDetails.arrivalTransport.transportInfoId || "",
            Time: bookingDetails.arrivalTransport.time || "0001-01-01T00:00:00:00",
          },
        }),
      };
  
      try {
        const response = await axios.post(`${apilink}/hotel/book`, payload);
        setBookingResponse(response.data);
        setShowModal(true);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        let errorMessage = "An error occurred while booking the hotel.";
        
        // Check for session expiration error
        if (
          error.response?.data?.data?.BookResult?.Error?.ErrorCode === 5 ||
          error.response?.data?.data?.BookResult?.Error?.ErrorMessage === "Your session (TraceId) is expired."
        ) {
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Your session has expired. Please search for hotels again.",
            confirmButtonText: "OK",
          }).then(() => {
            router.push("/hotels");
          });
        } else {
          // Handle other errors
          if (error.response?.data?.errors) {
            errorMessage = Object.values(error.response.data.errors).flat().join(" ");
          } else if (error.response?.data?.data?.BookResult?.Error?.ErrorMessage) {
            errorMessage = error.response.data.data.BookResult.Error.ErrorMessage;
          } else if (error.message) {
            errorMessage = error.message;
          }
          Swal.fire({
            icon: "error",
            title: "Booking Failed",
            text: errorMessage,
            confirmButtonText: "OK",
          });
        }
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Invalid Input",
        text: "Please fill out all required fields and fix the errors before submitting.",
        confirmButtonText: "OK",
      });
    }
  };

  const closeModal = () => setShowModal(false);

  const HotelConfirmationModal = ({ bookingResponse, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-4 text-[#DA5200]">
            🎉 Hotel Booked!
          </h2>
          <div className="space-y-4">
            <p>
              <strong>Booking Reference:</strong>{" "}
              {bookingResponse?.bookingReference || "N/A"}
            </p>
            <p>
              <strong>Hotel Name:</strong> {hotelData?.HotelName || "N/A"}
            </p>
            <p>
              <strong>Check-In Date:</strong>{" "}
              {hotelData?.CheckInDate
                ? new Date(hotelData.CheckInDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Check-Out Date:</strong>{" "}
              {hotelData?.CheckOutDate
                ? new Date(hotelData.CheckOutDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Total Amount:</strong> INR{" "}
              {fareDetails.totalFare.toLocaleString() || "N/A"}
            </p>
          </div>
          <div className="mt-6 text-center">
            <button
              className="bg-[#DA5200] text-white px-6 py-2 rounded-full hover:bg-[#C44A00]"
              onClick={onClose}
              aria-label="Close confirmation modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const formatCancellationPolicy = (policy) => {
    const date = new Date(policy.FromDate).toLocaleDateString();
    const charge = policy.CancellationCharge === 0
      ? "Free cancellation"
      : `${policy.ChargeType === "Fixed" ? "INR " : ""}${policy.CancellationCharge}${policy.ChargeType === "Percentage" ? "%" : ""}`;
    return `From ${date}: ${charge}`;
  };

  return (
    <div className="md:grid px-[10%] md:grid-cols-6 gap-5 mt-3">
      <div className="col-span-4 space-y-6">
        {/* Booking Details Section */}
        <div className="border rounded-lg shadow-lg">
          <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg flex items-center gap-3">
            <span className="text-sm md:text-xl font-medium">Booking Details</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-[10px] font-bold" htmlFor="endUserIp">
                End User IP *
              </label>
              <input
                type="text"
                id="endUserIp"
                name="endUserIp"
                value={bookingDetails.endUserIp}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
                placeholder="e.g., 192.168.1.1"
                required
                aria-label="End User IP Address"
                aria-describedby={errors.endUserIp ? "endUserIp-error" : undefined}
              />
              {errors.endUserIp && (
                <p id="endUserIp-error" className="text-red-500 text-sm">
                  {errors.endUserIp}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold" htmlFor="guestNationality">
                Guest Nationality (ISO Code) *
              </label>
              <input
                type="text"
                id="guestNationality"
                name="guestNationality"
                value={bookingDetails.guestNationality}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
                placeholder="e.g., IN, GB"
                required
                aria-label="Guest Nationality ISO Code"
                aria-describedby={errors.guestNationality ? "guestNationality-error" : undefined}
              />
              {errors.guestNationality && (
                <p id="guestNationality-error" className="text-red-500 text-sm">
                  {errors.guestNationality}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVoucherBooking"
                name="isVoucherBooking"
                checked={bookingDetails.isVoucherBooking}
                onChange={handleChange}
                className="mr-2"
                aria-label="Voucher Booking Immediately"
              />
              <label className="text-[10px] font-bold" htmlFor="isVoucherBooking">
                Voucher Booking Immediately
              </label>
              {errors.isVoucherBooking && (
                <p id="isVoucherBooking-error" className="text-red-500 text-sm">
                  {errors.isVoucherBooking}
                </p>
              )}
            </div>
            {bookingDetails.isPackageDetailsMandatory && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold" htmlFor="arrivalTransportType">
                    Arrival Transport Type *
                  </label>
                  <select
                    id="arrivalTransportType"
                    name="arrivalTransportType"
                    value={bookingDetails.arrivalTransport.arrivalTransportType}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    required
                    aria-label="Arrival Transport Type"
                    aria-describedby={errors.arrivalTransportType ? "arrivalTransportType-error" : undefined}
                  >
                    <option value="0">Flight</option>
                    <option value="1">Surface</option>
                  </select>
                  {errors.arrivalTransportType && (
                    <p id="arrivalTransportType-error" className="text-red-500 text-sm">
                      {errors.arrivalTransportType}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold" htmlFor="transportInfoId">
                    Transport Info ID
                  </label>
                  <input
                    type="text"
                    id="transportInfoId"
                    name="arrivalTransport.transportInfoId"
                    value={bookingDetails.arrivalTransport.transportInfoId}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    placeholder="Enter transport info ID"
                    aria-label="Transport Info ID"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold" htmlFor="arrivalTransportTime">
                    Arrival Time *
                  </label>
                  <input
                    type="text"
                    id="arrivalTransportTime"
                    name="arrivalTransport.time"
                    value={bookingDetails.arrivalTransport.time}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    placeholder="YYYY-MM-DDTHH:MM:SS:00"
                    required
                    aria-label="Arrival Time"
                    aria-describedby={errors.arrivalTransportTime ? "arrivalTransportTime-error" : undefined}
                  />
                  {errors.arrivalTransportTime && (
                    <p id="arrivalTransportTime-error" className="text-red-500 text-sm">
                      {errors.arrivalTransportTime}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hotel Details Section */}
        <div className="border rounded-lg shadow-lg">
          <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg flex items-center gap-3">
            <span className="text-sm md:text-xl font-medium">Hotel Details</span>
          </div>
          <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold">{hotelData?.HotelName || "N/A"}</h3>
            <p>
              <strong>Check-In:</strong>{" "}
              {hotelData?.CheckInDate
                ? new Date(hotelData.CheckInDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Check-Out:</strong>{" "}
              {hotelData?.CheckOutDate
                ? new Date(hotelData.CheckOutDate).toLocaleDateString()
                : "N/A"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotelData?.HotelRoomsDetails?.map((room, index) => (
                <div key={index} className="flex justify-between">
                  <span>{room.RoomTypeName}</span>
                  <span className="font-semibold">
                    INR {room.Price?.PublishedPrice?.toLocaleString() || "N/A"}
                  </span>
                </div>
              )) || <p>No room details available</p>}
            </div>
          </div>
        </div>

        {/* Cancellation Policies Section */}
        <div className="border rounded-lg shadow-lg">
          <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg flex items-center gap-3">
            <span className="text-sm md:text-xl font-medium">Cancellation Policies</span>
          </div>
          <div className="p-4 space-y-4">
            {cancellationPolicies?.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {cancellationPolicies?.map((policy, index) => (
                  <li key={index} className="text-sm">
                    Cancellation Charge {formatCancellationPolicy(policy)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No cancellation policy details available.</p>
            )}
            {hotelData?.LastCancellationDeadline && (
              <p className="text-sm font-semibold">
                Last Cancellation Deadline:{" "}
                {new Date(hotelData.LastCancellationDeadline).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Guest Details Section */}
        <div className="border rounded-lg shadow-lg">
          <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg flex items-center gap-3">
            <span className="text-sm md:text-xl font-medium">Guest Details</span>
          </div>

          {rooms.map((room, roomIndex) => (
            <div key={room.RoomIndex} className="m-4 rounded-lg shadow-lg border-2">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold">
                  Room {roomIndex + 1} ({room.RoomTypeName})
                </h3>
                <button
                  onClick={() => toggleFormVisibility(roomIndex)}
                  aria-label={`Toggle form for Room ${roomIndex + 1}`}
                >
                  <RiArrowDropDownLine
                    className={`text-2xl transform ${showForms[roomIndex] ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              {showForms[roomIndex] && (
                <div className="p-4 space-y-4">
                  {room.Guests.map((guest, guestIndex) => (
                    <div key={`guest_${roomIndex}_${guestIndex}`} className="border-t pt-4">
                      <h4 className="text-md font-semibold">
                        Guest {guestIndex + 1} {guest.LeadPassenger ? "(Lead)" : ""}
                      </h4>
                      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                        <div>
                          <label className="block text-[10px] font-bold" htmlFor={`title_${roomIndex}_${guestIndex}`}>
                            Title *
                          </label>
                          <select
                            id={`title_${roomIndex}_${guestIndex}`}
                            name="Title"
                            value={guest.Title}
                            onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                            className="w-full border p-2 rounded-md"
                            required
                            aria-label="Guest Title"
                            aria-describedby={errors[`Title_${roomIndex}_${guestIndex}`] ? `title-error_${roomIndex}_${guestIndex}` : undefined}
                          >
                            <option value="">Select</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Miss">Miss</option>
                          </select>
                          {errors[`Title_${roomIndex}_${guestIndex}`] && (
                            <p id={`title-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                              {errors[`Title_${roomIndex}_${guestIndex}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold" htmlFor={`firstName_${roomIndex}_${guestIndex}`}>
                            First Name *
                          </label>
                          <input
                            type="text"
                            id={`firstName_${roomIndex}_${guestIndex}`}
                            name="FirstName"
                            value={guest.FirstName}
                            onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                            className="w-full border p-2 rounded-md"
                            maxLength={validationPolicies?.PaxNameMaxLength || 50}
                            required
                            aria-label="Guest First Name"
                            aria-describedby={errors[`FirstName_${roomIndex}_${guestIndex}`] ? `firstName-error_${roomIndex}_${guestIndex}` : undefined}
                          />
                          {errors[`FirstName_${roomIndex}_${guestIndex}`] && (
                            <p id={`firstName-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                              {errors[`FirstName_${roomIndex}_${guestIndex}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold" htmlFor={`middleName_${roomIndex}_${guestIndex}`}>
                            Middle Name
                          </label>
                          <input
                            type="text"
                            id={`middleName_${roomIndex}_${guestIndex}`}
                            name="MiddleName"
                            value={guest.MiddleName}
                            onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                            className="w-full border p-2 rounded-md"
                            maxLength={validationPolicies?.PaxNameMaxLength || 50}
                            aria-label="Guest Middle Name"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold" htmlFor={`lastName_${roomIndex}_${guestIndex}`}>
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id={`lastName_${roomIndex}_${guestIndex}`}
                            name="LastName"
                            value={guest.LastName}
                            onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                            className="w-full border p-2 rounded-md"
                            maxLength={validationPolicies?.PaxNameMaxLength || 50}
                            required
                            aria-label="Guest Last Name"
                            aria-describedby={errors[`LastName_${roomIndex}_${guestIndex}`] ? `lastName-error_${roomIndex}_${guestIndex}` : undefined}
                          />
                          {errors[`LastName_${roomIndex}_${guestIndex}`] && (
                            <p id={`lastName-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                              {errors[`LastName_${roomIndex}_${guestIndex}`]}
                            </p>
                          )}
                        </div>
                        {(guest.LeadPassenger || guest.PaxType === 2) && (
                          <div>
                            <label className="block text-[10px] font-bold" htmlFor={`email_${roomIndex}_${guestIndex}`}>
                              {guest.PaxType === 2 ? "Parent Email *" : "Email *"}
                            </label>
                            <input
                              type="email"
                              id={`email_${roomIndex}_${guestIndex}`}
                              name="Email"
                              value={guest.Email}
                              onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                              className="w-full border p-2 rounded-md"
                              required
                              aria-label={guest.PaxType === 2 ? "Parent Email" : "Guest Email"}
                              aria-describedby={errors[`Email_${roomIndex}_${guestIndex}`] ? `email-error_${roomIndex}_${guestIndex}` : undefined}
                            />
                            {errors[`Email_${roomIndex}_${guestIndex}`] && (
                              <p id={`email-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                                {errors[`Email_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                        )}
                        {(guest.LeadPassenger || guest.PaxType === 1) && (
                          <div>
                            <label className="block text-[10px] font-bold" htmlFor={`phoneno_${roomIndex}_${guestIndex}`}>
                              Phone Number *
                            </label>
                            <input
                              type="text"
                              id={`phoneno_${roomIndex}_${guestIndex}`}
                              name="Phoneno"
                              value={guest.Phoneno}
                              onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                              className="w-full border p-2 rounded-md"
                              required
                              aria-label="Guest Phone Number"
                              aria-describedby={errors[`Phoneno_${roomIndex}_${guestIndex}`] ? `phoneno-error_${roomIndex}_${guestIndex}` : undefined}
                            />
                            {errors[`Phoneno_${roomIndex}_${guestIndex}`] && (
                              <p id={`phoneno-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                                {errors[`Phoneno_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                        )}
                        {validationPolicies?.PassportMandatory && (
                          <>
                            <div>
                              <label className="block text-[10px] font-bold" htmlFor={`passportNo_${roomIndex}_${guestIndex}`}>
                                Passport Number *
                              </label>
                              <input
                                type="text"
                                id={`passportNo_${roomIndex}_${guestIndex}`}
                                name="PassportNo"
                                value={guest.PassportNo}
                                onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                                className="w-full border p-2 rounded-md"
                                maxLength={20}
                                required
                                aria-label="Passport Number"
                                aria-describedby={errors[`PassportNo_${roomIndex}_${guestIndex}`] ? `passportNo-error_${roomIndex}_${guestIndex}` : undefined}
                              />
                              {errors[`PassportNo_${roomIndex}_${guestIndex}`] && (
                                <p id={`passportNo-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                                  {errors[`PassportNo_${roomIndex}_${guestIndex}`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold" htmlFor={`passportIssueDate_${roomIndex}_${guestIndex}`}>
                                Passport Issue Date *
                              </label>
                              <input
                                type="datetime-local"
                                id={`passportIssueDate_${roomIndex}_${guestIndex}`}
                                name="PassportIssueDate"
                                value={guest.PassportIssueDate ? guest.PassportIssueDate.slice(0, 16) : ""}
                                onChange={(e) => handleChange({ target: { name: "PassportIssueDate", value: e.target.value + ":00" } }, roomIndex, guestIndex)}
                                className="w-full border p-2 rounded-md"
                                required
                                aria-label="Passport Issue Date"
                                aria-describedby={errors[`PassportIssueDate_${roomIndex}_${guestIndex}`] ? `passportIssueDate-error_${roomIndex}_${guestIndex}` : undefined}
                              />
                              {errors[`PassportIssueDate_${roomIndex}_${guestIndex}`] && (
                                <p id={`passportIssueDate-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                                  {errors[`PassportIssueDate_${roomIndex}_${guestIndex}`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold" htmlFor={`passportExpDate_${roomIndex}_${guestIndex}`}>
                                Passport Expiry Date *
                              </label>
                              <input
                                type="datetime-local"
                                id={`passportExpDate_${roomIndex}_${guestIndex}`}
                                name="PassportExpDate"
                                value={guest.PassportExpDate ? guest.PassportExpDate.slice(0, 16) : ""}
                                onChange={(e) => handleChange({ target: { name: "PassportExpDate", value: e.target.value + ":00" } }, roomIndex, guestIndex)}
                                className="w-full border p-2 rounded-md"
                                required
                                aria-label="Passport Expiry Date"
                                aria-describedby={errors[`PassportExpDate_${roomIndex}_${guestIndex}`] ? `passportExpDate-error_${roomIndex}_${guestIndex}` : undefined}
                              />
                              {errors[`PassportExpDate_${roomIndex}_${guestIndex}`] && (
                                <p id={`passportExpDate-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                                  {errors[`PassportExpDate_${roomIndex}_${guestIndex}`]}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                        {validationPolicies?.PanMandatory && (
                          <div>
                            <label className="block text-[10px] font-bold">
                              PAN *
                            </label>
                            <input
                              type="text"
                              id={`pan_${roomIndex}_${guestIndex}`}
                              name="PAN"
                              value={guest.PAN}
                              onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                              className="w-full border p-2 rounded-md"
                              placeholder="e.g., AAAAA1234A"
                              maxLength={10}
                              required
                              aria-label="PAN"
                              aria-describedby={errors[`PAN_${roomIndex}_${guestIndex}`] ? `pan-error_${roomIndex}_${guestIndex}` : undefined}
                            />
                            {errors[`PAN_${roomIndex}_${guestIndex}`] && (
                              <p id={`pan-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                                {errors[`PAN_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                        )}
                        <div>
                          <label className="block text-[10px] font-bold" htmlFor={`paxType_${roomIndex}_${guestIndex}`}>
                            Guest Type *
                          </label>
                          <select
                            id={`paxType_${roomIndex}_${guestIndex}`}
                            name="PaxType"
                            value={guest.PaxType}
                            onChange={(e) => {
                              const updatedRooms = [...rooms];
                              updatedRooms[roomIndex].Guests[guestIndex].PaxType = parseInt(e.target.value, 10);
                              if (e.target.value === "2") {
                                updatedRooms[roomIndex].Guests[guestIndex].Age = "";
                                updatedRooms[roomIndex].Guests[guestIndex].LeadPassenger = false;
                              } else {
                                updatedRooms[roomIndex].Guests[guestIndex].Age = null;
                              }
                              setRooms(updatedRooms);
                            }}
                            className="w-full border p-2 rounded-md"
                            required
                            aria-label="Guest Type"
                          >
                            <option value="1">Adult</option>
                            <option value="2">Child</option>
                          </select>
                        </div>
                        {guest.PaxType === 2 && (

                          <div>
                            <label className="block text-[10px] font-bold" htmlFor={`age_${roomIndex}_${guestIndex}`}>
                              Age *
                            </label>
                            {childAges.length > 0 ? (
                              <select
                                id={`age_${roomIndex}_${guestIndex}`}
                                name="Age"
                                value={guest.Age}
                                onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                                className="w-full border p-2 rounded-md"
                                required
                                aria-label="Child Age"
                                aria-describedby={errors[`Age_${roomIndex}_${guestIndex}`] ? `age-error_${roomIndex}_${guestIndex}` : undefined}
                              >
                                <option value="">Select Age</option>
                                {childAges.map((age, index) => (
                                  <option key={`child_age_${index}`} value={age}>
                                    {age}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="number"
                                id={`age_${roomIndex}_${guestIndex}`}
                                name="Age"
                                value={guest.Age}
                                onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                                className="w-full border p-2 rounded-md"
                                max="12"
                                min="0"
                                required
                                aria-label="Child Age"
                                aria-describedby={errors[`Age_${roomIndex}_${guestIndex}`] ? `age-error_${roomIndex}_${guestIndex}` : undefined}
                              />
                            )}
                            {errors[`Age_${roomIndex}_${guestIndex}`] && (
                              <p id={`age-error_${roomIndex}_${guestIndex}`} className="text-red-500 text-sm">
                                {errors[`Age_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>

                        )}
                        {guest.PaxType === 1 && (
                          <div>
                            <label className="block text-[10px] font-bold" htmlFor={`age_${roomIndex}_${guestIndex}`}>
                              Age
                            </label>
                            <input
                              type="number"
                              id={`age_${roomIndex}_${guestIndex}`}
                              name="Age"
                              value={guest.Age || ""}
                              onChange={(e) => handleChange(e, roomIndex, guestIndex)}
                              className="w-full border p-2 rounded-md"
                              min="0"
                              aria-label="Adult Age"
                            />
                          </div>
                        )}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`leadPassenger_${roomIndex}_${guestIndex}`}
                            name="LeadPassenger"
                            checked={guest.LeadPassenger}
                            onChange={(e) => {
                              const updatedRooms = [...rooms];
                              if (e.target.checked && guest.PaxType === 1) {
                                updatedRooms[roomIndex].Guests = updatedRooms[roomIndex].Guests.map(
                                  (g, idx) => ({
                                    ...g,
                                    LeadPassenger: idx === guestIndex && g.PaxType === 1,
                                  })
                                );
                              } else {
                                updatedRooms[roomIndex].Guests[guestIndex].LeadPassenger = false;
                              }
                              setRooms(updatedRooms);
                              if (errors[`LeadPassenger_${roomIndex}`]) {
                                setErrors((prevErrors) => {
                                  const newErrors = { ...prevErrors };
                                  delete newErrors[`LeadPassenger_${roomIndex}`];
                                  return newErrors;
                                });
                              }
                            }}
                            className="mr-2"
                            disabled={guest.PaxType === 2}
                            aria-label="Lead Passenger"
                          />
                          <label className="text-[10px] font-bold" htmlFor={`leadPassenger_${roomIndex}_${guestIndex}`}>
                            Lead Passenger
                          </label>
                        </div>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>

        {validationPolicies?.PackageDetailsMandatory && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold" htmlFor="arrivalTransportType">
                Arrival Transport Type *
              </label>
              <select
                id="arrivalTransportType"
                name="arrivalTransportType"
                value={bookingDetails.arrivalTransport.arrivalTransportType}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
                required
                aria-label="Arrival Transport Type"
                aria-describedby={errors.arrivalTransportType ? "arrivalTransportType-error" : undefined}
              >
                <option value="0">Flight</option>
                <option value="1">Surface</option>
              </select>
              {errors.arrivalTransportType && (
                <p id="arrivalTransportType-error" className="text-red-500 text-sm">
                  {errors.arrivalTransportType}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold" htmlFor="transportInfoId">
                Transport Info ID
              </label>
              <input
                type="text"
                id="transportInfoId"
                name="arrivalTransport.transportInfoId"
                value={bookingDetails.arrivalTransport.transportInfoId}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
                placeholder="Enter transport info ID"
                aria-label="Transport Info ID"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold" htmlFor="arrivalTransportTime">
                Arrival Time *
              </label>
              <input
                type="text"
                id="arrivalTransportTime"
                name="arrivalTransport.time"
                value={bookingDetails.arrivalTransport.time}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
                placeholder="YYYY-MM-DDTHH:MM:SS:00"
                required
                aria-label="Arrival Time"
                aria-describedby={errors.arrivalTransportTime ? "arrivalTransportTime-error" : undefined}
              />
              {errors.arrivalTransportTime && (
                <p id="arrivalTransportTime-error" className="text-red-500 text-sm">
                  {errors.arrivalTransportTime}
                </p>
              )}
            </div>
          </div>
        )}

        {showModal && (
          <HotelConfirmationModal
            bookingResponse={bookingResponse}
            onClose={closeModal}
          />
        )}
      </div>

      <div className="w-full md:col-span-2 space-y-4 md:px-4">
        <div className="sticky top-0">
          <div className="border rounded shadow-lg">
            <div className="border rounded-t flex items-center px-3 py-2 bg-[#D1EAFF]">
              <h3>Price Summary</h3>
            </div>
            <div className="p-4 space-y-2">
              {hotelData?.HotelRoomsDetails?.map((room, index) => (
                <div key={index} className="flex justify-between">
                  <p>{room.RoomTypeName}</p>
                  <p className="flex items-center font-bold">
                    <FaRupeeSign />
                    {room.Price?.PublishedPrice?.toLocaleString('en-IN') || "N/A"}
                  </p>
                </div>
              )) || <p>No price details available</p>}
              <div className="flex justify-between border-t pt-2">
                <p>Base Fare</p>
                <p className="flex items-center">
                  <FaRupeeSign />
                  {fareDetails.totalFare.toLocaleString('en-IN') || "N/A"}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Taxes & Fees (18%)</p>
                <p className="flex items-center">
                  <FaRupeeSign />
                  {fareDetails.taxFare.toLocaleString('en-IN') || "N/A"}
                </p>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2 relative">
                <p>Total</p>
                <p className="flex items-center">
                  <FaRupeeSign />
                  {fareDetails.netAmount.toLocaleString('en-IN') || "N/A"}
                </p>
                {/* Tooltip for assistance */}

              </div>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <button
              className={`bg-[#DA5200] text-sm lg:text-lg text-white rounded-full w-1/2 md:w-[80%] py-2 flex justify-center items-center ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              onClick={handleBookHotel}
              disabled={isLoading}
              aria-label="Book Hotel"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Booking...
                </>
              ) : (
                "Book Hotel"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}