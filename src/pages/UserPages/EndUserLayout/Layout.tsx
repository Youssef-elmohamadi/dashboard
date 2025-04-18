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
    <>
      {/* TopBar */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <AppTopBar />
      </div>
      {/* Header*/}
      <div
        className={`sticky z-50 bg-white shadow-md transition-all duration-500 ease-in-out ${
          hidden ? "top-0" : "top-12"
        }`}
      >
        <AppHeader />
      </div>
      {/* NavBar */}
      <div
        className={`fixed left-0 w-full z-40 transition-transform duration-500 ease-in-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
        style={{ top: hidden ? "64px" : "120px" }}
      >
        <NavBar />
      </div>
      {/* Main content */}
      <main className="pt-[150px]">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
