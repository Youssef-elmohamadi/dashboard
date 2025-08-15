import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import CategoriesDropdown from "./CategoriesDropdown";
import CartPopup from "./CartPopup";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";

const NavBar = React.memo(() => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { lang, dir } = useDirectionAndLanguage();

  const toggleCartPopup = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const { data: categories } = useCategories();

  return (
    <nav className="end-user-bg-secondary w-full min-h-14 md:flex items-center hidden">
      <div className="flex enduser_container w-full justify-center lg:justify-baseline items-center relative">
        <CategoriesDropdown dir={dir} />

        <ul className="flex justify-center lg:justify-start items-center flex-[3] gap-5 ">
          {categories?.slice(0, 6).map((category) => (
            <li key={category.id} className="text-white p-2">
              <NavLink
                to={`/${lang}/category/${category.id}`}
                className={({ isActive }) =>
                  isActive
                    ? "py-3 font-semibold border-b-2 border-[#d62828] underline-hover-effect"
                    : "py-3 font-semibold text-white underline-hover-effect"
                }
              >
                {category.name}
              </NavLink>
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
