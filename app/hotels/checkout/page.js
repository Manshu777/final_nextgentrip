"use client";

import React, { useEffect, useState } from "react";
import { MdArrowForwardIos, FaHotel } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaLock, FaRupeeSign, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apilink } from "../../Component/common";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState();
  const [rooms, setRooms] = useState([]);
  const [showForms, setShowForms] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hotelData, setHotelData] = useState(null);

  // Fetch hotel data from localStorage
 useEffect(() => {
  const hotelCheckData = JSON.parse(localStorage.getItem("hotelcheckdata"));
  const searchData = JSON.parse(localStorage.getItem("hotelSearchData")); 
  const hotelItems = JSON.parse(localStorage.getItem("hotelItems"));

  console.log("Hotel Items Data:", hotelCheckData.Rooms[0]);
  if (hotelCheckData && hotelItems) {
    const mappedHotelData = {
      HotelName: hotelCheckData.Rooms[0].Name[0] || "Unknown Hotel",
      CheckInDate: searchData?.CheckInDate || "2025-06-01",
      CheckOutDate: searchData?.CheckOutDate || "2025-06-05",
      BookingCode: hotelCheckData.Rooms[0].BookingCode || "BOOK12345",
      Price: {
        TotalDisplayFare: hotelCheckData.Rooms[0].TotalFare || 0,
      },
      IsPackageFare: hotelCheckData.Rooms[0].WithTransfers || false,
      IsPackageDetailsMandatory: false,
      HotelRoomsDetails: hotelCheckData.Rooms?.map((room, index) => {
        // Get adult and child count for the current room (assuming hotelItems is an array of room data)
        const roomData = Array.isArray(hotelItems) ? hotelItems[index] : hotelItems;
        const adultCount = roomData?.adultcount || 1;
        const childCount = roomData?.childcount || 0;

        // Create GuestDetails array dynamically
        const guestDetails = [
          // Adults
          ...Array(adultCount).fill().map((_, guestIndex) => ({
            PaxType: 1, // Adult
            LeadPassenger: guestIndex === 0, // First adult is the lead passenger
            Title: "",
            FirstName: "",
            MiddleName: "",
            LastName: "",
            Phoneno: "",
            Email: "",
            PassportNo: "",
            PAN: "",
          })),
          // Children
          ...Array(childCount).fill().map(() => ({
            PaxType: 2, // Child
            LeadPassenger: false,
            Title: "",
            FirstName: "",
            MiddleName: "",
            LastName: "",
            Phoneno: "",
            Email: "",
            PassportNo: "",
            PAN: "",
            Age: "", // Age is required for children
          })),
        ];

        return {
          RoomIndex: index + 1,
          RoomTypeName: room.Name?.[0] || "Standard Room",
          Price: {
            PublishedPrice: room.PriceBreakUp?.[0]?.RoomRate || 0,
          },
          GuestDetails: guestDetails,
        };
      }) || [],
    };
    setHotelData(mappedHotelData);
    // Initialize rooms state with the same structure as HotelRoomsDetails
    setRooms(mappedHotelData.HotelRoomsDetails);
  } else {
    console.error("No hotel data found in localStorage");
    // Optionally redirect or show an error
    // router.push("/hotels");
  }
}, []);


  // Initialize rooms based on hotel data
  useEffect(() => {
    if (hotelData?.HotelRoomsDetails) {
      const initialRooms = hotelData.HotelRoomsDetails.map((room, roomIndex) => ({
        RoomIndex: room.RoomIndex,
        RoomTypeName: room.RoomTypeName,
        Guests: room.GuestDetails?.map((guest, guestIndex) => ({
          Title: "Mr",
          FirstName: "",
          MiddleName: "",
          LastName: "",
          Phoneno: "",
          Email: "",
          PaxType: guest.PaxType || 1, // Adult = 1, Child = 2
          LeadPassenger: guestIndex === 0, // First guest in each room is lead
          Age: guest.PaxType === 2 ? "" : null, // Required for children
          PassportNo: "",
          PassportIssueDate: "0001-01-01T00:00:00",
          PassportExpDate: "0001-01-01T00:00:00",
          PAN: "",
        })) || [],
      }));
      setRooms(initialRooms);
      setShowForms(Array(hotelData.HotelRoomsDetails.length).fill(true));
    }
  }, [hotelData]);



  const handleChange = (e, roomIndex, guestIndex) => {
    const { name, value } = e.target;
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].Guests[guestIndex][name] = value;
    setRooms(updatedRooms);

    if (errors[`${name}_${roomIndex}_${guestIndex}`]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${name}_${roomIndex}_${guestIndex}`];
        return newErrors;
      });
    }
  };

  const toggleFormVisibility = (index) => {
    const updatedShowForms = [...showForms];
    updatedShowForms[index] = !updatedShowForms[index];
    setShowForms(updatedShowForms);
  };

  const validateAllForms = () => {
    const newErrors = {};
    rooms.forEach((room, roomIndex) => {
      room.Guests.forEach((guest, guestIndex) => {
        if (!guest.Title)
          newErrors[`Title_${roomIndex}_${guestIndex}`] = "Title is required.";
        if (!guest.FirstName)
          newErrors[`FirstName_${roomIndex}_${guestIndex}`] =
            "First Name is required.";
        else if (guest.FirstName.length < 2 || guest.FirstName.length > 50)
          newErrors[`FirstName_${roomIndex}_${guestIndex}`] =
            "First Name must be 2-50 characters.";
        if (!guest.LastName)
          newErrors[`LastName_${roomIndex}_${guestIndex}`] =
            "Last Name is required.";
        else if (guest.LastName.length < 2 || guest.LastName.length > 50)
          newErrors[`LastName_${roomIndex}_${guestIndex}`] =
            "Last Name must be 2-50 characters.";
        if (guest.LeadPassenger) {
          if (!guest.Phoneno)
            newErrors[`Phoneno_${roomIndex}_${guestIndex}`] =
              "Phone Number is required for lead guest.";
          else if (!/^\d{10}$/.test(guest.Phoneno))
            newErrors[`Phoneno_${roomIndex}_${guestIndex}`] =
              "Phone Number must be 10 digits.";
          if (!guest.Email)
            newErrors[`Email_${roomIndex}_${guestIndex}`] =
              "Email is required for lead guest.";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.Email))
            newErrors[`Email_${roomIndex}_${guestIndex}`] = "Invalid Email.";
        }
        if (!guest.PaxType)
          newErrors[`PaxType_${roomIndex}_${guestIndex}`] =
            "Guest Type is required.";
        if (guest.PaxType === 2 && (!guest.Age || guest.Age > 12))
          newErrors[`Age_${roomIndex}_${guestIndex}`] =
            "Age is required for children and must be ≤ 12.";
        if (guest.PAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(guest.PAN))
          newErrors[`PAN_${roomIndex}_${guestIndex}`] = "Invalid PAN format.";
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleBookHotel = async (e) => {
  e.preventDefault();
  const isValid = validateAllForms();

  const traceID = localStorage.getItem("selectedHotelTraceId");
  const bookingCode = hotelData?.BookingCode;

  if (isValid) {
    setIsLoading(true);
    const payload = {
      EndUserIp: "192.168.1.1",
      BookingCode: bookingCode || "BOOK12345",
      GuestNationality: "IN",
      IsVoucherBooking: true,
      RequestedBookingMode: 5,
      NetAmount: hotelData?.Price?.TotalDisplayFare || 0,
      HotelRoomsDetails: rooms.map((room) => ({
        HotelPassenger: room.Guests.map((guest) => ({
          Title: guest.Title.endsWith(".") ? guest.Title : `${guest.Title}.`, // Ensure Title ends with a dot
          FirstName: guest.FirstName,
          MiddleName: guest.MiddleName || "",
          LastName: guest.LastName,
          Phoneno: guest.Phoneno,
          Email: guest.Email,
          PaxType: parseInt(guest.PaxType, 10),
          LeadPassenger: guest.LeadPassenger,
          Age: parseInt(guest.Age, 10) || (guest.PaxType === 1 ? 30 : 10), // Default ages: 30 for adults, 10 for children
          PassportNo: guest.PassportNo || null,
          PassportIssueDate: guest.PassportIssueDate || null,
          PassportExpDate: guest.PassportExpDate || null,
          PAN: guest.PAN || null,
          RoomIndex: parseInt(room.RoomIndex, 10) || null, // Move RoomIndex to HotelPassenger
        })),
      })),
      IsPackageFare: hotelData?.IsPackageFare || false,
      IsPackageDetailsMandatory: hotelData?.IsPackageDetailsMandatory || false,
      ArrivalTransport: hotelData?.IsPackageDetailsMandatory
        ? {
            ArrivalTransportType: 0,
            TransportInfoId: "",
            Time: "0001-01-01T00:00:00",
          }
        : null,
      TraceId: traceID || null, // Include TraceId if required
    };

    try {
      const response = await axios.post(`${apilink}/hotel/book`, payload);
      setBookingResponse(response.data);
      setShowModal(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      let errorMessage = "An error occurred while booking the hotel.";
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join(" ");
      } else if (error.response?.data?.message) {
        // Handle other API errors
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
              {hotelData?.Price?.TotalDisplayFare?.toLocaleString() || "N/A"}
            </p>
          </div>
          <div className="mt-6 text-center">
            <button
              className="bg-[#DA5200] text-white px-6 py-2 rounded-full hover:bg-[#C44A00]"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  console.log('Hotels darta',hotelData?.HotelRoomsDetails)

  return (
    <>
      <div className="md:grid md:grid-cols-6 gap-5 mt-3 px-10">
        <div className="col-span-4 space-y-6">
    
          <div className="border rounded-lg shadow-lg">
            <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg flex items-center gap-3">
              <div className="border-4 bg-white border-orange-100 h-10 w-10 flex justify-center items-center text-2xl rounded-full">
     
              </div>
              <span className="text-sm md:text-xl font-medium">
                Hotel Details
              </span>
            </div>
            <div className="p-4 space-y-4">
              <h3 className="text-xl font-semibold">{hotelData?.HotelName}</h3>
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
              <p>
                <strong>Meal Plan:</strong>{" "}
                {hotelData?.MealType?.replace("_", " ") || "N/A"}
              </p>
              <p>
                <strong>Inclusions:</strong> {hotelData?.Inclusion || "N/A"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotelData?.HotelRoomsDetails?.map((room, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{room.RoomTypeName}</span>
                    <span className="font-semibold">
                      INR {room.Price?.PublishedPrice?.toLocaleString() || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
             
              <div>
                <h4 className="text-md font-semibold">Cancellation Policy</h4>
                {hotelData?.CancelPolicies?.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {hotelData.CancelPolicies.map((policy, index) => (
                      <li key={index}>
                        From {policy.FromDate}: {policy.CancellationCharge}% (
                        {policy.ChargeType})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Non-refundable</p>
                )}
                <p>
                  <strong>Last Cancellation Deadline:</strong>{" "}
                  {hotelData?.LastCancellationDeadline || "N/A"}
                </p>
              </div>
            </div>
          </div>


          <div className="border rounded-lg shadow-lg">
            <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg flex items-center gap-3">
              <span className="text-sm md:text-xl font-medium">
                Guest Details
              </span>
            </div>
            {rooms.map((room, roomIndex) => (
              <div key={roomIndex} className="m-4 rounded-lg shadow-lg border-2">
                <div className="flex items-center justify-between p-4">
                  <h3 className="text-lg font-semibold">
                    Room {roomIndex + 1} ({room.RoomTypeName})
                  </h3>
                  <button onClick={() => toggleFormVisibility(roomIndex)}>
                    <RiArrowDropDownLine
                      className={`text-2xl transform ${
                        showForms[roomIndex] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {showForms[roomIndex] && (
                  <div className="p-4 space-y-4">
                    {room.Guests.map((guest, guestIndex) => (
                      <div key={guestIndex} className="border-t pt-4">
                        <h4 className="text-md font-semibold">
                          Guest {guestIndex + 1}{" "}
                          {guest.LeadPassenger ? "(Lead)" : ""}
                        </h4>
                        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                          <div>
                            <label className="block text-[10px] font-bold">
                              Title
                            </label>
                            <select
                              name="Title"
                              value={guest.Title}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                              required
                            >
                              <option value="">Select</option>
                              <option value="Mr">Mr</option>
                              <option value="Ms">Ms</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Miss">Miss</option>
                            </select>
                            {errors[`Title_${roomIndex}_${guestIndex}`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`Title_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="FirstName"
                              value={guest.FirstName}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                              required
                            />
                            {errors[`FirstName_${roomIndex}_${guestIndex}`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`FirstName_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold">
                              Middle Name
                            </label>
                            <input
                              type="text"
                              name="MiddleName"
                              value={guest.MiddleName}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="LastName"
                              value={guest.LastName}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                              required
                            />
                            {errors[`LastName_${roomIndex}_${guestIndex}`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`LastName_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold">
                              Phone Number
                              {guest.LeadPassenger && " (Required)"}
                            </label>
                            <input
                              type="text"
                              name="Phoneno"
                              value={guest.Phoneno}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                            />
                            {errors[`Phoneno_${roomIndex}_${guestIndex}`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`Phoneno_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold">
                              Email {guest.LeadPassenger && " (Required)"}
                            </label>
                            <input
                              type="email"
                              name="Email"
                              value={guest.Email}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                            />
                            {errors[`Email_${roomIndex}_${guestIndex}`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`Email_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold">
                              Guest Type
                            </label>
                            <select
                              name="PaxType"
                              value={guest.PaxType}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                              required
                            >
                              <option value="1">Adult</option>
                              <option value="2">Child</option>
                            </select>
                            {errors[`PaxType_${roomIndex}_${guestIndex}`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`PaxType_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                          {guest.PaxType === 2 && (
                            <div>
                              <label className="block text-[10px] font-bold">
                                Age
                              </label>
                              <input
                                type="number"
                                name="Age"
                                value={guest.Age}
                                onChange={(e) =>
                                  handleChange(e, roomIndex, guestIndex)
                                }
                                className="w-full border p-2 rounded-md"
                                required
                              />
                              {errors[`Age_${roomIndex}_${guestIndex}`] && (
                                <p className="text-red-500 text-sm">
                                  {errors[`Age_${roomIndex}_${guestIndex}`]}
                                </p>
                              )}
                            </div>
                          )}
                          <div>
                            <label className="block text-[10px] font-bold">
                              Passport Number
                            </label>
                            <input
                              type="text"
                              name="PassportNo"
                              value={guest.PassportNo}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold">
                              PAN
                            </label>
                            <input
                              type="text"
                              name="PAN"
                              value={guest.PAN}
                              onChange={(e) =>
                                handleChange(e, roomIndex, guestIndex)
                              }
                              className="w-full border p-2 rounded-md"
                            />
                            {errors[`PAN_${roomIndex}_${guestIndex}`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`PAN_${roomIndex}_${guestIndex}`]}
                              </p>
                            )}
                          </div>
                        </form>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Price Summary */}
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
               {room.Price?.PublishedPrice?.toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <p>Total</p>
                  <p className="flex items-center">

                    {hotelData?.Price?.TotalDisplayFare?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Tax:</strong> INR{" "}
                    {hotelData?.TotalTax?.toLocaleString() || "N/A"}
                  </p>
                  <p>
                    <strong>Currency:</strong> {hotelData?.Currency || "INR"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <button
                className={`bg-[#DA5200] text-sm lg:text-lg text-white rounded-full w-1/2 md:w-[80%] py-2 flex justify-center items-center ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                onClick={handleBookHotel}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                   
                    Booking...
                  </>
                ) : (
                  "Book Hotel"
                )}
              </button>
            </div>
          </div>
        </div>

        {showModal && (
          <HotelConfirmationModal
            bookingResponse={bookingResponse}
            onClose={closeModal}
          />
        )}
      </div>
    </>
  );
}