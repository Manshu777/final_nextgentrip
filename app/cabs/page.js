import React from "react";
import CustomSlider from "../Component/AllComponent/Slider";
import Header from "../Component/AllComponent/Header";
import Image from "next/image";
import Link from "next/link";
import MobileHeader from "../Component/AllComponent/MobileHeader";
import CabsComp from "../Component/AllComponent/formMaincomp/CabsComp";

const page = () => {
  const routes = [
    {
      from: "Delhi",
      to: "Agra, Bareilly, Dehradun, Amritsar, Chandigarh, Haridwar",
      img: "/images/delhi.jpg",
    },
    {
      from: "Agra",
      to: "Noida, Lucknow, Delhi, Gurgaon, Faridabad, Ghaziabad",
      img: "/images/Routes/chennai-img.webp",
    },
    {
      from: "Mumbai",
      to: "Pune, Surat, Shirdi, Lonavala, Mahabaleshwar",
      img: "/images/Routes/mumbai-img.webp",
    },
    {
      from: "Pune",
      to: "Shirdi, Mumbai, Nashik, Aurangabad, Mahabaleshwar",
      img: "/images/pune.jpg",
    },
    {
    country: "UAE",
    from: "Dubai",
    to: "Abu Dhabi, Sharjah, Al Ain, Fujairah",
    img: "/images/dubai.jpg",
  },
  {
    country: "USA",
    from: "New York",
    to: "Washington D.C., Boston, Philadelphia, Chicago",
    img: "/images/newyork.jpeg",
  },
  {
    country: "UK",
    from: "London",
    to: "Manchester, Birmingham, Liverpool, Oxford",
    img: "/images/london.jpg",
  },
  {
    country: "Australia",
    from: "Sydney",
    to: "Melbourne, Brisbane, Canberra, Perth",
    img: "/images/sydney.jpg",
  },
  {
    country: "Canada",
    from: "Toronto",
    to: "Vancouver, Montreal, Calgary, Ottawa",
    img: "/images/canada.jpg",
  },
  ];

  return (
    <>

    <head>
  <title>NextGenTrip – Ride Smart, Book Your Cab in Seconds</title>
  <meta
    name="description"
    content="NextGenTrip offers easy cab bookings for local, airport & outstation travel. Enjoy safe rides, 24/7 support, best prices, and global service—travel hassle-free!"
  />
  
</head>
      <CabsComp />
      <MobileHeader />
      

    

      <main className="flight py-8 lg:py-10 px-0 md:px-10  lg:px-40">
        <div className="">
          <div className="relative ">
            <div className="relative text-lg md:text-xl lg:text-3xl font-bold text-gray-900 flex justify-center items-center gap-2  mb-5 lg:mb-6">
              Top Cab Routes
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div key={index} className="flex items-center space-x-4  p-4 ">
              <div className="w-24 h-20 relative">
                <Image
                  src={route.img}
                  alt={`${route.from} to ${route.to}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg w-16 h-16"
                />
              </div>
              <div>
                <div className="font-bold text-xl flex">{route.from} </div>
                <div className="text-gray-600 text-sm font-semibold">
                  To- {route.to}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

       <div className="bg-gray-100 p-5 md:p-20">
  <div className="container mx-auto px-4 lg:px-0 space-y-8">
    <div className="w-full lg:w-3/5 text-center mx-auto">
      <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full mb-3">
        Benefits
      </span>
      <h2 className="text-lg md:text-3xl font-bold">
        Boost Your Search With <strong>Trending Categories</strong>
      </h2>
      <p className="text-gray-600 mt-4">
        Ride in style and comfort with our luxury cab options
      </p>
    </div>

    <div className="flex flex-wrap justify-between items-stretch -mx-2">
      {[
        {
          title: 'Choosing the Right Cab for Your Needs',
          icon: '/images/plan-brown-icon.svg',
        },
        {
          title: 'Top Cab Services in Your Area',
          icon: '/images/cog-primary-icon.svg',
        },
        {
          title: 'How to Book a Cab Efficiently',
          icon: '/images/arrow-red-icon.svg',
        },
        {
          title: 'Understanding Cab Fare Calculations',
          icon: '/images/legal-purple-icon.svg',
        },
        {
          title: 'Safety Tips for Cab Rides',
          icon: '/images/finance-blue-icon.svg',
        },
      ].map((item, index) => (
        <div key={index} className="w-full md:w-1/2 lg:w-1/5 px-2 mb-4">
          <div
            href=""
            className="flex flex-col justify-between bg-white text-center rounded-lg p-7 shadow-md h-full"
          >
            <Image
              className="mx-auto mb-4"
              src={item.icon}
              alt="icon"
              width={48}
              height={48}
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

<CustomSlider />
     <div className="min-h-max bg-gray-100">
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8">
    <section className="bg-white shadow-md rounded-lg p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Hassle-Free Cab Booking with Next Gen
      </h1>
      <p className="text-gray-700 mb-6">
        At Next Gen, we’re dedicated to making your travel experience as
        smooth and stress-free as possible. Our hassle-free cab booking
        service is designed to meet all your transportation needs with
        just a few taps on your smartphone.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Here’s how we ensure a seamless experience for you:
      </h2>

      <ol className="list-decimal list-inside mb-6 space-y-4">
        <li className="text-gray-700">
          <strong>User-Friendly App Interface:</strong> Our intuitive app
          is designed to make booking a cab easy and quick. Whether you
          need a ride for a business meeting or a family outing, you can
          book a cab effortlessly in just a few steps.
        </li>
        <li className="text-gray-700">
          <strong>Instant Booking Confirmation:</strong> Once you’ve booked
          your ride, you’ll receive instant confirmation with details of
          your driver and vehicle. No more waiting or uncertainty—just
          reliable service at your fingertips.
        </li>
        <li className="text-gray-700">
          <strong>Wide Range of Vehicles:</strong> Choose from a variety of
          vehicles to suit your needs. From sedans to SUVs, we have the
          right vehicle to accommodate your group size and preferences.
        </li>
        <li className="text-gray-700">
          <strong>24/7 Customer Support:</strong> Our customer support team
          is available around the clock to assist you with any queries or
          concerns. We’re here to ensure that your journey is smooth from
          start to finish.
        </li>
        <li className="text-gray-700">
          <strong>Safe and Reliable Drivers:</strong> Our drivers are
          experienced, professional, and thoroughly vetted to ensure your
          safety and comfort. We prioritize your security and strive to
          provide the best service possible.
        </li>
      </ol>
    </section>
  </main>
</div>

    </>
  );
};

export default page;
