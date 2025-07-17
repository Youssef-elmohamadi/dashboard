// import PageMeta from "../../../components/common/SEO/PageMeta"; // Removed PageMeta import
import SEO from "../../../components/common/SEO/seo"; // Ensured SEO component is imported
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import VendorEditPage from "./VendorInfoCard";
import { useTranslation } from "react-i18next";

const VendorSettings = () => {
  const { t } = useTranslation(["UpdateVendor", "Meta"]); // Using namespaces here
  return (
    <>
      <SEO // PageMeta replaced with SEO, and data directly set
        title={{
          ar: "تشطيبة - إعدادات البائع",
          en: "Tashtiba - Vendor Settings",
        }}
        description={{
          ar: "صفحة إعدادات البائع في تشطيبة. قم بتحديث بيانات ملفك الشخصي كبائع.",
          en: "Vendor settings page on Tashtiba. Update your vendor profile information.",
        }}
        keywords={{
          ar: [
            "إعدادات البائع",
            "ملف البائع",
            "تحديث البائع",
            "تشطيبة",
            "إدارة البائعين",
          ],
          en: [
            "vendor settings",
            "vendor profile",
            "update vendor",
            "Tashtiba",
            "vendor management",
          ],
        }}
      />
      <PageBreadcrumb
        pageTitle={t("UpdateVendor:vendor.vendorProfile")}
        userType="admin"
      />{" "}
      {/* Added namespace */}
      <div className="space-y-6">
        <VendorEditPage />
      </div>
    </>
  );
};

export default VendorSettings;
