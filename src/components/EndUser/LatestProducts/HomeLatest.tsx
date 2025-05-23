import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";

type Product = {
  id: number | string;
  title: string;
  images: [];
  price: number;
  rating?: number;
};

interface CategorySliderProps {
  title: string;
  products: Product[];
}

const LatestProducts: React.FC<CategorySliderProps> = ({ title, products }) => {
  const { t } = useTranslation(["EndUserHome"]);

  return (
    <>
      {products && products.length > 0 && (
        <div className="mb-10 px-4 my-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {title}
            </h2>
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
            {products?.map((product) => (
              <SwiperSlide key={product?.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default LatestProducts;
