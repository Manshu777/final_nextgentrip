"use client";
import React from "react";
import Topbar from "./Component/Topbar";
import Header from "./Component/AllComponent/Header";
import TopFlight from "./Component/AllComponent/TopFlight";
import Book from "./Component/AllComponent/Book";
import TipsTricks from "./Component/AllComponent/TipsTricks";
import Navbar from "./Component/AllComponent/Navbar";
import Footer from "./Component/Footer";
import CustomSlider from "./Component/AllComponent/Slider";
import { redirect } from "next/navigation";
import { development } from "./Component/common";
import Reviews from "./Component/AllComponent/Reviews";

import FeaturedProperties from "./Component/AllComponent/FeaturedProperties";
const page = () => {
  if (development == "production") {
    redirect("/maintenance");
  }
  return (
    <>
      <head>
        <title>
          Best Travel Agency in India | Budget Hotels & Tour Packages
        </title>

        <meta
          name="keywords"
          content="best travel agency, budget hotels, tour agency in India, travel company in India, flight booking online, cruise booking, bus booking site, hotel booking, train ticket booking, charter plane, travel insurance"
        />
      </head>
      <Header />
      <div className="hidden md:block">
        <CustomSlider />
      </div>

      <TopFlight />

      <Book />

      <TipsTricks />

      <Reviews />
    </>
  );
};

export default page;
