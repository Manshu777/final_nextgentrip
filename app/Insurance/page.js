import InsuranceHeader from "../Component/AllComponent/InsuranceHeader";

export default function InsurancePage() {
  const insuranceServices = [
    {
      title: "Health Insurance",
      description:
        "Comprehensive coverage for medical expenses, including doctor visits, hospital stays, and prescriptions.",
      icon: "🩺",
    },

    {
      title: "Travel Insurance",
      description:
        "Comprehensive travel protection covering trip cancellations, medical emergencies, and lost baggage.",
      icon: "✈️",
    },
  ];

  const benefits = [
    {
      title: "Comprehensive Coverage",
      description:
        "We offer a wide range of coverage options for health, life, auto, and property insurance. With our comprehensive plans, you can ensure that you and your family are always protected.",
      points: [
        "Health insurance for medical expenses",
        "Life insurance for financial security",
        "Auto insurance for vehicle protection",
        "Property insurance for home and valuables",
      ],
    },
    {
      title: "Affordable Premiums",
      description:
        "Our insurance plans are designed to be cost-effective while offering maximum coverage. We provide flexible plans that can fit into any budget without compromising quality.",
      points: [
        "Tailored plans that suit your budget",
        "Discounts for bundling multiple policies",
        "Flexible payment options",
      ],
    },
    {
      title: "24/7 Customer Support",
      description:
        "We understand that insurance can sometimes be complex. That's why our dedicated support team is available 24/7 to help you with any questions or claims process.",
      points: [
        "Assistance with policy management",
        "Help with claims processing",
        "Answers to your coverage-related questions",
      ],
    },
    {
      title: "Tailored Plans",
      description:
        "No two individuals or families are alike. We offer customized insurance solutions to meet your specific needs, whether for individuals, families, or businesses.",
      points: [
        "Personalized coverage options",
        "Adjustable policy terms",
        "Support for a wide range of needs",
      ],
    },
    {
      title: "Quick and Easy Claims",
      description:
        "In the event of a claim, we ensure a fast and straightforward process. Our goal is to get you the compensation you need without unnecessary delays.",
      points: [
        "Simple claim submission process",
        "Fast claim approval and payout",
        "Dedicated claims assistance",
      ],
    },
  ];

  return (
    <>
      <head>
        <title>NextGenTrip – Your Trusted Travel Insurance Partner</title>
        <meta
          name="description"
          content="Protect your journey with NextGenTrip Travel Insurance. Get coverage for medical emergencies, trip cancellations, lost baggage, and more—travel worry-free."
        />
      </head>

      <div className="">
        <InsuranceHeader />
      </div>

      <main>
        <section
          style={{ backgroundImage: "url('/images/insurance.webp')" }}
          className="min-h-[80vh] py-10 flex items-center relative bg-center bg-cover text-white px-5 md:px-16 xl:px-32"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-0"></div>
          <div className="z-20 text-white  text-center space-y-5  w-full h-full">
            <h4 className="text-3xl font-bold">
              Protecting Your Today, Securing Your Tomorrow
            </h4>
            <p className="text-white">
              Insurance is more than just a policy; it’s a safety net that
              provides financial protection against unexpected events. At [Your
              Company Name], we offer a variety of insurance solutions tailored
              to meet your needs, from health and life insurance to vehicle and
              property coverage. Life is unpredictable, and with the right
              insurance coverage, you can ensure that you and your loved ones
              are protected no matter what comes your way. Our goal is to make
              insurance simple, affordable, and accessible, providing you with
              the peace of mind that comes from knowing you're covered during
              life's uncertainties.
            </p>
          </div>
        </section>
        <section className="bg-gray-50 text-gray-800 font-sans px-5 md:px-16 xl:px-32">
          <section className="py-4">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-4">
                Our Insurance Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {insuranceServices.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg p-6 border border-gray-200"
                  >
                    <div className="text-4xl mb-4 text-blue-600">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">{service.description}</p>
                    <button className="mt-4 bg-[#10325a] text-white px-4 py-2 rounded-lg hover:bg-[#45a183]">
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
        <section className="bg-gray-100 py-4 px-5 md:px-16 xl:px-32">
          <div className="container   ">
            <h2 className="text-3xl  text-center font-bold text-[#10325a] mb-8">
              Why Choose Our Insurance Services?
            </h2>
            <p className="text-base md:text-xl text-gray-600 mb-4 text-center">
              Our insurance services are designed to provide you with
              comprehensive coverage, peace of mind, and financial protection
              against unexpected events.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="mb-2 bg-slate-100 shadow-lg px-5 rounded-md py-2"
                >
                  <h3 className="text-2xl font-semibold text-[#10325a] mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {benefit.description}
                  </p>
                  <ul className="list-disc list-inside text-left text-gray-600">
                    {benefit.points.map((point, i) => (
                      <li key={i} className="mb-2">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
