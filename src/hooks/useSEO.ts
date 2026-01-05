// src/hooks/useSEO.ts

import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { HOME_SEO_DATA, SEO_BASE_URL } from "../components/common/SEO/seoData";

/**
 * Custom Hook لإدارة بيانات الـ SEO للصفحة الرئيسية
 * يمنع الـ re-renders تماماً باستخدام useRef
 */
export const useSEO = () => {
  const location = useLocation();

  // استخراج اللغة من الرابط
  const pathLang = location.pathname.split("/")[1];
  const currentLang = pathLang === "en" || pathLang === "ar" ? pathLang : "ar";

  // ✅ استخدام useRef للبيانات الثابتة - مش هتتغير أبداً
  const seoDataRef = useRef({
    lang: currentLang,
    url: `${SEO_BASE_URL}/${currentLang}`,
    title: HOME_SEO_DATA.title,
    description: HOME_SEO_DATA.description,
    keywords: HOME_SEO_DATA.keywords,
    alternates: HOME_SEO_DATA.alternates,
    pageType: "home",
    structuredData: HOME_SEO_DATA.structuredData,
  });

  // ✅ نرجع نفس الـ reference دايماً
  return seoDataRef.current;
};