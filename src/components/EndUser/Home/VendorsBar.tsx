// components/VendorsCarousel.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Import Autoplay module
import { useHomeData } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LazyImage from "../../common/LazyImage";
import { Vendor } from "../../../types/Home";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import React from "react";

// Install Swiper modules
// Swiper.use([Autoplay]); // No longer needed this way if using Swiper 9+ and importing directly

const VendorsCarousel = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const { lang } = useDirectionAndLanguage();
  const { data: homeData, isLoading } = useHomeData();
  const vendors = homeData?.vendors;

  const loadingAltText =
    lang === "ar"
      ? "جاري تحميل البائعين المميزين..."
      : "Loading best vendors...";

  if (isLoading) {
    return (
      <section
        dir="rtl"
        className="py-16 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="enduser_container flex flex-col items-center justify-center px-4 py-10 min-h-[30vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-28 h-28 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              {/* Placeholder for image */}
              <svg
                className="w-16 h-16 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="h-4 bg-gray-200  rounded w-48 mb-2"></div>
            <div className="h-3 bg-gray-200  rounded w-32"></div>
            <span className="mt-4 text-base text-gray-500 ">
              {loadingAltText}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (!vendors || vendors.length === 0) return null;

  return (
    <section className="mb-5">
      <div className="enduser_container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {t("bestVendors", "Our Top-Rated Vendors")}
            </h2>
            {/* <p className="text-base text-gray-600 dark:text-gray-300">
              {t(
                "vendorsCarousel.subtitle",
                "Discover quality products from our trusted partners."
              )}
            </p> */}
          </div>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={32}
          slidesPerView={1.2}
          loop
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 24 },
            768: { slidesPerView: 3.2, spaceBetween: 24 },
            1024: { slidesPerView: 4.2, spaceBetween: 32 },
          }}
          className="mySwiper"
        >
          {vendors.map((vendor: Vendor) => (
            <SwiperSlide key={vendor.id}>
              <div
                className="group relative bg-white  rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-between text-center 
                          transition-all duration-500 transform hover:-translate-y-2 hover:shadow-md
                          border border-gray-100  overflow-hidden"
              >
                {/* Background overlay/gradient for visual interest */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 "></div>
                <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
                  {/* Logo */}
                  <div
                    className="w-28 h-28 mb-4 rounded-full bg-purple-100  overflow-hidden 
                                  flex items-center justify-center p-1 border-4 border-white 
                                 transition-all duration-300 group-hover:border-purple-300"
                  >
                    <LazyImage
                      src={vendor.logo || "/images/apple.jpg"} // Placeholder if no logo
                      alt={
                        lang === "ar"
                          ? `شعار ${vendor.name}`
                          : `Logo of ${vendor.name}`
                      }
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900  mb-2">
                    {vendor.name}
                  </h3>

                  {/* Description */}
                  {vendor.description && (
                    <p className="mt-2 text-sm text-gray-600  line-clamp-3 leading-relaxed">
                      {vendor.description}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default React.memo(VendorsCarousel);
