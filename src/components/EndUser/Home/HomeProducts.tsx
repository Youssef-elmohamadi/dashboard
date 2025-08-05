import React, { useMemo, lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import { useTranslation } from "react-i18next";
import {
  useHomeData,
  useProductForEveryCategory,
} from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { Banner } from "../../../types/Home";
import { Product } from "../../../types/Product";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const ProductCard = lazy(() => import("../Product/ProductCard"));
const ProductCardSkeleton = lazy(
  () => import("../Product/ProductCardSkeleton")
);
const AdBanner = lazy(() => import("../Home/AdBanner"));

const HomeProducts: React.FC = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const { data: productCategories, isLoading: isProductsLoading } =
    useProductForEveryCategory();
  const { data: homeData, isLoading: isHomeLoading } = useHomeData();
  console.log(productCategories);

  const isLoading = isHomeLoading || isProductsLoading;

  const filteredCategories = useMemo(() => {
    return productCategories?.filter(
      (category) => category.products && category.products.length > 0
    );
  }, [productCategories]);

  const { lang } = useDirectionAndLanguage();
  const swiperRef = useRef<any>(null);
  if (isLoading) {
    return (
      <div className="enduser_container px-4 py-10 h-[550px] ">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="mb-12 flex ">
            <div className="h-4 w-1/5 bg-gray-200 mb-4 animate-pulse rounded" />
            <Swiper
              spaceBetween={12}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 }, // sm
                768: { slidesPerView: 3 }, // md
                1024: { slidesPerView: 4 }, // lg
              }}
              className="w-full mt-6"
            >
              {[...Array(4)].map((_, j) => (
                <SwiperSlide key={j}>
                  <Suspense fallback={null}>
                    <ProductCardSkeleton />
                  </Suspense>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    );
  }

  if (!filteredCategories || filteredCategories.length === 0) return null;

  return (
    <div className="enduser_container px-4 py-10 ">
      {filteredCategories.map((category) => {
        const relatedBanners = homeData?.banners?.filter(
          (banner: Banner) => banner.position === category.id
        );

        const bannerAltText =
          lang === "ar"
            ? `تشطيبة | إعلان تصنيف ${category.name}`
            : `Tashtiba | Category banner for ${category.name}`;

        return (
          <div key={category.id} className="mb-8">
            {relatedBanners?.map((banner: Banner, idx: number) => (
              <div className=" h-[200px] md:h-[400px] overflow-hidden mb-6">
                <Suspense fallback={null} key={idx}>
                  <AdBanner
                    imageUrl={banner.image}
                    linkUrl={banner.url || `/${lang}/category/${category.id}`}
                    altText={bannerAltText}
                  />
                </Suspense>
              </div>
            ))}

            <div className="h-[550px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  {category.name}
                </h2>
                <Link
                  to={`/${lang}/category/${category.id}`}
                  className="text-sm end-user-text-base hover:underline"
                >
                  {t("homeProducts.showAll")}
                </Link>
              </div>

              <Swiper
                key={lang}
                dir={lang === "ar" ? "rtl" : "ltr"}
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                  swiper.changeLanguageDirection(lang === "ar" ? "rtl" : "ltr");
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
                {category.products.map((product: any, index: number) => (
                  <SwiperSlide key={product.id}>
                    <Suspense fallback={null}>
                      <ProductCard
                        product={product as Product}
                        loadingPriority={index < 2 ? "eager" : "lazy"}
                      />
                    </Suspense>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(HomeProducts);
