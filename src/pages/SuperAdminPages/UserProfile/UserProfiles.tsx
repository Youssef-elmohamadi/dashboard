// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم استيراد SEO component
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UserInfoCard from "../../../components/admin/UserProfile/UserInfoCard";
import { useTranslation } from "react-i18next";
export default function UserProfiles() {
  const { t } = useTranslation(["UserProfile", "Meta"]);
  return (
    <>
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - الملف الشخصي للمشرف العام",
          en: "Tashtiba - Super Admin Profile",
        }}
        description={{
          ar: "صفحة الملف الشخصي للمشرف العام في تشطيبة. استعرض وحدث بياناتك الشخصية وإعدادات الحساب كمسؤول أعلى.",
          en: "Super Admin profile page on Tashtiba. View and update your personal information and account settings as a super administrator.",
        }}
        keywords={{
          ar: [
            "الملف الشخصي للمشرف العام",
            "بيانات السوبر أدمن",
            "إعدادات حساب المشرف",
            "تشطيبة",
            "البروفايل الإداري",
            "إدارة السوبر أدمن",
          ],
          en: [
            "super admin profile",
            "super admin data",
            "admin account settings",
            "Tashtiba",
            "admin profile",
            "super admin management",
          ],
        }}
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
