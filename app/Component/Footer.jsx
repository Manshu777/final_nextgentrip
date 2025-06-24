
"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Subscribe from "./AllComponent/Subscribe";
import { useTranslations } from "next-intl";
import axios from "axios";
import { apilink } from "./common";

const Footer = () => {
  const t = useTranslations("footer");
  const [activeTab, setActiveTab] = useState(2);
  const [allpackage, setAllpackage] = useState([]);
  const [loader, setLoader] = useState(true);

  const fetchPackage = async () => {
    try {
      setLoader(true);
      const response = await axios.get(`${apilink}/holidays/top`);
      if (response.data) {
        setAllpackage(response.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, []);

  const tabsContent = {
    FavouriteAirlineAndAirports: [
      { type: "Airline", name: "Ryanair", link: "https://www.ryanair.com" },
      { type: "Airline", name: "easyJet", link: "https://www.easyjet.com" },
      { type: "Airline", name: "Southwest Airlines", link: "https://www.southwest.com" },
      { type: "Airline", name: "AirAsia", link: "https://www.airasia.com" },
      { type: "Airline", name: "JetBlue Airways", link: "https://www.jetblue.com" },
      { type: "Airline", name: "Spirit Airlines", link: "https://www.spirit.com" },
      { type: "Airline", name: "IndiGo", link: "https://www.goindigo.in" },
      { type: "Airline", name: "Wizz Air", link: "https://www.wizzair.com" },
      { type: "Airline", name: "Norwegian Air Shuttle", link: "https://www.norwegian.com" },
      { type: "Airline", name: "Frontier Airlines", link: "https://www.flyfrontier.com" },
      { type: "Airport", name: "Heathrow Airport", link: "https://www.heathrow.com" },
      { type: "Airport", name: "Changi Airport", link: "https://www.changiairport.com" },
      { type: "Airport", name: "Los Angeles International Airport (LAX)", link: "https://www.flylax.com" },
      { type: "Airport", name: "Dubai International Airport (DXB)", link: "https://www.dubaiairports.ae" },
      { type: "Airport", name: "Tokyo Narita Airport", link: "https://www.narita-airport.jp" },
      { type: "Airline", name: "Scoot", link: "https://www.flyscoot.com" },
      { type: "Airline", name: "Vueling", link: "https://www.vueling.com" },
      { type: "Airport", name: "Singapore Changi Airport", link: "https://www.changiairport.com" },
      { type: "Airline", name: "Allegiant Air", link: "https://www.allegiantair.com" },
      { type: "Airline", name: "Tigerair", link: "https://www.tigerair.com" },
      { type: "Airport", name: "San Francisco International Airport (SFO)", link: "https://www.flysfo.com" },
      { type: "Airline", name: "Peach Aviation", link: "https://www.flypeach.com" },
      { type: "Airline", name: "VivaAerobus", link: "https://www.vivaaerobus.com" },
      { type: "Airline", name: "Flynas", link: "https://www.flynas.com" },
      { type: "Airport", name: "Sydney Kingsford Smith Airport", link: "https://www.sydneyairport.com.au" },
      { type: "Airline", name: "Azul Brazilian Airlines", link: "https://www.voeazul.com.br" },
      { type: "Airline", name: "Cebu Pacific", link: "https://www.cebupacificair.com" },
      { type: "Airport", name: "Hartsfield-Jackson Atlanta International Airport", link: "https://www.atl.com" },
      { type: "Airline", name: "Gol Linhas Aéreas", link: "https://www.voegol.com.br" },
      { type: "Airport", name: "Frankfurt Airport", link: "https://www.frankfurt-airport.com" },
    ],
  };

  return (
    <>
      <Subscribe />
      <footer className="bg-white px-4 sm:px-6 lg:px-8" aria-labelledby="footer-heading">
  <h2 id="footer-heading" className="sr-only">Footer</h2>
  <div className="mx-auto max-w-7xl py-6 sm:py-8 lg:py-10">
    {/* Recommended Section */}
    <div className="space-y-4">
      <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700">
        Recommended by <span className="text-blue-500">Nextgentrip.com</span>
      </p>

      <div className="tabSection">
        <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2">
          <button
            onClick={() => setActiveTab(2)}
            className={`${
              activeTab === 2
                ? "bg-slate-700 text-white"
                : "bg-slate-100 hover:text-blue-500"
            } py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 border-b-2 border-transparent focus:outline-none rounded-sm whitespace-nowrap`}
          >
            Top Holiday Packages
          </button>
        </div>
        {activeTab === 1 ? (
          <ul className="tab-content text-xs sm:text-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-5 py-6 sm:py-8 rounded-md">
            {tabsContent.FavouriteAirlineAndAirports.map((item, index) => (
              <li key={index} className="text-gray-600">
                <h3>{item.name}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <div className="tab-content text-xs sm:text-sm px-4 sm:px-5 py-6 sm:py-8 rounded-md">
            {loader ? (
              <p>Loading packages...</p>
            ) : allpackage.length > 0 ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {allpackage.map((pkg, index) => (
                  <Link href={`/holidayspackage/package/${pkg.slug}`} key={index} className="text-gray-600 hover:text-gray-900">
                    <h3>{pkg.package_name || "Package"}</h3>
                  </Link>
                ))}
              </ul>
            ) : (
              <p>No packages available.</p>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Main Footer Content */}
    <div className="my-8 sm:my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      <div className="space-y-4">
        <img
          className="w-auto h-12 sm:h-14 lg:h-16"
          src="/images/NextGenTrip.png"
          alt="NextGenTrip Logo"
        />
        <p className="text-xs sm:text-sm leading-6 text-gray-600">
          Your Journey, Our Responsibility. <br />
          आपकी यात्रा, हमारी ज़िम्मेदारी।
        </p>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link
            target="_blank"
            href="https://www.facebook.com/share/1AA9dPezvA/?mibextid=wwXIfr"
            className="hover:text-blue-400 text-blue-500"
            aria-label="Facebook"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <Link
            target="_blank"
            href="https://x.com/NextGenTrip?t=d4oQeyJHEQldf9lsP2EgnQ&s=08"
            className="hover:text-gray-400 text-gray-500"
            aria-label="X"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
            </svg>
          </Link>
          <Link
            href="https://www.instagram.com/nextgentrip/profilecard/?igsh=MTdyMjlyb293aTB0MA%3D%3D"
            className="hover:text-pink-400 text-pink-500"
            target="_blank"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 1 1 0-5.334" />
            </svg>
          </Link>
          <Link
            target="_blank"
            href="https://www.youtube.com/@NextGenTrip-g5t"
            className="text-red-500 hover:text-red-400"
            aria-label="YouTube"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:gap-8 sm:col-span-2">
        <div className="grid grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold leading-6 text-gray-900">Solutions</h3>
            <ul role="list" className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <li>
                <Link href="/listofhotels" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("listofhotels")}
                </Link>
              </li>
              <li>
                <Link href="/TrainComponent/pnrcheck" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("pnr")}
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("activities")}
                </Link>
              </li>
              <li>
                <Link href="/MyBooking/mybooking" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("booking")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold leading-6 text-gray-900">Service</h3>
            <ul role="list" className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <li>
                <Link href="/flight" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("flights")}
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("hotels")}
                </Link>
              </li>
              <li>
                <Link href="/train" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("trains")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold leading-6 text-gray-900">Company</h3>
            <ul role="list" className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <li>
                <Link href="/about" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/condition/privacy-policy" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/condition/terms-condition" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  {t("contactus")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold leading-6 text-gray-900">More Services</h3>
            <ul role="list" className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <li>
                <Link href="/ATI/atimate" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Business Associate
                </Link>
              </li>
              <li>
                <Link href="/ATI/atidesk" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Corporate Travel Desk
                </Link>
              </li>
              <li>
                <Link href="/ATI/atipro" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Elite Luxury
                </Link>
              </li>
              <li>
                <Link href="/ATI/atibharat" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Explore World
                </Link>
              </li>
              <li>
                <Link href="/ATI/loyalty-program/" className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
                  Membership & Loyalty Program
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Note */}
    <div className="mt-8 sm:mt-10 lg:mt-12 border-t border-gray-900/10 pt-4 hidden sm:block">
      <div className="flex justify-between items-center">
        <div className="text-xs sm:text-sm leading-6 text-gray-600 hover:text-gray-900">
          <p>{t("text1")}</p>
        </div>
      </div>
    </div>

    {/* Bottom Footer */}
    <div className="mt-6 sm:mt-8 lg:mt-10 border-t border-gray-900/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-xs sm:text-sm leading-5 text-gray-500">
        © 2025 Next Gen All Rights Reserved.
      </p>
      <Link
        href="/condition/privacy-policy"
        className="text-xs sm:text-sm leading-5 text-gray-500 hover:text-gray-900"
      >
        Privacy Policy
      </Link>
    </div>
  </div>
</footer>
    </>
  );
};

export default Footer;
