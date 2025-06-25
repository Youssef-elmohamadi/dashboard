// components/VendorsCarousel.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { useHomeData } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LazyImage from "../../common/LazyImage";
import { Vendor } from "../../../types/Home";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const VendorsCarousel = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const { lang } = useDirectionAndLanguage();
  const { data: homeData, isLoading } = useHomeData();
  const vendors = homeData?.vendors;

  const loadingAltText =
    lang === "ar" ? "جاري تحميل البائعين المميزين" : "Loading best vendors...";

  if (isLoading) {
    return (
      <section dir="rtl" className="py-16">
        <div className="enduser_container flex flex-col items-center justify-center px-4 py-10 text-gray-500 min-h-[30vh]">
          <LazyImage
            src="/images/vendor-placeholder.jpg"
            alt={loadingAltText}
            className="w-24 h-24 mb-4 animate-pulse mx-auto"
          />
          <span className="text-base">{t("loading", "Loading...")}</span>
        </div>
      </section>
    );
  }

  if (!vendors || vendors.length === 0) return null;

  return (
    <section dir="rtl" className="py-16">
      <div className="min-h-[300px] enduser_container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {t("vendorsCarousel.bestVendors", "Best Vendors")}
          </h2>
        </div>
        <Swiper
          spaceBetween={24}
          slidesPerView={1.2}
          loop
          autoplay={{ delay: 2500 }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
          }}
        >
          {vendors.map((vendor: Vendor) => (
            <SwiperSlide key={vendor.id}>
              <div className="group bg-white dark:bg-gray-900 rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-between text-center transition-transform duration-300 hover:scale-105 border border-gray-200">
                {/* Logo */}
                <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  <LazyImage
                    src={vendor.logo || "/images/apple.jpg"}
                    alt={
                      lang === "ar"
                        ? `شعار ${vendor.name}`
                        : `Logo of ${vendor.name}`
                    }
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {vendor.name}
                </h3>

                {/* Description */}
                {vendor.description && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                    {vendor.description}
                  </p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default VendorsCarousel;
