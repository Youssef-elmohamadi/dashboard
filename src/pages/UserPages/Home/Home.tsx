import FeaturesSection from "../../../components/EndUser/FeaturedBanner/FeaturedSection";
import CircleSlider from "../../../components/EndUser/CircleSlider/CircleSlider";
import HomeProducts from "../../../components/EndUser/HomeProducts/HomeProducts";
import LatestProducts from "../../../components/EndUser/LatestProducts/HomeLatest";
import ProductModal from "../../../components/EndUser/ProductModal/ProductModal";
import { useModal } from "../Context/ModalContext";
import AddToCartModal from "../../../components/EndUser/AddedSuccess/AddToCartModal";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LandingSection from "../../../components/EndUser/Landing/LandingSection";
import VendorsCarousel from "../../../components/EndUser/VendorsBar/VendorsBar";
import SEO from "../../../components/common/seo"; // تأكد أن المسار صحيح حسب مكان الكمبوننت
import { Category } from "../../../types/Categories";

const Home = () => {
  const { modalType } = useModal();
  const { t } = useTranslation(["EndUserHome"]);

  const { data: categories } = useCategories();
  const metaCategories =
    categories?.map((category: Category) => category.name) || [];

  return (
    <section>
      <SEO
        title={{
          ar: "تاشتيبا - تسوق عبر الإنترنت في السوق المتعدد البائعين",
          en: "Tashtiba - Shop Online at Multi-Vendor Marketplace",
        }}
        description={{
          ar: "اكتشف آلاف المنتجات على تاشتيبا - سوقك الموثوق للتسوق عبر الإنترنت للموضة والإلكترونيات والسلع المنزلية والمزيد. تسوق بسهولة وأمان من أفضل البائعين",
          en: "Discover thousands of products on Tashtiba — your trusted multi-vendor marketplace for fashion, electronics, home goods, and more. Shop easily and securely from top sellers",
        }}
        keywords={{
          ar: [
            "تاشتيبا",
            "سوق",
            "الكترونيات",
            "ملابس",
            "أثاث",
            "تسوق",
            "توصيل",
          ],
          en: [
            "tashtiba",
            "marketplace",
            "electronics",
            "fashion",
            "furniture",
            "shopping",
            "delivery",
          ],
        }}
      />

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
