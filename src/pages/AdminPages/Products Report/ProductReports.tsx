import { useEffect, useState } from "react";
import EcommerceMetrics from "../../../components/common/Home/EcommerceMetrics";
import { GroupIcon, BoxIconLine } from "../../../icons";
import FilterRangeDate from "../../../components/admin/reports/FilterRangeDate";
import TopSelligProducts from "../../../components/admin/productReports/TopSellingProducts";
import { useTranslation } from "react-i18next";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // Removed PageMeta import
import SEO from "../../../components/common/SEO/seo"; // Ensured SEO component is imported
import { useProductData } from "../../../hooks/Api/Admin/useProductsReports/useProductReport";

const ProductReports = () => {
  const [totalProductSell, setTotalProductSell] = useState([]);
  const [numbersData, setNumbersData] = useState({
    allProduct: 0,
    activeProduct: 0,
    inactiveProduct: 0,
    outOfStockProduct: 0,
    lowStockProduct: 0,
  });

  const [searchValues, setSearchValues] = useState({
    start_date: "",
    end_date: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [unauthorized, setUnauthorized] = useState("");

  const { data, isLoading, isError, error } = useProductData(searchValues);
  const productsReportsData = data;

  const { t } = useTranslation(["ProductsReports", "Meta"]); // استخدام الـ namespaces هنا

  useEffect(() => {
    if (productsReportsData) {
      setNumbersData({
        allProduct: productsReportsData.allProduct,
        activeProduct: productsReportsData.activeProduct,
        inactiveProduct: productsReportsData.inactiveProduct,
        outOfStockProduct: productsReportsData.outOfStockProduct,
        lowStockProduct: productsReportsData.lowStockProduct,
      });
      setTotalProductSell(productsReportsData.topSellingProducts);
    }
  }, [productsReportsData]);

  useEffect(() => {
    if (isError && error) {
      const err = error as any;
      if (err?.response?.status === 401) {
        setUnauthorized(t("ProductsReports:unauthorized")); // إضافة namespace
      } else {
        setGeneralError(t("ProductsReports:somethingWentWrong")); // إضافة namespace
      }
    }
  }, [isError, error, t]);

  const handleFilter = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isLoading) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for loading state
          title={{
            ar: "تشطيبة - تقارير المنتجات - جارٍ التحميل",
            en: "Tashtiba - Product Reports - Loading",
          }}
          description={{
            ar: "جارٍ تحميل تقارير المنتجات الشاملة في تشطيبة. يرجى الانتظار.",
            en: "Loading comprehensive product reports on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تقارير المنتجات",
              "إحصائيات المنتجات",
              "تقارير المخزون",
              "المنتجات الأكثر مبيعًا",
              "تشطيبة",
              "تحليل المنتجات",
            ],
            en: [
              "product reports",
              "product statistics",
              "inventory reports",
              "top selling products",
              "Tashtiba",
              "product analytics",
            ],
          }}
        />
        <p className="text-center mt-5">{t("ProductsReports:loading")}</p>{" "}
        {/* إضافة namespace */}
      </>
    );
  }

  if (unauthorized) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for unauthorized state
          title={{
            ar: "تشطيبة - تقارير المنتجات - غير مصرح",
            en: "Tashtiba - Product Reports - Unauthorized",
          }}
          description={{
            ar: "لا يوجد تصريح للوصول إلى تقارير المنتجات في تشطيبة. يرجى تسجيل الدخول بحساب مسؤول.",
            en: "Unauthorized access to product reports on Tashtiba. Please log in with an administrator account.",
          }}
          keywords={{
            ar: [
              "تقارير المنتجات",
              "غير مصرح",
              "إدارة",
              "تشطيبة",
              "تسجيل الدخول",
            ],
            en: [
              "product reports",
              "unauthorized",
              "admin",
              "Tashtiba",
              "login",
            ],
          }}
        />{" "}
        <p className="text-center text-red-500 mt-5">{unauthorized}</p>
      </>
    );
  }

  if (generalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for general error state
          title={{
            ar: "تشطيبة - تقارير المنتجات - خطأ",
            en: "Tashtiba - Product Reports - Error",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحميل تقارير المنتجات في تشطيبة. يرجى المحاولة مرة أخرى.",
            en: "A general error occurred while loading product reports on Tashtiba. Please try again.",
          }}
          keywords={{
            ar: ["تقارير المنتجات", "خطأ", "مشكلة", "تشطيبة", "فشل التحميل"],
            en: [
              "product reports",
              "error",
              "issue",
              "Tashtiba",
              "loading failed",
            ],
          }}
        />{" "}
        <p className="text-center text-red-500 mt-5">{generalError}</p>
      </>
    );
  }

  return (
    <>
      <SEO // PageMeta replaced with SEO, and data directly set for main content
        title={{
          ar: "تشطيبة - تقارير المنتجات",
          en: "Tashtiba - Product Reports",
        }}
        description={{
          ar: "استعرض تقارير شاملة عن أداء المنتجات في متجر تشطيبة، بما في ذلك إحصائيات المنتجات النشطة وغير النشطة، نفاد المخزون، والمنتجات الأكثر مبيعاً.",
          en: "View comprehensive product performance reports for Tashtiba store, including statistics on active and inactive products, out-of-stock items, and top-selling products.",
        }}
        keywords={{
          ar: [
            "تقارير المنتجات",
            "إحصائيات المنتجات",
            "إدارة المخزون",
            "المنتجات الأكثر مبيعًا",
            "تشطيبة",
            "تحليل المنتجات",
            "تقرير المخزون",
          ],
          en: [
            "product reports",
            "product statistics",
            "inventory management",
            "top selling products",
            "Tashtiba",
            "product analytics",
            "stock report",
          ],
        }}
      />{" "}
      <FilterRangeDate setSearchParam={handleFilter} />
      <div className="col-span-6 space-y-6 ">
        <EcommerceMetrics
          parentClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
          metrics={[
            {
              label: t("ProductsReports:allProducts"), // إضافة namespace
              value: numbersData.allProduct,
              percentage: 11.01,
              icon: GroupIcon,
            },
            {
              label: t("ProductsReports:activeProducts"), // إضافة namespace
              value: numbersData.activeProduct,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("ProductsReports:inactiveProducts"), // إضافة namespace
              value: numbersData.inactiveProduct,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("ProductsReports:outOfStockProducts"), // إضافة namespace
              value: numbersData.outOfStockProduct,
              percentage: -9.05,
              icon: BoxIconLine,
            },
            {
              label: t("ProductsReports:lowStockProducts"), // إضافة namespace
              value: numbersData.lowStockProduct,
              percentage: -9.05,
              icon: BoxIconLine,
            },
          ]}
        />
      </div>
      <div className="col-span-12 xl:col-span-7 mt-3">
        <TopSelligProducts products={totalProductSell} />
      </div>
    </>
  );
};

export default ProductReports;
