import { useDispatch } from "react-redux";
import ProductCard from "../../../components/EndUser/ProductCard/ProductCard";
import { removeItem } from "../../../components/EndUser/Redux/wishListSlice/WishListSlice";
import { useAllFavoriteProducts } from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import { useEffect } from "react";
import { Circles } from "react-loader-spinner";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const ProductsFavorite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["EndUserFavProducts"]);

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      navigate("/signin", { replace: true });
    }
  }, []);

  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isError } =
    useAllFavoriteProducts();

  const products = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="p-4 min-h-[300px]">
      <Helmet>
        <title>{t("mainTitle")}</title>
        <meta
          name="description"
          content={t("wishlistDescription", {
            defaultValue:
              "شاهد المنتجات التي قمت بإضافتها إلى قائمة الأمنيات الخاصة بك واحتفظ بها لوقت لاحق.",
          })}
        />
      </Helmet>

      {isError ? (
        <p className="text-center text-red-500 font-semibold mt-10">
          {t("mainContent.fetchError", {
            defaultValue:
              "حدث خطأ ما أثناء تحميل المنتجات. حاول مرة أخرى لاحقًا.",
          })}
        </p>
      ) : isLoading ? (
        <div className="flex justify-center">
          <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
        </div>
      ) : !products || products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          {t("mainContent.emptyWishlist", {
            defaultValue: "لا يوجد أي منتجات في قائمة الأمنيات الخاصة بك.",
          })}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="relative group border border-gray-200 rounded-xl overflow-hidden shadow-sm transition duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => dispatch(removeItem(item.id))}
                  className="absolute top-2 z-20 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
                  title={t("mainContent.removeFromWishlist", {
                    defaultValue: "إزالة من قائمة الأمنيات",
                  })}
                >
                  ✕
                </button>
                <ProductCard product={item.product} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetching}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetching
                  ? t("mainContent.loadingMore")
                  : t("showMore", { defaultValue: "عرض المزيد" })}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsFavorite;
