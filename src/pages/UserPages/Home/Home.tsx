import FeaturesSection from "../../../components/EndUser/FeaturedBanner/FeaturedSection";
import CircleSlider from "../../../components/EndUser/CircleSlider/CircleSlider";
import HomeProducts from "../../../components/EndUser/HomeProducts/HomeProducts";
import LatestProducts from "../../../components/EndUser/LatestProducts/HomeLatest";
import ProductModal from "../../../components/EndUser/ProductModal/ProductModal";
import { useModal } from "../Context/ModalContext";
import AddToCartModal from "../../../components/EndUser/AddedSuccess/AddToCartModal";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LandingSection from "../../../components/EndUser/Landing/LandingSection";
import VendorsCarousel from "../../../components/EndUser/VendorsBar/VendorsBar";

const Home = () => {
  const { modalType } = useModal();
  const { t } = useTranslation(["EndUserHome"]);

  const { data: categories } = useCategories();

  return (
    <section>
      <Helmet>
        <title>{t("home.mainTitle")}</title>
        <meta
          name="description"
          content="Discover thousands of products on Tashtiba — your trusted multi-vendor marketplace for fashion, electronics, home goods, and more. Shop easily and securely from top sellers"
        />
      </Helmet>
      <LandingSection />

      {modalType === "product" && <ProductModal />}
      {modalType === "addtocart" && <AddToCartModal />}

      <div className="enduser_container">
        <FeaturesSection />
        <CircleSlider items={categories} />
      </div>

      <div className="enduser_container">
        <HomeProducts />
        <LatestProducts title={t("latestProducts")} />
        <VendorsCarousel />
      </div>
    </section>
  );
};

export default Home;
