import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemap = new SitemapStream({
  hostname: "https://tashtiba.com",
});

const writeStream = createWriteStream(
  path.resolve(__dirname, "public", "sitemap.xml")
);
sitemap.pipe(writeStream);

const langs = ["en", "ar"];

const staticRoutes = [
  "terms",
  "return",
  "support",
  "privacy",
  "category",
  "signin",
  "signup",
];

async function generateSitemap() {
  for (const lang of langs) {
    staticRoutes.forEach((route) => {
      const url = `/${lang}/${route}`.replace(/\/+$/, "");
      sitemap.write({
        url,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      });
    });

    sitemap.write({
      url: `/${lang}`,
      changefreq: "daily",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    });
  }

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get("https://tashtiba.com/api/user/products"),
      axios.get("https://tashtiba.com/api/user/categories"),
    ]);

    const products = productsRes.data?.data.data || [];
    const categories = categoriesRes?.data.data || [];

    products.forEach((product) => {
      langs.forEach((lang) => {
        sitemap.write({
          url: `/${lang}/product/${product.id}`,
          changefreq: "weekly",
          priority: 0.7,
          lastmod: new Date().toISOString(),
        });
      });
    });

    categories.forEach((cat) => {
      langs.forEach((lang) => {
        sitemap.write({
          url: `/${lang}/category/${cat.id}`,
          changefreq: "weekly",
          priority: 0.7,
          lastmod: new Date().toISOString(),
        });
      });
    });
  } catch (error) {
    console.error("❌ Failed to fetch dynamic data:", error.message);
  }

  sitemap.end();
  await streamToPromise(sitemap);
  console.log("✅ Sitemap generated at public/sitemap.xml");
}

generateSitemap();
