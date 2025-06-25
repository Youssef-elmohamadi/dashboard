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
import SEO from "../../../components/common/seo";
import { useNavigate, useParams } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useEffect } from "react";
import i18n from "../../../i18n";

const Home = () => {
  const { modalType } = useModal();
  const { t } = useTranslation(["EndUserHome"]);
  const { data: categories } = useCategories();
  const { lang } = useParams();
  const { setLang, setDir } = useDirectionAndLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lang || (lang !== "ar" && lang !== "en")) {
      navigate("/en", { replace: true });
      return;
    }

    i18n.changeLanguage(lang);
    setLang(lang);
    setDir(lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  // const dynamicKeywords = categories?.map((c) =>
  //   lang === "ar" ? c.name_ar : c.name_en
  // );

  return (
    <section>
      <SEO
        title={{
          ar: "تاشتيبا - تسوق إلكتروني للأزياء والإلكترونيات والمزيد",
          en: "Tashtiba - Online Shopping for Fashion, Electronics & More",
        }}
        description={{
          ar: "اكتشف منتجات مذهلة على تاشتيبا - تسوق إلكترونيات، أزياء، أثاث ومنتجات منزلية بسهولة وأمان من أفضل البائعين في مصر.",
          en: "Shop amazing products at Tashtiba — your online destination for electronics, fashion, furniture, and home goods. Safe and easy shopping across Egypt.",
        }}
        keywords={{
          ar: [
            "تاشتيبا",
            "الكترونيات",
            "ملابس",
            "أزياء",
            "أثاث",
            "مطبخ",
            "عناية شخصية",
            "موبايلات",
            "أحذية",
            "شنط",
            "سوق مصر",
            "توصيل سريع",
            // ...(dynamicKeywords || [])
          ],
          en: [
            "tashtiba",
            "electronics",
            "fashion",
            "furniture",
            "home appliances",
            "mobiles",
            "kitchen",
            "bags",
            "shoes",
            "online shopping Egypt",
            "fast delivery",
            // ...(dynamicKeywords || [])
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
