import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UserInfoCard from "../../../components/admin/UserProfile/UserInfoCard";
import PageMeta from "../../../components/common/SEO/PageMeta";
import { useTranslation } from "react-i18next";
export default function UserProfiles() {
  const { t } = useTranslation(["UserProfile"]);
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb
        pageTitle={t("userProfile.title")}
        userType="super_admin"
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {t("userProfile.title")}
        </h3>
        <div className="space-y-6">
          {/* <UserMetaCard /> */}
          <UserInfoCard userType="super_admin" />
        </div>
      </div>
    </>
  );
}
