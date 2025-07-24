'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const leaders = [
  {
    name: 'Ms. Geeta Sachdeva',
    title: 'Director – M/s Next Gen Trip Pvt. Ltd',
    image: '/images/leaders/geeta sachdeva.jpeg',
    bio: `Ms. Geeta Sachdeva is a dynamic HR leader with over 40 years of experience across top Indian and multinational organizations. A graduate of Himachal Pradesh University and a postgraduate in PM&IR, she is also the founder of Integrated HR Solutions, a strategic HR advisory firm. She has held senior roles at Gates India, Gontermann-Peipers (ISPAT Group) and Gabriel (Anand Group), leading initiatives in TPM, Six Sigma, Gemba Kaizen and Balance Scorecard PMS. Her collaborations with Ernst & Young, IBM and Kaizen Institute have shaped her global HR perspective. As Advisor-HR to Morepen Labs and an active member of CII and ISTD, she contributes significantly to the HR community. A certified Six Sigma Black Belt, she brings expertise in talent development, strategic HR transformation and performance management—driving a people-first and performance-oriented culture at NextGenTrip.com .`,
  },
  {
    name: 'Dr. J.C. Jhuraney',
    title: 'Advisor – M/s Next Gen Trip Pvt. Ltd.',
    image: '/images/leaders/jhauraneysahab (1).webp',
    bio: `Dr. J.C. Jhuraney bringing with him decades of Leadership in Human Resource Strategy, Organizational Development and Executive Coaching. With a distinguished background, he held the position of Senior Vice President – HR at Samtel Group, followed by his impactful role as Whole-Time Director & CHRO with Omax Group, where he championed people-centric transformation and corporate governance. Beyond the corporate arena, Dr. Jhuraney has played pivotal roles in key industry bodies, having served as Chairman of the HR & IR Committee of CII (Northern Region) and Vice President of the Delhi Management Association (DMA). These positions underscore his commitment to elevating HR practices and leadership standards across industries. Renowned for his deep insights into Leadership Mentoring, Talent Engagement and Building High-Performance Cultures, Dr. Jhuraney guides NextGenTrip's people, culture and business roadmap with a sharp ethical compass and strategic foresight. His guidance is instrumental in nurturing a value-driven, inclusive and innovation-led environment as the company scales its presence in the Global Travel Industry.`,
  },
  {
    name: 'Mr. Harjeet Singh Rana',
    title: 'Director – M/s Next Gen Trip Pvt. Ltd.',
    image: '/images/leaders/harjeetphoto.jpg',
    bio: `Mr. Harjeet Singh Rana, B.A., LL.B., PG-HR & IR, MBA (Opn.), is a dynamic HR leader with over three decades of experience across top corporates including Winsome Group, Hero Cycles, Pidilite Industries, Murugappa Group and Eicher Motors. Known for transforming people practices and building inclusive, high-performance cultures, he has led HR functions across diverse sectors and geographies. As the visionary Founder of NextGenTrip.com, he is now revolutionizing the travel industry with a tech-driven platform offering Flights, Hotels, Holidays, Buses, Cabs, eSIMs, Cruises, Charters, Insurance, Join Marriages, Visas and International Internship Trainings. His mission is to make NextGenTrip a global favorite, blending innovation with trust to deliver a world-class travel experience.`,
  },
  {
    name: 'Dr. Vishal Rana',
    title: 'Director – M/s Next Gen Trip Pvt. Ltd',
    image: '/images/leaders/vishal rana.jpeg',
    bio: `Dr. Vishal Rana is a visionary entrepreneur and MBBS graduate from Government Medical College, Amritsar. A passionate traveler and innovator, he founded Next Gen Trip to simplify and enrich the global travel experience. Under his leadership, the company has grown into a dynamic, tech-driven platform offering air tickets, hotels, cruises, charters, travel insurance, global eSIMs, JoinMarriages and international internships. Dr. Rana’s mission is to make travel more affordable, meaningful and culturally immersive. His initiatives like JoinMarriages and global training programs reflect a unique vision of travel as a tool for human connection and cultural exchange. By blending innovation with empathy, he is redefining modern travel for a new generation of explorers. With a strong commitment to accessibility, global connectivity and purposeful experiences, Dr. Rana continues to lead Next Gen Trip toward its goal of becoming a truly transformative force in the travel industry.`,
  }
];

export default function OurLeadersPage() {
  const [selectedLeader, setSelectedLeader] = useState(null);

  const closeModal = () => setSelectedLeader(null);

  const handleOverlayClick = (e) => {
    if (e.target.id === 'overlay') closeModal();
  };

  // Optional: prevent background scroll when modal is open
  useEffect(() => {
    if (selectedLeader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedLeader]);

  return (
    <section className=" px-6 bg-gradient-to-b from-white to-gray-100 font-sans">
      <div className="max-w-7xl mx-auto text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#10325a] mb-1">Management Team</h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-base leading-relaxed">
          Meet the distinguished leaders shaping the future of NextGenTrip.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto mb-20">
        {leaders.map((leader, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-xl transition duration-300 cursor-pointer group"
            onClick={() => setSelectedLeader(leader)}
          >
            <div className="flex justify-center mb-3">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#45a183] shadow">
                <Image src={leader.image} alt={leader.name} fill className="object-cover" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-[#10325a]">{leader.name}</h3>
            <p className="text-xs text-[#45a183] mt-1">{leader.title}</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{leader.bio}</p>
            <button
              className="mt-2 text-sm text-[#45a183] font-semibold hover:underline"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent card click from firing
                setSelectedLeader(leader);
              }}
            >
              Read more
            </button>
          </div>
        ))}
      </div>

      {selectedLeader && (
        <div
          id="overlay"
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 px-4 pt-28 pb-10"
        >
         <div className="mx-auto max-w-2xl w-full">
            <div className="bg-white rounded-lg p-6 relative shadow-2xl animate-fadeIn">
              <button
                onClick={closeModal}
                className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#45a183] shadow mb-4">
                  <Image
                    src={selectedLeader.image}
                    alt={selectedLeader.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold text-[#10325a]">{selectedLeader.name}</h2>
                <p className="text-sm text-[#45a183] mb-4">{selectedLeader.title}</p>
                <p className="text-sm text-gray-700 text-justify whitespace-pre-line leading-relaxed">
                  {selectedLeader.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
