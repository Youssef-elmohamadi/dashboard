import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../../../components/EndUser/Header/AppHeader";
import NavBar from "../../../components/EndUser/NavBar/NavBar";
import AppTopBar from "../../../components/EndUser/TopBar/AppTopBar";
import Footer from "../../../components/EndUser/Footer/Footer";

export default function EndUserLayout() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll <= 10) {
        setHidden(false);
      } else if (currentScroll > lastScroll && currentScroll > 100) {
        setHidden(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <div className="bg-white text-black dark:bg-white dark:text-black min-h-screen">
      {/* TopBar */}
      <div
        className={`sticky z-[50] bg-white shadow-md transition-all duration-400 ease-in-out ${
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

      {/* Main content */}
      <main className="md:pt-[95px] pt-[50px]">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
