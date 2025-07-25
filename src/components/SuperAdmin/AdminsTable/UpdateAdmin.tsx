import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { FiUserPlus } from "react-icons/fi";
import {
  useGetAdminById,
  useUpdateAdmin,
} from "../../../hooks/Api/SuperAdmin/useSuperAdminAdmis/useSuperAdminAdmins";
import { useRoles } from "../../../hooks/Api/SuperAdmin/useRoles/useSuperAdminRoles";
// import PageMeta from "../../common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component
import {
  ClientErrors,
  ServerErrors,
  UpdateAdminInput,
} from "../../../types/Admins";
import { AxiosError } from "axios";
import { Role } from "../../../types/Roles";
const UpdateAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fetchingRoleError, setFetchingRoleError] = useState<string>("");

  const [updateData, setUpdateData] = useState<UpdateAdminInput>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ServerErrors>({
    first_name: [],
    last_name: [],
    phone: [],
    email: [],
    password: [],
    role: [],
    global: "",
    general: "",
  });

  const [clientSideErrors, setClientSideErrors] = useState<ClientErrors>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
  const validate = () => {
    const newErrors = {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      role: "",
    };
    if (!updateData.first_name) {
      newErrors.first_name = t("admin.errors.first_name");
    } else if (!updateData.last_name) {
      newErrors.last_name = t("admin.errors.last_name");
    } else if (!updateData.email) {
      newErrors.email = t("admin.errors.email_required");
    } else if (
      !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        updateData.email
      )
    ) {
      newErrors.email = t("admin.errors.email_invalid");
    } else if (!updateData.phone) {
      newErrors.phone = t("admin.errors.phone_required");
    } else if (!/^01[0125][0-9]{8}$/.test(updateData.phone)) {
      newErrors.phone = t("admin.errors.phone_invalid");
    } else if (!updateData.role) {
      newErrors.role = t("admin.errors.role");
    } else if (updateData.password && updateData.password.length < 8) {
      newErrors.password = t("admin.errors.length_password");
    }
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };
  const { t } = useTranslation(["UpdateAdmin", "Meta"]);
  const { dir } = useDirectionAndLanguage();

  const {
    data,
    isError: isErrorFetchAdmin,
    error: errorFetchAdmin,
    isLoading,
  } = useGetAdminById(id);

  const admin = data;
  useEffect(() => {
    if (!admin) return;
    setUpdateData({
      first_name: admin?.first_name || "",
      last_name: admin?.last_name || "",
      phone: admin?.phone || "",
      email: admin?.email || "",
      password: "",
      role: admin?.roles?.[0]?.name || "",
    });
  }, [admin]);

  useEffect(() => {
    if (isErrorFetchAdmin && errorFetchAdmin instanceof AxiosError) {
      const status = errorFetchAdmin?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("admin.errors.global"),
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("admin.errors.fetching_admin"),
        }));
      }
    }
  }, [isErrorFetchAdmin, errorFetchAdmin, t]);

  // Fetch roles
  const { data: roles, isError: isRoleError, error: roleError } = useRoles();
  const options = roles?.data.data;
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
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle role selection
  const handleSelectChange = (value: string) => {
    setUpdateData((prev) => ({
      ...prev,
      role: value,
    }));
  };
  const { mutateAsync } = useUpdateAdmin(id!!);
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
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
    try {
      if (id) {
        const dataToSend = {
          ...updateData,
        };

        if (!dataToSend.password) {
          delete dataToSend.password;
        }

        await mutateAsync({ id: +id, adminData: dataToSend });
        navigate("/super_admin/admins", {
          state: { successEdit: t("admin.success_message") },
        });
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("admin.errors.global"),
        });
        return;
      }
      const rawErrors = err?.response?.data?.errors;

      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};
        rawErrors.forEach((error: { code: string; message: string }) => {
          if (!formattedErrors[error.code]) {
            formattedErrors[error.code] = [];
          }
          formattedErrors[error.code].push(error.message);
        });
        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors((prev) => ({ ...prev, general: t("admin.errors.general") }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for loading state
          title={{
            ar: "تشطيبة - تحديث مسؤول - جارٍ التحميل (سوبر أدمن)",
            en: "Tashtiba - Update Admin - Loading (Super Admin)",
          }}
          description={{
            ar: "جارٍ تحميل بيانات المسؤول للتحديث بواسطة المشرف العام في تشطيبة. يرجى الانتظار.",
            en: "Loading admin data for update by Super Admin on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تحديث مسؤول",
              "تحميل مسؤول",
              "إدارة المسؤولين",
              "سوبر أدمن",
              "حسابات المسؤولين",
            ],
            en: [
              "update admin",
              "loading admin",
              "admin management",
              "super admin",
              "admin accounts",
            ],
          }}
        />{" "}
        <p className="text-center mt-5">{t("admin.loading") || "Loading..."}</p>
      </>
    );

  if (!data && !errors.general) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for not found state
          title={{
            ar: "تشطيبة - تحديث مسؤول - غير موجود (سوبر أدمن)",
            en: "Tashtiba - Update Admin - Not Found (Super Admin)",
          }}
          description={{
            ar: "المسؤول المطلوب للتحديث غير موجود في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested admin for update was not found on Tashtiba. Please verify the ID.",
          }}
          keywords={{
            ar: [
              "مسؤول غير موجود",
              "تحديث مسؤول",
              "خطأ 404",
              "سوبر أدمن",
              "إدارة المسؤولين",
            ],
            en: [
              "admin not found",
              "update admin",
              "404 error",
              "super admin",
              "admin management",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("not_found")}
        </div>
      </>
    );
  }
  if (errors.general) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for general error state
          title={{
            ar: "تشطيبة - خطأ في تحديث المسؤول (سوبر أدمن)",
            en: "Tashtiba - Admin Update Error (Super Admin)",
          }}
          description={{
            ar: "حدث خطأ عام أثناء محاولة تحديث بيانات المسؤول بواسطة المشرف العام في تشطيبة. يرجى المحاولة مرة أخرى.",
            en: "An error occurred while attempting to update admin data by Super Admin on Tashtiba. Please try again.",
          }}
          keywords={{
            ar: [
              "خطأ تحديث مسؤول",
              "مشكلة مسؤول",
              "تحديث تشطيبة",
              "سوبر أدمن",
              "فشل التعديل",
            ],
            en: [
              "admin update error",
              "admin issue",
              "Tashtiba update",
              "super admin",
              "update failed",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {errors.general || t("admin.errors.general")}
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <SEO
          title={{
            ar: `تشطيبة - تحديث مسؤول ${admin?.first_name || ""}`,
            en: `Tashtiba - Update Admin ${
              admin?.first_name || ""
            } (Super Admin)`,
          }}
          description={{
            ar: `صفحة تحديث بيانات المسؤول "${
              admin?.first_name || "غير معروف"
            }" بواسطة المشرف العام في تشطيبة. عدّل المعلومات والصلاحيات.`,
            en: `Update administrator "${
              admin?.first_name || "unknown"
            }" details by Super Admin on Tashtiba. Modify info and permissions.`,
          }}
          keywords={{
            ar: [
              `تحديث مسؤول ${admin?.first_name || ""}`,
              "تعديل أدمن",
              "إدارة المسؤولين",
              "سوبر أدمن",
              "حسابات المسؤولين",
              "تشطيبة",
            ],
            en: [
              `update admin ${admin?.first_name || ""}`,
              "edit admin",
              "admin management",
              "super admin",
              "admin accounts",
              "Tashtiba",
            ],
          }}
        />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("admin.update_title")}
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-10 flex flex-col items-center"
      >
        {errors.global && (
          <p className="text-error-500 text-sm mt-1">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4">{errors.general}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* First Name */}
          <div className="col-span-1">
            <Label htmlFor="first_name">{t("admin.first_name")}</Label>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              value={updateData.first_name}
              placeholder={t("admin.placeholder.first_name")}
              onChange={handleChange}
            />
            {errors.first_name?.[0] && (
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

          {/* Last Name */}
          <div className="col-span-1">
            <Label htmlFor="last_name">{t("admin.last_name")}</Label>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              value={updateData.last_name}
              placeholder={t("admin.placeholder.last_name")}
              onChange={handleChange}
            />
            {errors.last_name?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>
            )}
            {clientSideErrors.last_name && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.last_name}
              </p>
            )}
          </div>
          {/* Role */}
          <div className="col-span-1">
            <Label htmlFor="role">{t("admin.select_role")}</Label>
            <Select
              options={options?.map((role: Role) => ({
                value: role.name,
                label: role.name,
              }))}
              onChange={handleSelectChange}
              value={updateData.role}
              placeholder={t("admin.placeholder.select_role")}
            />
            {errors.role?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
            )}
            {clientSideErrors.role && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.role}
              </p>
            )}
            {fetchingRoleError && (
              <p className="text-red-500 text-sm mt-1">{fetchingRoleError}</p>
            )}
          </div>
          {/* Email */}
          <div className="col-span-1">
            <Label htmlFor="email">{t("admin.email")}</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={updateData.email}
              placeholder={t("admin.placeholder.email")}
              onChange={handleChange}
            />
            {errors.email?.[0] && (
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

          {/* Phone */}
          <div className="col-span-1">
            <Label htmlFor="phone">{t("admin.phone")}</Label>
            <Input
              type="text"
              name="phone"
              id="phone"
              value={updateData.phone}
              placeholder={t("admin.placeholder.phone")}
              onChange={handleChange}
            />
            {errors.phone?.[0] && (
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
          {/* Password */}
          <div className="col-span-1">
            <Label htmlFor="password">{t("admin.password")}</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={updateData.password}
                placeholder={t("admin.placeholder.password")}
                onChange={handleChange}
              />
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
            {errors.password?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
            {clientSideErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.password}
              </p>
            )}
          </div>
        </div>
        {/* Submit Button */}
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
};

export default UpdateAdmin;
