import { FC, memo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import { Link, useParams } from "react-router-dom";
import { Category } from "../../../types/Categories";
import LazyImage from "../../common/LazyImage";
import CircleSkeletonSlider from "./CircleSkeletonSlider";
interface CategorySliderProps {
  items: Category[];
  loading?: boolean;
}

const CircleSlider: FC<CategorySliderProps> = ({ items, loading }) => {
  const { lang } = useParams();
  const swiperRef = useRef<any>(null);
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto justify-center my-10 px-4 h-[225px]">
        <CircleSkeletonSlider />
      </div>
    );
  }

  return (
    <div className="w-full h-[225px]">
      <Swiper
        key={lang}
        dir={lang === "ar" ? "rtl" : "ltr"}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
          swiper.changeLanguageDirection(lang === "ar" ? "rtl" : "ltr");
        }}
        spaceBetween={20}
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
              ? `تصنيف تشطيبة ${item.name_ar}`
              : `Tashtiba Category ${item.name_en}`;

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
                <span className="text-center font-medium end-user-text-base">
                  {item[`name_${lang}`]}
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
