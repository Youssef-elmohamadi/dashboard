import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import PriceRangeFilter from "../SpinnerFilter/PriceRangeFilter";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";

const Sidebar = ({
  setCurrentPage,
  handlePriceChange,
  setShowCategories,
  showCategories,
}) => {
  const { t } = useTranslation(["EndUserShop"]);
  const { category_id } = useParams();
  const { data, isLoading } = useAllCategories();
  const categories = data?.data?.data.original;
  
  return (
    <aside className="w-64 hidden 2xl:block">
      <div className="border border-gray-200 p-4">
        {isLoading ? (
          <div className="text-center py-10">{t("loadingCategories")}</div>
        ) : (
          <>
            <button
              onClick={() => setShowCategories((prev) => !prev)}
              className="font-bold w-full flex justify-between items-center"
            >
              {t("categories")}
              <IoIosArrowDown
                className={`transition-transform duration-300 ${
                  showCategories ? "rotate-180" : ""
                }`}
              />
            </button>

            {showCategories && (
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    className={`text-gray-500 hover:text-purple-600 transition ${
                      !category_id ? "text-purple-600 font-semibold" : ""
                    }`}
                    to={`/category/`}
                  >
                    {t("allCategories")}
                  </Link>
                </li>
                {categories?.map((category) => (
                  <li
                    key={category.id}
                    onClick={() => setCurrentPage(category.name)}
                  >
                    <Link
                      className={`text-gray-500 hover:text-purple-600 transition ${
                        category.id.toString() === category_id
                          ? "text-purple-600 font-semibold"
                          : ""
                      }`}
                      to={`/category/${category.id}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <PriceRangeFilter setValuesProp={handlePriceChange} />
    </aside>
  );
};

export default Sidebar;
