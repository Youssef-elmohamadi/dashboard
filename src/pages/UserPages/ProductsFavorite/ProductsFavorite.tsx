import { useEffect } from "react";
import ProductCard from "../../../components/EndUser/Product/ProductCard";
import { useAllFavoriteProducts } from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import { Circles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom"; // Import useParams for language
import { useTranslation } from "react-i18next";
import SEO from "../../../components/common/SEO/seo"; // Import your custom SEO component
import { toast } from "react-toastify"; // Import toast for messages
import { HiOutlineHeart, HiOutlineArrowPath } from "react-icons/hi2"; // Icons for wishlist page
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const ProductsFavorite = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("EndUserFavProducts");
  // Brand colors from your UserProfile/UserNotifications components
  const primaryColor = "#9810fa"; // Lighter purple for accents/active states
  const secondaryColor = "#542475"; // Deeper purple for text/main elements
  const { lang } = useDirectionAndLanguage();
  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      toast.error(
        t("authRequired", {
          defaultValue: "Please login first to view your wishlist.",
        })
      );
      navigate(`/${lang}/signin`, { replace: true });
    }
  }, [navigate, t]); // Add 't' to dependency array

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isError } =
    useAllFavoriteProducts();

  const products = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="p-4">
      <SEO
        title={{
          ar: `تشطيبة - قائمة أمنياتي`,
          en: `Tashtiba - My Wishlist`,
        }}
        description={{
          ar: `اكتشف المنتجات المفضلة لديك في قائمة أمنيات تشطيبة. احفظ المنتجات التي أعجبتك لتجدها بسهولة في أي وقت وتتخذ قرار الشراء لاحقًا.`,
          en: `Explore your favorite products in Tashtiba's wishlist. Save items you love to easily find them later and make a purchase decision.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "قائمة أمنيات",
            "منتجات مفضلة",
            "مفضلتي",
            "عربة التسوق",
            "منتجات محفوظة",
            "مصر",
            "تسوق",
            "عروض",
          ],
          en: [
            "tashtiba",
            "wishlist",
            "favorite products",
            "my favorites",
            "saved items",
            "shopping list",
            "Egypt",
            "shop",
            "deals",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/u-favorite" },
          { lang: "en", href: "https://tashtiba.com/en/u-favorite" },
          {
            lang: "x-default",
            href: "https://tashtiba.com/en/u-favorite",
          }, // Added x-default
        ]}
      />

      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Page Header */}
        <div className="p-6 border-b-2" style={{ borderColor: primaryColor }}>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: secondaryColor }}
          >
            <HiOutlineHeart className="h-8 w-8" />
            {t("pageTitle", { defaultValue: "قائمة أمنياتي" })}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("pageSubtitle", {
              defaultValue: "هنا تجد جميع المنتجات التي أعجبتك.",
            })}
          </p>
        </div>

        {/* Wishlist Content */}
        <div className="py-2">
          {isError ? (
            <p className="text-center text-red-500 font-semibold py-10">
              {t("mainContent.fetchError", {
                defaultValue:
                  "حدث خطأ ما أثناء تحميل المنتجات. حاول مرة أخرى لاحقًا.",
              })}
            </p>
          ) : isLoading && products.length === 0 ? ( // Show loader only on initial load if no products
            <div className="flex justify-center py-10">
              <Circles
                height="80"
                width="80"
                color={secondaryColor}
                ariaLabel="loading-wishlist"
              />
            </div>
          ) : !products || products.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-10">
              {t("mainContent.emptyWishlist", {
                defaultValue: "لا يوجد أي منتجات في قائمة الأمنيات الخاصة بك.",
              })}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {/* Increased gap, added lg:grid-cols-4 */}
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="relative group border border-gray-200 rounded-xl overflow-hidden shadow-sm transition duration-300 hover:shadow-lg"
                  >
                    <ProductCard product={item.product} />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="mt-8 flex justify-center">
                {" "}
                {/* Increased margin-top */}
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetching}
                    className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {isFetching ? (
                      <Circles
                        height="20"
                        width="20"
                        color="#fff"
                        ariaLabel="loading-more"
                      />
                    ) : (
                      <>
                        <HiOutlineArrowPath className="h-5 w-5" />{" "}
                        {/* Icon for loading more */}
                        {t("showMore", { defaultValue: "عرض المزيد" })}
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsFavorite;
