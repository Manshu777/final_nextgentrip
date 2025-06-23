"use client";

import React, { useEffect, useState } from "react";
import InfoSection from "./InfoSection";
import Link from "next/link";
import { useTranslations } from "next-intl";
import axios from "axios";
import { apilink, storageLink } from "../common";
import HotelSliderCompo from "../../hotels/HotelSliderCompo";

const TopFlight = () => {
  const [viewAll, setviewAll] = useState(true);
  const t = useTranslations("Popular");

  let date = new Date(Date.now());
  date.setMonth(date.getMonth() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}T00:00:00`;

  const cityData = [
    {
      head: t("heading1"),
      images: [
        {
          image: "/images/london.webp",
          title: "Delhi to UAE",
          description: t("des1"),
          link: `flightto=DEL&from=BOM&date=${formattedDate}&prfdate=${formattedDate}&JourneyType=1&adultcount=1&childCount=0&infantCount=0&selectedClass=1/`,
        },
        {
          image: "/images/lose.webp",
          title: "Mumbai to Indonesia",
          description: t("des2"),
          link: `flightto=BOM&from=BOM&date=${formattedDate}&prfdate=${formattedDate}&JourneyType=1&adultcount=1&childCount=0&infantCount=0&selectedClass=1/`,
        },
        {
          image: "/images/tokyo.webp",
          title: "Delhi to Mumbai",
          description: t("des3"),
          link: `flightto=DEL&from=BOM&date=${formattedDate}&prfdate=${formattedDate}&JourneyType=1&adultcount=1&childCount=0&infantCount=0&selectedClass=1/`,
        },
        {
          image: "/images/rome.webp",
          title: "New York to London",
          description: t("des4"),
          link: `flightto=DEL&from=BOM&date=${formattedDate}&prfdate=${formattedDate}&JourneyType=1&adultcount=1&childCount=0&infantCount=0&selectedClass=1/`,
        },
        {
          image: "/images/dubai.webp",
          title: "Dubai to Hong Kong",
          description: t("des5"),
          link: `flightto=DEL&from=BOM&date=${formattedDate}&prfdate=${formattedDate}&JourneyType=1&adultcount=1&childCount=0&infantCount=0&selectedClass=1/`,
        },
      ],
    },
    {
      head: t("heading2"),
      images: [
        { image: "/images/europe.webp", title: "Explore the Wonders of Europe", description: t("desa1") },
        { image: "/images/getways.webp", title: "Exotic Getaways to the Caribbean", description: t("desa2") },
        { image: "/images/adventure.webp", title: "Adventure Awaits in Southeast Asia", description: t("desa3") },
        { image: "/images/maldives.webp", title: "Serene Escapes to the Maldives", description: t("desa4") },
        { image: "/images/america2.webp", title: "Cultural Immersion in South America", description: t("desa5") },
      ],
    },
    {
      head: t("heading3"),
      images: [
        {
          image: "/images/car1.webp",
          title: "Delhi",
          description: t("desb1"),
          link: `/hotels/cityName=delhi&citycode=130443&checkin=${formattedDate.split("T")[0]}&checkout=${formattedDate.split("T")[0]}&adult=1&child=0&roomes=1&page=0&star=0/`,
        },
        {
          image: "/images/24.webp",
          title: "Mumbai",
          description: t("desb2"),
          link: `/hotels/cityName=Mumbai&citycode=144306&checkin=${formattedDate.split("T")[0]}&checkout=${formattedDate.split("T")[0]}&adult=1&child=0&roomes=1&page=0&star=0/`,
        },
        {
          image: "/images/wifi.webp",
          title: "Shimla",
          description: t("desb3"),
          link: `/hotels/cityName=Shimla&citycode=138673&checkin=${formattedDate.split("T")[0]}&checkout=${formattedDate.split("T")[0]}&adult=1&child=0&roomes=1&page=0&star=0/`,
        },
        {
          image: "/images/safety-first.webp",
          title: "Guwahati",
          description: t("desb4"),
          link: `/hotels/cityName=Guwahati&citycode=121139&checkin=${formattedDate.split("T")[0]}&checkout=${formattedDate.split("T")[0]}&adult=1&child=0&roomes=1&page=0&star=0/`,
        },
        {
          image: "/images/businesswoman.webp",
          title: "Amritsar",
          description: t("desb5"),
          link: `/hotels/cityName=Amritsar&citycode=101129&checkin=${formattedDate.split("T")[0]}&checkout=${formattedDate.split("T")[0]}&adult=1&child=0&roomes=1&page=0&star=0/`,
        },
      ],
    },
  ];

  const attractions = [
    { name: "Jaipur", image: "/images/jaipur.webp", isNew: true, link: "/FamousPlaces/InnerLakshadweep" },
    { name: "Bali", image: "/images/bali.webp", link: "/FamousPlaces/Bali" },
    { name: "Goa", image: "/images/goa.jpg", link: "/FamousPlaces/Andaman" },
    { name: "Australia", image: "/images/austrailia.jpg", link: "/FamousPlaces/Kashmir" },
    { name: "Dubai", image: "/images/dubai.jpg", link: "/FamousPlaces/Dubai" },
    { name: "Paris", image: "/images/paris.jpg", link: "/FamousPlaces/Jaipur" },
    { name: "Kashmir", image: "/images/kashmir.jpg", link: "/FamousPlaces/Bengaluru" },
    { name: "Singapore", image: "/images/singapore.jpg", link: "/FamousPlaces/Singapore" },
    { name: "Leh", image: "/images/leh.jpg", link: "/FamousPlaces/Leh" },
    { name: "Singapore Alt", image: "/images/singapore2.jpg", link: "/FamousPlaces/Leh" },
    { name: "France", image: "/images/france.jpg", link: "/FamousPlaces/Leh" },
    { name: "Thar", image: "/images/thar.jpg", link: "/FamousPlaces/Kerala" },
  ];

  const [topport, setTopport] = useState([]);
  const [toppkage, setToppackage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [flights, packages] = await Promise.all([
        axios.get(`${apilink}/Popular-Flight`),
        axios.get(`${apilink}/holidays/list`)
      ]);
      setTopport(flights.data);
      setToppackage(packages.data);
    };
    fetchData();
  }, []);

  return (
    <>
      {/* FLIGHT & PACKAGE GRID */}
      <div className="flight pt-0 lg:pt-10 px-0 md:px-10 lg:px-28">
        <h2 className="text-center text-3xl font-bold mb-6">{t("mainheading")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-5 p-3">
          {/* Flights */}
          <div className="bg-white border shadow-md rounded-xl">
            <div className="bg-[#0291d2] text-center py-3 text-white text-lg font-semibold">{t("heading1")}</div>
            {topport && topport.map((item, i) => (
              <Link key={i} href={`flightto=${item.from_code}&from=${item.to_code}&date=${formattedDate}&prfdate=${formattedDate}&JourneyType=1&adultcount=1&childCount=0&infantCount=0&selectedClass=1/`} className="flex items-center border-b px-6 py-2 hover:bg-gray-50">
                <img src={cityData[0].images[i]?.image} alt="" className="h-16 w-16 rounded-full object-cover border-2 shadow-sm" />
                <div className="px-4 w-[80%]">
                  <h3 className="text-sm font-semibold">{item.from} to {item.to}</h3>
                  <p className="text-xs text-gray-500">{item.dis}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Packages */}
          <div className="bg-white border shadow-md rounded-xl">
            <div className="bg-[#0291d2] text-center py-3 text-white text-lg font-semibold">{t("heading2")}</div>
            {toppkage.map((pkg, i) => (
              <Link key={i} href={`/holidayspackage/package/${pkg.slug}`} className="flex items-center border-b px-6 py-2 hover:bg-gray-50">
                <img src={`${storageLink}/${pkg.banner_image}`} alt={pkg.package_name} className="h-16 w-16 rounded-full object-cover border shadow-sm" />
                <div className="px-4 w-full">
                  <h3 className="text-md font-semibold">{pkg.package_name}</h3>
                  <p className="text-xs text-gray-500">📍 {pkg.city}, {pkg.country} ⏳ {pkg.duration} days</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Hotels */}
          <div className="bg-white border shadow-md rounded-xl">
            <div className="bg-[#0291d2] text-center py-3 text-white text-lg font-semibold">{t("heading3")}</div>
            {cityData[2].images.map((img, i) => (
              <Link key={i} href={img.link} className="flex items-center border-b px-6 py-2 hover:bg-gray-50">
                <img src={img.image} alt={img.title} className="h-16 w-16 rounded-full object-cover border shadow-sm" />
                <div className="px-4 w-[80%]">
                  <h3 className="text-sm font-semibold">{img.title}</h3>
                  <p className="text-xs text-gray-500">{img.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <InfoSection />

      {/* Hotel Slider Section */}
      <div className="px-2 my-8">
        <h3 className="text-center text-3xl font-bold my-4">Our Packages</h3>
        <HotelSliderCompo />
      </div>

      

      {/* Services Section */}
      {/* <div className="bg-gray-100 p-1 lg:p-20 mt-12">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-5">
          <div className="p-4">
            <h3 className="text-4xl font-semibold">{t("service")}</h3>
            <p className="mt-4 mb-6">{t("serviceans")}</p>
            <ul className="space-y-6">
              {["blog2", "shield", "general"].map((img, i) => (
                <li key={i} className="flex flex-col lg:flex-row items-center space-x-4">
                  <img src={`/images/${img}.webp`} className="w-16 h-16 object-cover" alt="" />
                  <div>
                    <h5 className="text-lg font-semibold">{t(i === 0 ? "moreabout" : i === 1 ? "serviceprovider" : "happyservice")}</h5>
                    <p className="mt-2">{t(i === 0 ? "moreaboutans" : i === 1 ? "serviceproviderans" : "happyserviceans")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4">
            <img src="/images/online-booking.webp" alt="" className="rounded-lg" />
          </div>
        </div>
      </div> */}

      {/* Tourist Love Section */}
      <div className="w-full mx-auto px-6 md:px-10 lg:px-28 pt-0 lg:pt-12">
        <h2 className="text-center text-4xl font-bold text-[#10325a] mb-12">Tourist <span className="text-[#45a183]">Love</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {(viewAll ? attractions.slice(0, 7) : attractions).map((attraction, index) => (
            <Link href={attraction.link} key={index} className="border-b-4 border-b-[#009dff] shadow-md rounded-lg p-4 bg-white">
              <div className="flex items-center">
                <img src={attraction.image} alt={attraction.name} className="h-16 w-16 rounded-full object-cover border shadow-sm" />
                <div className="ml-4">
                  <h5 className="text-lg font-semibold">{attraction.name}</h5>
                  <p className="text-sm text-gray-500">View All Package</p>
                </div>
              </div>
            </Link>
          ))}
          {viewAll && (
            <div onClick={() => setviewAll(false)} className="cursor-pointer border-b-4 hover:border-b-[#009dff] shadow-md rounded-lg p-4 bg-white">
              <div className="flex items-center">
                <p className="text-3xl">🧾</p>
                <div className="ml-4">
                  <h5 className="text-lg font-semibold">View All</h5>
                  <p className="text-sm text-gray-500">Destination Package</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopFlight;
