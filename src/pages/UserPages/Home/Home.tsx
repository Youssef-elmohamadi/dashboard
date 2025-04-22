import React, { useEffect, useState } from "react";
import AdBanner from "../../../components/EndUser/AdBanner/AdBanner";
import FeaturesSection from "../../../components/EndUser/FeaturedBanner/FeaturedSection";
import CircleSlider from "../../../components/EndUser/CircleSlider/CircleSlider";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import { MultiImagesBanner } from "../../../components/EndUser/MultiImagesBanner/MulltiImagesBanner";
import HomeProducts from "../../../components/EndUser/HomeProducts/HomeProducts";
import { getProductCategories } from "../../../api/EndUserApi/ensUserProducts/_requests";

const Home = () => {
  const [Categories, setCategories] = useState<any>();
  const [productCategories, setProductCategories] = useState<any>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        console.log(response.data.data);
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
        console.log(response.data.data);
        setProductCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <section className="">
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
