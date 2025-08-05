import FeaturesSection from "../../../components/EndUser/Home/FeaturedSection";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import LandingSection from "../../../components/EndUser/Home/LandingSection";
import SEO from "../../../components/common/SEO/seo";
import { useNavigate, useParams } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import React, { useEffect } from "react";
import i18n from "../../../i18n";

const HomeProducts = React.lazy(
  () => import("../../../components/EndUser/Home/HomeProducts")
);
const LatestProducts = React.lazy(
  () => import("../../../components/EndUser/Home/HomeLatest")
);
const CircleSlider = React.lazy(
  () => import("../../../components/EndUser/Home/CircleSlider")
);

const Home = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const { data: categories, isLoading } = useCategories();
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
          ar: "تشطيبة | تسوّق مواد التشطيب أونلاين - سيراميك، سباكة، دهانات والمزيد",
          en: "Tashtiba | Buy Finishing & Construction Materials Online in Egypt",
        }}
        description={{
          ar: "اكتشف أفضل منتجات التشطيب أونلاين في مصر من سيراميك، سباكة، دهانات، أدوات كهرباء وغيرها. تشطيبة توفر كل ما تحتاجه لتشطيب منزلك من مكان واحد وبأسعار تنافسية.",
          en: "Discover the best finishing materials online in Egypt including ceramic tiles, plumbing, paints, electrical tools, and more. Tashtiba offers everything you need to finish your home — all in one place.",
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "مواد تشطيب",
            "تشطيب منازل",
            "سيراميك",
            "سباكة",
            "دهانات",
            "أدوات كهرباء",
            "بلاط",
            "مواد بناء",
            "تشطيب شقق",
            "خدمات تشطيب",
            "تشطيبات مصر",
          ],
          en: [
            "tashtiba",
            "finishing materials Egypt",
            "home finishing Egypt",
            "ceramic tiles",
            "plumbing Egypt",
            "paints Egypt",
            "electrical supplies",
            "construction tools",
            "floor tiles Egypt",
            "building materials",
            "apartment finishing",
            "online finishing store Egypt",
          ],
        }}
        image="https://tashtiba.com/og-image.png"
        url={`https://tashtiba.com/${lang}`}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar" },
          { lang: "en", href: "https://tashtiba.com/en" },
          { lang: "x-default", href: "https://tashtiba.com/en" },
        ]}
      />

      <LandingSection />

      <div className="enduser_container">
        <FeaturesSection />
      </div>
      <div className="enduser_container">
        <CircleSlider items={categories || []} loading={isLoading} />
      </div>

      <div className="enduser_container">
        <HomeProducts />
        <LatestProducts title={t("latestProducts")} />
      </div>
    </section>
  );
};

export default React.memo(Home);
