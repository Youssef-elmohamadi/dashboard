import React from "react";
import { Circles } from "react-loader-spinner";
import { useBlog } from "../../../hooks/Api/EndUser/useBlogs/useBlogs";
import { useParams } from "react-router";
import SEO from "../../../components/common/SEO/seo";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";

// Define interfaces for type safety
interface Author {
  id: number;
  first_name: string;
  last_name: string;
}

interface Article {
  id: number;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  author: Author;
  created_at: string;
}

const SingleBlog: React.FC = () => {
  const { t } = useTranslation("Blogs");
  const { id } = useParams<{ id: string }>();
  const articleId = id;

  const { data, isLoading, isError } = useBlog(articleId);

  // Check for loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen  ">
        <Circles
          height="50"
          width="50"
          color="#E74C3C"
          ariaLabel="loading-article"
        />
      </div>
    );
  }

  // Check for error or data not found
  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screenp-8">
        <div className="text-red-500 text-lg">{t("errorLoadingArticle")}</div>
      </div>
    );
  }
  const { lang } = useDirectionAndLanguage();

  const article = data.data;
  const createMarkup = () => {
    return { __html: article[`content_${lang}`] };
  };

  const extractImageUrl = (content: string): string | null => {
    if (!content) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : null;
  };
  const stripHtml = (html: string): string => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || "";
    // Get the first 200 characters as a summary
    return text.substring(0, 200) + (text.length > 200 ? "..." : "");
  };

  const imageUrl = extractImageUrl(article[`content_${lang}`]);

  return (
    <>
      <SEO
        lang={lang}
        title={{ ar: article.title_ar, en: article.title_en }}
        description={{
          ar: stripHtml(article.content_ar),
          en: stripHtml(article.content_en),
        }}
        keywords={{ ar: "مقالة, مدونة, تشطيبة", en: "article, blog, tashtiba" }}
        alternates={[
          { lang: "ar", href: `https://tashtiba.com/ar/blogs/${article.id}` },
          { lang: "en", href: `https://tashtiba.com/en/blogs/${article.id}` },
          {
            lang: "x-default",
            href: `https://tashtiba.com/ar/blogs/${article.id}`,
          },
        ]}
        image={imageUrl || "/og-image.png"}
        url={`https://tashtiba.com/${lang}/blogs/${article.id}`}
        pageType="blog"
        productData={{
          authorName: `${article.author.first_name} ${article.author.last_name}`,
          datePublished: new Date(article.created_at).toISOString(),
          dateModified: new Date(article.created_at).toISOString(),
        }}
      />
      <div className="min-h-screen p-8  mt-10">
        <div className="max-w-4xl mx-auto py-10">
          <h1 className="md:text-2xl text-xl font-extrabold text-[#E74C3C] mb-4 text-center">
            {article[`title_${lang}`]}
          </h1>
          {/* <div className="text-center text-black mb-8">
          <span>
            بقلم: {article.author.first_name} {article.author.last_name}
          </span> 
         <span className="mx-2">|</span>
          <span>
            تاريخ النشر:{" "}
            {new Date(article.created_at).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span> 
        </div> */}
          <div
            className=" text-black p-6 sm:p-8 rounded-xl leading-relaxed prose prose-lg max-w-none prose-invert"
            dangerouslySetInnerHTML={createMarkup()}
          />
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
