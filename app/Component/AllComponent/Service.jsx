"use client";

import React from "react";
import { useTranslations } from "next-intl";

const ServiceRow = ({ icon, titleKey, descKey }) => {
  const t = useTranslations("Popular");

  return (
    <div className="flex items-start">
      <div className="text-xl sm:text-2xl text-[#10325a] pt-0.5 w-6 sm:w-8 text-center">
        {icon}
      </div>
      <div className="pl-3 sm:pl-4">
        <h5 className="text-sm sm:text-base font-semibold text-[#10325a] leading-tight">
          {t(titleKey)}
        </h5>
        <p className="text-[13px] text-gray-600 mt-0.5 leading-snug">
          {t(descKey)}
        </p>
      </div>
    </div>
  );
};

const Service = () => {
  const t = useTranslations("Popular");

  const services = [
    { icon: "✈️", titleKey: "flight", descKey: "flightans" },
    { icon: "🏨", titleKey: "hotel", descKey: "hotelans" },
    { icon: "🚐", titleKey: "transport", descKey: "transportans" },
    { icon: "🛡️", titleKey: "insurance", descKey: "insuranceans" },
    { icon: "🌍", titleKey: "visa", descKey: "visaans" },
    { icon: "💱", titleKey: "forex", descKey: "forexans" },
    { icon: "📶", titleKey: "esim", descKey: "esimans" },
    { icon: "💍", titleKey: "marriage", descKey: "marriageans" },
    { icon: "🎓", titleKey: "internship", descKey: "internshipans" },
    { icon: "🚢", titleKey: "cruise", descKey: "cruiseans" },
    { icon: "⛵", titleKey: "charter", descKey: "charterans" },
    { icon: "🌴", titleKey: "holiday", descKey: "holidayans" },
];

  return (
    <section className="bg-white py-3 px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center sm:text-left">
          {t("service")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
          {services.map((item, index) => (
            <ServiceRow key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
