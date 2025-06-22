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
import i18n from "../../../i18n";

const Home = () => {
  const { modalType } = useModal();
  const { t } = useTranslation(["EndUserHome"]);

  const { data: categories } = useCategories();
  const isArabic = i18n.language === "ar";

  const metaTitle = isArabic
    ? "تاشتيبا - تسوق عبر الإنترنت في السوق المتعدد البائعين"
    : "Tashtiba - Shop Online at Multi-Vendor Marketplace";

  const metaDescription = isArabic
    ? "اكتشف آلاف المنتجات على تاشتيبا - سوقك الموثوق للتسوق عبر الإنترنت للموضة والإلكترونيات والسلع المنزلية والمزيد. تسوق بسهولة وأمان من أفضل البائعين"
    : "Discover thousands of products on Tashtiba — your trusted multi-vendor marketplace for fashion, electronics, home goods, and more. Shop easily and securely from top sellers";

  return (
    <section>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
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
