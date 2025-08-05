import React, { Suspense, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
const LazyProductCard = React.lazy(() => import("../Product/ProductCard"));
import { useHomeData } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { Product } from "../../../types/Product";
import LazyImage from "../../common/LazyImage";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

interface CategorySliderProps {
  title: string;
}

const LatestProducts: React.FC<CategorySliderProps> = ({ title }) => {
  const { data: homeData, isLoading } = useHomeData();
  const { lang } = useDirectionAndLanguage();
  const swiperRef = useRef<any>(null);
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
      <div className="enduser_container flex flex-col items-center justify-center px-4 py-10 text-gray-500 min-h-[550px]">
        <div className="flex flex-col items-center justify-center w-full h-full">
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
    <div>
      {products && products.length > 0 && (
        <div className="mb-10 px-4 my-10 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {title}
            </h2>
          </div>

          <Swiper
            key={lang} // علشان يعيد البناء لما اللغة تتغير
            dir={lang === "ar" ? "rtl" : "ltr"} // يضبط الاتجاه للـ DOM
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
              swiper.changeLanguageDirection(lang === "ar" ? "rtl" : "ltr"); // الأهم
            }}
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
    </div>
  );
};

export default React.memo(LatestProducts);
