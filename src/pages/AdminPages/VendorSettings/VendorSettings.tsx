import SEO from "../../../components/common/SEO/seo";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import VendorEditPage from "./VendorInfoCard";
import { useTranslation } from "react-i18next";

const VendorSettings = () => {
  const { t } = useTranslation(["UpdateVendor", "Meta"]);
  return (
    <>
      <SEO
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
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("UpdateVendor:vendor.vendorProfile")}
        userType="admin"
      />
      <div className="space-y-6">
        <VendorEditPage />
      </div>
    </>
  );
};

export default VendorSettings;
