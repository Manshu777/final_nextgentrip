"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Autoplay } from 'swiper/modules';
import { useTranslations } from 'next-intl';
import axios from "axios";
// import { apilink, storageLink } from "../common";
// import { getSliderData } from "../Store/slices/SliderSlice";
import { useDispatch, useSelector } from "react-redux";
import { apilink, storageLink } from "../Component/common";
import { getSliderData } from "../Component/Store/slices/SliderSlice";

const allData = [
  {
    title: "Exclusive Offer",
    subtitle: "New User",
    offer: "First Flight",
    code: "NextGen",
    imageUrl: "/images/apka trip6 (1).webp",
    description:
      "Get an exclusive discount on your first flight booking. Use the code below to avail the offer.",
    category: "TopOffer",
    bg: "#ECF5FE",
    link: "/holidayspackage",
  },
  {
    title: "Flights Offer",
    subtitle: "New User",
    offer: "First Flight",
    code: "NextGen",
    imageUrl: "/images/apka trip1.webp",
    description:
      "Get an exclusive discount on your first flight booking. Use the code below to avail the offer.",
    category: "FlightsOffer",
    bg: "#ECF5FE",
    link: "/holidayspackage",
  },
  {
    title: "Hotel Offer",
    subtitle: "New User",
    offer: "First Flight",
    code: "NextGen",
    imageUrl: "/images/apka trip2.webp",
    description:
      "Get an exclusive discount on your first flight booking. Use the code below to avail the offer.",
    category: "HotelsOffer",
    bg: "#ECF5FE",
    link: "/holidayspackage",
  },
  {
    title: "Holiday Offer",
    subtitle: "New User",
    offer: "First Flight",
    code: "NextGen",
    imageUrl: "/images/apka trip3.webp",
    description:
      "Get an exclusive discount on your first flight booking. Use the code below to avail the offer.",
    category: "HolidayOffer",
    bg: "#ECF5FE",
    link: "/holidayspackage",
  },
  {
    title: "Bank Offers",
    subtitle: "New User",
    offer: "First Flight",
    code: "NextGen",
    imageUrl: "/images/apka trip4.webp",
    description:
      "Get an exclusive discount on your first flight booking. Use the code below to avail the offer.",
    category: "BankOffer",
    bg: "#ECF5FE",
    link: "/holidayspackage",
  },
  {
    title: "Bus Offers",
    subtitle: "New User",
    offer: "First Flight",
    code: "NextGen",
    imageUrl: "/images/apka trip7.webp",
    description:
      "Get an exclusive discount on your first flight booking. Use the code below to avail the offer.",
    category: "BusOffer",
    bg: "#ECF5FE",
    link: "/holidayspackage",
  },
  {
    title: "Cabs",
    subtitle: "New User",
    offer: "First Flight",
    code: "NextGen",
    imageUrl: "/images/apka trip8.webp",
    description:
      "Get an exclusive discount on your first flight booking. Use the code below to avail the offer.",
    category: "CabOffer",
    bg: "#ECF5FE",
    link: "/holidayspackage",
  },
];

const HotelSliderCompo = ({ isLoading, children }) => {
  const t = useTranslations('HomePage');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("TopOffer");
  const [bannerimg, setbannerImg] = useState()

  const dispatch = useDispatch();
  const sliderdata = useSelector((state) => state.sliderData);

  useEffect(() => {

    dispatch(getSliderData())

  }, [])


  const filteredData =
    activeTab === "TopOffer"
      ? allData
      : allData.filter((item) => item.category === activeTab);
  const filteredData2 = ["/images/flight-slide2.png", "/images/flight-slide1.png", "/images/flight-slide3.png"]

  const handleClick = (id) => {
    setActiveTab(id);
  };

  const fetchapi = async () => {
    const response = await axios.get(`${apilink}/home/bannerimg`);
    setbannerImg(response.data)
  }

  useEffect(() => {
    // fetchapi();
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);


  return (
    <>
      <div className="md:my-6">
        <div className="flex flex-col lg:flex-row justify-end w-full md:gap-4 px-4 my-1 md:my-2 ">
        <Swiper
            className=" w-full  h-[250px]  md:h-[350px] lg:h-full"
            loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1, // 1 slide on screens < 640px (mobile)
                },
                768: {
                  slidesPerView: 3, // Optional: 2 slides for tablets
                },
                1024: {
                  slidesPerView: 3, // 4 slides for larger screens (desktop)
                },
              }}
              spaceBetween={50}
           
              modules={[Autoplay]}
 
            >

            {["loadimg-1.webp", "loadimg-2.webp","loadimg-3.webp","loadimg-4.webp","loadimg-5.webp","loadimg-6.webp"].map((img, index) => <SwiperSlide
              className="flex flex-col   rounded-2xl shadow-sm bg-white-900"
            > 

              <div className="rounded-2xl   h-[300px]  md:h-[400px] lg:h-full ">


                <img src={`/slide/${img}`} alt="" className="h-full w-full  rounded-2xl" />

              </div>
            </SwiperSlide>)}

          </Swiper>
        </div>

      </div>
    </>
  );
};

export default HotelSliderCompo;
