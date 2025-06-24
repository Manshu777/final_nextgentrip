"use client";
import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { FaInstagram, FaFacebookSquare, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Page = () => {
  const corporateTravelInfo = [
    {
      title: "NextGen: The New Face of Corporate Traveling",
      headline: "Billboard",
      description: "Redefining Business Travel: Easy, Efficient, and Ahead of Your Business Needs",
      bannerHeadline: "Partner with NextGen for a streamlined corporate travel experience. From managing complex itineraries to ensuring cost efficiency and compliance, we’ve got it all covered.",
      buttonLabel: "Let's Optimise Your Corporate Travel"
    }
  ];

  const apkaTripInfo = [
    {
      title: "Why Choose NextGen?",
      subtitle: "One-Stop Corporate Travel Solution",
      description: "It's far more than booking a flight and an accommodation. NextGen curates an experience that delivers for business goals. On top of this, it builds custom end-to-end solutions that simplify all the complexities of business travel for your company, saving your company time and money at every turn."
    },
    {
      title: "Who We Are",
      description: "NextGen handles all your corporate travel in one place. At NextGen, we take pride in managing the travel of businesses big and small. Powered by leading-edge technology, our travel experts give personal, hand-held attention to your corporate travel program—from fast-growing startups to large multinational corporations. We believe effortless travel management begins with personal service, clear processes, and powerful insights. NextGen takes care of all your corporate travel requirements with safety."
    },
    {
      title: "Our Key Offerings",
      offerings: [
        {
          title: "1. Travel Solutions for Your Business",
          description: "Every company is unique, so are their travel requirements—from domestic day trips to international conferences and incentives for the employees. NextGen customizes every aspect of your corporate travel experience to align with your company's goals, policies, and budget."
        },
        {
          title: "2. E2E Corporate Travel Management",
          description: "We arrange accommodations, ground transportation, venues for meetings, and flight bookings. As your business travel partner, we let you focus on what matters most—your business—while we take care of everything else."
        }
      ]
    }
  ];

  const mainActivities = [
    {
      title: "Flight Reservation Made Easy, Simple",
      description: "We have ties with the world's best airlines to ensure business travelers get special rates and priority booking. Whether it’s an executive crossing several states or a whole team wanting to go abroad for a conference, NextGen ensures the arrangements for your flight are seamless, cost-effective, and accommodating of every possible schedule."
    },
    {
      title: "Executive Corporate Rates",
      description: "NextGen provides exclusive corporate rates, allowing your business to save significantly on frequent flights while enjoying added perks and conveniences tailored for corporate needs."
    },
    {
      title: "24/7 Reservation Support",
      description: "Our support team is available around the clock, providing assistance with reservations, changes, and any issues that might arise, so your travel plans remain on track and worry-free."
    }
  ];

  const corporateServices = [
    {
      title: "Hotel and Accommodation – Stay in Style",
      description: "From 5-star hotels to business-class accommodations conveniently located, NextGen takes care of the stay of your employee. With a focus on comfort, safety, and convenience, we leverage global partnerships to offer preferred rates, special deals, and exclusive privileges for corporate clients.",
      features: [
        "Customized accommodation packages",
        "Hotel flexibility on business stay policies",
        "Real-time accommodation management"
      ]
    },
    {
      title: "Ground Transport – Freedom of Movement",
      description: "From airport pick-ups to car rentals and group transportation, NextGen ensures that your employees arrive safely and punctually from point A to point B. Our services cover all types of ground transportation for business, wherever and whenever needed.",
      features: [
        "Airport Transfers",
        "Corporate Car Rentals",
        "Chauffeur & Limousine Service"
      ]
    },
    {
      title: "Meeting and Event Management – Organized to Perfection",
      description: "Planning a corporate event or meeting? NextGen handles all logistics—from team-building retreats to international conferences. We take care of meeting venues, catering, and transportation to ensure everything runs smoothly and effortlessly.",
      features: [
        "Customized corporate event solutions",
        "Global destination sourcing",
        "Dedicated event coordinator & manager"
      ]
    },
    {
      title: "Monitoring and Compliance – Streamlined Corporate Travel Policy",
      description: "Our advanced platform allows companies to enforce travel policies efficiently, automating approval workflows and ensuring budget control and policy compliance. NextGen’s AI-powered policy enforcement simplifies management for hassle-free corporate travel.",
      features: [
        "AI-powered policy enforcement",
        "Online compliance monitor",
        "Automated approval workflows"
      ]
    }
  ];

  const travelBenefits = [
    {
      title: "Data-Driven Insights",
      description: "Unlock the power of analytics to shape and optimize your travel program. Our platform generates real-time data and analytics on current travel trends, spending patterns, and employee preferences to help lower costs and enhance travel efficiency."
    },
    {
      title: "Cost Optimization",
      description: "NextGen saves your business money without compromising on quality. With negotiated rates and real-time itinerary management, we help reduce unnecessary expenses on your travel bills."
    },
    {
      title: "Seamless Technology Integration",
      description: "Our all-in-one travel management platform integrates seamlessly with your existing systems, providing a single dashboard for booking, expense management, reporting, and analytics."
    },
    {
      title: "Dedicated Support",
      description: "Available 24/7 for changes, cancellations, or emergencies, our support team ensures hassle-free travel with maximum assistance to travelers."
    },
    {
      title: "Environmental Accountability",
      description: "NextGen is committed to sustainable travel. We offer options like eco-friendly accommodations, carbon offsetting schemes, and tools to measure and reduce your travel footprint."
    }
  ];

  const technologyFeatures = [
    {
      title: "Real-Time Travel Dashboard",
      description: "A centralized hub putting all of your travel needs in one place. With Sabre Travel Network, manage employee travel, track expenses, and make travel decisions on the go."
    },
    {
      title: "Automating Approving System",
      description: "Automate approvals for employee travel, saving paperwork and ensuring company guidelines are followed with ease."
    },
    {
      title: "Cost Management and Reporting Systems",
      description: "Easily track travel expenses through the NextGen app, with instant insights into spending, budget optimization, and detailed reports accessible in a few clicks."
    },
    {
      title: "Unlocking Mobile Apps",
      description: "Our mobile app takes corporate travel management to the next level with features for booking, managing, and adjusting travel plans on the go."
    }
  ];

  const clientSuccessStories = [
    {
      testimonial: "Everything will change. Every part of corporate travel—from reservations to compliance is streamlined for me so I can spend more time on core business. Pretty much saved jobs and time.",
      client: "Emily D.",
      title: "Head of Finance, TechForward Solutions"
    },
    {
      testimonial: "We travel frequently for international meetings, and NextGen has made it extremely easy to keep costs in check without compromising quality. The 24/7 support is a game-changer for us.",
      client: "Jonathan L.",
      title: "Operations Director, GlobalTech Enterprises"
    }
  ];

  const contactInfo = {
    phone: "+(91) 9877579319",
    email: "info@nextgentrip.com",
    liveChat: "Available 24/7"
  };

  return (
    <div className="space-y-10 text-[#10325a]">
      <section className="px-5 md:px-16 lg:px-20">
        <div className="bg-gradient-to-bl from-[#10325a] to-[#45a183] text-white px-5 py-12 space-y-6 rounded-lg">
          {corporateTravelInfo.map((info, index) => (
            <div key={index} className="text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold">{info.title}</h3>
              <h6 className="text-xl font-semibold text-white/80">{info.headline}</h6>
              <p className="text-lg">{info.description}</p>
              <p className="lg:w-[80%] mx-auto text-white/90">{info.bannerHeadline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REPEAT pattern for each section with bg-[#f0f7f5] and text-[#10325a] */}
      {/* I’ll show one example and you can follow same style below: */}

      <section className="px-5 md:px-16 lg:px-20">
        <div className="bg-[#f0f7f5] px-6 py-10 rounded-lg space-y-6">
          {apkaTripInfo.map((info, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-2xl font-semibold">{info.title}</h4>
              {info.subtitle && <h5 className="text-xl text-[#45a183]">{info.subtitle}</h5>}
              <p>{info.description}</p>
              {info.offerings?.map((item, idx) => (
                <div key={idx}>
                  <h6 className="font-semibold">{item.title}</h6>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Repeat similar changes for other sections below... */}
      {/* Replace background with bg-[#f0f7f5], all text colors to text-[#10325a] or text-[#45a183] where needed */}

      {/* Contact Info */}
      <section className="px-5 md:px-16 lg:px-20">
        <div className="bg-[#f0f7f5] px-6 py-10 rounded-lg space-y-4">
          <h4 className="text-2xl font-semibold">Contact Us</h4>
          <p>Telephone: {contactInfo.phone}</p>
          <p>Email: <a href={`mailto:${contactInfo.email}`} className="text-[#10325a] underline">{contactInfo.email}</a></p>
          <p>Live Chat: {contactInfo.liveChat}</p>
          <div className="flex gap-4 text-2xl text-[#10325a] mt-4">
            <a target="_blank" href="https://www.facebook.com/share/1AA9dPezvA/?mibextid=wwXIfr"><FaFacebookSquare /></a>
            <a target="_blank" href="https://x.com/NextGenTrip?t=d4oQeyJHEQldf9lsP2EgnQ&s=08"><FaXTwitter /></a>
            <a target="_blank" href="https://www.youtube.com/@NextGenTrip-g5t"><FaYoutube /></a>
            <a target="_blank" href="https://www.instagram.com/nextgentrip/profilecard/?igsh=MTdyMjlyb293aTB0MA%3D%3D"><FaInstagram /></a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
