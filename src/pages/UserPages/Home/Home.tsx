import FeaturesSection from "../../../components/EndUser/Home/FeaturedSection";
import CircleSlider from "../../../components/EndUser/Home/CircleSlider";
import HomeProducts from "../../../components/EndUser/Home/HomeProducts";
import LatestProducts from "../../../components/EndUser/Home/HomeLatest";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LandingSection from "../../../components/EndUser/Home/LandingSection";
import VendorsCarousel from "../../../components/EndUser/Home/VendorsBar";
import SEO from "../../../components/common/SEO/seo";
import { useNavigate, useParams } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useEffect } from "react";
import i18n from "../../../i18n";

const Home = () => {
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
  return (
    <section>
      <SEO
        title={{
          ar: "تشطيبة - تسوق إلكتروني للأزياء والإلكترونيات والمزيد",
          en: "Tashtiba - Online Shopping for Fashion, Electronics & More",
        }}
        description={{
          ar: "اكتشف منتجات مذهلة على تشطيبة - تسوق إلكترونيات، أزياء، أثاث ومنتجات منزلية بسهولة وأمان من أفضل البائعين في مصر.",
          en: "Shop amazing products at Tashtiba — your online destination for electronics, fashion, furniture, and home goods. Safe and easy shopping across Egypt.",
        }}
        keywords={{
          ar: [
            "تشطيبة",
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
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.vercel.app/ar" },
          { lang: "en", href: "https://tashtiba.vercel.app/en" },
        ]}
      />

      <LandingSection />
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
