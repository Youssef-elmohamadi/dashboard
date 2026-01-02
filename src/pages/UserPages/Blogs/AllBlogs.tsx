import React, { useState } from "react";
import ArticleCard from "../../../components/EndUser/Blogs/BlogCard";
import { useBlogs } from "../../../hooks/Api/EndUser/useBlogs/useBlogs";
import { Circles } from "react-loader-spinner";
import SEO from "../../../components/common/SEO/seo";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
interface Article {
  id: number;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  slug: string;
}

const AllBlogs: React.FC = () => {
  const { t } = useTranslation("Blogs");
  const [page, setPage] = useState(1);
  const { data: allArticles, isLoading, isError } = useBlogs(page);

  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen  ">
        <div className="flex justify-center border-b border-gray-200 items-center py-4">
          <Circles
            height="50"
            width="50"
            color="#d62828"
            ariaLabel="loading-categories"
          />
        </div>
      </div>
    );
  }

  if (allArticles?.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen  ">
        <div className="text-red-500 text-lg">{t("noArticles")}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen  ">
        <div className="text-red-500 text-lg">{t("errorLoadingArticles")}</div>
      </div>
    );
  }

  const handleLoadMore = () => {
    if (allArticles && page < allArticles.last_page) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const hasMore = allArticles && page < allArticles.last_page;
  const { lang } = useDirectionAndLanguage();
  return (
    <>
      <SEO
        lang={lang}
        title={{
          ar: "جميع المقالات",
          en: "All Articles",
        }}
        description={{
          ar: "استكشف جميع مقالات تشطيبة حول الديكور، التصميم، الأفكار، ونصائح التشطيب في مصر.",
          en: "Explore all Tashtiba articles about decoration, design, ideas, and finishing tips in Egypt.",
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "مقالات",
            "ديكور",
            "تصميم داخلي",
            "تشطيب",
            "أفكار",
            "نصائح",
          ],
          en: [
            "Tashtiba",
            "articles",
            "decoration",
            "interior design",
            "finishing",
            "ideas",
            "tips",
          ],
        }}
        image={"/og-image.png"}
        url={`https://tashtiba.com/${lang}/blogs`}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/blogs" },
          { lang: "en", href: "https://tashtiba.com/en/blogs" },
          { lang: "x-default", href: "https://tashtiba.com/ar/blogs" },
        ]}
        pageType="category"
        itemList={
          allArticles?.data.map((article: Article) => ({
            name: article[`title_${lang}`],
            url: `https://tashtiba.com/${lang}/blogs/${article.id}`,
          })) || []
        }
      />

      <div className="min-h-screen p-4 mt-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-12 text-[#E74C3C]">
            {t("allBlogs")}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allArticles?.data.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            {isLoading && page > 1 ? (
              <div className="   text-lg animate-pulse">
                {t("loadingMoreArticles")}
              </div>
            ) : (
              hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 rounded-full  font-bold bg-[#E74C3C] hover:bg-[#C0392B] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:ring-offset-2 focus:ring-offset-[#121212]"
                >
                  {t("loadMore")}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllBlogs;
