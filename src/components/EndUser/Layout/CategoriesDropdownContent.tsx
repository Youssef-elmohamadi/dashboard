import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { Category, Child } from "../../../types/Categories";
import { Circles } from "react-loader-spinner";
import ArrowDown from "../../../icons/ArrowDown";

interface CategoriesDropdownContentProps {
  dir: string;
  closeDropdown: () => void;
  lang: string;
}

const CategoriesDropdownContent: React.FC<CategoriesDropdownContentProps> = ({
  dir,
  closeDropdown,
  lang,
}) => {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories("parent");
  const [activeId, setActiveId] = useState<number | null>(null);

  useMemo(() => {
    if (categories?.length > 0 && activeId === null) {
      setActiveId(categories[0].id);
    }
  }, [categories, activeId]);

  const activeCategory = categories?.find((c) => c.id === activeId);

  const CategoryIcon = ({ svgString }: { svgString: string | null }) => {
    if (!svgString)
      return <div className="w-5 h-5 bg-gray-100 rounded-full flex-shrink-0" />;
    return (
      <div
        className="w-5 h-5 flex-shrink-0 transition-colors duration-200"
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center p-20 w-[850px]">
        <Circles height="40" width="40" color="#d62828" />
      </div>
    );

  return (
    <div className="flex bg-white shadow-2xl rounded-lg overflow-hidden w-[850px] max-w-[95vw] border border-gray-100 h-[500px]">
      <div className="w-1/3 border-e border-gray-100 bg-gray-50/30">
        <ul className="py-2 h-full overflow-y-auto custom-scrollbar">
          {categories?.map((category: Category) => (
            <li
              key={category.id}
              onMouseEnter={() => setActiveId(category.id)}
              className={`group relative flex items-center justify-between transition-all ${
                activeId === category.id
                  ? "bg-white text-red-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
              }`}
            >
              <Link
                to={`/${lang}/category/${category.id}`}
                onClick={closeDropdown}
                className={`flex items-center gap-3 w-full px-4 py-3.5 z-10 ${
                  activeId === category.id ? "font-bold" : "font-medium"
                }`}
              >
                <CategoryIcon svgString={category.icon} />
                <span className="text-[13px] truncate">
                  {category[`name_${lang}`]}
                </span>
              </Link>
              {activeId === category.id && (
                <div className="absolute inset-y-0 start-0 w-[3px] bg-red-600 z-20" />
              )}
              {category.childs && category.childs.length > 0 && (
                <ArrowDown
                  className={`w-3 absolute end-4 pointer-events-none transition-transform opacity-40 ${
                    dir === "ltr" ? "-rotate-90" : "rotate-90"
                  } ${
                    activeId === category.id
                      ? "translate-x-1 rtl:-translate-x-1 opacity-100"
                      : ""
                  }`}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 bg-white p-6 h-full overflow-y-auto custom-scrollbar">
        {activeCategory ? (
          <div
            key={activeCategory.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {activeCategory[`name_${lang}`]}
              </h3>
              <Link
                to={`/${lang}/category/${activeCategory.id}`}
                className="text-red-600 text-xs font-bold hover:bg-red-50 px-4 py-2 rounded-full transition-all border border-red-100"
                onClick={closeDropdown}
              >
                {t("Common:navbar.viewAll", "تسوق الكل")}
              </Link>
            </div>

            {activeCategory.childs && activeCategory.childs.length > 0 ? (
              <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                {activeCategory.childs.map((sub: Child) => (
                  <div key={sub.id} className="group/sub space-y-4">
                    <Link
                      to={`/${lang}/category/${sub.id}`}
                      className="text-sm font-bold text-gray-800 group-hover/sub:text-red-600 transition-colors inline-block"
                      onClick={closeDropdown}
                    >
                      {sub[`name_${lang}`]}
                    </Link>

                    {sub.childs && sub.childs.length > 0 && (
                      <ul className="space-y-2.5">
                        {sub.childs.map((nested: Child) => (
                          <li key={nested.id}>
                            <Link
                              to={`/${lang}/category/${nested.id}`}
                              className="text-[12px] text-gray-500 hover:text-red-600 flex items-center gap-2 transition-all"
                              onClick={closeDropdown}
                            >
                              <span className="w-1 h-1 bg-gray-300 rounded-full" />
                              {nested[`name_${lang}`] || nested.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium">
                  {t("Common:navbar.comingSoon", "أصناف جديدة قريباً")}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 italic">
            {t("Common:navbar.selectCategory")}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesDropdownContent;
