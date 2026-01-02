// components/skeletons/CircleSkeletonSlider.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const CircleSkeletonSlider: React.FC = () => {
  return (
    <Swiper
      spaceBetween={16}
      slidesPerView="auto"
      className="my-10 px-4"
    >
      {[...Array(5)].map((_, i) => (
        <SwiperSlide
          key={i}
          style={{ width: "auto" }}
          className="!w-auto"
        >
          <div className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] bg-gray-200 animate-pulse rounded-full" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CircleSkeletonSlider;
