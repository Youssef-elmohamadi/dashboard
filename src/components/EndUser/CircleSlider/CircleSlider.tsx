import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import { Link } from "react-router-dom";
interface CategoryItem {
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
          <a
            href={item.link}
            className="flex flex-col items-center gap-2 my-10 "
          >
            <img
              src={item.image || "images/default-avatar.jpg"}
              alt={item.name}
              className="w-40 h-40 rounded-full object-cover"
            />
            <span className="text-center text-xl font-medium text-purple-600">
              <Link to={`category/${item.id}`}>{item.name}</Link>
            </span>
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CircleSlider;
