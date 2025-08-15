import { Helmet } from "react-helmet-async";
import i18n from "../../../i18n";

type SEOProps = {
  lang?: "ar" | "en";
  title: { ar: string; en: string };
  description: { ar: string; en: string };

  keywords?: { ar: string | string[]; en: string | string[] };
  image?: string;
  url?: string;
  alternates?: { lang: string; href: string }[];
  robotsTag?: "index, follow" | "noindex, nofollow";
  structuredData?: Record<string, any>;
};

const SEO = ({
  title,
  description,
  lang,
  keywords,
  image,
  url,
  alternates,
  robotsTag = "index, follow",
  structuredData,
}: SEOProps) => {
  const currentLang = lang || i18n.language;
  const isArabic = currentLang === "ar";

  const siteName = isArabic ? "تشطيبة" : "Tashtiba";
  const pageTitle = `${isArabic ? title.ar : title.en} | ${siteName}`;
  const pageDescription = isArabic ? description.ar : description.en;

  const selectedKeywords = isArabic ? keywords?.ar : keywords?.en;
  const metaKeywords = selectedKeywords
    ? Array.isArray(selectedKeywords)
      ? selectedKeywords.join(", ")
      : selectedKeywords
    : undefined;

  const pageUrl = url;
  const pageImage = image || "/favicon.png";

  const mergedStructuredData = {
    "@context": "https://schema.org",
    "@type": structuredData?.["@type"] || "WebPage",
    url: pageUrl,
    inLanguage: currentLang,
    name: pageTitle,
    description: pageDescription,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: "https://tashtiba.com",
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: "https://tashtiba.com",
      logo: {
        "@type": "ImageObject",
        url: "https://tashtiba.com/favicon.png",
      },
    },
    ...structuredData,
  };

  return (
    <Helmet htmlAttributes={{ lang: currentLang }}>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {pageUrl && <link rel="canonical" href={pageUrl} />}
      <meta name="robots" content={robotsTag} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {alternates?.map((alt) => (
        <link
          key={alt.lang}
          rel="alternate"
          hrefLang={alt.lang}
          href={alt.href}
        />
      ))}
      <script type="application/ld+json">
        {JSON.stringify(mergedStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
