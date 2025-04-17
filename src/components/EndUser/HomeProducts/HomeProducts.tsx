import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "./customSwiper.css";

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
          navigation
          modules={[Navigation]}
          breakpoints={{
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <img
                    className="p-8 rounded-t-lg object-contain h-48 w-full"
                    src={product.image || "/images/def.webp"}
                    alt={product.title}
                  />
                </a>
                <div className="px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {product.title}
                    </h5>
                  </a>
                  <div className="flex items-center mt-2.5 mb-5">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      {/* 4 نجوم من 5 + نجمة رمادية */}
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                      <svg
                        className="w-4 h-4 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    </div>
                    {product.rating && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
                        {product.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {product.price} EGP
                    </span>
                    <a
                      href="#"
                      className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
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
