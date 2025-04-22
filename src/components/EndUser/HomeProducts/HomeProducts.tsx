import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "./customSwiper.css";
import ProductCard from "../ProductCard/ProductCard";

type Product = {
  id: number | string;
  title: string;
  image: string;
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
    <div className="mb-10 px-4 my-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          {title}
        </h2>
        <Link to="/" className="text-sm text-purple-600 hover:underline">
          Show All
        </Link>
      </div>

      {products && products.length > 0 ? (
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
              <ProductCard
                image={product.image}
                title={product.name || "/images/logo.png"}
                price={product.price}
                rating={product.rating || 0}
                id={product.id}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center p-6 h-80">
          <img
            src="/images/no-found.png"
            alt="No products"
            className="w-24 h-24 mb-4"
          />
          <p className="text-gray-500 dark:text-gray-300 text-center text-lg">
            No Products Found
          </p>
        </div>
      )}
    </div>
  );
};

export default HomeProducts;
