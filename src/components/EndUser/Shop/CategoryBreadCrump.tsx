import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface CategoryBreadCrumpProps {
  items?: BreadcrumbItem[];
}

const CategoryBreadCrump = ({ items }: CategoryBreadCrumpProps) => {
  const { lang } = useDirectionAndLanguage();
  const { t } = useTranslation(["EndUserShop"]);

  const Separator = () => (
    <svg
      className="shrink-0 mx-2 size-4 text-gray-400 rtl:rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"></path>
    </svg>
  );

  return (
    <div className="-mt-7">
      <ol className="flex items-center whitespace-nowrap">
        <li className="inline-flex items-center">
          <Link
            className="flex items-center text-sm text-gray-500 hover:text-[#d62828] focus:outline-hidden focus:text-[#d62828] transition-colors"
            to={`/${lang}`}
          >
            {t("breadcrumbCategory.home")}
          </Link>
          {items && items.length > 0 && <Separator />}
        </li>

        {items?.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              {!isLast && item.path ? (
                <>
                  <Link
                    className="flex items-center text-sm text-gray-500 hover:text-[#d62828] focus:outline-hidden focus:text-[#d62828] transition-colors"
                    to={item.path}
                  >
                    {item.label}
                  </Link>
                  <Separator />
                </>
              ) : (
                <span
                  className="text-sm font-semibold text-[#d62828] truncate max-w-[150px] md:max-w-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default CategoryBreadCrump;
