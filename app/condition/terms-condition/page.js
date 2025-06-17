import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const TermsAndConditions = () => {
  return (
    <>
      <head>
        <title>
          NextGenTrip User Terms – Safe & Secure Travel Bookings
        </title>
        <meta name="description" content="By using NextGenTrip, you agree to our Terms & Conditions, including Razorpay payment policies. Learn about service usage, booking policies, cancellations, and user obligations." />
      </head>

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Agreement between Clients & NextGenTrip</h2>
          <p>
            By accessing, browsing, or booking through NextGenTrip, you agree to these Terms and Conditions, including Razorpay’s payment terms, 
            any additional guidelines, and future updates. NextGenTrip acts as a travel agent facilitating bookings for travel services.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Pricing & Inclusions</h2>
          <p>
            Prices displayed on NextGenTrip include accommodation, applicable taxes (unless stated otherwise), and, in some cases, meals. 
            Personal expenses, such as telephone calls, minibar charges, or optional activities, are not included unless specified.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Payment Terms & Razorpay Policies</h2>
          <p>
            All payments on NextGenTrip are processed securely through Razorpay. By making a payment, you agree to Razorpay’s{" "}
            <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Privacy Policy
            </a>.
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>Supported payment methods include Credit/Debit Cards (Visa, MasterCard, Amex, RuPay), Net Banking, UPI (Google Pay, PhonePe, Paytm, etc.), and Wallets.</li>
            <li>EMI options are available through select banks, subject to Razorpay’s terms.</li>
            <li>All transactions are in Indian Rupees (INR) unless otherwise specified.</li>
            <li>Refunds, if applicable, are processed as per NextGenTrip’s refund policy and Razorpay’s processing timelines.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Service Rules</h2>
          <p>
            Travel services booked through NextGenTrip are subject to the terms and conditions of the respective service providers 
            (e.g., hotels, airlines, tour operators). Review these rules before confirming your booking.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Visa & Travel Documentation</h2>
          <p>
            You are responsible for obtaining valid visas and travel documents for your destination or transit countries. 
            NextGenTrip is not liable for visa rejections or related booking cancellations, and no refunds will be issued in such cases.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Data Security</h2>
          <p>
            Payments processed via Razorpay are encrypted for security. However, internet communications may not be entirely secure. 
            NextGenTrip and Razorpay are not liable for unauthorized interception of data transmitted to or from the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
          <p>
            All content on NextGenTrip, including text, images, and logos, is the property of NextGenTrip or its partners. 
            Unauthorized use of this content or trademarks is prohibited and may result in legal action.
          </p>
        </section>

      
      </div>
    </>
  );
};

export default TermsAndConditions;