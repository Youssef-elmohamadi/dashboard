import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import VendorEditPage from "./VendorInfoCard";
import { useTranslation } from "react-i18next";
const VendorSettings = () => {
  const { t } = useTranslation(["UpdateVendor"]);
  return (
    <>
      <PageMeta
        title="Tashtiba | Vendor Settings"
        description="Update Your Vendor Information"
      />
      <PageBreadcrumb pageTitle={t("vendor.vendorProfile")} userType="admin" />
      <div className="space-y-6">
        {/* <UserMetaCard /> */}
        <VendorEditPage />
      </div>
    </>
  );
};

export default VendorSettings;
