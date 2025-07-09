import React from "react";
import Image from "next/image";

const leaders = [
  {
  name: "Dr. Vishal Rana",
  title: "Director – M/s Next Gen Trip Pvt. Ltd",
  image: "/images/leaders/vishal rana.jpeg",
  bio: "Dr. Vishal Rana is the visionary Founder of Next Gen Trip Pvt. Ltd., a tech-driven travel platform transforming global travel experiences. An MBBS graduate from Government Medical College, Amritsar, and a passionate traveler, he is dedicated to making travel simpler, affordable, and meaningful. Under his leadership, Next Gen Trip has evolved into a holistic lifestyle and cultural exchange ecosystem, redefining modern travel for a new generation of explorers."
}
,
  {
    name: "Ms. Geeta Sachdeva",
    title: "Advisor  – M/s Next Gen Trip Pvt. Ltd.",
    image: "/images/leaders/geeta sachdeva.jpeg",
    bio: "Ms. Geeta Sachdeva is a seasoned HR leader with decades of experience in talent development, workforce transformation, and leadership mentoring. She has held key roles at Indo Rama, Gate India Ltd., and Morepen Laboratories Ltd. At NextGenTrip, she provides strategic guidance on people-first leadership, ethical governance, and sustainable growth, helping shape a resilient organizational culture rooted in values and innovation."
  },
 {
  name: "Dr. J.C. Jhuraney",
  title: "Strategic Advisor – Leadership & Organizational Excellence",
  image: "/images/leaders/jhauraneysahab (1).webp",
  bio: "Dr. J.C. Jhuraney is a seasoned leader and Strategic Advisor at NextGenTrip Pvt. Ltd., guiding the company’s leadership and people strategy. With decades of experience in leadership development and organizational transformation, he empowers the team with insights in executive coaching, leadership excellence, and people-first growth. His vision helps shape NextGenTrip’s culture of innovation and ethical leadership."
}
];



export default function OurLeadersPage() {
  return (
    <section className="py-4 px-6 bg-gradient-to-b from-white to-gray-100 font-sans">
      <div className="max-w-7xl mx-auto text-center mb-4">
        <h1 className="text-4xl font-bold text-[#10325a] mb-4 tracking-tight">
          Management Team
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-base leading-relaxed">
          Meet the distinguished leaders shaping the future of NextGenTrip with expertise, vision, and a shared commitment to ethical innovation.
        </p>
      </div>

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {leaders.map((leader, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="relative w-44 h-44 mx-auto mb-5 rounded-full overflow-hidden border-4 border-[#45a183] shadow-md group-hover:border-[#10325a]">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                className="object-cover"
                sizes="112px"
                priority
              />
            </div>
            <h3 className="text-lg font-semibold text-[#10325a] mb-1 group-hover:text-[#45a183] transition-colors">
              {leader.name}
            </h3>
            <p className="text-sm font-medium text-[#45a183] mb-3 uppercase tracking-wider">
              {leader.title}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {leader.bio}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
