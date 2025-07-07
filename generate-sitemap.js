import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemap = new SitemapStream({
  hostname: "https://tashtiba.vercel.app", // ← غيّر هذا إلى دومين موقعك الحقيقي
});

const writeStream = createWriteStream(
  path.resolve(__dirname, "public", "sitemap.xml")
);
sitemap.pipe(writeStream);

const langs = ["en", "ar"];

const staticRoutes = [
  "",
  "product/123",
  "cart",
  "u-profile",
  "u-orders",
  "u-orders/details/456",
  "u-notification",
  "u-compare",
  "u-favorite",
  "terms",
  "return",
  "support",
  "privacy",
  "category",
  "category/electronics",
  "reset-password",
  "signin",
  "signup",
];

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
}

sitemap.end();
await streamToPromise(sitemap);
console.log("✅ Sitemap generated at public/sitemap.xml");
