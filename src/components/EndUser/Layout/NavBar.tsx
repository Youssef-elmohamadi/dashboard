import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import CategoriesDropdown from "./CategoriesDropdown";
import CartPopup from "./CartPopup";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData"; // Keep this import if static links are needed
import { Category } from "../../../types/Categories"; // Keep this import if static links are needed

const NavBar = React.memo(() => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { lang, dir } = useDirectionAndLanguage(); // Destructure dir here
  const { t } = useTranslation(["EndUserNavBar"]);

  const toggleCartPopup = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Fetch categories for static links if needed
  const { data: categories } = useCategories();

  return (
    <nav className="bg-primary w-full min-h-14 md:block hidden">
      <div className="flex enduser_container w-full justify-center lg:justify-baseline items-center relative">
        <CategoriesDropdown dir={dir} />

        <ul className="flex justify-center lg:justify-start flex-[2] gap-5 ">
          {categories?.slice(0, 4).map((category: Category) => (
            <li key={category.id} className="text-white py-3">
              <Link
                to={`/${lang}/category/${category.id}`}
                className="py-3 font-semibold"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        <CartPopup
          isCartOpen={isCartOpen}
          toggleCartPopup={toggleCartPopup}
          lang={lang}
        />
      </div>
    </nav>
  );
});

export default NavBar;
