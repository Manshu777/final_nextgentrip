'use client';
import React from 'react';
import Image from 'next/image';

const leaders = [
  {
    name: 'Ms. Geeta Sachdeva',
    title: 'Director – M/s Next Gen Trip Pvt. Ltd',
    image: '/images/leaders/geeta sachdeva.jpeg',
    bio: 'Ms. Geeta Sachdeva, Director at NextGenTrip.com, is a dynamic HR leader with over 40 years of experience across top Indian and multinational organizations. A graduate of Himachal Pradesh University and a postgraduate in PM&IR, she is also the founder of Integrated HR Solutions, a strategic HR advisory firm. She has held senior roles at Gates India, Gontermann-Peipers (ISPAT Group) and Gabriel (Anand Group), leading initiatives in TPM, Six Sigma, Gemba Kaizen and Balance Scorecard PMS. Her collaborations with Ernst & Young, IBM and Kaizen Institute have shaped her global HR perspective. As Advisor-HR to Morepen Labs and an active member of CII and ISTD, she contributes significantly to the HR community. A certified Six Sigma Black Belt, she brings expertise in talent development, strategic HR transformation and performance management—driving a people-first and performance-oriented culture at NextGenTrip.com.',
  },
  {
    name: 'Mr. Harjeet Singh Rana',
    title: 'Director – M/s Next Gen Trip Pvt. Ltd.',
    image: '/images/leaders/harjeetphoto.jpg',
    bio: 'Mr. Harjeet Singh Rana, B.A., LL.B., PG-HR & IR, MBA (Opn.), is a dynamic HR leader with over three decades of experience across top corporates including Winsome Group, Hero Cycles, Pidilite Industries, Murugappa Group and Eicher Motors. Known for transforming people practices and building inclusive, high-performance cultures, he has led HR functions across diverse sectors and geographies. As the visionary Founder of NextGenTrip.com, he is now revolutionizing the travel industry with a tech-driven platform offering Flights, Hotels, Holidays, Buses, Cabs, eSIMs, Cruises, Charters, Insurance, Join Marriages, Visas and International Internship Trainings. His mission is to make NextGenTrip a global favorite, blending innovation with trust to deliver a world-class travel experience.',
  },
  {
    name: 'Dr. Vishal Rana',
    title: 'Director – M/s Next Gen Trip Pvt. Ltd',
    image: '/images/leaders/vishal rana.jpeg',
    bio: 'Dr. Vishal Rana, Director at M/s Next Gen Trip Pvt. Ltd., is a visionary entrepreneur and MBBS graduate from Government Medical College, Amritsar. A passionate traveler and innovator, he founded Next Gen Trip to simplify and enrich the global travel experience. Under his leadership, the company has grown into a dynamic, tech-driven platform offering air tickets, hotels, cruises, charters, travel insurance, global eSIMs, JoinMarriages and international internships. Dr. Rana’s mission is to make travel more affordable, meaningful and culturally immersive. His initiatives like JoinMarriages and global training programs reflect a unique vision of travel as a tool for human connection and cultural exchange. By blending innovation with empathy, he is redefining modern travel for a new generation of explorers. With a strong commitment to accessibility, global connectivity and purposeful experiences, Dr. Rana continues to lead Next Gen Trip toward its goal of becoming a truly transformative force in the travel industry.',
  },
  {
  name: 'Dr. J.C. Jhuraney',
  title: 'Advisor – M/s Next Gen Trip Pvt. Ltd.',
  image: '/images/leaders/jhauraneysahab (1).webp',
  bio: 'Dr. J.C. Jhuraney – Advisor, M/s Next Gen Trip Pvt. Ltd., bringing with him decades of Leadership in Human Resource Strategy, Organizational Development and Executive Coaching. With a distinguished background, he held the position of Senior Vice President – HR at Samtel Group, followed by his impactful role as Whole-Time Director & CHRO with Omax Group, where he championed people-centric transformation and corporate governance. Beyond the corporate arena, Dr. Jhuraney has played pivotal roles in key industry bodies, having served as Chairman of the HR & IR Committee of CII (Northern Region) and Vice President of the Delhi Management Association (DMA). These positions underscore his commitment to elevating HR practices and leadership standards across industries. Renowned for his deep insights into Leadership Mentoring, Talent Engagement and Building High-Performance Cultures, Dr. Jhuraney guides NextGenTrip\'s people, culture and business roadmap with a sharp ethical compass and strategic foresight. His guidance is instrumental in nurturing a value-driven, inclusive and innovation-led environment as the company scales its presence in the Global Travel Industry.'
}
];

export default function OurLeadersPage() {
  return (
    <section className="py-4 px-6 bg-gradient-to-b from-white to-gray-100 font-sans">
      <div className="max-w-7xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-[#10325a] mb-4 tracking-tight">
          Management Team
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-base leading-relaxed">
          Meet the distinguished leaders shaping the future of NextGenTrip with expertise, vision, and a shared commitment to ethical innovation.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 max-w-6xl mx-auto">
        {leaders.map((leader, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative w-40 h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-[#45a183] shadow-md">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                className="object-cover"
                sizes="160px"
                priority
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 text-left flex-1">
              <h3 className="text-xl font-semibold text-[#10325a] mb-1">
                {leader.name}
              </h3>
              <p className="text-sm font-medium text-[#45a183] mb-2 tracking-wider">
                {leader.title}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                {leader.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
