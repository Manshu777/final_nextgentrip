"use client";
import React from "react";

// ✅ Manually added flyers (editable)
const flyers = [
  { image: "/images/dailyupdates/Dubai.webp" },
  { image: "/images/dailyupdates/bali.webp" },
  { image: "/images/dailyupdates/Europe.webp" },
  { image: "/images/dailyupdates/Thailand.webp" },
];

const Page = () => {
  return (
    <div className="bg-gradient-to-br from-[#e8f4ff] to-[#f4fcff] py-12 px-5 md:px-20 min-h-screen">
      {/* ✅ Heading Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#10325a] drop-shadow-sm mb-4 tracking-tight">
          📣 Grab <span className="text-[#ff4d4d]">Limited-Time</span> Travel
          Offers — <span className="text-[#00b894]">Act Fast!</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto  font-medium">
          ✨ Missed moments don’t return — but the deals are here now. Book your
          perfect escape with{" "}
          <strong className="text-[#00b894]">NextGenTrip</strong> today!
        </p>
      </div>

      {/* ✅ Flyer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {flyers.map((flyer, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden shadow-2xl bg-white border border-blue-100"
          >
            <img
              src={flyer.image}
              alt={`Flyer ${i + 1}`}
              className="w-full h-[32rem] object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
