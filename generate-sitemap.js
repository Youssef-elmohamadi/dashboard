import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langs = ["ar", "en"];

const staticRoutes = [
  "terms",
  "return",
  "support",
  "privacy",
  "category",
  "signin",
  "signup",
];

// دالة لتوليد sitemap لكل لغة
async function generateSitemapForLang(lang, products, categories) {
  const sitemap = new SitemapStream({
    hostname: "https://tashtiba.com",
  });

  const filePath = path.resolve(__dirname, "public", `sitemap-${lang}.xml`);
  const writeStream = createWriteStream(filePath);
  sitemap.pipe(writeStream);

  // static routes
  staticRoutes.forEach((route) => {
    sitemap.write({
      url: `/${lang}/${route}`.replace(/\/+$/, ""),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    });
  });

  // الصفحة الرئيسية لكل لغة
  sitemap.write({
    url: `/${lang}`,
    changefreq: "daily",
    priority: 0.9,
    lastmod: new Date().toISOString(),
  });

  // المنتجات
  products.forEach((product) => {
    sitemap.write({
      url: `/${lang}/product/${product.id}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    });
  });

  // التصنيفات
  categories.forEach((cat) => {
    sitemap.write({
      url: `/${lang}/category/${cat.id}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    });
  });

  sitemap.end();
  await streamToPromise(sitemap);
  console.log(`✅ sitemap-${lang}.xml generated.`);
}

async function generateSitemaps() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get("https://tashtiba.com/api/user/products"),
      axios.get("https://tashtiba.com/api/user/categories"),
    ]);

    const products = productsRes.data?.data.data || [];
    const categories = categoriesRes?.data.data || [];

    for (const lang of langs) {
      await generateSitemapForLang(lang, products, categories);
    }

    console.log("✅ All sitemaps generated.");
  } catch (error) {
    console.error("❌ Failed to fetch data or generate sitemap:", error.message);
  }
}

generateSitemaps();
