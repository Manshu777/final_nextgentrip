"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apilink } from "../../Component/common";
import { useRouter } from "next/navigation";
function PlanSelector() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = new URLSearchParams(location.search);
  const country = params.get("country_covered") || "Unknown";

  useEffect(() => {
    const getPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apilink}/matrix/plans`, { params });
        setPlans(response.data.data || []);
      } catch (error) {
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };
    getPlans();
  }, [country]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBuyNow = (plan) => {
    router.push(`/e-sim/buy-esim?planId=${plan.id}&planName=${encodeURIComponent(plan.planName)}`);
  };


  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-md animate-pulse"
        >
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  // Function to parse and extract key features from description HTML
  const parseDescription = (description) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, "text/html");
    const listItems = Array.from(doc.querySelectorAll("li")).map(
      (li) => li.textContent
    );
    return listItems.filter((item) =>
      [
        "Data Speed",
        "Tethering / Hotspot",
        "Cellular Network",
        "Mobile Plan Type",
      ].some((key) => item.includes(key))
    );
  };

  // Function to format coverage countries
  const formatCoverage = (coverage) => {
    const countries = coverage.split(",").map((c) => c.trim());
    return countries.length > 5
      ? `${countries.slice(0, 5).join(", ")} +${countries.length - 5} more`
      : countries.join(", ");
  };

  return (
    <div className="px-[4%] lg:px-[6%] mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Available eSIM Plans for{" "}
        <span className="text-blue-600 underline decoration-wavy">
          {country}
        </span>
      </h2>
      {error && (
        <p className="text-red-500 mb-6 text-center font-medium">{error}</p>
      )}
      {loading ? (
        <SkeletonLoader />
      ) : plans.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No plans available for {country}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${
                selectedPlan?.id === plan.id ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => handleSelectPlan(plan)}
            >
              {/* eSIM Badge */}
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                eSIM
              </div>
              {/* Plan Header */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pr-16">
                {plan.planName}
              </h3>
              {/* Plan Details */}
              <div className="space-y-3">
                <p className="text-gray-700 flex items-center">
                  <span className="font-medium text-blue-600 mr-2">📊 Data:</span>
                  {plan.dataCapacity === "Unlimited"
                    ? "Unlimited"
                    : `${plan.dataCapacity} ${plan.dataCapacityUnit}`}
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="font-medium text-blue-600 mr-2">🕒 Validity:</span>
                  {plan.validity} days
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="font-medium text-blue-600 mr-2">💰 Price:</span>
                  {plan.totalPrice} {plan.currency}
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="font-medium text-blue-600 mr-2">🌍 Coverage:</span>
                  <span className="text-sm">{formatCoverage(plan.coverages)}</span>
                </p>
              </div>
              {/* Additional Features */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 font-medium">Features:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {parseDescription(plan.description).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBuyNow(plan)}
                className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                Buy Now
              </button>
              
              {/* Selected Indicator */}
              {selectedPlan?.id === plan.id && (
                <div className="mt-4 flex items-center">
                  <span className="text-blue-500 font-medium">✔ Selected</span>
                </div>
              )}
              {/* Rechargeable Tag */}
              {plan.isRechargeable && (
                <p className="text-xs text-green-600 font-medium mt-2">
                  Rechargeable Plan
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlanSelector;