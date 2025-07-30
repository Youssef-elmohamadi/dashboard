import React, { Suspense } from "react";
// Swiper imports remain direct as it's a core layout component here.
// If the entire LatestProducts component is lazy-loaded, Swiper will also be lazy-loaded.
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";

// Lazy-load ProductCard component
const LazyProductCard = React.lazy(() => import("../Product/ProductCard"));

import { useHomeData } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { Product } from "../../../types/Product";
import LazyImage from "../../common/LazyImage"; // LazyImage is already handling its own lazy loading
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

interface CategorySliderProps {
  title: string;
}

const LatestProducts: React.FC<CategorySliderProps> = ({ title }) => {
  const { data: homeData, isLoading } = useHomeData();
  const { lang } = useDirectionAndLanguage();

  const loadingAltText =
    lang === "ar" ? "تحميل أحدث المنتجات ..." : "Loading latest products...";

  const products: Product[] | undefined = homeData?.leatestProducts?.map(
    (product: any) => ({
      ...product,
      category_id: String(product.category_id),
    })
  );

  if (isLoading) {
    return (
      <div className="enduser_container flex flex-col items-center justify-center px-4 py-10 text-gray-500 min-h-[50vh]">
        <div className="flex flex-col items-center justify-center w-full h-full">
          {/* LazyImage for the loading state is good here */}
          <LazyImage
            src="images/product/placeholder-image.webp"
            alt={loadingAltText}
            className="w-24 h-24 mb-4 animate-pulse mx-auto"
          />
          <span className="text-base">{loadingAltText}</span>
        </div>
      </div>
    );
  }

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
            {products?.map((product: Product) => (
              <SwiperSlide key={product?.id}>
                {/* Wrap LazyProductCard with Suspense and null fallback */}
                <Suspense fallback={null}>
                  <LazyProductCard product={product} />
                </Suspense>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default React.memo(LatestProducts);
