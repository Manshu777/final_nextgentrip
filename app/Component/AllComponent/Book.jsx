"use client";
import { useTranslations } from "next-intl";
import React from "react";



const Book = () => {
  const t=useTranslations("Bookwithus")
  const features = [
    {
      title: t("title1"),
      description:
        t("des1"),
      icon: "✈️", 
      count: "1"
    },
    {
      title: t("title2"),
      description:
      t("des2"),
      icon: "💰", 
      count: "2"
    },
    {
      title:t("title3"),
      description:
      t("des3"),
      icon: "🔥", 
      count: "3"
    },
    {
      title: t("title4"),
      description:
      t("des4"),
      icon: "📞", 
      count: "4"
    },
  ];
  return (
    <>
      <div className="py-2 lg:py-6 bg-white mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative text-lg md:text-xl lg:text-3xl font-bold text-gray-900 flex justify-center items-center gap-2 mb-5">
         {t("bookwith")}
           
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 border border-blue-200 text-center card-hero"
              >   
                <div className="text-4xl mt-7 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

   <section className="relative py-7  px-6 md:px-16 lg:px-32 bg-gradient-to-r from-[#10325a] to-[#45a183] text-white overflow-hidden">
  {/* Decorative Elements */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full top-[-100px] left-[-100px] blur-3xl animate-spin-slow"></div>
    <div className="absolute w-72 h-72 bg-white opacity-10 rounded-full bottom-[-80px] right-[-80px] blur-2xl animate-ping"></div>
  </div>

  {/* Main Content */}
  <div className="relative z-10 text-center max-w-4xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 mb-6">
      {t("packages")}
    </h2>
    <p className="text-base md:text-lg text-white/80 font-normal leading-7">
      {t("packageans")}
    </p>
  </div>
</section>





    </>
  );
};

export default Book;
