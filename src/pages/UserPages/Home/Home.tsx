import React, { useEffect, useState } from "react";
import AdBanner from "../../../components/EndUser/AdBanner/AdBanner";
import FeaturesSection from "../../../components/EndUser/FeaturedBanner/FeaturedSection";
import CircleSlider from "../../../components/EndUser/CircleSlider/CircleSlider";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import { MultiImagesBanner } from "../../../components/EndUser/MultiImagesBanner/MulltiImagesBanner";
import HomeProducts from "../../../components/EndUser/HomeProducts/HomeProducts";
import { getProductCategories } from "../../../api/EndUserApi/ensUserProducts/_requests";
import ProductModal from "../../../components/EndUser/ProductModal/ProductModal";
import { useModal } from "../Context/ModalContext";
import AddToCartModal from "../../../components/EndUser/AddedSuccess/AddToCartModal";

const Home = () => {
  const [Categories, setCategories] = useState<any>();
  const [productCategories, setProductCategories] = useState<any>();
  const { modalType } = useModal();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductCategories();
        setProductCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <section className="">
      {modalType === "product" && <ProductModal  />}
      {modalType === "addtocart" && <AddToCartModal  />}
      <div className="enduser_container">
        <AdBanner imageUrl="/images/banner.webp" linkUrl="/" />
        <FeaturesSection />
        <CircleSlider items={Categories} />
        <AdBanner imageUrl="/images/banner-offer.webp" linkUrl="/" />
      </div>
      <MultiImagesBanner
        items={[
          {
            title: "youssef",
            subtitle: "engineer",
            imageUrls: ["/images/ad1.webp"],
          },
          {
            title: "youssef",
            subtitle: "engineer",
            imageUrls: ["/images/ad1.webp"],
          },
          {
            title: "youssef",
            subtitle: "engineer",
            imageUrls: ["/images/ad1.webp"],
          },
        ]}
      />
      <div className="enduser_container">
        <AdBanner imageUrl="/images/ad2.webp" linkUrl="/" />
        {productCategories?.map((category: any) => (
          <HomeProducts
            key={category.id}
            title={category.name}
            products={category.products}
          />
        ))}
      </div>
    </section>
  );
};

export default Home;
