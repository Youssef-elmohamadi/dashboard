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
  const { setLang } = useDirectionAndLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lang || (lang !== "ar" && lang !== "en")) {
      navigate("/en", { replace: true });
      return;
    }

    i18n.changeLanguage(lang);
    setLang(lang);
  }, [lang]);

  return (
    <section>
      <SEO
        title={{
          ar: "تسوّق مواد التشطيب أونلاين - سيراميك، سباكة، دهانات والمزيد",
          en: "Buy Finishing & Construction Materials Online in Egypt",
        }}
        description={{
          ar: "تسوق كل ما تحتاجه لتشطيب وتجهيز منزلك من موقع تشطيبة: أبواب، إضاءات، أثاث منزلي، ديكورات، خلاطات، تأسيس سباكة، تشطيب سباكة، وأدوات كهرباء وبلاط وسيراميك. أسعار منافسة، شحن سريع، وخدمة موثوقة في جميع أنحاء مصر.",
          en: "Shop everything you need to finish and furnish your home at Tashtiba: doors, lighting, home furniture, decorations, faucets, plumbing installation, plumbing finishing, plus electrical tools, tiles, and ceramics. Competitive prices, fast delivery, and reliable service across Egypt.",
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
            "اضاءة",
            "مواد بناء",
            "تشطيب شقق",
            "خدمات تشطيب",
            "تشطيبات مصر",
            " تشطيبات",
            " تجهيز المنزل",
            " مواد بناء",
            " أدوات صحية",
            " إكسسوارات منزلية",
            "مستلزمات ديكورات",
          ],
          en: [
            "tashtiba",
            "home finishing Egypt",
            "ceramic tiles",
            "plumbing Egypt",
            "paints Egypt",
            "finishing materials Egypt",
            "electrical supplies",
            "construction tools",
            "floor tiles Egypt",
            "building materials",
            "apartment finishing",
            "online finishing store Egypt",
            "home finishing",
            "home renovation",
            "sanitary ware",
            "home accessories",
            "decor supplies",
          ],
        }}
        image="https://tashtiba.com/og-image.png"
        url={`https://tashtiba.com/${lang}`}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar" },
          { lang: "en", href: "https://tashtiba.com/en" },
          { lang: "x-default", href: "https://tashtiba.com/ar" },
        ]}
        structuredData={{
          "@type": "CollectionPage",
          url: `https://tashtiba.com/${lang}`,
          inLanguage: lang,
        }}
        lang={lang as "ar" | "en"}
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
