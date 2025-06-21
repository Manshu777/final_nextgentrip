"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { apilink, storageLink } from "../../../Component/common";
import { FaAngleRight, FaRegStar, FaStar, FaRegCheckCircle } from "react-icons/fa";
import { IoTerminalOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Swal from "sweetalert2";

const PackageSlugCompo = ({ slug }) => {
  const [packageInfo, setPackageInfo] = useState(null);
  const [formData, setFormData] = useState({
    holiday_name: "",
    username: "",
    email: "",
    phone_number: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch package data
  useEffect(() => {
    const fetchapi = async () => {
      try {
        const res = await axios.get(`${apilink}/holidays-package/${slug}`);
        setPackageInfo(res.data);
        // Set holiday_name in formData when packageInfo is loaded
        setFormData((prev) => ({
          ...prev,
          holiday_name: res.data?.package_name || res.data?.title || "",
        }));
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch package details",
          confirmButtonColor: "#FF2E4A",
        });
      }
    };
    fetchapi();
  }, [slug]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.holiday_name.trim()) errors.holiday_name = "Holiday name is required";
    if (!formData.username.trim()) errors.username = "Full Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone_number.trim()) {
      errors.phone_number = "Mobile Number is required";
    } else if (!/^\+?\d{10,15}$/.test(formData.phone_number)) {
      errors.phone_number = "Invalid phone number (10-15 digits, optional +)";
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
          `${apilink}/book-holiday`,
        formData
      );
      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Thank You!",
          text: "Your booking has been submitted successfully. We'll contact you soon.",
          confirmButtonColor: "#FF2E4A",
        });
        // Reset form
        setFormData({
          holiday_name: packageInfo?.package_name || packageInfo?.title || "",
          username: "",
          email: "",
          phone_number: "",
          message: "",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit booking. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#FF2E4A",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("packageInfo", packageInfo);
  console.log("formData", formData);

  return (
    <>
      {packageInfo && (
        <>
          <section>
            <div className="rows inner_banner bg-gray-100 relative">
              <div className="absolute top-0 left-0 h-full w-full bg-[#0000005c] z-10"></div>
              <img
                src={`${storageLink}/${packageInfo.banner_image}`}
                alt=""
                className="w-full h-[25rem] bg-cover"
              />
              <div className="container flex justify-center items-center absolute top-0 left-0 h-full w-full z-20">
                <div className="spe-title text-center py-8">
                  <h2 className="text-4xl font-bold text-[#FF2E4A]">
                    {packageInfo.country.toUpperCase()} &{" "}
                    {packageInfo.city.toUpperCase()}{" "}
                    <span className="text-white">
                      {" "}
                      {packageInfo.package_Type.toUpperCase()} PACKAGE
                    </span>
                  </h2>
                  <div className="title-line flex justify-center items-center space-x-1 mt-4">
                    <div className="w-4 h-1 bg-gray-400"></div>
                    |<div className="w-6 h-1 bg-gray-600"></div>
                    <div className="w-8 h-1 bg-gray-800"></div>
                  </div>
                  <p className="text-white mt-4">
                    World's leading Hotel Booking website, Over 30,000 Hotel rooms
                    worldwide.
                  </p>
                  <ul className="flex justify-center items-center mt-4 space-x-2 text-white">
                    <li>
                      <a href="/main" className="">
                        Home
                      </a>
                    </li>
                    <li>
                      <FaAngleRight />
                    </li>
                    <li>
                      <a href="#" className="font-bold">
                        {packageInfo.city.toUpperCase()}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:mx-24 my-3 grid lg:grid-cols-3 gap-2 shadow-lg rounded-md px-[1vw] md:p-3">
            <div className=" h-auto static lg:h-[800px] lg:sticky lg:top-0 lg:col-span-2">
              <div className="flex items-center gap-1">
                <h2 className="text-3xl font-bold text-[#372326] my-5">
                  The Best of {packageInfo.country} & {packageInfo.city}{" "}
                  <span className="">{packageInfo.package_Type} Package</span>
                </h2>
                {Array.from({ length: 5 }, (_, i) =>
                  packageInfo.rating >= i + 1 ? (
                    <FaStar key={i} className="text-orange-500 text-2xl" />
                  ) : (
                    <FaRegStar key={i} className="text-2xl text-orange-500" />
                  )
                )}
              </div>

              <div>
                <p className="my-2 text-xl font-bold">Description</p>
                <div
                  dangerouslySetInnerHTML={{ __html: packageInfo.des }}
                ></div>
              </div>

              <p className="my-4 mt-8 text-xl font-bold">Photo Gallery</p>
              <div className="h-[26rem]">
                <Swiper
                  navigation={true}
                  modules={[Navigation]}
                  loop={true}
                  className="w-[98vw] lg:w-full h-full"
                >
                  {packageInfo.images.map((imginfo, imgindex) => (
                    <SwiperSlide className="" key={imgindex}>
                      <img
                        src={`${storageLink}/${imginfo}`}
                        alt=""
                        className="w-full h-full bg-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
        

            </div>

            <div className="px-1 py-8">
              <div className="border my-4">
                <div className="text-center bg-[#253D52] text-white py-1">
                  Book Now
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                  <div className="flex flex-col gap-1 my-3">
                    <label htmlFor="holiday_name">Holiday Name</label>
                    <input
                      type="text"
                      name="holiday_name"
                      id="holiday_name"
                      className={`border p-2 rounded-md ${
                        formErrors.holiday_name ? "border-red-500" : ""
                      }`}
                      value={formData.holiday_name}
                      onChange={handleInputChange}
                      disabled
                    />
                    {formErrors.holiday_name && (
                      <p className="text-red-500 text-sm">{formErrors.holiday_name}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 my-3">
                    <label htmlFor="username">Full Name</label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Enter your full name"
                      className={`border p-2 rounded-md ${
                        formErrors.username ? "border-red-500" : ""
                      }`}
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {formErrors.username && (
                      <p className="text-red-500 text-sm">{formErrors.username}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 my-3">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your Email"
                      className={`border p-2 rounded-md ${
                        formErrors.email ? "border-red-500" : ""
                      }`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm">{formErrors.email}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 my-3">
                    <label htmlFor="phone_number">Mobile Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      id="phone_number"
                      placeholder="Enter your Mobile Number"
                      className={`border p-2 rounded-md ${
                        formErrors.phone_number ? "border-red-500" : ""
                      }`}
                      value={formData.phone_number}
                      onChange={handleInputChange}
                    />
                    {formErrors.phone_number && (
                      <p className="text-red-500 text-sm">{formErrors.phone_number}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 my-3">
                    <label htmlFor="message">Message (Optional)</label>
                    <textarea
                      name="message"
                      id="message"
                      placeholder="Any special requests?"
                      className="border p-2 rounded-md"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="text-center my-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`p-2 px-4 rounded-md text-white font-semibold ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700"
                      }`}
                    >
                      {isSubmitting ? "Submitting..." : "Send"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="border my-14">
                <div className="text-center bg-[#253D52] text-white py-1">
                  Trip Information
                </div>
                <div className="flex items-center gap-3 ps-3 my-3">
                  <FaRegCheckCircle className="text-blue-500" />
                  <p>Location</p>:
                  <p>
                    {packageInfo.country},{packageInfo.city}.
                  </p>
                </div>
                <div className="flex items-center gap-3 ps-3 my-3">
                  <FaRegCheckCircle className="text-blue-500" />
                  <p>Duration</p>:
                  <p>
                    {packageInfo.duration - 1}/Night - {packageInfo.duration}/Days.
                  </p>
 Complexes
                </div>
                <div className="flex items-center gap-3 ps-3 my-3">
                  <FaRegCheckCircle className="text-blue-500" />
                  <p>Package Type</p>:
                  <p>{packageInfo.package_Type} Package.</p>
                </div>
                <div className="flex items-center gap-3 ps-3 my-3">
                  <FaRegCheckCircle className="text-blue-500" />
                  <p>Price</p>:<p>₹ {packageInfo.price}.</p>
                </div>
              </div>

              <div className="border my-14">
                <div className="text-center bg-[#253D52] text-white py-1">
                  Terms & Conditions
                </div>
                {packageInfo.terms.map((terms, termsindex) => (
                  <div
                    key={termsindex}
                    className="flex items-center gap-2 p-2"
                  >
                    <IoTerminalOutline className="text-green-600" />{" "}
                    {terms.terms}
                  </div>
                ))}
              </div>

              <div className="border my-4">
                <div className="text-center bg-[#253D52] text-white py-1">
                  Activities
                </div>
                {packageInfo.activities?.map((activity, index) => (
                  <div key={index} className="flex flex-col gap-2 p-2">
                    <p>Day: {activity.day}</p>
                    <p>Activity: {activity.activity}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default PackageSlugCompo;