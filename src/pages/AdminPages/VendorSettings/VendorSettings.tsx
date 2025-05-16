import React from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UserInfoCard from "../../../components/admin/UserProfile/UserInfoCard";
import UserAddressCard from "../../../components/admin/UserProfile/UserAddressCard";
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
      <PageBreadcrumb
        pageTitle={t("vendor.vendorProfile")}
        userType="super_admin"
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          {/* <UserMetaCard /> */}
          <VendorEditPage />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
};

export default VendorSettings;
