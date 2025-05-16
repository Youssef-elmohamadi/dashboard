import React, { useEffect, useState } from "react";
import AdBanner from "../../../components/EndUser/AdBanner/AdBanner";
import FeaturesSection from "../../../components/EndUser/FeaturedBanner/FeaturedSection";
import CircleSlider from "../../../components/EndUser/CircleSlider/CircleSlider";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import { MultiImagesBanner } from "../../../components/EndUser/MultiImagesBanner/MulltiImagesBanner";
import HomeProducts from "../../../components/EndUser/HomeProducts/HomeProducts";
import LatestProducts from "../../../components/EndUser/LatestProducts/HomeLatest";
import { getProductCategories } from "../../../api/EndUserApi/ensUserProducts/_requests";
import ProductModal from "../../../components/EndUser/ProductModal/ProductModal";
import { useModal } from "../Context/ModalContext";
import AddToCartModal from "../../../components/EndUser/AddedSuccess/AddToCartModal";
import { Helmet } from "react-helmet-async";
import { getHome } from "../../../api/EndUserApi/HomeApi/_requests";
const Home = () => {
  const [Categories, setCategories] = useState<any>();
  const [productCategories, setProductCategories] = useState<any>();
  const [banners, setBanners] = useState<any>();
  const [latest, setLatest] = useState<any>();
  const { modalType }: any = useModal();
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
    const fetchBanners = async () => {
      try {
        const response = await getHome();
        setBanners(response.data.data.banners);
        console.log(response.data.data.banners);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBanners();
  }, []);
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await getHome();
        setLatest(response.data.data.leatestProducts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLatestProducts();
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
  console.log(latest);

  return (
    <section className="">
      <Helmet>
        <title>Tashtiba | All-in-One Multi-Vendor Online Marketplace</title>
        <meta
          name="description"
          content="Discover thousands of products on Tashtiba — your trusted multi-vendor marketplace for fashion, electronics, home goods, and more. Shop easily and securely from top sellers"
        />
      </Helmet>
      {modalType === "product" && <ProductModal />}
      {modalType === "addtocart" && <AddToCartModal />}
      <div className="enduser_container">
        <AdBanner
          imageUrl="/images/banner.webp"
          linkUrl="/"
          altText="Profit Announcement"
        />
        <FeaturesSection />
        <CircleSlider items={Categories} />
        <AdBanner
          imageUrl="/images/banner-offer.webp"
          linkUrl="/"
          altText="Profit Announcement"
        />
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
        {productCategories?.map((category: any) => (
          <div key={category.id}>
            {banners
              ?.filter((banner: any) => banner.position === category.id)
              .map((banner: any, idx: number) => (
                <AdBanner
                  key={idx}
                  imageUrl={banner.image}
                  linkUrl={
                    banner.url
                      ? banner.url
                      : `/category/${category.id}` || "/images/ad1.webp"
                  }
                  altText="Profit Announcement"
                />
              ))}
            <HomeProducts
              title={category.name}
              products={category.products}
              viewAllLink={`/category/${category.id}`}
            />
          </div>
        ))}
        <LatestProducts products={latest} title="Latest Products" />
      </div>
    </section>
  );
};

export default Home;
