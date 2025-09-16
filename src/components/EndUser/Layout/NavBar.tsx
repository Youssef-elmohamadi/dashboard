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

        <ul className="flex justify-center lg:justify-start items-center flex-[3] gap-5">
          {categories?.slice(0, 6).map((category) => (
            <li key={category.id} className="text-white py-3">
              <NavLink
                to={`/${lang}/category/${category.id}`}
                className={({ isActive }) =>
                  isActive
                    ? "py-3 text-sm md:text-base font-semibold border-b-2 border-[#d62828] underline-hover-effect flex items-center"
                    : "py-3 text-sm md:text-base font-semibold text-white underline-hover-effect flex items-center"
                }
              >
                {category.icon && (
                  <span className="inline-flex items-center justify-center w-6 h-6 flex-shrink-0">
                    <span
                      className="w-5 h-5 text-white fill-current"
                      dangerouslySetInnerHTML={{ __html: category.icon }}
                    />
                  </span>
                )}
                <span className="ml-2 flex-grow-0">
                  {category[`name_${lang}`]}
                </span>
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
