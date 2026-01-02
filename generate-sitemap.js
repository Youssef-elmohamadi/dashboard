import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const langs = ["ar", "en"];

const staticRoutes = [
  "terms",
  "return",
  "support",
  "privacy",
  "category",
  "signin",
  "signup",
  "blogs",
];

async function fetchAllProducts() {
  let products = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await axios.get(`https://tashtiba.com/api/user/products?page=${page}`);
    const data = res.data?.data?.data || [];
    lastPage = res.data?.data?.last_page || 1;
    products = [...products, ...data];
    page++;
    
    if (page <= lastPage) await delay(1000);
  } while (page <= lastPage);

  console.log(`📦 Total products fetched: ${products.length}`);
  return products;
}

async function fetchAllArticles() {
  let articles = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await axios.get(`https://tashtiba.com/api/user/articles/withPaginate?page=${page}`);
    const data = res.data?.data?.data || [];
    lastPage = res.data?.data?.last_page || 1;
    articles = [...articles, ...data];
    page++;

    if (page <= lastPage) await delay(1000);
  } while (page <= lastPage);

  console.log(`📝 Total articles fetched: ${articles.length}`);
  return articles;
}

async function generateSitemapForLang(lang, products, categories, articles) {
  const sitemap = new SitemapStream({
    hostname: "https://tashtiba.com",
  });

  const filePath = path.resolve(__dirname, "public", `sitemap-${lang}.xml`);
  const writeStream = createWriteStream(filePath);
  sitemap.pipe(writeStream);

  staticRoutes.forEach((route) => {
    sitemap.write({
      url: `/${lang}/${route}`.replace(/\/+$/, ""),
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

  products.forEach((product) => {
    sitemap.write({
      url: `/${lang}/product/${product.id}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    });
  });

  categories.forEach((cat) => {
    sitemap.write({
      url: `/${lang}/category/${cat.id}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    });
  });

  articles.forEach((article) => {
    sitemap.write({
      url: `/${lang}/blogs/${article.id}`,
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
    const products = await fetchAllProducts();
    const articles = await fetchAllArticles();
    
    const categoriesRes = await axios.get("https://tashtiba.com/api/user/categories");
    const categories = categoriesRes?.data?.data || [];
    console.log(`📂 Total categories fetched: ${categories.length}`);

    for (const lang of langs) {
      await generateSitemapForLang(lang, products, categories, articles);
    }

    console.log("✅ All sitemaps generated.");
  } catch (error) {
    console.error("❌ Failed to fetch data or generate sitemap:", error.message);
  }
}

generateSitemaps();