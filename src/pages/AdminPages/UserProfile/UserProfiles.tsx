import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UserInfoCard from "../../../components/admin/UserProfile/UserInfoCard";
import SEO from "../../../components/common/SEO/seo"; 
import { useTranslation } from "react-i18next";

export default function UserProfiles() {
  const { t } = useTranslation(["UserProfile", "Meta"]);
  return (
    <>
      <SEO 
        title={{
          ar: "الملف الشخصي للمستخدم",
          en: "User Profile",
        }}
        description={{
          ar: "صفحة الملف الشخصي للمستخدم في تشطيبة، استعرض وحدث بياناتك الشخصية وإعدادات الحساب.",
          en: "User profile page on Tashtiba, view and update your personal information and account settings.",
        }}
        keywords={{
          ar: [
            "الملف الشخصي",
            "بيانات المستخدم",
            "إعدادات الحساب",
            "تشطيبة",
            "البروفايل",
            "إدارة المستخدم",
          ],
          en: [
            "user profile",
            "account settings",
            "personal data",
            "Tashtiba",
            "profile management",
            "user info",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb pageTitle="Profile" userType="admin" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {t("UserProfile:userProfile.title")}
        </h3>
        <div className="space-y-6">
          <UserInfoCard userType="admin" />
        </div>
      </div>
    </>
  );
}
