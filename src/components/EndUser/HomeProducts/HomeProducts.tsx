import React from "react";
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

const HomeProducts: React.FC = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const { data: productCategories, isLoading: isProductsLoading } =
    useProductForEveryCategory();
  const { data: homeData, isLoading: isHomeLoading } = useHomeData();
  if (isProductsLoading) return <div>{t("loading")}</div>; // You can replace this with a Skeleton

  return (
    <div className="enduser_container">
      {productCategories?.map((category: any) => {
        if (!category.products || category.products.length === 0) return null;

        return (
          <div key={category.id} className="mb-10 px-4 my-10">
            {homeData?.banners
              ?.filter((banner: any) => banner.position === category.id)
              .map((banner: any, idx: number) => (
                <AdBanner
                  key={idx}
                  imageUrl={banner.image}
                  linkUrl={banner.url ? banner.url : `/category/${category.id}`}
                  altText="Profit Announcement"
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
