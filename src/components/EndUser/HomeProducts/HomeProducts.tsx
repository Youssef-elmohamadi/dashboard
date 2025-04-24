import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import ProductCard from "../ProductCard/ProductCard";

type Product = {
  id: number | string;
  title: string;
  images: [];
  price: number;
  rating?: number;
};

interface CategorySliderProps {
  title: string;
  viewAllLink?: string;
  products: Product[];
}

const HomeProducts: React.FC<CategorySliderProps> = ({
  title,
  viewAllLink,
  products,
}) => {
  return (
    <>
      {products && products.length > 0 && (
        <div className="mb-10 px-4 my-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {title}
            </h2>
            <Link to="/" className="text-sm text-purple-600 hover:underline">
              Show All
            </Link>
          </div>

          <Swiper
            spaceBetween={15}
            slidesPerView={2.2}
            breakpoints={{
              1024: { slidesPerView: 4 },
              768: { slidesPerView: 3 },
              640: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default HomeProducts;
