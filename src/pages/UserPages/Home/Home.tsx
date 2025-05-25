import { useQuery } from "@tanstack/react-query";
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
import { useTranslation } from "react-i18next";

const Home = () => {
  const { modalType }: any = useModal();
  const { t } = useTranslation(["EndUserHome"]);
  // Query: All Categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getAllCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Query: Home Banners & Latest Products
  const { data: homeData, isLoading: isHomeLoading } = useQuery({
    queryKey: ["homePage"],
    queryFn: async () => {
      const res = await getHome();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Query: Product Categories (with their products)
  const { data: productCategories, isLoading: isProductsLoading } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const res = await getProductCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section>
      <Helmet>
        <title>Tashtiba | All-in-One Multi-Vendor Online Marketplace</title>
        <meta
          name="description"
          content="Discover thousands of products on Tashtiba — your trusted multi-vendor marketplace for fashion, electronics, home goods, and more. Shop easily and securely from top sellers"
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
        <CircleSlider items={categories} />
        {/* <AdBanner
          imageUrl="/images/banner-offer.webp"
          linkUrl="/"
          altText="Profit Announcement"
        /> */}
      </div>

      {/* <MultiImagesBanner
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
      /> */}

      <div className="enduser_container">
        {productCategories?.map((category: any) => (
          <div key={category.id}>
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
            <HomeProducts
              title={category.name}
              products={category.products}
              viewAllLink={`/category/${category.id}`}
            />
          </div>
        ))}

        <LatestProducts
          products={homeData?.leatestProducts}
          title={t("latestProducts")}
        />
      </div>
    </section>
  );
};

export default Home;
