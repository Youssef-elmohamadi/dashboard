import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

const LandingSection = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const uToken = localStorage.getItem("uToken");
  const isLoggedIn = !!uToken;

  return (
    <section className="relative h-[550px] flex items-center justify-center text-white bg-black overflow-hidden rtl">
      {/* خلفية الصورة */}
      <div className="absolute inset-0">
        <img
          src="/images/landing.png"
          alt="landing background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-purple-800/70" />
      </div>

      {/* المحتوى */}
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
          {isLoggedIn ? (
            <>
              <MotionLink
                to="/category"
                whileHover={{ scale: 1.05 }}
                className="bg-[#8e2de2] hover:bg-[#7a1ccf] text-white px-6 py-3 rounded-full shadow-md transition"
              >
                {t("landingSection.button.shopNow")}
              </MotionLink>
              <MotionLink
                to="/about"
                whileHover={{ scale: 1.05 }}
                className="bg-white text-[#8e2de2] hover:bg-gray-100 px-6 py-3 rounded-full shadow-md transition"
              >
                {t("landingSection.button.learnMore")}
              </MotionLink>
            </>
          ) : (
            <>
              <MotionLink
                to="/signin"
                whileHover={{ scale: 1.05 }}
                className="bg-[#8e2de2] hover:bg-[#7a1ccf] text-white px-6 py-3 rounded-full shadow-md transition"
              >
                {t("landingSection.button.signIn")}
              </MotionLink>
              <MotionLink
                to="/signup"
                whileHover={{ scale: 1.05 }}
                className="bg-white text-[#8e2de2] hover:bg-gray-100 px-6 py-3 rounded-full shadow-md transition"
              >
                {t("landingSection.button.signUp")}
              </MotionLink>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default LandingSection;
