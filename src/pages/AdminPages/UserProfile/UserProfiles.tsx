import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UserInfoCard from "../../../components/admin/UserProfile/UserInfoCard";
import PageMeta from "../../../components/common/SEO/PageMeta";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Tashtiba | Admin Profile"
        description="Show Your Profile"
      />
      <PageBreadcrumb pageTitle="Profile" userType="admin" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {/* <UserMetaCard /> */}
          <UserInfoCard userType="admin" />
        </div>
      </div>
    </>
  );
}
