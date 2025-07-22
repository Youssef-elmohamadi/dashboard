import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import { Link, useParams } from "react-router-dom";
import { Category } from "../../../types/Categories";
import LazyImage from "../../common/LazyImage";
import CircleSkeletonSlider from "./CircleSkeletonSlider";

interface CategorySliderProps {
  items?: Category[];
  rtl?: boolean;
}

const CircleSlider: FC<CategorySliderProps> = ({ items, rtl = false }) => {
  const { lang } = useParams();

  if (!items) {
    return (
      <div className="flex gap-4 overflow-x-auto justify-center my-10 px-4">
        <CircleSkeletonSlider />
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={20}
      dir={rtl ? "rtl" : "ltr"}
      breakpoints={{
        1024: { slidesPerView: 5 },
        768: { slidesPerView: 4 },
        640: { slidesPerView: 3 },
        0: { slidesPerView: 2 },
      }}
    >
      {items.map((item, index) => {
        const altText =
          lang === "ar"
            ? `تصنيف تشطيبة ${item.name}`
            : `Tashtiba Category ${item.name}`;

        const shouldEagerLoad = index < 3;

        return (
          <SwiperSlide key={index}>
            <Link
              to={`/category/${item.id}`}
              className="flex flex-col items-center justify-center gap-2 my-10"
            >
              <LazyImage
                src={item.image}
                alt={altText}
                width={120}
                height={120}
                loading={shouldEagerLoad ? "eager" : "lazy"}
                fetchPriority={shouldEagerLoad ? "high" : undefined}
                className="w-[120px] h-[120px] rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <span className="text-center font-medium text-purple-600">
                {item.name}
              </span>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default CircleSlider;
