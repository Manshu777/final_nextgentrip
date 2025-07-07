"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { apilink } from "../../Component/common";

function KYCForm() {
  const [formData, setFormData] = useState({
    orderNo: "",
    simNo: "",
    mobileNo: "",
    passportF: null,
    passportB: null,
    visaCopy1: null,
    eTicket1: null,
    eTicket2: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill form with query parameters
  useState(() => {
    setFormData({
      orderNo: searchParams.get("orderNo") || "",
      simNo: searchParams.get("simNo") || "",
      mobileNo: searchParams.get("mobileNo") || "",
      passportF: null,
      passportB: null,
      visaCopy1: null,
      eTicket1: null,
      eTicket2: null,
    });
  }, [searchParams]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.passportF || !formData.passportB || !formData.eTicket1) {
      setError("Passport Front, Passport Back, and E-Ticket 1 are required.");
      return;
    }

    // Validate file types and sizes
    const allowedTypes = ["image/jpeg", "image/jpg"];
    const maxSize = 2 * 1024 * 1024; // 2MB
    for (const field of ["passportF", "passportB", "visaCopy1", "eTicket1", "eTicket2"]) {
      if (formData[field]) {
        if (!allowedTypes.includes(formData[field].type)) {
          setError(`${field} must be a JPG/JPEG image.`);
          return;
        }
        if (formData[field].size > maxSize) {
          setError(`${field} must be less than 2MB.`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("orderNo", formData.orderNo);
      formDataToSend.append("simNo", formData.simNo);
      formDataToSend.append("mobileNo", formData.mobileNo);
      if (formData.passportF) formDataToSend.append("passportF", formData.passportF);
      if (formData.passportB) formDataToSend.append("passportB", formData.passportB);
      if (formData.visaCopy1) formDataToSend.append("visaCopy1", formData.visaCopy1);
      if (formData.eTicket1) formDataToSend.append("eTicket1", formData.eTicket1);
      if (formData.eTicket2) formDataToSend.append("eTicket2", formData.eTicket2);

      const response = await axios.post(`${apilink}/matrix/upload-documents`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 1 && response.data.data.documentSynced) {
        setSuccess("KYC documents uploaded successfully. Your eSIM is now activated!");
        // Show SweetAlert2 success popup
        await Swal.fire({
          title: "Success!",
          text: "KYC documents uploaded successfully. Your eSIM is now activated!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4f46e5", // Indigo color to match theme
        });


        router.push("/"); 
      } else {
        setError(response.data.message || "Failed to upload KYC documents.");
      }
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
            KYC Verification
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

        {success && (
          <div
            className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="kyc-form-title">
          <div>
            <label
              htmlFor="orderNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Order Number
            </label>
            <input
              type="text"
              id="orderNo"
              name="orderNo"
              value={formData.orderNo}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
              aria-readonly="true"
            />
          </div>
          <div>
            <label
              htmlFor="simNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              SIM Number
            </label>
            <input
              type="text"
              id="simNo"
              name="simNo"
              value={formData.simNo}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
              aria-readonly="true"
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
              type="text"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
              aria-readonly="true"
            />
          </div>
          <div>
            <label
              htmlFor="passportF"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Passport Front (JPG/JPEG, max 2MB)
            </label>
            <input
              type="file"
              id="passportF"
              name="passportF"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-200 rounded-xl"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="passportB"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Passport Back (JPG/JPEG, max 2MB)
            </label>
            <input
              type="file"
              id="passportB"
              name="passportB"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-200 rounded-xl"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="visaCopy1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Visa Copy (Optional, JPG/JPEG, max 2MB)
            </label>
            <input
              type="file"
              id="visaCopy1"
              name="visaCopy1"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label
              htmlFor="eTicket1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-Ticket 1 (JPG/JPEG, max 2MB)
            </label>
            <input
              type="file"
              id="eTicket1"
              name="eTicket1"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-200 rounded-xl"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="eTicket2"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-Ticket 2 (Optional, JPG/JPEG, max 2MB)
            </label>
            <input
              type="file"
              id="eTicket2"
              name="eTicket2"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-200 rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl text-white font-semibold transition-all ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } flex items-center justify-center`}
            aria-label="Submit KYC documents"
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
                Uploading...
              </>
            ) : (
              "Submit KYC Documents"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default KYCForm;