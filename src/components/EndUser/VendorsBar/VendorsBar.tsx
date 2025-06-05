// components/VendorsCarousel.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { useHomeData } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
type Vendor = {
  id: string | number;
  name: string;
  description: string;
  logo: string;
};
const VendorsCarousel = () => {
  const { data: homeData, isLoading: isHomeLoading } = useHomeData();
  const vendors = homeData?.vendors;
  return (
    <section dir="rtl" className="py-16">
      <div className="min-h-[300px] ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Best Vendors
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
          {vendors?.map((vendor: Vendor) => (
            <SwiperSlide key={vendor.id}>
              <div className="group bg-white dark:bg-gray-900 rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-between text-center transition-transform duration-300 hover:scale-105 border border-gray-200">
                {/* Logo */}
                <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  <img
                    src={vendor.logo || "/images/apple.jpg"}
                    alt={vendor.name}
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
