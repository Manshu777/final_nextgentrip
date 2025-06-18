"use client"
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";


import { FaStar } from "react-icons/fa";
import Link from "next/link";




const Testimonial = () => {

  const reviewData = [
    {
      title: "Exceptional Travel Experience!",
      rating: 5,
      content: "Next Gen Trip Tour and Travels planned our vacation perfectly. From flights to hotel bookings, everything was smooth and stress-free. Highly recommended for personalized travel planning!",
      author: {
        name: "Ankita Malhotra",
        role: "Frequent Traveler",
        imageUrl: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
        image: "/images/googleicon.webp",
        profileLink: "#"
      }
    },
    {
      title: "Best Tour Service Ever!",
      rating: 5,
      content: "The team at Next Gen Trip Tour and Travels is incredibly professional. They curated a perfect honeymoon package for us, and every detail was handled with care.",
      author: {
        name: "Rahul Singh",
        role: "Marketing Executive",
        imageUrl: "/mail-2.webp",
        image: "/images/LinkedIn.svg",
        profileLink: "#"
      }
    },
    {
      title: "Highly Recommended!",
      rating: 5,
      content: "Next Gen Trip Tour and Travels made our family vacation unforgettable. Great service, friendly support, and timely arrangements. We’ll definitely book again.",
      author: {
        name: "Sonal Deshmukh",
        role: "Entrepreneur",
        imageUrl: "/women-4.avif",
        image: "/images/LinkedIn.svg",
        profileLink: "#"
      }
    },
    {
      title: "Stress-Free and Enjoyable!",
      rating: 5,
      content: "I was amazed by how easy and enjoyable the whole process was with Next Gen Trip Tour and Travels. They took care of everything, and we just relaxed and enjoyed.",
      author: {
        name: "Sodhi Singh",
        role: "Bank Manager",
        imageUrl: "/sardar-ji-1.jpg",
        image: "/images/LinkedIn.svg",
        profileLink: "#"
      }
    },
    {
      title: "Incredible Holiday Package!",
      rating: 5,
      content: "Our trip to Kerala was arranged by Next Gen Trip Tour and Travels, and it was flawless. Excellent coordination and beautiful properties throughout.",
      author: {
        name: "Deepika Nair",
        role: "Software Developer",
        imageUrl: "/women-2-test.jpg",
        image: "/images/LinkedIn.svg",
        profileLink: "#"
      }
    },
    {
      title: "Best Travel Agency Around!",
      rating: 5,
      content: "Next Gen Trip Tour and Travels provided top-notch service with transparent pricing and timely updates. A trustworthy agency for all your travel needs.",
      author: {
        name: "Manoj Verma",
        role: "Operations Lead",
        imageUrl: "/women-4.jpg",
        image: "/images/LinkedIn.svg",
        profileLink: "#"
      }
    }
  ];
  


  const reviews = [
    { id: 1, platform: "Google", rating: "4.8/5", reviewCount: 6933, logoSrc: "/images/Google2.svg" },
    { id: 2, platform: "Facebook", rating: "4.7/5", reviewCount: 1212, logoSrc: "/images/Facebook-d.svg" },
    { id: 3, platform: "Switchup", rating: "4.9/5", reviewCount: 209, logoSrc: "/images/Switch-43.svg" },
    { id: 4, platform: "Course Report", rating: "4.8/5", reviewCount: 403, logoSrc: "/images/Course3.webp" }
  ];

  return (
    <div className="overflow-hidden bg-gray-100 py-12 px-5 lg:px-28" id="reviews" data-aos="fade-up">
      <div className="max-w-4xl mx-auto text-center">
        {/* <h2 className="text-sm font-semibold text-gray-600 uppercase">LEARNER REVIEWS FROM THE WORLD OVER</h2> */}
        <p className="text-3xl font-bold text-gray-900 mt-3">REVIEWS FROM THE WORLD OVER</p>
      </div>


      <div className="container mx-auto mt-8" data-aos="fade-up-right">
        <Swiper
          spaceBetween={20}
          breakpoints={{
            1024: { slidesPerView: 3,spaceBetween:20 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
          }}
        >
          {reviewData.map((review, index) => (
            <SwiperSlide key={index} className="testimonial-slider ">
              <div className="relative ">

                <h6 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h6>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-base text-justify text-gray-600 mt-3">{review.content}</p>
              </div>
              <div className="border-t mt-4 pt-4 flex items-center gap-3">
                <img src={review.author.imageUrl} alt="User" className="w-[60px] h-[58px] rounded-full" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{review.author.name}</div>
                  <div className="text-xs text-gray-500">{review.author.role}</div>
                </div>
               
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

     
      <div className="container mx-auto bg-white p-6 rounded-2xl  mt-8" data-aos="fade-up-left">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col items-center">
              <img src={review.logoSrc} alt={review.platform} className="w-32" />
              <div className="flex items-center mt-2">
                <FaStar className="text-yellow-500" />
                <span className="text-gray-600 ml-1">{review.rating}</span>
              </div>
              <p className="text-gray-500">{review.reviewCount} Reviews</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
