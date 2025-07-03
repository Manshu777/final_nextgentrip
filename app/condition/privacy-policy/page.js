import Image from "next/image";
import Link from "next/link";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <>
      <head>
        <title>
          NextGenTrip Privacy Policy – Your Data, Our Priority
        </title>
        <meta name="description" content="Learn how NextGenTrip, in partnership with Razorpay, collects, uses, and protects your personal data. Understand our privacy practices for secure travel bookings." />
      </head>

      <section className="bg-gray-50 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex justify-center">
              <span className="flex px-4 py-2 font-semibold rounded-full bg-[#3b82f6] text-white items-center justify-center">
                <img className="mr-2.5" src="/images/earth.svg" alt="NextGenTrip" />
                AGREEMENT
              </span>
            </div>
            <h2 className="mt-4 mb-4 text-4xl font-bold">Privacy Policy</h2>
            <p className="text-xl font-medium text-neutral-1000 fadeInUp" style={{ visibility: "visible" }}>
              Last update: June 17, 2025
            </p>
          </div>
          
          <div className="flex justify-center my-5">
            <img className="mr-2.5" src="/images/banner-privacy.webp" alt="NextGenTrip" />
          </div>
          
          <div className="mx-auto mt-10 text-justify max-w-6xl px-3">
            <div className="box-detail-info">
              <p>
                NextGenTrip is committed to safeguarding your privacy. This Privacy Policy outlines how we, along with our payment partner Razorpay, 
                collect, use, and protect your personal information when you interact with our services via our website, mobile app, or offline channels 
                (collectively, "Sales Channels"). By using our services, you consent to this policy. If you do not agree, please refrain from using our Sales Channels.
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">Information Collection</h3>
              <p>
                We collect personal information such as your name, contact details, travel preferences, and payment information to facilitate your bookings. 
                For travel-related services, we may also collect passport details, PAN information, or vaccination status as required. Razorpay collects payment-related 
                data (e.g., card details, UPI IDs) as per their{" "}
                <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Privacy Policy
                </a>. This data is shared with service providers like airlines, hotels, or tour operators to complete your reservations.
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">Usage of Information</h3>
              <p>
                Your data is used to process bookings, manage payments via Razorpay, improve our services, and meet legal requirements. We may use your email or mobile number 
                to send promotional offers, such as discounts or travel deals. You can opt out of these communications at any time through the provided unsubscribe options.
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">Membership & Registration</h3>
              <p>
                When you register with NextGenTrip, we collect details like your name, email, address, and password to enable:
                <ul className="list-disc pl-5 mt-2">
                  <li>Personalized user accounts</li>
                  <li>Seamless travel bookings</li>
                  <li>Customer support services</li>
                  <li>New member verification</li>
                  <li>Service enhancements</li>
                </ul>
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">Surveys</h3>
              <p>
                We may conduct optional surveys to gather feedback and improve our offerings. Your responses are anonymous unless explicitly stated otherwise.
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">Cookies & Tracking</h3>
              <p>
                NextGenTrip and Razorpay use cookies to enhance user experiences, enable seamless logins, and deliver personalized ads. You can manage cookie preferences 
                through your browser settings. For details on Razorpay’s use of cookies, refer to their{" "}
                <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Privacy Policy
                </a>.
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">Automatic Logging</h3>
              <p>
                Our systems log data such as IP addresses, browser types, and session activities to optimize user experience and troubleshoot issues.
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">User-Generated Content</h3>
              <p>
                Reviews, ratings, or questions you post about our services may be publicly visible on our platforms or shared with partners for promotional purposes.
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">Data Sharing & Disclosure</h3>
              <p>
                We share your data with service providers (e.g., airlines, hotels) to fulfill bookings and with Razorpay for payment processing. We may share anonymized, 
                aggregated data with partners for analytics or marketing. Personal data is not sold or rented but may be disclosed to comply with legal obligations.
              </p>
              
              <h3 className="mt-6 text-2xl font-semibold">Security & Data Protection</h3>
              <p>
                NextGenTrip employs industry-standard security measures to protect your data. Razorpay handles payment data securely, and we do not store sensitive financial 
                information like card details. For more on Razorpay’s security practices, see their{" "}
                <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Privacy Policy
                </a>.
              </p>
              
              <h6 className="mt-6 text-lg font-semibold">Thank you for trusting NextGenTrip!</h6>
              <p>
                By using our services, you agree to this Privacy Policy and Razorpay’s associated terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;