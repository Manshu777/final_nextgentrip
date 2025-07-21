import React from "react";
import { FaCrown, FaMedal, FaStar, FaUserPlus, FaSuitcase, FaGift } from "react-icons/fa";


export const metadata = {
  title: "NextGen Rewards – Loyalty Program for Travel Enthusiasts",
  description:
    "Join the NextGenTrip Rewards Program to unlock travel discounts, earn perks, and enjoy VIP benefits. Travel smarter and get rewarded!",
};

export default function RewardsPage() {
  const tiers = [
    {
      tier: "Silver Explorer",
      icon: <FaStar className="text-[#45a183] text-4xl mb-3" />,
      criteria: "Sign up & complete your first booking",
      benefits: [
        "5% discount on select hotels",
        "Early-bird deals & seasonal offers",
        "Basic travel support access",
      ],
    },
    {
      tier: "Gold Voyager",
      icon: <FaMedal className="text-yellow-500 text-4xl mb-3" />,
      criteria: "Book 5+ trips in a year",
      benefits: [
        "10% discount + curated travel packages",
        "One-time free flight reschedule",
        "Special pricing on travel insurance",
      ],
    },
    {
      tier: "Platinum Globetrotter",
      icon: <FaCrown className="text-[#10325a] text-4xl mb-3" />,
      criteria: "Spend ₹5L+ or partner via MoU",
      benefits: [
        "15% discount + elite travel upgrades",
        "Personal trip concierge",
        "Co-branded promotional benefits",
      ],
    },
  ];

  const steps = [
    {
      icon: <FaUserPlus className="text-[#45a183] text-4xl mb-4" />,
      title: "Become a Member",
      desc: "Create your free NextGenTrip account in seconds",
    },
    {
      icon: <FaSuitcase className="text-[#10325a] text-4xl mb-4" />,
      title: "Book & Earn",
      desc: "Every confirmed trip brings you closer to new rewards",
    },
    {
      icon: <FaGift className="text-yellow-500 text-4xl mb-4" />,
      title: "Enjoy Exclusive Perks",
      desc: "Unlock discounts, priority support, and VIP privileges",
    },
  ];

  return (
    <main>
      {/* Head Section for Meta Info */}
  
      {/* Hero Section */}
      <section className="bg-[#10325a] text-white py-16 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-3">NextGen Rewards</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Welcome to the travel club that pays you back! Earn points, unlock exclusive discounts,
          and elevate your travel experience with NextGenTrip.
        </p>
      </section>

      {/* Tiers Section */}
      <section className="py-14 px-6 bg-gray-100">
        <h2 className="text-4xl text-center font-bold text-[#10325a] mb-10">
          Level Up Your Travel Game
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map(({ tier, icon, criteria, benefits }, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-[#45a183] transition-all">
              <div className="flex justify-center">{icon}</div>
              <h3 className="text-2xl font-extrabold text-[#10325a] mb-1">{tier}</h3>
              <p className="text-sm text-gray-500 mb-5 italic">{criteria}</p>
              <ul className="text-left text-sm list-disc list-inside text-gray-700 space-y-2">
                {benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 px-6">
        <h2 className="text-4xl font-bold text-center text-[#10325a] mb-12">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto text-center">
          {steps.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-lg w-full md:w-1/3 hover:shadow-[#45a183] transition-all"
            >
              <div className="flex justify-center">{icon}</div>
              <h4 className="text-xl font-semibold text-[#10325a]">{title}</h4>
              <p className="text-sm text-gray-600 mt-3">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#45a183] text-white py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Travel Smarter. Travel Rewarded.</h2>
        <p className="text-sm mb-6">
          Join thousands of travelers already earning with NextGen Rewards. The world is waiting—get rewarded while exploring it.
        </p>
      </section>
    </main>
  );
}
