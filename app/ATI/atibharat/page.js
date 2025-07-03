"use client";
import React from "react";
import { FaInstagram, FaFacebookSquare, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Page() {
  const whyApkaTripDetails = [
    {
      title: "Tailor-Made Experiences for Every Explorer",
      description:
        "No two travelers are alike. The solo wanderer, the couple who yearns for romance, the family on an adventure, or the friends looking for a pinch of excitement; NextGen opens the doors for you in tailor-made plans that bring out your passion, zest, and interest. Cultural immersion, adventurous escapades, or serene retreats - guaranteed to bring your dreams to life.",
    },
    {
      title: "Vast Global Reach, Endless Possibilities",
      description:
        "You can choose from iconic destinations like the majestic temples of Kyoto, the vibrant streets of Marrakech, or the untouched beauty of Patagonia - to crystal-clear waters of the Maldives. Every destination is accessible to you through our global network of partners.",
    },
    {
      title: "Authentic, Off-the-Beaten-Path Adventures",
      description:
        "While some agencies focus on popular spots, NextGen helps you discover secret places. Imagine exploring a hidden waterfall in Bali, wandering the backstreets of Rome, or dining with locals in a remote Peruvian village, creating unforgettable off-the-beaten-path travel experiences.",
    },
    {
      title: "Experienced Travel Advisors to Guide You",
      description:
        "Our highly trained travel experts are passionate about travel - and it shows. Whether seeking advice on the best hiking trails in the Swiss Alps or recommendations for hidden cultural gems in India, our advisors guide you every step of the way with insider expertise.",
    },
  ];

  const travelCategories = [
    {
      category: "Adventure Travel",
      description:
        "For a dose of adrenaline? We'll help you get one - from trekking through the Amazon Rainforest to climbing the Andes or experiencing a safari in Kenya, our adventure travel experiences let you connect with nature.",
    },
    {
      category: "Cultural Immersions",
      description:
        "Discover different cultures. Participate in local festivals, explore old ruins, and intermingle with artisans in far-flung villages. NextGen opens up experiences that allow you to understand and appreciate the richness of cultures.",
    },
    {
      category: "Luxury Escapes",
      description:
        "Luxe up your adventures with private villas, five-star resorts, and guided tours, making each journey an unforgettable experience.",
    },
    {
      category: "Eco and Sustainable Travel",
      description:
        "Travel responsibly with NextGen’s eco-friendly options. Stay in eco-lodges, empower local communities, and visit nature reserves, ensuring your adventures have a positive impact on the planet.",
    },
    {
      category: "Family Adventures",
      description:
        "Travel with loved ones? Our family-friendly vacations offer activities for kids and relaxing downtime for adults, creating memories to cherish as you explore new destinations.",
    },
    {
      category: "Travelling Alone",
      description:
        "Whether a solo backpacking trip or a quiet retreat, NextGen provides empowering solo experiences, letting you explore new destinations at your own pace.",
    },
  ];

  const journeySteps = [
    {
      step: "1. Share Your Dream Destination",
      description:
        "Please do share with us that dream destination or kind of experience you're looking for - whether it be a quiet retreat, a cultural immersion, or an adventurous exploration. We listen closely to your needs.",
    },
    {
      step: "2. Tailor-made touring itinerary",
      description:
        "Our travel experts will create a unique itinerary tailored to your desires. From flights and accommodations to guided tours and activities, every detail will be taken care of to make your trip unforgettable.",
    },
    {
      step: "3. Guard Your Book",
      description:
        "Relax and let us handle every aspect of your trip. We offer flexible booking policies, ensuring you’re covered if things don’t go as planned. Enjoy the anticipation, knowing every detail is managed.",
    },
    {
      step: "4. Take the Road of a Lifetime",
      description:
        "Your adventure awaits! We support you every step of the way, whether you’re exploring a new city or an adventurous terrain. Our dedicated team is here to cater to your needs throughout the journey.",
    },
  ];

  const communityDetails = [
    {
      title: "Join the NextGen Travel Community",
      subtitle: "Share your story, move others.",
      description:
        "Get inspired by the travel experiences of our travelers. Discover hidden waterfalls in Iceland, street food markets in Bangkok, or other gems our explorers have found. Share your stories, photos, and travel tips with the NextGen community. Inspire others to venture beyond the ordinary.",
    },
    {
      title: "Start Your Journey with NextGen",
      subtitle: "Ready to travel with us?",
      description:
        "Adventure, culture, and breathtaking experiences await you. Begin your journey and let us make your dreams a reality.",
    },
    {
      title: "Get in Touch with Us",
      subtitle: "Let’s begin planning the adventure of a lifetime.",
      description:
        "Whether it’s a tropical island escape, a trek through the mountains, or a cultural immersion into a new country, we’ll ensure your journey is beyond what you’ve ever imagined.",
      cta: "Contact Us | Start Your Journey",
    },
    {
      title: "About NextGen",
      description:
        "This is where inspiration comes from the power of discovery and the beauty of new places. At NextGen, we connect travelers with hidden treasures and unforgettable adventures from all around the globe. Every journey is made unforgettable, whether it’s a luxury escape or an off-the-beaten-path exploration.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="h-[300px] bg-gradient-to-br from-[#10325a] to-[#45a183] flex items-center justify-center px-5 text-white text-center">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Welcome to NextGen - Your Gateway to Exploring the World
          </h1>
          <p className="text-white/90 text-lg">
            Uncover, roam, and explore the wonders of the world with NextGen.
            Whether you're dreaming of ancient cities or remote islands, we make
            it happen with curated travel and unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-5 md:px-16 lg:px-20 py-12 space-y-12 text-[#10325a]">
        {/* Why NextGen */}
        <div className="bg-[#f0f7f5] p-4 rounded-lg space-y-2">
          <h2 className="text-3xl font-bold text-center">Why NextGen?</h2>
          {whyApkaTripDetails.map((item, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Travel Categories */}
        <div className="bg-[#f0f7f5] p-8 rounded-lg space-y-8">
          <h2 className="text-3xl font-bold text-center">
            Discover Our Signature Travel Categories
          </h2>
          {travelCategories.map((item, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-xl font-semibold">{item.category}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Journey Steps */}
        <div className="bg-[#f0f7f5] p-8 rounded-lg space-y-8">
          <h2 className="text-3xl font-bold text-center">
            How It Works: Your Journey with NextGen
          </h2>
          {journeySteps.map((item, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-xl font-semibold">{item.step}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Community Sections */}
        <div className="space-y-5">
          {communityDetails.map((section, index) => (
            <div key={index} className="bg-[#f0f7f5] p-8 rounded-lg space-y-4">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.subtitle && (
                <h3 className="text-lg font-medium text-[#45a183]">
                  {section.subtitle}
                </h3>
              )}
              <p>{section.description}</p>
              {section.cta && (
                <button className="mt-4 text-[#45a183] font-semibold hover:underline">
                  {section.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-[#f0f7f5] p-8 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-base">
            <a
              href="tel:+919877579319"
              className="text-[#10325a] hover:text-[#45a183]"
            >
              +(91) 9877579319
            </a>
            <br />
            <a
              href="mailto:info@nextgentrip.com"
              className="text-[#10325a] hover:text-[#45a183]"
            >
              info@nextgentrip.com
            </a>
          </p>
        </div>

        {/* Social Media */}
        <div className="bg-[#f0f7f5] p-8 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">Follow Us on Social Media</h2>
          <p>
            Stay inspired and updated about the latest travel trends, hidden
            gems, and unique experiences around the world.
          </p>
          <div className="flex space-x-4 text-2xl text-[#10325a] mt-4">
            <a
              target="_blank"
              href="https://www.facebook.com/share/1AA9dPezvA/?mibextid=wwXIfr"
            >
              <FaFacebookSquare />
            </a>
            <a
              target="_blank"
              href="https://x.com/NextGenTrip?t=d4oQeyJHEQldf9lsP2EgnQ&s=08"
            >
              <FaXTwitter />
            </a>
            <a
              target="_blank"
              href="https://www.youtube.com/@NextGenTrip-g5t"
            >
              <FaYoutube />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/nextgentrip/profilecard/?igsh=MTdyMjlyb293aTB0MA%3D%3D"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
