"use client";

import React, { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { GiAirplaneDeparture } from "react-icons/gi";
import { IoAirplaneSharp } from "react-icons/io5";
import { IoIosThumbsUp } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { RiArrowDropDownLine, RiHospitalLine } from "react-icons/ri";
import { FaArrowDown19, FaCheck } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import Swal from 'sweetalert2';
import "swiper/css";
import { FaRupeeSign, FaArrowDown, FaSpinner, FaTag, FaChevronDown, FaChevronUp } from "react-icons/fa";

import Image from "next/image";
import axios from "axios";
import { apilink } from "../../common";
import { useRouter } from "next/navigation";

// New import for generating UUIDs for API logs
import { v4 as uuidv4 } from 'uuid';

const Page = ({ setActiveTab, fdatas, price }) => {
  const router = useRouter();

  const [user, setUser] = useState();
  const [cardDetailsError, setCardDetailsError] = useState(false);
  const [showAdult, setShowAdult] = useState(true);
  const [activeOption, setActiveOption] = useState("cards");
  const [passengers, setPassengers] = useState();
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [bookingResponse, setBookingResponse] = useState(null);
  const [userInfo, setUserinfo] = useState();
  const [showForms, setShowForms] = useState([true]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookisLoading, setBookisLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [checkPassport, setCheckPassport] = useState(false);
  // New state for SSR and GST
  const [ssrDetails, setSsrDetails] = useState({});
  const [gstDetails, setGstDetails] = useState({
    GSTNumber: "",
    GSTCompanyName: "",
    GSTEmail: "",
    GSTPhone: ""
  });

  const [isPriceBreakdownOpen, setIsPriceBreakdownOpen] = useState(true); // Toggle for mobile
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Handle promo code submission
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");

    // Mock promo code validation (replace with actual API call)
    if (promoCode.trim() === "") {
      setPromoError("Please enter a promo code.");
      return;
    }

    // Example: Validate promo code (replace with real logic)
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo({ code: promoCode, discount: 10 }); // Mock discount
      Swal.fire({
        icon: "success",
        title: "Promo Applied",
        text: `Promo code ${promoCode} applied! 10% discount added.`,
        confirmButtonText: "OK",
      });
    } else {
      setPromoError("Invalid promo code.");
      Swal.fire({
        icon: "error",
        title: "Invalid Promo",
        text: "The promo code entered is not valid.",
        confirmButtonText: "OK",
      });
    }
  };


   console.log('fdatasfdatas',fdatas?.data?.Response?.Results)
  // Calculate total after promo (mock implementation)
  const originalFare = fdatas?.data?.Response?.Results?.Fare?.PublishedFare || 0;
  const discount = appliedPromo ? (originalFare * appliedPromo.discount) / 100 : 0;
  const finalFare = originalFare - discount;
  // New state for token management
  const [authToken, setAuthToken] = useState(null);
  const [traceId, setTraceId] = useState(null);

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${apilink}/user/${userId}`);
        setUserinfo(data.user);

        if (data.user && passengers?.length > 0) {
          const updatedPassengers = [...passengers];
          updatedPassengers[0] = {
            ...updatedPassengers[0],
            FirstName: data.user.name || "",
            Email: data.user.email || "",
          };
          setPassengers(updatedPassengers);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const userid = JSON.parse(localStorage.getItem("NextGenUser"));
    if (userid) {
      fetchUserData(userid);
    } else {
      setIsLoading(false);
    }
  }, [passengers]);

  const togglePriceBreakdown = () => {
    setIsPriceBreakdownOpen(!isPriceBreakdownOpen);
  };

  // Countdown timer logic (aligned with trace ID validity of 15 minutes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
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
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index][name] = value;
    setPassengers(updatedPassengers);

    if (errors[`${name}_${index}`]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${name}_${index}`];
        return newErrors;
      });
    }
  };

  // New: Handle GST input changes
  const handleGstChange = (e) => {
    const { name, value } = e.target;
    setGstDetails((prev) => ({ ...prev, [name]: value }));
  };

  // New: Handle SSR selection
  const handleSsrChange = (index, type, value) => {
    setSsrDetails((prev) => ({
      ...prev,
      [index]: { ...prev[index], [type]: value },
    }));
  };

  const toggleFormVisibility = (index) => {
    const updatedShowForms = [...showForms];
    updatedShowForms[index] = !updatedShowForms[index];
    setShowForms(updatedShowForms);
  };

  const validateAllForms = () => {
    const newErrors = {};
    let checkMEEE = JSON.parse(localStorage.getItem("checkOutFlightDetail"));

    setCheckPassport(checkMEEE?.data?.Response?.Results.IsPassportRequiredAtBook);

    console.log('checkMEEE',checkPassport)


    // setCheckPassport(checkMEEE.data.Results.IsPassportRequiredAtBook);
    console.log('passengers',passengers)
    passengers.forEach((passenger, index) => {
      if (!passenger.Title) {
        newErrors[`Title_${index}`] = "Title is required.";
      }
      if (!passenger.FirstName) {
        newErrors[`FirstName_${index}`] = "First Name is required.";
      }
      if (!passenger.LastName) {
        newErrors[`LastName_${index}`] = "Last Name is required.";
      }
      if (!passenger.Gender) {
        newErrors[`Gender_${index}`] = "Gender is required.";
      }
      if (!passenger.DateOfBirth) {
        newErrors[`DateOfBirth_${index}`] = "Date of Birth is required.";
      }

      // Validate passport fields if required
      if (checkPassport) {
        if (!passenger.PassportNo) {
          newErrors[`PassportNo_${index}`] = "Passport Number is required.";
        } else if (passenger.PassportNo.length !== 8) {
          newErrors[`PassportNo_${index}`] = "Passport Number must be 8 characters long.";
        }
        if (!passenger.PassportExpiry) {
          newErrors[`PassportExpiry_${index}`] = "Passport Expiry Date is required.";
        } else {
          const currentDate = new Date();
          const expiryDate = new Date(passenger.PassportExpiry);
          if (expiryDate <= currentDate) {
            newErrors[`PassportExpiry_${index}`] = "Passport Expiry Date must be in the future.";
          }
        }
      }

      if (!passenger.AddressLine1) {
        newErrors[`AddressLine1_${index}`] = "Address is required.";
      }
      if (!passenger.City) {
        newErrors[`City_${index}`] = "City is required.";
      }
      if (!passenger.ContactNo) {
        newErrors[`ContactNo_${index}`] = "Contact Number is required.";
      } else if (!/^\d{10}$/.test(passenger.ContactNo)) {
        newErrors[`ContactNo_${index}`] = "Phone Number must be 10 digits long.";
      }
      if (!passenger.Email) {
        newErrors[`Email_${index}`] = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.Email)) {
        newErrors[`Email_${index}`] = "Invalid Email Address.";
      }

      // Validate GST for lead passenger if required
      if (checkMEEE?.data?.Response?.Results.IsGSTMandatory && passenger.IsLeadPax) {
        if (!gstDetails.GSTNumber) {
          newErrors[`GSTNumber_${index}`] = "GST Number is required for lead passenger.";
        }
        if (!gstDetails.GSTCompanyName) {
          newErrors[`GSTCompanyName_${index}`] = "GST Company Name is required.";
        }
        if (!gstDetails.GSTEmail) {
          newErrors[`GSTEmail_${index}`] = "GST Email is required.";
        }
        if (!gstDetails.GSTPhone) {
          newErrors[`GSTPhone_${index}`] = "GST Phone Number is required.";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const now = new Date(Date.now());
  const addate = new Date(fdatas?.addat);
  const differenceInMinutes = (now - addate) / (1000 * 60);

  useEffect(() => {
    const initialPassengers = () => {
      let passengers = [];
   
      if (fdatas?.data?.Response?.Results?.FareBreakdown) {
        fdatas?.data?.Response?.Results?.FareBreakdown?.forEach((fare) => {
          for (let i = 0; i < fare.PassengerCount; i++) {
            passengers.push({
              Title: "Mr",
              FirstName: "",
              LastName: "",
              PaxType: fare.PassengerType,
              DateOfBirth: "",
              Gender: 1,
              PassportNo: null,
              PassportExpiry: null,
              AddressLine1: "",
              City: "",
              CountryCode: "91",
              ContactNo: "",
              Nationality: "IN",
              Email: "",
              IsLeadPax: i === 0,
            });
          }
        });
      }
      setPassengers(passengers);
      // Initialize showForms array
      setShowForms(new Array(passengers.length).fill(true));
    };

    initialPassengers();



  }, [fdatas]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const addTraveler = () => {
    const newTraveler = {
      Title: "Mr",
      FirstName: "",
      LastName: "",
      PaxType: 1,
      DateOfBirth: "",
      Gender: 1,
      PassportNo: "",
      PassportExpiry: "",
      AddressLine1: "",
      City: "",
      CountryCode: "91",
      ContactNo: "",
      Nationality: "IN",
      Email: "",
      IsLeadPax: false,
    };
    setPassengers([...passengers, newTraveler]);
    setShowForms([...showForms, true]);
  };


  const handleBook = async (e) => {
    e.preventDefault();
  
    const isValid = validateAllForms();
    if (!isValid) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill out all required fields and fix the errors before submitting.",
        confirmButtonText: "OK",
      });
      return;
    }
  
    setBookisLoading(true);
  
    const requestId = uuidv4();
    const requestLog = {
      requestId,
      timestamp: new Date().toISOString(),
      endpoint: "",
      payload: {},
      response: null,
    };
  
    try {
      const leadPassenger = passengers.find((passenger) => passenger.IsLeadPax);
      const fareBreakdown = fdatas?.data?.Response?.Results?.FareBreakdown;
      const checkOutFlightDetail = JSON.parse(localStorage.getItem("checkOutFlightDetail"));
      const isLCC = checkOutFlightDetail?.IsLCC === true;
      const isInternational = checkOutFlightDetail?.data?.IsInternational;
      const isSpecialReturn = checkOutFlightDetail?.data?.IsSpecialReturn;
  
      // Determine ResultIndex
      let resultIndex = fdatas?.ResultIndex;
      if (isSpecialReturn && isLCC) {
        resultIndex = `OB${fdatas?.ResultIndex},IB${fdatas?.ResultIndex}`;
      } else if (!isInternational) {
        resultIndex = fdatas?.ResultIndex;
      }
  
      const apiEndpoint = isLCC ? `${apilink}/flight-book-llc` : `${apilink}/flight-book`;
  
      // Prepare booking payload
      const payload = {
        ResultIndex: resultIndex,
        EndUserIp: fdatas?.ip,
        TraceId: fdatas?.traceid,
        fFareBreakdown: fareBreakdown,
        email: leadPassenger?.Email,
        user_id: '4',
        checkPassport: checkPassport,
        Passengers: passengers.map((passenger, index) => {
          const passengerFare = fareBreakdown.find(
            (fare) => fare.PassengerType === passenger.PaxType
          );
  
          const baseFarePerPassenger = passengerFare?.BaseFare / passengerFare?.PassengerCount;
          const taxPerPassenger = passengerFare?.Tax / passengerFare?.PassengerCount;
  
          const passengerPayload = {
            Title: passenger.Title,
            FirstName: passenger.FirstName,
            LastName: passenger.LastName,
            PaxType: passenger.PaxType,
            DateOfBirth: passenger.DateOfBirth,
            Gender: parseInt(passenger.Gender, 10),
            AddressLine1: passenger.AddressLine1,
            City: passenger.City,
            CellCountryCode: passenger.CountryCode,
            CountryCode: "IN",
            ContactNo: passenger.ContactNo,
            Email: passenger.Email,
            IsLeadPax: passenger.IsLeadPax,
            Fare: {
              Currency: passengerFare?.Currency,
              BaseFare: baseFarePerPassenger,
              Tax: taxPerPassenger,
              YQTax: passengerFare?.YQTax,
              AdditionalTxnFeePub: fdatas?.data?.Response?.Results?.Fare.AdditionalTxnFeePub,
              AdditionalTxnFeeOfrd: fdatas?.data?.Response?.Results?.Fare.AdditionalTxnFeeOfrd,
              OtherCharges: fdatas?.data?.Response?.Results?.Fare.OtherCharges,
              Discount: fdatas?.data?.Response?.Results?.Fare.Discount,
              PublishedFare: fdatas?.data?.Response?.Results?.Fare.PublishedFare,
              OfferedFare: fdatas?.data?.Response?.Results?.Fare.OfferedFare,
              TdsOnCommission: fdatas?.data?.Response?.Results?.Fare.TdsOnCommission,
              TdsOnPLB: fdatas?.data?.Response?.Results?.Fare.TdsOnPLB,
              TdsOnIncentive: fdatas?.data?.Response?.Results?.Fare.TdsOnIncentive,
              ServiceFee: fdatas?.data?.Response?.Results?.Fare.ServiceFee,
            },
          };
  
          // Add Passport details only if they exist and are not empty
          if (passenger.PassportNo?.trim()) {
            passengerPayload.PassportNo = passenger.PassportNo.trim();
          }
          if (passenger.PassportExpiry?.trim()) {
            passengerPayload.PassportExpiry = passenger.PassportExpiry.trim();
          }
  
          // Add SSR
          if (isLCC && ssrDetails[index]) {
            passengerPayload.SSR = {
              MealDynamic: Array.isArray(ssrDetails[index].Meal) ? ssrDetails[index].Meal : [ssrDetails[index].Meal],
              Baggage: ssrDetails[index].Baggage,
              SeatDynamic: Array.isArray(ssrDetails[index].Seat) ? ssrDetails[index].Seat : [ssrDetails[index].Seat],
            };
          } else if (!isLCC && ssrDetails[index]) {
            passengerPayload.SSR = {
              Meal: ssrDetails[index].Meal || "",
              Seat: ssrDetails[index].Seat || "",
            };
          }
  
          // GST
          if (passenger.IsLeadPax && checkOutFlightDetail?.data?.IsGSTMandatory) {
            passengerPayload.GSTDetails = {
              GSTNumber: gstDetails.GSTNumber,
              GSTCompanyName: gstDetails.GSTCompanyName,
              GSTEmail: gstDetails.GSTEmail,
              GSTPhone: gstDetails.GSTPhone,
            };
          }
  
          return passengerPayload;
        }),
      };
  
      requestLog.endpoint = apiEndpoint;
      requestLog.payload = payload;
  
      // 1️⃣ Create Razorpay order
      const amount = fdatas?.data?.Response?.Results?.Fare?.PublishedFare;
      const orderResponse = await axios.post(`${apilink}/create-razorpay-order`, {
        amount: amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        user_email: leadPassenger?.Email,
        user_name: `${leadPassenger?.FirstName} ${leadPassenger?.LastName || ''}`,
        user_phone: leadPassenger?.ContactNo,
      });
  
      const { order_id } = orderResponse.data;
  
      const options = {
        key: 'rzp_live_GHQAKE32vCoZBA',
        amount: amount * 100,
        currency: "INR",
        name: "Next Gen Trip Pvt Ltd",
        description: "Flight Booking Payment",
        order_id: order_id,
        handler: async (response) => {
          try {
            const bookingResponse = await axios.post(apiEndpoint, payload);
  
            requestLog.response = bookingResponse.data;
  
            if (bookingResponse.data?.status === "success") {
              await axios.post(`${apilink}/capture-razorpay-payment`, {
                payment_id: response.razorpay_payment_id,
                amount: amount,
              });
  
              if (!isInternational && !isLCC && fdatas?.ResultIndex.includes("OB")) {
                const ibPayload = { ...payload, ResultIndex: fdatas?.ResultIndex.replace("OB", "IB") };
                const ibBookingResponse = await axios.post(apiEndpoint, ibPayload, {
                  headers: { Authorization: `Bearer ${authToken}` },
                });
                requestLog.response = { ...requestLog.response, ibResponse: ibBookingResponse.data };
                localStorage.setItem(`apiLog_${requestId}_IB`, JSON.stringify(requestLog));
              }
  
              // Success flow
              localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));
              setBookingResponse(bookingResponse.data);
              setShowModal(true);
  
              Swal.fire({
                icon: "success",
                title: "Booking and Payment Successful",
                text: "Your flight has been booked!",
                confirmButtonText: "OK",
              });
            } else {
              throw new Error(bookingResponse.data?.message || "Booking failed");
            }
          } catch (bookingError) {
            console.error("Error during booking:", bookingError);
            requestLog.response = { error: bookingError.message };
            localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));
  
            Swal.fire({
              icon: "error",
              title: "Booking Failed",
              text: bookingError?.response?.data?.message || "Booking failed. No payment was captured.",
              confirmButtonText: "OK",
            });
          } finally {
            setBookisLoading(false);
          }
        },
        prefill: {
          name: `${leadPassenger?.FirstName} ${leadPassenger?.LastName || ''}`,
          email: leadPassenger?.Email,
          contact: leadPassenger?.ContactNo || "",
        },
        theme: {
          color: "#0086da",
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setBookisLoading(false);
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
      console.error("Error during payment initiation:", error);
      requestLog.response = { error: error.message };
      localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));
      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: error?.response?.data?.error || "Something went wrong",
        confirmButtonText: "OK",
      });
      setBookisLoading(false);
    }
};


// const handleBook = async (e) => {
//   e.preventDefault();

//   const isValid = validateAllForms();
//   if (!isValid) {
//     Swal.fire({
//       icon: "error",
//       title: "Validation Error",
//       text: "Please fill out all required fields and fix the errors before submitting.",
//       confirmButtonText: "OK",
//     });
//     return;
//   }

//   setBookisLoading(true);

//   const requestId = uuidv4();
//   const requestLog = {
//     requestId,
//     timestamp: new Date().toISOString(),
//     endpoint: "",
//     payload: {},
//     response: null,
//   };

//   try {
//     const leadPassenger = passengers.find((p) => p.IsLeadPax);
//     const fareBreakdown = fdatas?.data?.Response?.Results?.FareBreakdown;
//     const checkOutFlightDetail = JSON.parse(localStorage.getItem("checkOutFlightDetail"));
//     const isLCC = checkOutFlightDetail?.IsLCC === true;
//     const isInternational = checkOutFlightDetail?.data?.IsInternational;
//     const isSpecialReturn = checkOutFlightDetail?.data?.IsSpecialReturn;

//     let resultIndex = fdatas?.ResultIndex;
//     if (isSpecialReturn && isLCC) {
//       resultIndex = `OB${fdatas?.ResultIndex},IB${fdatas?.ResultIndex}`;
//     } else if (!isInternational) {
//       resultIndex = fdatas?.ResultIndex;
//     }

//     const apiEndpoint = isLCC ? `${apilink}/flight-book-llc` : `${apilink}/flight-book`;

//     const payload = {
//       ResultIndex: resultIndex,
//       EndUserIp: fdatas?.ip,
//       TraceId: fdatas?.traceid,
//       fFareBreakdown: fareBreakdown,
//       email: leadPassenger?.Email,
//       user_id: '4',
//       checkPassport: checkPassport,
//       Passengers: passengers.map((passenger, index) => {
//         const fare = fareBreakdown.find((f) => f.PassengerType === passenger.PaxType);
//         const baseFare = fare?.BaseFare / fare?.PassengerCount;
//         const tax = fare?.Tax / fare?.PassengerCount;

//         const obj = {
//           Title: passenger.Title,
//           FirstName: passenger.FirstName,
//           LastName: passenger.LastName,
//           PaxType: passenger.PaxType,
//           DateOfBirth: passenger.DateOfBirth,
//           Gender: parseInt(passenger.Gender, 10),
//           AddressLine1: passenger.AddressLine1,
//           City: passenger.City,
//           CellCountryCode: passenger.CountryCode,
//           CountryCode: "IN",
//           ContactNo: passenger.ContactNo,
//           Email: passenger.Email,
//           IsLeadPax: passenger.IsLeadPax,
//           Fare: {
//             Currency: fare?.Currency,
//             BaseFare: baseFare,
//             Tax: tax,
//             YQTax: fare?.YQTax,
//             AdditionalTxnFeePub: fdatas?.data?.Response?.Results?.Fare.AdditionalTxnFeePub,
//             AdditionalTxnFeeOfrd: fdatas?.data?.Response?.Results?.Fare.AdditionalTxnFeeOfrd,
//             OtherCharges: fdatas?.data?.Response?.Results?.Fare.OtherCharges,
//             Discount: fdatas?.data?.Response?.Results?.Fare.Discount,
//             PublishedFare: fdatas?.data?.Response?.Results?.Fare.PublishedFare,
//             OfferedFare: fdatas?.data?.Response?.Results?.Fare.OfferedFare,
//             TdsOnCommission: fdatas?.data?.Response?.Results?.Fare.TdsOnCommission,
//             TdsOnPLB: fdatas?.data?.Response?.Results?.Fare.TdsOnPLB,
//             TdsOnIncentive: fdatas?.data?.Response?.Results?.Fare.TdsOnIncentive,
//             ServiceFee: fdatas?.data?.Response?.Results?.Fare.ServiceFee,
//           },
//         };

//         if (passenger.PassportNo?.trim()) obj.PassportNo = passenger.PassportNo.trim();
//         if (passenger.PassportExpiry?.trim()) obj.PassportExpiry = passenger.PassportExpiry.trim();

//         if (isLCC && ssrDetails[index]) {
//           obj.SSR = {
//             MealDynamic: Array.isArray(ssrDetails[index].Meal) ? ssrDetails[index].Meal : [ssrDetails[index].Meal],
//             Baggage: ssrDetails[index].Baggage,
//             SeatDynamic: Array.isArray(ssrDetails[index].Seat) ? ssrDetails[index].Seat : [ssrDetails[index].Seat],
//           };
//         } else if (!isLCC && ssrDetails[index]) {
//           obj.SSR = {
//             Meal: ssrDetails[index].Meal || "",
//             Seat: ssrDetails[index].Seat || "",
//           };
//         }

//         if (passenger.IsLeadPax && checkOutFlightDetail?.data?.IsGSTMandatory) {
//           obj.GSTDetails = {
//             GSTNumber: gstDetails.GSTNumber,
//             GSTCompanyName: gstDetails.GSTCompanyName,
//             GSTEmail: gstDetails.GSTEmail,
//             GSTPhone: gstDetails.GSTPhone,
//           };
//         }

//         return obj;
//       }),
//     };

//     requestLog.endpoint = apiEndpoint;
//     requestLog.payload = payload;

//     const bookingResponse = await axios.post(apiEndpoint, payload);
//     requestLog.response = bookingResponse.data;
//     localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));

//     if (bookingResponse.data?.status === "success") {
//       setBookingResponse(bookingResponse.data);
//       setShowModal(true);
//       Swal.fire({
//         icon: "success",
//         title: "Booking Successful",
//         text: "Your flight has been booked!",
//         confirmButtonText: "OK",
//       });
//     } else {
//       throw new Error(bookingResponse.data?.message || "Booking failed");
//     }

//   } catch (error) {
//     console.error("Booking Error:", error);
//     requestLog.response = { error: error.message };
//     localStorage.setItem(`apiLog_${requestId}`, JSON.stringify(requestLog));

//     Swal.fire({
//       icon: "error",
//       title: "Booking Failed",
//       text: error?.response?.data?.message || error.message || "Something went wrong",
//       confirmButtonText: "OK",
//     });
//   } finally {
//     setBookisLoading(false);
//   }
// };


  
  

  const handleBookingError = (data) => {
    Swal.fire({
      icon: 'error',
      title: 'Booking Failed',
      text: data?.message || 'An error occurred while processing your booking.',
      confirmButtonText: 'OK',
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const userid = JSON.parse(localStorage.getItem("NextGenUser"));

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const data = await axios.get(`${apilink}/user/${userid}`);
        if (data.data.success) {
          setUser(data.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userid) {
      fetchUserData();
    }
  }, []);

  const formatDate = (dateStr) => {
    const targetDate = new Date(dateStr);
    const options = { weekday: "short", day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = targetDate.toLocaleDateString("en-US", options);
    const [weekday, month, day, year] = formattedDate.split(/[\s,]+/);
    return `${weekday}-${day} ${month} ${year}`;
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return { formattedDate, formattedTime };
  };

  useEffect(() => {
    if (differenceInMinutes > 15) { // Align with trace ID validity
      router.push('/flight');
    }
  }, [differenceInMinutes, router]);

  const BookingConfirmationModal = ({ bookingResponse, onClose, fdatas }) => {
    const { PNR, BookingId, FlightItinerary } = bookingResponse?.data || {};
    const passenger = FlightItinerary.Passenger?.[0] || {}; // Safely access the first passenger
    const segment = FlightItinerary?.Segments?.[0] || {}; // Safely access the first segment

    // Reuse formatDateTime for consistent formatting
    const departure = segment?.Origin?.DepTime
      ? formatDateTime(segment.Origin.DepTime)
      : { formattedDate: "N/A", formattedTime: "N/A" };
    const arrival = segment?.Destination?.ArrTime
      ? formatDateTime(segment.Destination.ArrTime)
      : { formattedDate: "N/A", formattedTime: "N/A" };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white max-h-[70vh] overflow-y-auto p-6 rounded-lg shadow-lg w-11/12 max-w-2xl transform transition-all duration-300 scale-95 hover:scale-100">
          <h2 className="text-2xl font-bold text-center mb-4 text-[#DA5200]">
            🎉 Booking Confirmed!
          </h2>
          <table className="w-full mb-6 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left text-sm font-semibold">Field</th>
                <th className="p-2 text-left text-sm font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold text-sm">PNR</td>
                <td className="p-2 text-blue-600 text-sm">{PNR || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold text-sm">Booking ID</td>
                <td className="p-2 text-blue-600 text-sm">{BookingId || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold text-sm">Passenger Name</td>
                <td className="p-2 text-blue-600 text-sm">
                  {passenger.Title} {passenger.FirstName} {passenger.LastName || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold text-sm">Contact Number</td>
                <td className="p-2 text-blue-600 text-sm">{passenger.ContactNo || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold text-sm">Email</td>
                <td className="p-2 text-blue-600 text-sm">{passenger.Email || "N/A"}</td>
              </tr>
             
             
             
            </tbody>
          </table>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">✈️ Flight Details</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left text-sm font-semibold">Field</th>
                  <th className="p-2 text-left text-sm font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-sm">Airline</td>
                  <td className="p-2 text-sm">
                    {segment?.Airline?.AirlineName} ({segment?.Airline?.AirlineCode || "N/A"})
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-sm">Flight Number</td>
                  <td className="p-2 text-sm">{segment?.Airline?.FlightNumber || "N/A"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-sm">Departure</td>
                  <td className="p-2 text-sm">
                    {segment?.Origin?.Airport?.CityName} ({segment?.Origin?.Airport?.AirportCode || "N/A"}) at{" "}
                    {departure.formattedTime} on {departure.formattedDate}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-sm">Arrival</td>
                  <td className="p-2 text-sm">
                    {segment?.Destination?.Airport?.CityName} (
                    {segment?.Destination?.Airport?.AirportCode || "N/A"}) at {arrival.formattedTime} on{" "}
                    {arrival.formattedDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              🎟️ Your ticket will be sent to your email ID. Please take a screenshot of this page for your
              reference.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              className="bg-[#DA5200] text-white px-6 py-2 rounded-full hover:bg-[#C44A00] transition-all duration-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
        ))}
      </div>
      <div className="h-40 bg-gray-200 rounded-lg"></div>
      <div className="h-20 bg-gray-200 rounded-lg"></div>
    </div>
  );

  console.log('wrfrwff', fdatas?.traceid);
  return (
    <div className="">
      <div className="flex justify-end mb-4">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
          Time Left: {formatCountdown(countdown)}
        </div>
      </div>
      <div className="md:grid md:grid-cols-6 gap-5 mt-3">
        <div className="col-span-4 leftSide space-y-6">
          <div className="FirstChild border rounded-lg shadow-lg">
            <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="border-4 bg-white border-orange-100 h-10 w-10 flex justify-center items-center text-2xl rounded-full">
                  <GiAirplaneDeparture />
                </div>
                <div className="flex justify-between gap-10">
                  <span className="text-sm md:text-xl font-medium">Flight Detail</span>
                  <span className="text-sm md:text-xl font-medium text-red-700">
                    {differenceInMinutes > 15 && <span>Trace ID Expired. Search flight again.</span>}
                  </span>
                </div>
              </div>
            </div>
            {console.log('fdatas',fdatas)}
            <div className="">
              {fdatas?.data?.Response?.Results?.Segments?.[0]?.map((segment, index) => (
                <div key={index} className="rounded-sm border px-3 py-4 relative space-y-5">
                  <h3 className="bg-gray-600 text-white text-xs w-fit px-3 font-bold rounded-br-xl absolute top-0 left-0">
                    Depart
                  </h3>
                  <div className="flex items-center gap-3 text-md md:text-xl">
                    <IoAirplaneSharp className="font-bold -rotate-45" />
                    <div className="flex items-center gap-1">
                      <h4 className="">
                        {segment?.Origin?.Airport?.CityName} - {segment?.Destination?.Airport?.CityName}
                      </h4>
                      <p className="border-s-2 border-black px-2 text-sm">
                        {formatDate(segment?.Origin?.DepTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5 flex-col md:flex-row items-start justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={`/images/${segment?.Airline?.AirlineCode}.gif`}
                        alt=""
                        className="h-10 w-10 rounded-lg"
                      />
                      <div>
                        <p className="text-sm md:text-lg">{segment?.Airline?.AirlineName}</p>
                        <p className="text-xs">{segment?.Airline?.AirlineCode}-{segment?.Airline?.FlightNumber}</p>
                        <p className="text-xs">
                          {[
                            "All",
                            "Economy",
                            "PremiumEconomy",
                            "Business",
                            "PremiumBusiness",
                            "First",
                          ].filter((inf, ind) => ind + 1 === segment?.CabinClass)}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full gap-2 justify-between md:w-[70%] md:px-3">
                      <div className="flex flex-col gap-1 items-start">
                        <h4 className="font-extrabold text-md md:text-xl">
                          {formatDateTime(segment?.Origin?.DepTime).formattedTime}
                        </h4>
                        <div className="flex flex-col text-xs">
                          <span className="font-bold text-nowrap">
                            {segment?.Origin?.Airport?.CityName} ({segment?.Origin?.Airport?.AirportCode})
                          </span>
                          <span>{formatDate(segment?.Origin?.DepTime)}</span>
                          <span>{segment?.Origin?.Airport?.Terminal}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 items-center">
                        <p className="text-xs">{Math.floor(segment?.Duration / 60)}h-{segment?.Duration % 60}m</p>
                        <div className="border-t-2 border-black border-dotted w-full flex justify-center relative">
                          <div className="absolute -top-3 bg-white text-lg rounded-full">
                            <GiAirplaneDeparture />
                          </div>
                        </div>
                        {fdatas?.data?.Response?.Results?.IsRefundable ? (
                          <span className="border border-green-400 px-6 md:px-8 m-0 py-1 rounded-full font-bold text-[0.5rem]">
                            REFUNDABLE
                          </span>
                        ) : (
                          <span className="border border-red-400 px-6 md:px-8 m-0 py-1 rounded-full font-bold text-[0.5rem]">
                            NO REFUNDABLE
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <h4 className="font-extrabold text-sm md:text-xl">
                          {formatDateTime(segment?.Destination?.ArrTime).formattedTime}
                        </h4>
                        <div className="flex flex-col text-xs">
                          <span className="text-nowrap font-bold">
                            {segment?.Destination?.Airport?.CityName} ({segment?.Destination?.Airport?.AirportCode})
                          </span>
                          <span>{formatDate(segment?.Destination?.ArrTime)}</span>
                          <span>{segment?.Destination?.Airport?.Terminal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start gap-5">
                    <h3 className="bg-gray-200 font-bold w-fit text-gray-800 rounded-full px-5 text-xs py-1">
                      saver
                    </h3>
                    <p className="text-xs text-gray-400">Fare Rules Baggage</p>
                  </div>
                  <div className="border-2">
                    <div className="p-2 bg-gray-50">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <p className="text-gray-400">Airline</p>
                        <p className="text-gray-400">Check-in-Baggage</p>
                        <p className="text-gray-400">Cabin Baggage</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-start p-2">
                      <div className="flex justify-start items-center w-[35%] gap-6">
                        <div className="flex items-center md:bg-transparent px-3 rounded-t-lg md:rounded-t-none py-4 md:py-0">
                          <img
                            src={`/images/${segment?.Airline?.AirlineCode}.gif`}
                            alt="refund policy"
                            className="h-7 w-7 rounded-lg"
                          />
                        </div>
                        <div>
                          <h6 className="text-black text-sm font-semibold capitalize">
                            {segment?.Airline?.AirlineName}
                          </h6>
                          <p className="text-gray-500 text-[12px] font-semibold">
                            {segment?.Airline?.AirlineCode}-{segment?.Airline?.FlightNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-black text-sm font-semibold capitalize w-[28%]">
                        {segment?.Baggage}
                      </div>
                      <div className="text-black text-sm font-semibold capitalize w-[20%]">
                        {segment?.CabinBaggage}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="FirstChild border rounded-lg shadow-lg">
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
            <div className="p-4">
              <h3 className="text-lg font-semibold">ADULT</h3>
              {passengers?.map((passenger, index) => (
                <div key={index} className="m-4 rounded-lg shadow-lg border-2">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex gap-4 items-center">
                      <input type="checkbox" className="h-6 w-6" />
                      <h3 className="text-lg font-semibold">
                        {passenger.Title} {passenger.FirstName}
                      </h3>
                    </div>
                    <button onClick={() => toggleFormVisibility(index)}>
                      <RiArrowDropDownLine className="text-4xl" />
                    </button>
                  </div>
                  {showForms[index] && (
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-md shadow-lg">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">Title</label>
                        <select
                          name="Title"
                          value={passenger.Title}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        >
                          <option value="">Select Title</option>
                          <option value="Mr">Mr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                        </select>
                        {errors[`Title_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`Title_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">First Name</label>
                        <input
                          type="text"
                          name="FirstName"
                          value={passenger.FirstName}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                        {errors[`FirstName_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`FirstName_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="LastName"
                          value={passenger.LastName}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                        {errors[`LastName_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`LastName_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">Gender</label>
                        <select
                          name="Gender"
                          value={passenger.Gender}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="1">Male</option>
                          <option value="2">Female</option>
                          <option value="3">Other</option>
                        </select>
                        {errors[`Gender_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`Gender_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          name="DateOfBirth"
                          value={passenger.DateOfBirth}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                        {errors[`DateOfBirth_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`DateOfBirth_${index}`]}</p>
                        )}
                      </div>
                      {checkPassport && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">Passport No</label>
                            <input
                              type="text"
                              name="PassportNo"
                              value={passenger.PassportNo}
                              onChange={(e) => handleChange(e, index)}
                              className="w-full border border-gray-300 rounded-md p-2"
                              required
                            />
                            {errors[`PassportNo_${index}`] && (
                              <p className="text-red-500 text-sm">{errors[`PassportNo_${index}`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">Passport Expiry</label>
                            <input
                              type="date"
                              name="PassportExpiry"
                              value={passenger.PassportExpiry}
                              onChange={(e) => handleChange(e, index)}
                              className="w-full border border-gray-300 rounded-md p-2"
                              required
                            />
                            {errors[`PassportExpiry_${index}`] && (
                              <p className="text-red-500 text-sm">{errors[`PassportExpiry_${index}`]}</p>
                            )}
                          </div>
                        </>
                      )}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">Address</label>
                        <input
                          type="text"
                          name="AddressLine1"
                          value={passenger.AddressLine1}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                        {errors[`AddressLine1_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`AddressLine1_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">City</label>
                        <input
                          type="text"
                          name="City"
                          value={passenger.City}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                        {errors[`City_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`City_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">Contact Number</label>
                        <input
                          type="text"
                          name="ContactNo"
                          value={passenger.ContactNo}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                        {errors[`ContactNo_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`ContactNo_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-900 mb-1">Email</label>
                        <input
                          type="email"
                          name="Email"
                          value={passenger.Email}
                          onChange={(e) => handleChange(e, index)}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                        {errors[`Email_${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`Email_${index}`]}</p>
                        )}
                      </div>
                      {/* New: SSR Inputs for LCC Flights */}
                      {fdatas?.data?.Response?.Results?.IsLCC && ssrDetails[index] && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">Meal Preference</label>
                            <select
                              name="Meal"
                              value={ssrDetails[index]?.Meal || ""}
                              onChange={(e) => handleSsrChange(index, "Meal", e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2"
                            >
                              <option value="">Select Meal</option>
                              {/* Example options; populate dynamically from ssrDetails */}
                              <option value="Veg">Vegetarian</option>
                              <option value="NonVeg">Non-Vegetarian</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">Baggage</label>
                            <select
                              name="Baggage"
                              value={ssrDetails[index]?.Baggage || ""}
                              onChange={(e) => handleSsrChange(index, "Baggage", e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2"
                            >
                              <option value="">Select Baggage</option>
                              <option value="15KG">15KG</option>
                              <option value="20KG">20KG</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">Seat Preference</label>
                            <select
                              name="Seat"
                              value={ssrDetails[index]?.Seat || ""}
                              onChange={(e) => handleSsrChange(index, "Seat", e.target.value)}
                              className="w-full border border-gray-300 rounded-md p-2"
                            >
                              <option value="">Select Seat</option>
                              <option value="Window">Window</option>
                              <option value="Aisle">Aisle</option>
                            </select>
                          </div>
                        </>
                      )}
                      {/* New: GST Inputs for Lead Passenger */}
                      {passenger.IsLeadPax && fdatas?.data?.Response?.Results?.IsGSTMandatory && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">GST Number</label>
                            <input
                              type="text"
                              name="GSTNumber"
                              value={gstDetails.GSTNumber}
                              onChange={handleGstChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                              required
                            />
                            {errors[`GSTNumber_${index}`] && (
                              <p className="text-red-500 text-sm">{errors[`GSTNumber_${index}`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">GST Company Name</label>
                            <input
                              type="text"
                              name="GSTCompanyName"
                              value={gstDetails.GSTCompanyName}
                              onChange={handleGstChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                              required
                            />
                            {errors[`GSTCompanyName_${index}`] && (
                              <p className="text-red-500 text-sm">{errors[`GSTCompanyName_${index}`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">GST Email</label>
                            <input
                              type="email"
                              name="GSTEmail"
                              value={gstDetails.GSTEmail}
                              onChange={handleGstChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                              required
                            />
                            {errors[`GSTEmail_${index}`] && (
                              <p className="text-red-500 text-sm">{errors[`GSTEmail_${index}`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-900 mb-1">GST Phone</label>
                            <input
                              type="text"
                              name="GSTPhone"
                              value={gstDetails.GSTPhone}
                              onChange={handleGstChange}
                              className="w-full border border-gray-300 rounded-md p-2"
                              required
                            />
                            {errors[`GSTPhone_${index}`] && (
                              <p className="text-red-500 text-sm">{errors[`GSTPhone_${index}`]}</p>
                            )}
                          </div>
                        </>
                      )}
                    </form>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 text-gray-500 text-sm flex items-center gap-1">
              <FaLock /> Secure Booking & Data Protection
            </div>
          </div>
        </div>
        <div className="w-full md:col-span-2 rightSide space-y-4 font-sans">
          <div className="sticky top-4">
            {/* Price Summary Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-white">Price Summary</h3>
                <button
                  onClick={togglePriceBreakdown}
                  className="md:hidden text-white focus:outline-none"
                  aria-label="Toggle price breakdown"
                >
                  {isPriceBreakdownOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
                </button>
              </div>
              <div className={`px-4 py-3 text-sm ${isPriceBreakdownOpen ? "block" : "hidden md:block"}`}>
                {/* Passenger Count */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <p className="text-gray-700 font-medium">Adult x {passengers?.length || 0}</p>
                  <p className="flex items-center font-bold text-gray-900">
                    <FaRupeeSign className="mr-1" size={14} />
                    {originalFare.toLocaleString("en-IN")}
                  </p>
                </div>
                {/* Detailed Breakdown */}
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Fare:</span>
                    <span className="flex items-center">
                      <FaRupeeSign size={12} className="mr-1" />
                      {fdatas?.data?.Response?.Results?.Fare?.BaseFare?.toLocaleString("en-IN") || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span className="flex items-center">
                      <FaRupeeSign size={12} className="mr-1" />
                      {fdatas?.data?.Response?.Results?.Fare?.Tax?.toLocaleString("en-IN") || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Other Charges:</span>
                    <span className="flex items-center">
                      <FaRupeeSign size={12} className="mr-1" />
                      {fdatas?.data?.Response?.Results?.Fare?.OtherCharges?.toLocaleString("en-IN") || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Fee:</span>
                    <span className="flex items-center">
                      <FaRupeeSign size={12} className="mr-1" />
                      {fdatas?.data?.Response?.Results?.Fare?.ServiceFee?.toLocaleString("en-IN") || "0"}
                    </span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Promo Discount ({appliedPromo.code}):</span>
                      <span className="flex items-center">
                        -<FaRupeeSign size={12} className="mr-1" />
                        {discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="flex items-center">
                      <FaRupeeSign size={14} className="mr-1" />
                      {finalFare.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Button */}
            <div className="booking flex justify-center items-center mt-4">
              <button
                className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full w-full sm:w-4/5 py-3 text-sm md:text-lg font-semibold flex justify-center items-center shadow-md hover:from-orange-600 hover:to-orange-700 transition-all duration-300 ${
                  isLoading || bookisLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleBook}
                disabled={isLoading || bookisLoading}
              >
                {bookisLoading ? (
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
      {showModal && (
        <BookingConfirmationModal
          bookingResponse={bookingResponse}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Page;