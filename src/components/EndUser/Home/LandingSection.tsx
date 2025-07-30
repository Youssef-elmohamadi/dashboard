import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

const MotionLink = motion(Link);

const LandingSection = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const { lang } = useParams();

  const isLoggedIn = useMemo(() => {
    return !!localStorage.getItem("end_user_token");
  }, []);

  const buttonClass =
    "px-6 py-3 rounded-full shadow-md transition duration-300 text-sm md:text-base";

  const primaryBtn = "bg-[#8e2de2] hover:bg-[#7a1ccf] text-white";
  const secondaryBtn = "bg-white text-[#8e2de2] hover:bg-gray-100";

  const loggedInButtons = [
    {
      to: `/${lang}/category`,
      text: t("landingSection.button.shopNow"),
      className: primaryBtn,
    },
    {
      text: t("landingSection.button.learnMore"),
      className: secondaryBtn,
    },
  ];

  const guestButtons = [
    {
      to: `/${lang}/signin`,
      text: t("landingSection.button.signIn"),
      className: primaryBtn,
    },
    {
      to: `/${lang}/signup`,
      text: t("landingSection.button.signUp"),
      className: secondaryBtn,
    },
  ];

  const buttonsToRender = isLoggedIn ? loggedInButtons : guestButtons;
  const backgroundAlt =
    lang === "ar"
      ? "صورة خلفية رئيسية لموقع تشطيبة - تسوق إلكتروني"
      : "Tashtiba main background image - Online Shopping";

  const handleScrollToAboutSection = () => {
    const aboutSection = document.getElementById("aboutSection");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[550px] flex items-center justify-center text-white bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/landing.webp"
          srcSet="
      /images/landing-mobile.webp 600w,
      /images/landing.webp 1200w
    "
          sizes="(max-width: 768px) 100vw, 100vw"
          width={1920}
          height={1080}
          alt={backgroundAlt}
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-purple-800/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-center px-6 max-w-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-snug">
          {t("landingSection.welcome.title")}
          <span className="text-[#8e2de2]">
            {t("landingSection.welcome.subTitle")}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          {t("landingSection.welcome.description")}
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          {buttonsToRender.map((btn, idx) => (
            <MotionLink
              key={idx}
              {...(btn.to
                ? { to: btn.to }
                : { onClick: handleScrollToAboutSection })}
              whileHover={{ scale: 1.05 }}
              className={`${btn.className} ${buttonClass}`}
            >
              {btn.text}
            </MotionLink>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default memo(LandingSection);
