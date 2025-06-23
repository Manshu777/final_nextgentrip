"use client";

import React from "react";
import { useTranslations } from "next-intl";

const ServiceItem = ({ img, titleKey, descKey }) => {
  const t = useTranslations("Popular");

  return (
    <li className="flex flex-col lg:flex-row items-center gap-4">
      <img
        src={`/images/${img}.webp`}
        className="w-16 h-16 object-cover"
        alt={t(titleKey)}
      />
      <div>
        <h5 className="text-lg font-semibold">{t(titleKey)}</h5>
        <p className="mt-2">{t(descKey)}</p>
      </div>
    </li>
  );
};

const Service = () => {
  const t = useTranslations("Popular");

  const services = [
    { img: "blog2", titleKey: "moreabout", descKey: "moreaboutans" },
    { img: "shield", titleKey: "serviceprovider", descKey: "serviceproviderans" },
    { img: "general", titleKey: "happyservice", descKey: "happyserviceans" },
  ];

  return (
    <div className="bg-gray-100 p-1 lg:p-20 mt-12">
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-5">
        <div className="p-4">
          <h3 className="text-4xl font-semibold">{t("service")}</h3>
          <p className="mt-4 mb-6">{t("serviceans")}</p>
          <ul className="space-y-6">
            {services.map((service, i) => (
              <ServiceItem key={i} {...service} />
            ))}
          </ul>
        </div>
        <div className="p-4">
          <img
            src="/images/online-booking.webp"
            alt={t("service")}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Service;
