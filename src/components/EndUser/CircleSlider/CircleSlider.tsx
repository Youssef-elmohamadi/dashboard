import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import { Link } from "react-router-dom";
interface CategoryItem {
  id: string;
  image: string;
  name: string;
  link: string;
}

interface CategorySliderProps {
  items: CategoryItem[];
  rtl?: boolean;
}

const CircleSlider: FC<CategorySliderProps> = ({ items, rtl = false }) => {
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
      {items?.map((item, index) => (
        <SwiperSlide key={index}>
          <Link
            to={`category/${item.id}`}
            className="flex flex-col items-center gap-2 my-10 "
          >
            <img
              src={item.image || "images/default-avatar.jpg"}
              alt={item.name}
              className="w-30 h-30 rounded-full object-cover"
            />
            <span className="text-center font-medium text-purple-600">
              <div>{item.name}</div>
            </span>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CircleSlider;
