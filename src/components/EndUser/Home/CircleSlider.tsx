import { FC, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import { Link, useParams } from "react-router-dom";
import { Category } from "../../../types/Categories";
import LazyImage from "../../common/LazyImage";
import CircleSkeletonSlider from "./CircleSkeletonSlider";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

interface CategorySliderProps {
  items: Category[];
  loading?: boolean;
}

const CircleSlider: FC<CategorySliderProps> = ({ items, loading }) => {
  const { lang } = useParams();
  const { dir } = useDirectionAndLanguage();

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto justify-center my-10 px-4">
        <CircleSkeletonSlider />
      </div>
    );
  }

  return (
 <div className="w-full h-52">
      <Swiper
      spaceBetween={20}
      dir={dir}
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

        const shouldEagerLoad = index < 2;

        return (
          <SwiperSlide key={index}>
            <Link
              to={`/${lang}/category/${item.id}`}
              className="flex flex-col items-center justify-center gap-2 my-10"
            >
              <LazyImage
                src={item.image}
                alt={altText}
                width={120}
                height={120}
                loading={shouldEagerLoad ? "eager" : "lazy"}
                fetchPriority={shouldEagerLoad ? "high" : "low"}
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
 </div>
  );
};

export default memo(CircleSlider);
