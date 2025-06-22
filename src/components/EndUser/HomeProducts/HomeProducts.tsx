import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "./customSwiper.css";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import {
  useHomeData,
  useProductForEveryCategory,
} from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import AdBanner from "../AdBanner/AdBanner";
import LazyImage from "../../common/LazyImage";

const HomeProducts: React.FC = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const { data: productCategories, isLoading: isProductsLoading } =
    useProductForEveryCategory();
  const { data: homeData, isLoading: isHomeLoading } = useHomeData();

  const isLoading = isHomeLoading || isProductsLoading;

  const filteredCategories = useMemo(() => {
    return productCategories?.filter(
      (category: any) => category.products && category.products.length > 0
    );
  }, [productCategories]);

  if (isLoading) {
    return (
      <div className="enduser_container flex flex-col items-center justify-center px-4 py-10 text-gray-500 min-h-[50vh]">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <LazyImage
            src="images/product/placeholder-image.jpg"
            alt={t("homeProducts.loadingAlt", "Loading products...")}
            className="w-24 h-24 mb-4 animate-pulse mx-auto"
          />
          <span className="text-base">{t("loading", "Loading products...")}</span>
        </div>
      </div>
    );
  }

  if (!filteredCategories || filteredCategories.length === 0) return null;

  return (
    <div className="enduser_container px-4 py-10">
      {filteredCategories.map((category: any) => {
        const relatedBanners = homeData?.banners?.filter(
          (banner: any) => banner.position === category.id
        );

        return (
          <div key={category.id} className="mb-12">
            {relatedBanners?.map((banner: any, idx: number) => (
              <AdBanner
                key={idx}
                imageUrl={banner.image}
                linkUrl={banner.url || `/category/${category.id}`}
                altText="Category Banner"
              />
            ))}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {category.name}
              </h2>
              <Link
                to={`/category/${category.id}`}
                className="text-sm text-purple-600 hover:underline"
              >
                {t("homeProducts.showAll")}
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
              {category.products.map((product: any) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );
      })}
    </div>
  );
};

export default HomeProducts;
