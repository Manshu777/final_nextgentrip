"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { apilink } from "../../Component/common";

function OrderForm() {
  const [formData, setFormData] = useState({
    customerFirstName: "",
    customerLastName: "",
    customerDOB: "",
    customerPassportNo: "",
    travelStartDate: "",
    travelEndDate: "",
    mobileNo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderValidated, setOrderValidated] = useState(false);
  const [eSimDetails, setESimDetails] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [finalAmount, setFinalAmount] = useState(null); // Added to store final amount
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = {
    id: searchParams.get("planId"),
    planName: searchParams.get("planName") || "Selected eSIM Plan",
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      setError("Failed to load Razorpay SDK. Please try again.");
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Validate form inputs with additional year validation
  const validateForm = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const maxYear = currentYear + 1; // Allow only current year and next year
    const startYear = new Date(formData.travelStartDate).getFullYear();
    const endYear = new Date(formData.travelEndDate).getFullYear();

    if (formData.customerDOB > today.toISOString().split("T")[0]) {
      setError("Date of Birth cannot be in the future.");
      return false;
    }
    if (formData.travelStartDate < today.toISOString().split("T")[0]) {
      setError("Travel Start Date cannot be in the past.");
      return false;
    }
    if (formData.travelStartDate > formData.travelEndDate) {
      setError("Travel End Date must be after Travel Start Date.");
      return false;
    }
    if (startYear > maxYear || endYear > maxYear) {
      setError(`Travel dates must be within ${currentYear} or ${maxYear}.`);
      return false;
    }
    if (!plan.id) {
      setError("Plan ID is missing. Please select a valid plan.");
      return false;
    }
    if (!formData.mobileNo) {
      setError("Mobile Number is required.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      if (!razorpayLoaded) {
        setError("Razorpay SDK not loaded. Please try again.");
        setLoading(false);
        return;
      }

      const data = {
        request: [
          {
            id: plan.id,
            planName: plan.planName,
            ...formData,
          },
        ],
      };

      const validateResponse = await axios.post(
        `${apilink}/matrix/validate-order`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (validateResponse?.data?.status !== 1) {
        throw new Error(validateResponse.data.message || "Failed to validate order");
      }

      const validatedOrderId = validateResponse.data.validatedOrderId;
      const amount = validateResponse.data.amount;

      if (!validatedOrderId || !amount) {
        throw new Error("Validated Order ID or amount not found in response.");
      }

      setOrderValidated(true);
      setFinalAmount(Math.round(amount * 1.15)); // Store final amount in INR

      const finalAmountPaise = Math.round(amount * 1.15) * 100;
      const razorpayOrderData = {
        amount: finalAmountPaise,
        currency: "INR",
        receipt: `receipt_${validatedOrderId}_${Date.now()}`.slice(0, 40),
      };

      const razorpayResponse = await axios.post(
        `${apilink}/create-razorpay-order`,
        razorpayOrderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const options = {
        key: "rzp_live_GHQAKE32vCoZBA",
        amount: finalAmountPaise,
        currency: "INR",
        name: "eSIM Purchase",
        description: `Payment for ${plan.planName}`,
        order_id: razorpayResponse.data.orderId,
        handler: async function (response) {
          try {
            const orderData = {
              validatedOrderId: validatedOrderId,
            };

            const createOrderResponse = await axios.post(
              `${apilink}/matrix/create-order`,
              orderData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (createOrderResponse?.data?.status !== 1) {
              throw new Error(createOrderResponse.data.message || "Failed to create order");
            }

            const orderDetail = createOrderResponse.data.orderDetail?.[0];
            if (!orderDetail) {
              throw new Error("Order details not found in response.");
            }

            const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(orderDetail.base64QRCode);
            if (!isValidBase64) {
              throw new Error("Invalid QR code format.");
            }

            setESimDetails({
              planName: orderDetail.name || plan.planName,
              activationCode: orderDetail.activation_code || "N/A",
              lpa: orderDetail.lpa || "N/A",
              simNo: orderDetail.sim_no || "N/A",
              smdpAddress: orderDetail.smdp_address || "N/A",
              mobileNo: orderDetail.mobile_no || formData.mobileNo,
              orderId: createOrderResponse.data.orderId || "N/A",
              validatedOrderId: createOrderResponse.data.validatedOrderId || "N/A",
              qrCode: orderDetail.base64QRCode,
            });
            setOrderCreated(true);
          } catch (err) {
            setError(
              err.response?.data?.message || err.message || "Failed to process order after payment"
            );
          }
        },
        prefill: {
          name: `${formData.customerFirstName} ${formData.customerLastName}`,
          contact: formData.mobileNo,
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description || "Please try again."}`);
      });
      rzp.open();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCancelPayment = () => {
    router.push("/"); // Redirect to home page
  };

  const handleKYC = () => {
    router.push(
      `/e-sim/esim-kyc?orderNo=${eSimDetails.validatedOrderId}&simNo=${eSimDetails.simNo}&mobileNo=${eSimDetails.mobileNo}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            aria-label="Go back"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-extrabold text-gray-900 ml-4">
            {orderCreated && eSimDetails
              ? "Order Created Successfully"
              : orderValidated && eSimDetails
              ? "eSIM Details & Installation"
              : `Order ${plan.planName}`}
          </h2>
        </div>

        {error && (
          <div
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center"
            role="alert"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {!orderValidated ? (
          <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="form-title">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="customerFirstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="customerFirstName"
                  name="customerFirstName"
                  value={formData.customerFirstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                  placeholder="Enter your first name"
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="customerLastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="customerLastName"
                  name="customerLastName"
                  value={formData.customerLastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                  placeholder="Enter your last name"
                  aria-required="true"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="customerDOB"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="customerDOB"
                name="customerDOB"
                value={formData.customerDOB}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // Prevent future DOB
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="customerPassportNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Passport Number
              </label>
              <input
                type="text"
                id="customerPassportNo"
                name="customerPassportNo"
                value={formData.customerPassportNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
                placeholder="Enter your passport number"
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="mobileNo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobileNo"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
                placeholder="Enter your mobile number"
                aria-required="true"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="travelStartDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Travel Start Date
                </label>
                <input
                  type="date"
                  id="travelStartDate"
                  name="travelStartDate"
                  value={formData.travelStartDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]} // Prevent past dates
                  max={`${new Date().getFullYear() + 1}-12-31`} // Restrict to next year
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="travelEndDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Travel End Date
                </label>
                <input
                  type="date"
                  id="travelEndDate"
                  name="travelEndDate"
                  value={formData.travelEndDate}
                  onChange={handleChange}
                  min={formData.travelStartDate || new Date().toISOString().split("T")[0]}
                  max={`${new Date().getFullYear() + 1}-12-31`} // Restrict to next year
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                  aria-required="true"
                />
              </div>
            </div>
            {finalAmount && (
              <div className="text-sm font-medium text-gray-700">
                Total Amount: ₹{finalAmount}
              </div>
            )}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || !razorpayLoaded}
                className={`flex-1 p-3 rounded-xl text-white font-semibold transition-all ${
                  loading || !razorpayLoaded
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } flex items-center justify-center`}
                aria-label="Validate and proceed to payment"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Validate and Proceed to Payment"
                )}
              </button>
             
            </div>
          </form>
        ) : orderCreated && eSimDetails ? (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-xl">
              <p className="text-lg font-semibold text-green-800">
                Order Created Successfully!
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Please take a screenshot of this page for your records and proceed to KYC
                verification to activate your eSIM.
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleKYC}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                  aria-label="Proceed to KYC"
                >
                  Proceed to KYC
                </button>
              </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Plan Name:</span> {eSimDetails.planName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Activation Code:</span>{" "}
                {eSimDetails.activationCode}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">LPA:</span> {eSimDetails.lpa}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">SIM Number:</span> {eSimDetails.simNo}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">SMDP Address:</span>{" "}
                {eSimDetails.smdpAddress}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Mobile Number:</span>{" "}
                {eSimDetails.mobileNo}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order ID:</span> {eSimDetails.orderId}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Validated Order ID:</span>{" "}
                {eSimDetails.validatedOrderId}
              </p>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  QR Code for eSIM Activation:
                </p>
                <img
                  src={`data:image/png;base64,${eSimDetails.qrCode}`}
                  alt="eSIM QR Code"
                  className="w-40 h-40 mx-auto"
                  aria-describedby="qr-code-instructions"
                />
              </div>
            </div>
            <p className="text-sm text-red-600 font-medium">
              Important: You must complete KYC verification to activate your eSIM.
            </p>
          </div>
        ) : (
          eSimDetails && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Your eSIM Details
              </h3>
              <div className="bg-indigo-50 p-6 rounded-xl">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Plan Name:</span>{" "}
                  {eSimDetails.planName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Activation Code:</span>{" "}
                  {eSimDetails.activationCode}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">LPA:</span> {eSimDetails.lpa}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">SIM Number:</span>{" "}
                  {eSimDetails.simNo}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">SMDP Address:</span>{" "}
                  {eSimDetails.smdpAddress}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Mobile Number:</span>{" "}
                  {eSimDetails.mobileNo}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Order ID:</span>{" "}
                  {eSimDetails.orderId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Validated Order ID:</span>{" "}
                  {eSimDetails.validatedOrderId}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    QR Code for eSIM Activation:
                  </p>
                  <img
                    src={`data:image/png;base64,${eSimDetails.qrCode}`}
                    alt="eSIM QR Code"
                    className="w-40 h-40 mx-auto"
                    aria-describedby="qr-code-instructions"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                How to Install Your eSIM
              </h3>
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <p className="text-sm text-gray-600" id="qr-code-instructions">
                  Follow these steps to activate your eSIM on your device after KYC
                  verification:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>
                    <span className="font-medium">Scan the QR Code:</span> Go to your
                    device's settings, navigate to "Cellular" or "Mobile Data," and select
                    "Add Cellular Plan" or "Add eSIM." Scan the QR code displayed above.
                  </li>
                  <li>
                    <span className="font-medium">Manual Activation (if needed):</span>{" "}
                    If your device does not support QR code scanning, you can manually
                    enter the LPA: <code>{eSimDetails.lpa}</code> and SMDP Address:{" "}
                    <code>{eSimDetails.smdpAddress}</code>.
                  </li>
                  <li>
                    <span className="font-medium">Follow On-Screen Instructions:</span>{" "}
                    Your device will guide you through the activation process. Ensure you
                    have an internet connection (Wi-Fi or another data source) during
                    setup.
                  </li>
                  <li>
                    <span className="font-medium">Confirm Activation:</span> Once
                    activated, your eSIM will be listed under your cellular plans. Select
                    it as your active plan if prompted.
                  </li>
                  <li>
                    <span className="font-medium">Troubleshooting:</span> If you
                    encounter issues, ensure your device is eSIM-compatible and unlocked.
                    Contact support with your Order ID ({eSimDetails.orderId}) for
                    assistance.
                  </li>
                </ol>
                <p className="text-sm text-gray-600 italic">
                  Note: Activation will only occur after successful KYC verification.
                  Ensure your travel dates align with the plan's validity period.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default OrderForm;