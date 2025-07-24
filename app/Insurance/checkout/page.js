"use client";

import React, { useEffect, useState } from "react";
import { MdArrowForwardIos, MdOutlineHealthAndSafety } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaLock, FaRupeeSign, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import "swiper/css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apilink } from "../../Component/common";

const Page = () => {
  const router = useRouter();
  const [passengers, setPassengers] = useState([]);
  const [showForms, setShowForms] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [insuranceData, setSelectedPlan] = useState(null);

  // Fetch selected insurance plan from localStorage
  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedInsurancePlan");
    if (storedPlan) {
      const parsedPlan = JSON.parse(storedPlan);
      setSelectedPlan(parsedPlan);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Initialize passenger forms based on insurance data
  useEffect(() => {
    if (insuranceData?.PremiumList?.[0]?.PassengerCount) {
      const passengerCount = insuranceData.PremiumList[0].PassengerCount;
      const initialPassengers = Array(passengerCount)
        .fill()
        .map((_, index) => ({
          Title: "Mr",
          FirstName: "",
          LastName: "",
          DOB: "",
          Gender: "1",
          AddressLine1: "",
          City: "",
          CityCode: "",
          PinCode: "",
          CountryCode: "IND",
          PhoneNumber: "",
          EmailId: "",
          PassportNo: "",
          MajorDestination: "INDIA",
          PassportCountry: "IN",
          RelationToBeneficiary: "",
          IsLeadPax: index === 0,
        }));
      setPassengers(initialPassengers);
      setShowForms(Array(passengerCount).fill(true));
    }
  }, [insuranceData]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedPassengers = [...passengers];
    updatedPassengers[index][name] = value;
    setPassengers(updatedPassengers);

    // Clear error for the field
    if (errors[`${name}_${index}`]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${name}_${index}`];
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
    passengers.forEach((passenger, index) => {
      if (!passenger.Title) newErrors[`Title_${index}`] = "Title is required.";
      if (!passenger.FirstName) newErrors[`FirstName_${index}`] = "First Name is required.";
      if (!passenger.LastName) newErrors[`LastName_${index}`] = "Last Name is required.";
      if (!passenger.Gender) newErrors[`Gender_${index}`] = "Gender is required.";
      else if (!["1", "2"].includes(passenger.Gender))
        newErrors[`Gender_${index}`] = "Gender must be Male or Female.";
      if (!passenger.DOB) newErrors[`DOB_${index}`] = "Date of Birth is required.";
      else if (new Date(passenger.DOB) >= new Date("2025-05-18"))
        newErrors[`DOB_${index}`] = "Date of Birth must be before May 18, 2025.";
      if (!passenger.AddressLine1) newErrors[`AddressLine1_${index}`] = "Address is required.";
      if (!passenger.City) newErrors[`City_${index}`] = "City is required.";
      if (!passenger.CityCode) newErrors[`CityCode_${index}`] = "City Code is required.";
      else if (!/^[A-Z]{3}$/.test(passenger.CityCode))
        newErrors[`CityCode_${index}`] = "City Code must be a 3-letter code (e.g., DEL).";
      if (!passenger.PinCode) newErrors[`PinCode_${index}`] = "Postal Code is required.";
      else if (!/^\d{6}$/.test(passenger.PinCode))
        newErrors[`PinCode_${index}`] = "Postal Code must be 6 digits.";
      if (!passenger.CountryCode) newErrors[`CountryCode_${index}`] = "Country Code is required.";
      if (!passenger.PhoneNumber) newErrors[`PhoneNumber_${index}`] = "Phone Number is required.";
      else if (!/^\d{10}$/.test(passenger.PhoneNumber))
        newErrors[`PhoneNumber_${index}`] = "Phone Number must be 10 digits.";
      if (!passenger.EmailId) newErrors[`EmailId_${index}`] = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.EmailId))
        newErrors[`EmailId_${index}`] = "Invalid Email Address.";
      if (!passenger.PassportNo) newErrors[`PassportNo_${index}`] = "Passport Number is required.";
      if (!passenger.MajorDestination) newErrors[`MajorDestination_${index}`] = "Major Destination is required.";
      if (!passenger.PassportCountry) newErrors[`PassportCountry_${index}`] = "Passport Country is required.";
      if (!passenger.RelationToBeneficiary)
        newErrors[`RelationToBeneficiary_${index}`] = "Beneficiary Relationship is required.";
      else if (!["Spouse", "Parent", "Child", "Sibling", "Other"].includes(passenger.RelationToBeneficiary))
        newErrors[`RelationToBeneficiary_${index}`] = "Invalid Beneficiary Relationship.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookInsurance = async (e) => {
    e.preventDefault();
    const isValid = validateAllForms();
    const traceID = localStorage.getItem("selectedInsuranceTraceId");

    if (!isValid) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill out all required fields and fix the errors before submitting.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const leadPassenger = passengers[0];
      const amount = insuranceData?.Price?.PublishedPriceRoundedOff;

      if (!amount || isNaN(amount)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid insurance amount. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      // 1. Create Razorpay Order
      const orderResponse = await axios.post(`${apilink}/create-razorpay-order`, {
        amount,
        currency: "INR",
        receipt: `insurance_${Date.now()}`,
        user_email: leadPassenger.EmailId,
        user_name: `${leadPassenger.FirstName} ${leadPassenger.LastName}`,
        user_phone: leadPassenger.PhoneNumber || "9999999999",
      });

      const { order_id } = orderResponse.data;

      const options = {
        key: "rzp_live_GHQAKE32vCoZBA",
        amount,
        currency: "INR",
        name: "Next Gen Trip",
        description: "Insurance Payment",
        order_id,
        handler: async (response) => {
          try {
            // 2. On successful payment, call insurance booking API
            const payload = {
              EndUserIp: "223.178.210.95",
              TraceId: traceID,
              ResultIndex: insuranceData.ResultIndex,
              GenerateInsurancePolicy: "false",
              Passenger: passengers.map((passenger) => ({
                Title: passenger.Title,
                BeneficiaryTitle: passenger.Title,
                FirstName: passenger.FirstName,
                BeneficiaryName: `${passenger.Title} ${passenger.FirstName} ${passenger.LastName}`.trim(),
                LastName: passenger.LastName,
                RelationShipToInsured: "Self",
                RelationToBeneficiary: passenger.RelationToBeneficiary,
                DOB: passenger.DOB,
                Gender: passenger.Gender,
                AddressLine1: passenger.AddressLine1,
                City: passenger.City,
                CityCode: passenger.CityCode,
                PinCode: passenger.PinCode,
                CountryCode: passenger.CountryCode,
                PhoneNumber: passenger.PhoneNumber,
                EmailId: passenger.EmailId,
                PassportNo: passenger.PassportNo,
                MajorDestination: passenger.MajorDestination,
                PassportCountry: passenger.PassportCountry,
                IsLeadPax: passenger.IsLeadPax,
              })),
            };

            const bookingRes = await axios.post(`${apilink}/insurance-book`, payload);
            setBookingResponse(bookingRes.data);
            setShowModal(true); // Show modal only after successful booking

            Swal.fire({
              icon: "success",
              title: "Payment & Booking Successful",
              text: `Payment ID: ${response.razorpay_payment_id}`,
            });
          } catch (bookingError) {
            console.error("Booking failed after payment:", bookingError);
            Swal.fire({
              icon: "error",
              title: "Booking Failed",
              text: "Payment succeeded, but booking failed. Please contact support.",
            });
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: `${leadPassenger.FirstName} ${leadPassenger.LastName}`,
          email: leadPassenger.EmailId,
          contact: leadPassenger.PhoneNumber || "",
        },
        theme: {
          color: "#0086da",
        },
        modal: {
          ondismiss: () => {
            Swal.fire({
              icon: "error",
              title: "Payment Cancelled",
              text: "Payment was not completed. Please try again.",
            });
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: response.error.description || "Payment failed. Please try again or contact support.",
        });
        setIsLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong during payment initialization.",
      });
      setIsLoading(false);
    }
  };

  const closeModal = () => setShowModal(false);

  const InsuranceConfirmationModal = ({ bookingResponse, onClose }) => {
    const policyNo = bookingResponse?.data?.Response?.Itinerary?.PaxInfo?.[0]?.PolicyNo || "";
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-4 text-[#DA5200]">
            🎉 Insurance Booked!
          </h2>
          <div className="space-y-4">
            <p>
              <strong>Policy Number:</strong> {policyNo || "Pending"}
            </p>
            <p>
              <strong>Plan Name:</strong> {insuranceData?.PlanName}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(insuranceData?.PolicyStartDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(insuranceData?.PolicyEndDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Total Premium:</strong> INR{" "}
              {insuranceData?.Price?.GrossFare}
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

  return (
    <div className="md:grid md:grid-cols-6 gap-5 mt-3 px-10">
      <div className="col-span-4 space-y-6">
        {/* Insurance Details */}
        <div className="border rounded-lg shadow-lg">
          <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg flex items-center gap-3">
            <div className="border-4 bg-white border-orange-100 h-10 w-10 flex justify-center items-center text-2xl rounded-full">
              <MdOutlineHealthAndSafety />
            </div>
            <span className="text-sm md:text-xl font-medium">
              Insurance Details
            </span>
          </div>
          <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold">{insuranceData?.PlanName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insuranceData?.CoverageDetails?.map((coverage, index) => (
                <div key={index} className="flex justify-between">
                  <span>{coverage.Coverage}</span>
                  <span className="font-semibold">INR {coverage.SumInsured}</span>
                </div>
              ))}
            </div>
            <p>
              <strong>Policy Period:</strong>{" "}
              {new Date(insuranceData?.PolicyStartDate).toLocaleDateString()} -{" "}
              {new Date(insuranceData?.PolicyEndDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Traveller Details */}
        <div className="border rounded-lg shadow-lg">
          <div className="bg-[#D5EEFE] py-3 px-4 rounded-t-lg flex items-center gap-3">
            <span className="text-sm md:text-xl font-medium">
              Traveller Details
            </span>
          </div>
          {passengers.map((passenger, index) => (
            <div key={index} className="m-4 rounded-lg shadow-lg border-2">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold">
                  Traveller {index + 1} {passenger.IsLeadPax ? "(Lead)" : ""}
                </h3>
                <button onClick={() => toggleFormVisibility(index)}>
                  <RiArrowDropDownLine
                    className={`text-2xl ${showForms[index] ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
              {showForms[index] && (
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  <div>
                    <label className="block text-[10px] font-bold">Title</label>
                    <select
                      name="Title"
                      value={passenger.Title}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                    </select>
                    {errors[`Title_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`Title_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">First Name</label>
                    <input
                      type="text"
                      name="FirstName"
                      value={passenger.FirstName}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`FirstName_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`FirstName_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Last Name</label>
                    <input
                      type="text"
                      name="LastName"
                      value={passenger.LastName}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`LastName_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`LastName_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Gender</label>
                    <select
                      name="Gender"
                      value={passenger.Gender}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                    {errors[`Gender_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`Gender_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Date of Birth</label>
                    <input
                      type="date"
                      name="DOB"
                      value={passenger.DOB}
                      onChange={(e) => handleChange(e, index)}
                      max="2025-05-17"
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`DOB_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`DOB_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Address</label>
                    <input
                      type="text"
                      name="AddressLine1"
                      value={passenger.AddressLine1}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`AddressLine1_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`AddressLine1_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">City</label>
                    <input
                      type="text"
                      name="City"
                      value={passenger.City}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`City_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`City_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">City Code</label>
                    <input
                      type="text"
                      name="CityCode"
                      value={passenger.CityCode}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="e.g., DEL"
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`CityCode_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`CityCode_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Postal Code</label>
                    <input
                      type="text"
                      name="PinCode"
                      value={passenger.PinCode}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`PinCode_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`PinCode_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Country Code</label>
                    <input
                      type="text"
                      name="CountryCode"
                      value={passenger.CountryCode}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`CountryCode_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`CountryCode_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Phone Number</label>
                    <input
                      type="text"
                      name="PhoneNumber"
                      value={passenger.PhoneNumber}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`PhoneNumber_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`PhoneNumber_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Email</label>
                    <input
                      type="email"
                      name="EmailId"
                      value={passenger.EmailId}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`EmailId_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`EmailId_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Passport Number</label>
                    <input
                      type="text"
                      name="PassportNo"
                      value={passenger.PassportNo}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`PassportNo_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`PassportNo_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Major Destination</label>
                    <input
                      type="text"
                      name="MajorDestination"
                      value={passenger.MajorDestination}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`MajorDestination_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`MajorDestination_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Passport Country</label>
                    <input
                      type="text"
                      name="PassportCountry"
                      value={passenger.PassportCountry}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    {errors[`PassportCountry_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`PassportCountry_${index}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Beneficiary Relationship</label>
                    <select
                      name="RelationToBeneficiary"
                      value={passenger.RelationToBeneficiary}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors[`RelationToBeneficiary_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`RelationToBeneficiary_${index}`]}</p>
                    )}
                  </div>
                </form>
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
              <div className="flex justify-between">
                <p>Travellers x {insuranceData?.PremiumList?.[0]?.PassengerCount}</p>
                <p className="flex items-center font-bold">
                  <FaRupeeSign /> {insuranceData?.Price?.GrossFare}
                </p>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <p>Total</p>
                <p className="flex items-center">
                  <FaRupeeSign /> {insuranceData?.Price?.GrossFare}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <button
              className={`bg-[#DA5200] text-sm lg:text-lg text-white rounded-full w-1/2 md:w-[80%] py-2 flex justify-center items-center ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
              onClick={handleBookInsurance}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Booking...
                </>
              ) : (
                "Book Insurance"
              )}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <InsuranceConfirmationModal
          bookingResponse={bookingResponse}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Page;