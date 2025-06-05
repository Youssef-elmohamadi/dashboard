import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBannerById } from "../../../api/SuperAdminApi/Banners/_requests"; // تأكد من وجود هذا الملف
import { getAllCategories } from "../../../api/SuperAdminApi/Categories/_requests";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { useGetBannerById } from "../../../hooks/Api/SuperAdmin/useBanners/useSuperAdminBanners";

interface Banner {
  id: number;
  title: string;
  image: string;
  link_type: string;
  link_id: number;
  url: string | null;
  position: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const BannerDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["BannerDetails"]);
  //const [banner, setBanner] = useState<Banner | null>(null);
  // const [loading, setLoading] = useState(true);
  //const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   const fetchBanner = async () => {
  //     try {
  //       const res = await getBannerById(id as string);
  //       setBanner(res.data.data);
  //     } catch (error) {
  //       console.error("Error fetching banner:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) fetchBanner();
  // }, [id]);

  // useEffect(() => {
  //   const fetchCategory = async () => {
  //     try {
  //       const res = await getAllCategories();
  //       setCategories(res.data.data.original);
  //     } catch (error) {
  //       console.error("Error fetching banner:", error);
  //     }
  //   };

  //   fetchCategory();
  // }, []);

  const { data: bannerData, isLoading: loading } = useGetBannerById(id);
  const banner = bannerData?.data.data;
  const { data: allCategories } = useAllCategories();
  const categories = allCategories?.data.data?.original;
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("noId")}
      </div>
    );

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("loading")}
      </div>
    );

  if (!banner)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("notFound")}
      </div>
    );

  return (
    <div className="banner-details p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        {t("title")}
      </h1>

      {/* Basic Info */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
          {t("basicInfo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <p>
            <strong>{t("bannerTitle")}:</strong> {banner.title}
          </p>
          <p>
            <strong>{t("linkType")}:</strong> {banner.link_type}
          </p>

          <p>
            <strong>{t("linkId")}:</strong>{" "}
            {banner.link_type === "category"
              ? categories.find((cat) => cat.id === banner.link_id)?.name ||
                t("unknown")
              : banner.link_id}
          </p>

          <p>
            <strong>{t("position")}:</strong>{" "}
            {banner.link_type === "category"
              ? `before ${
                  categories.find((cat) => cat.id === banner.link_id)?.name ||
                  t("unknown")
                }`
              : banner.link_id}
          </p>
          <p>
            <strong>{t("isActive")}:</strong>{" "}
            {banner.is_active ? t("yes") : t("no")}
          </p>
          <p>
            <strong>{t("url")}:</strong>{" "}
            {banner.url ? (
              <Link
                className="inline-block px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                to={banner.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("visitLink")}
              </Link>
            ) : (
              <span className="text-gray-500">{t("notAvailable")}</span>
            )}
          </p>
        </div>
      </section>

      {/* Image */}
      {banner.image && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
            {t("bannerImage")}
          </h2>
          <div className="w-full flex justify-center">
            <img
              src={banner.image}
              alt={banner.title}
              className="max-w-xs h-auto rounded-lg shadow-md"
            />
          </div>
        </section>
      )}

      {/* Timestamps */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          {t("timestamps")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <p>
            <strong>{t("createdAt")}:</strong> {formatDate(banner.created_at)}
          </p>
          <p>
            <strong>{t("updatedAt")}:</strong> {formatDate(banner.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default BannerDetails;
