"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


function OrderForm() {
  const [formData, setFormData] = useState({
    customerFirstName: "",
    customerLastName: "",
    customerDOB: "",
    customerPassportNo: "",
    travelStartDate: "",
    travelEndDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract plan data from query parameters
  const plan = {
    id: searchParams.get("planId"),
    planName: searchParams.get("planName") || "Selected Plan",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = {
        request: [
          {
            id: plan.id,
            planName: plan.planName,
            ...formData,
          },
        ],
      };
      const response = await axios.post(`${apilink}/matrix/validate-order`,data)
  
      if (response.data.status === 1) {
        router.push(
          `/upload?validatedOrderId=${
            response.data.data[0].validatedOrderId
          }&planId=${plan.id}&planName=${encodeURIComponent(plan.planName)}`
        );
      } else {
        setError(response.data.message || "Failed to validate order");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 mr-4"
            aria-label="Go back"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            Order Details for{" "}
            <span className="text-blue-600">{plan?.planName}</span>
          </h2>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="customerFirstName"
              value={formData.customerFirstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="customerLastName"
              value={formData.customerLastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="customerDOB"
              value={formData.customerDOB}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passport Number
            </label>
            <input
              type="text"
              name="customerPassportNo"
              value={formData.customerPassportNo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
              placeholder="Enter your passport number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Travel Start Date
            </label>
            <input
              type="date"
              name="travelStartDate"
              value={formData.travelStartDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Travel End Date
            </label>
            <input
              type="date"
              name="travelEndDate"
              value={formData.travelEndDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-medium transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Validating...
              </>
            ) : (
              "Validate Order"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;