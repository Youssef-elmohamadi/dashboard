import { Helmet } from "react-helmet-async";
import i18n from "../../../i18n";

type SEOProps = {
  lang?: "ar" | "en";
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  keywords?: { ar: string | string[]; en: string | string[] };
  image?: string | string[];
  url?: string;
  alternates?: { lang: string; href: string }[];
  robotsTag?: "index, follow" | "noindex, nofollow";
  structuredData?: Record<string, any>;
  pageType?:
    | "product"
    | "category"
    | "categories"
    | "home"
    | "privacy"
    | "terms"
    | "return"
    | "support"
    | "login"
    | "register"
    | "default";
  productData?: Record<string, any>;
  itemList?: { name: string; url: string }[];
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
  pageType = "default",
  productData,
  itemList,
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
  const pageImage = Array.isArray(image) ? image[0] : image || "/favicon.png";

  // === Structured Data Base ===
  let autoStructuredData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
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
  };

  // === Switch حسب نوع الصفحة ===
  switch (pageType) {
    case "product":
      autoStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            ...productData,
          },
          ...(structuredData
            ? Array.isArray(structuredData)
              ? structuredData
              : [structuredData]
            : []),
        ],
      };
      break;

    case "category":
      autoStructuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: pageTitle,
        description: pageDescription,
        ...(itemList?.length && {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: itemList.map((item, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: item.name,
              url: item.url,
            })),
          },
        }),
      };
      break;

    case "categories":
      autoStructuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: isArabic ? "كل الأقسام" : "All Categories",
        description: pageDescription,
      };
      break;

    case "home":
      autoStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: pageUrl,
        name: siteName,
        inLanguage: currentLang,
      };
      break;

    case "privacy":
      autoStructuredData = {
        "@type": "PrivacyPolicy",
        "@context": "https://schema.org",
      };
      break;

    case "terms":
      autoStructuredData = {
        "@type": "TermsOfService",
        "@context": "https://schema.org",
      };
      break;

    case "return":
      autoStructuredData = {
        "@type": "RefundPolicy",
        "@context": "https://schema.org",
      };
      break;

    case "support":
      autoStructuredData = {
        "@type": "ContactPage",
        "@context": "https://schema.org",
      };
      break;

    case "login":
    case "register":
      autoStructuredData = {
        "@type": "WebPage",
        "@context": "https://schema.org",
      };
      break;

    default:
      break;
  }
  const mergedStructuredData = Array.isArray(autoStructuredData["@graph"])
    ? autoStructuredData
    : {
        "@context": "https://schema.org",
        "@graph": [
          autoStructuredData,
          ...(Array.isArray(structuredData)
            ? structuredData
            : structuredData
            ? [structuredData]
            : []),
        ],
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
      <meta property="og:site_name" content={siteName} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      <meta
        property="og:type"
        content={pageType === "product" ? "product" : "website"}
      />

      <meta
        name="twitter:card"
        content={pageImage ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage || "/og-image.png"} />

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
