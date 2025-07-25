import { useEffect, useState } from "react";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useRoles } from "../../../hooks/Api/SuperAdmin/useRoles/useSuperAdminRoles";
import { useCreateAdmin } from "../../../hooks/Api/SuperAdmin/useSuperAdminAdmis/useSuperAdminAdmins";
// import PageMeta from "../../common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component
import { AxiosError } from "axios";
type Role = {
  name: string;
};
export default function CreateAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingRoleError, setFetchingRoleError] = useState("");
  const [errors, setErrors] = useState({
    first_name: [] as string[],
    last_name: [] as string[],
    phone: [] as string[],
    email: [] as string[],
    password: [] as string[],
    role: [] as string[],
    global: "" as string,
    general: "" as string,
  });
  const [adminData, setAdminData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
  const [clientSideErrors, setClientSideErrors] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
  const { t } = useTranslation(["CreateAdmin", "Meta"]);
  const { dir } = useDirectionAndLanguage();
  const validate = () => {
    const newErrors = {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      role: "",
    };
    if (!adminData.first_name) {
      newErrors.first_name = t("admin.errors.first_name");
    } else if (!adminData.last_name) {
      newErrors.last_name = t("admin.errors.last_name");
    } else if (!adminData.email) {
      newErrors.email = t("admin.errors.email_required");
    } else if (
      /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(adminData.email) // الخطأ هنا كان يستخدم newErrors.email بدل adminData.email
    ) {
      // تم تصحيح هذا السطر: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(adminData.email)
      newErrors.email = t("admin.errors.email_invalid");
    } else if (!adminData.phone) {
      newErrors.phone = t("admin.errors.phone_required");
    } else if (!/^01[0125][0-9]{8}$/.test(adminData.phone)) {
      newErrors.phone = t("admin.errors.phone_invalid");
    } else if (!adminData.password) {
      newErrors.password = t("admin.errors.password");
    } else if (adminData.password.length < 8) {
      newErrors.password = t("admin.errors.length_password");
    } else if (!adminData.role) {
      newErrors.role = t("admin.errors.role");
    }
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setAdminData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const { data, isError: isRoleError, error: roleError } = useRoles();
  const options = data?.data.data;
  useEffect(() => {
    if (isRoleError && roleError instanceof AxiosError) {
      const status = roleError?.response?.status;
      if (status === 401 || status === 403) {
        setFetchingRoleError(t("admin.errors.global"));
      } else {
        setFetchingRoleError(t("admin.errors.fetching_roles"));
      }
    }
  }, [isRoleError, roleError, t]);
  console.log(fetchingRoleError);

  const { mutateAsync } = useCreateAdmin();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      first_name: [],
      last_name: [],
      phone: [],
      email: [],
      password: [],
      role: [],
      global: "",
      general: "",
    });
    if (!validate()) return;
    setLoading(true);
    try {
      await mutateAsync(adminData);
      navigate("/super_admin/admins", {
        state: { successCreate: t("admin.success_message") },
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("admin.errors.global"),
        });
        return;
      }
      const rawErrors = error?.response?.data.errors;

      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};

        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) {
            formattedErrors[err.code] = [];
          }
          formattedErrors[err.code].push(err.message);
        });

        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors((prev) => ({ ...prev, general: t("admin.errors.general") }));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - إنشاء مسؤول جديد (سوبر أدمن)",
          en: "Tashtiba - Create New Admin (Super Admin)",
        }}
        description={{
          ar: "صفحة إنشاء حساب مسؤول جديد بواسطة المشرف العام في نظام تشطيبة. املأ البيانات المطلوبة لإنشاء حساب إداري.",
          en: "Create a new administrator account by Super Admin on Tashtiba system. Fill in the required details to set up an admin account.",
        }}
        keywords={{
          ar: [
            "إنشاء مسؤول",
            "إضافة أدمن",
            "حساب مسؤول جديد",
            "تشطيبة",
            "إدارة المستخدمين",
            "صلاحيات",
            "سوبر أدمن",
          ],
          en: [
            "create admin",
            "add administrator",
            "new admin account",
            "Tashtiba",
            "user management",
            "permissions",
            "super admin",
          ],
        }}
      />{" "}
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("admin.create_title")}
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-8 flex justify-between items-center flex-col"
      >
        {errors.global && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {errors.global}
          </p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {errors.general}
          </p>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label htmlFor="input">{t("admin.first_name")}</Label>
            <Input
              type="text"
              id="input"
              name="first_name"
              placeholder={t("admin.placeholder.first_name")}
              onChange={handleChange}
            />
            {errors.first_name[0] && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name[0]}
              </p>
            )}
            {clientSideErrors.first_name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.first_name}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="inputTwo">{t("admin.last_name")}</Label>
            <Input
              type="text"
              id="inputTwo"
              name="last_name"
              placeholder={t("admin.placeholder.last_name")}
              onChange={handleChange}
            />
            {errors.last_name[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>
            )}
            {clientSideErrors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.last_name}
              </p>
            )}
          </div>
        </div>
        <div className="w-full">
          <Label>{t("admin.select_role")}</Label>
          <Select
            options={options?.map((role: Role) => ({
              value: role?.name,
              label: role?.name,
            }))}
            value={adminData?.role}
            onChange={handleSelectChange}
            placeholder={t("admin.placeholder.select_role")}
            className="dark:bg-dark-900"
          />
          {fetchingRoleError && (
            <p className="text-red-500 text-sm mt-1">{fetchingRoleError}</p>
          )}
          {errors.role[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
          )}
          {clientSideErrors.role && (
            <p className="text-red-500 text-sm mt-1">{clientSideErrors.role}</p>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="inputTwo">{t("admin.email")}</Label>
          <Input
            type="email"
            id="inputTwo"
            name="email"
            placeholder={t("admin.placeholder.email")}
            onChange={handleChange}
          />
          {errors.email[0] && (
            <p className="text-red-500 text-sm mt-1">
              {t("admin.errors.email_taken")}
            </p>
          )}
          {clientSideErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.email}
            </p>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="inputTwo">{t("admin.phone")}</Label>
          <Input
            type="text"
            id="inputTwo"
            name="phone"
            placeholder={t("admin.placeholder.phone")}
            onChange={handleChange}
          />
          {errors.phone[0] && (
            <p className="text-red-500 text-sm mt-1">
              {t("admin.errors.phone_taken")}
            </p>
          )}
          {clientSideErrors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.phone}
            </p>
          )}
        </div>
        <div className="w-full">
          <Label>{t("admin.password")}</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("admin.placeholder.password")}
              onChange={handleChange}
            />
            {errors.password[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
            {clientSideErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.password}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute z-30 -translate-y-1/2 cursor-pointer ${
                dir === "rtl" ? "left-4" : "right-4"
              } top-1/2`}
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 flex gap-4 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <FiUserPlus size={20} />
          {loading ? t("admin.button.submitting") : t("admin.button.submit")}
        </button>
      </form>
    </div>
  );
}