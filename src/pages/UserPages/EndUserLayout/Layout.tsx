import { useEffect, useRef, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import AppHeader from "../../../components/EndUser/Layout/AppHeader";
import NavBar from "../../../components/EndUser/Layout/NavBar";
import AppTopBar from "../../../components/EndUser/Layout/AppTopBar";
import Footer from "../../../components/EndUser/Layout/Footer";
import AboutTashtiba from "../../../components/EndUser/Layout/AboutSection";
import { applyLanguageSettings } from "../../../lib/setLanguage";

export default function EndUserLayout() {
  const [hidden, setHidden] = useState(false);
  const lastScrollRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const lastScroll = lastScrollRef.current;
      if (currentScroll <= 10 && hidden) {
        setHidden(false);
      } else if (currentScroll > lastScroll && currentScroll > 100 && !hidden) {
        setHidden(true);
      }
      lastScrollRef.current = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hidden]);
  const { lang } = useParams();
  useEffect(() => {
    if (lang === "en" || lang === "ar") {
      applyLanguageSettings(lang);
    }
  }, [lang]);

  return (
    <div className="bg-white! text-black dark:bg-white!  dark:text-black min-h-screen">
      <div
        className={`sticky z-[50] !bg-white shadow-md transition-all duration-400 ease-in-out ${
          hidden ? "top-0" : "top-12"
        }`}
      >
        <div
          className={`fixed top-0 left-0 w-full z-[30] transition-transform duration-500 ease-in-out ${
            hidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <AppTopBar />
        </div>
        <AppHeader />
      </div>
      {/* NavBar */}
      <div
        className={`fixed left-0 w-full z-[10] transition-transform duration-500 ease-in-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
        style={{ top: hidden ? "64px" : "120px" }}
      >
        <NavBar />
      </div>
      <main className="md:pt-[95px] !bg-white pt-[50px]">
        <Outlet />
      </main>
      <footer>
        <AboutTashtiba />
        <Footer />
      </footer>
    </div>
  );
}
