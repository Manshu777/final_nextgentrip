'use client';
import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { apilink, storageLink } from "../common";
import Link from "next/link";

const MineHolidayPkgComp = () => {
    const [allpackage, setAllpackage] = useState([]);
    const [loader, setLoader] = useState(true);
    const carouselRef = useRef(null);

    const fetchPackage = async () => {
        try {
            setLoader(true);
            const response = await axios.get(`${apilink}/holidays/top`);
            if (response.data) {
                setAllpackage(response.data);
            }
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchPackage();
    }, []);

    const scroll = useCallback((direction) => {
        const container = carouselRef.current;
        if (container) {
            const scrollAmount = container.offsetWidth * 0.8;
            const scrollLeft = direction === "left"
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    }, []);

    return (
        <div className="max-w-7xl mx-auto my-5 lg:my-10 px-4 py-8">
            <div className="relative">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Top Travel Picks by Next Gen Trip</h2>
                    <p className="text-gray-500">
                        Handpicked escapes to inspire your next getaway.
                    </p>
                </div>

                <div className="relative">
                    {loader ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                        </div>
                    ) : (
                        <div
                            ref={carouselRef}
                            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {allpackage.length > 0 ? (
                                allpackage.map((pkg) => (
                                    <Link key={pkg.id} href={`/holidayspackage/package/${pkg.slug}`} className="flex-none w-[40%]  sm:w-[48%] md:w-[32%] lg:w-[200px] relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                                        <img
                                            src={`${storageLink}/${pkg.banner_image}`}
                                            alt={pkg.title || "Holiday Package"}
                                            className="w-full h-72 object-cover rounded-md"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 rounded-md">
                                            <h3 className="text-white text-lg font-semibold">
                                                {pkg.package_name || "Untitled Package"}
                                            </h3>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full">
                                    No holiday packages available.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Scroll Buttons */}
                    {!loader && allpackage.length > 0 && (
                        <>
                          <div className="">
                          <button
                                onClick={() => scroll("left")}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md z-10"
                                aria-label="Scroll left"
                            >
                                <FiChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md z-10"
                                aria-label="Scroll right"
                            >
                                <FiChevronRight className="w-6 h-6" />
                            </button>
                          </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MineHolidayPkgComp;
