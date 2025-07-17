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
} from "../../../hooks/Api/Admin/useVendorAdmins/useVendorAdmins";
import { useRoles } from "../../../hooks/Api/Admin/useRoles/useRoles";
// import PageMeta from "../../common/SEO/PageMeta"; // تم التعليق على استيراد PageMeta
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
  const [fetchingRoleError, setFetchingRoleError] = useState("");
  const { t } = useTranslation(["UpdateAdmin", "Meta"]);
  const { dir } = useDirectionAndLanguage();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [updateData, setUpdateData] = useState<UpdateAdminInput>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
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

  // Fetch admin by id
  const {
    data,
    isError: isErrorFetchAdmin,
    error: errorFetchAdmin,
    isLoading,
  } = useGetAdminById(id);

  // Set initial form values when admin data loads
  useEffect(() => {
    const admin = data;
    if (!admin) return;

    setUpdateData({
      first_name: admin.first_name || "",
      last_name: admin.last_name || "",
      phone: admin.phone || "",
      email: admin.email || "",
      password: "",
      role: admin.roles?.[0]?.name || "",
    });
  }, [data]);

  // Handle errors on fetching admin
  useEffect(() => {
    if (isErrorFetchAdmin && errorFetchAdmin instanceof AxiosError) {
      const status = errorFetchAdmin?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateAdmin:admin.errors.global"),
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("UpdateAdmin:admin.errors.general"),
        }));
      }
    }
  }, [isErrorFetchAdmin, errorFetchAdmin, t]);

  // Fetch roles for select options
  const {
    data: rolesData,
    isError: isRoleError,
    error: roleError,
  } = useRoles();
  const options = rolesData?.data.data;
  useEffect(() => {
    if (isRoleError && roleError instanceof AxiosError) {
      const status = roleError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateAdmin:admin.errors.global"),
        }));
      } else {
        setFetchingRoleError(t("UpdateAdmin:admin.errors.fetching_roles"));
      }
    }
  }, [isRoleError, roleError, t]);
  // Client-side validation
  const validate = () => {
    const newErrors = {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      role: "",
    };

    if (!updateData.first_name)
      newErrors.first_name = t("UpdateAdmin:admin.errors.first_name");
    if (!updateData.last_name)
      newErrors.last_name = t("UpdateAdmin:admin.errors.last_name");
    if (!updateData.email)
      newErrors.email = t("UpdateAdmin:admin.errors.email_required");
    else if (
      !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        updateData.email
      )
    )
      newErrors.email = t("UpdateAdmin:admin.errors.email_invalid");

    if (!updateData.phone)
      newErrors.phone = t("UpdateAdmin:admin.errors.phone_required");
    else if (!/^01[0125][0-9]{8}$/.test(updateData.phone))
      newErrors.phone = t("UpdateAdmin:admin.errors.phone_invalid");

    if (!updateData.role) newErrors.role = t("UpdateAdmin:admin.errors.role");

    if (updateData.password && updateData.password.length < 8)
      newErrors.password = t("UpdateAdmin:admin.errors.length_password");

    setClientSideErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle role select changes
  const handleSelectChange = (value: string) => {
    setUpdateData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  // Update admin mutation
  const { mutateAsync } = useUpdateAdmin(id!!);

  // Form submit handler
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
      if (id) {
        const dataToSend = { ...updateData };
        if (!dataToSend.password) delete dataToSend.password;

        await mutateAsync({ id: id, adminData: dataToSend });
        navigate("/admin/admins", {
          state: { successEdit: t("UpdateAdmin:admin.success_message") },
        });
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateAdmin:admin.errors.global"),
        }));
        return;
      }
      const rawErrors = error?.response?.data?.errors;
      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};
        rawErrors.forEach(
          ({ code, message }: { code: string; message: string }) => {
            if (!formattedErrors[code]) formattedErrors[code] = [];
            formattedErrors[code].push(message);
          }
        );
        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("UpdateAdmin:admin.errors.general"),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <>
        <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
          title={{
            ar: "تشطيبة - تحديث مسؤول",
            en: "Tashtiba - Update Admin",
          }}
          description={{
            ar: "صفحة تحديث بيانات حساب المسؤول في نظام تشطيبة. قم بتعديل المعلومات وصلاحيات الحساب.",
            en: "Update administrator account details in Tashtiba system. Modify account information and permissions.",
          }}
          keywords={{
            ar: [
              "تحديث مسؤول",
              "تعديل أدمن",
              "تحديث حساب مسؤول",
              "تشطيبة",
              "إدارة المستخدمين",
              "صلاحيات",
            ],
            en: [
              "update admin",
              "edit administrator",
              "update admin account",
              "Tashtiba",
              "user management",
              "permissions",
            ],
          }}
        />
        <p className="text-center mt-5">
          {t("UpdateAdmin:admin.loading") || "Loading..."}
        </p>
      </>
    );

  if (!data && !errors.general) {
    return (
      <>
        <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
          title={{
            ar: "تشطيبة - مسؤول غير موجود",
            en: "Tashtiba - Admin Not Found",
          }}
          description={{
            ar: "المسؤول المطلوب تحديث بياناته غير موجود في نظام تشطيبة.",
            en: "The requested administrator for update was not found in Tashtiba system.",
          }}
          keywords={{
            ar: [
              "مسؤول غير موجود",
              "خطأ",
              "تحديث أدمن",
              "تشطيبة",
              "إدارة المستخدمين",
            ],
            en: [
              "admin not found",
              "error",
              "update admin",
              "Tashtiba",
              "user management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("UpdateAdmin:not_found")}
        </div>
      </>
    );
  }
  if (errors.general) {
    return (
      <>
        <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
          title={{
            ar: "تشطيبة - خطأ في تحديث المسؤول",
            en: "Tashtiba - Admin Update Error",
          }}
          description={{
            ar: "حدث خطأ عام أثناء محاولة تحديث بيانات المسؤول في تشطيبة. يرجى المحاولة مرة أخرى.",
            en: "A general error occurred while attempting to update administrator data in Tashtiba. Please try again.",
          }}
          keywords={{
            ar: [
              "خطأ تحديث مسؤول",
              "مشكلة أدمن",
              "تحديث تشطيبة",
              "فشل التعديل",
            ],
            en: [
              "admin update error",
              "admin issue",
              "Tashtiba update",
              "update failed",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {errors.general || t("UpdateAdmin:admin.errors.general")}
        </div>
      </>
    );
  }

  return (
    <div>
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - تحديث مسؤول",
          en: "Tashtiba - Update Admin",
        }}
        description={{
          ar: "صفحة تحديث بيانات حساب المسؤول في نظام تشطيبة. قم بتعديل المعلومات وصلاحيات الحساب.",
          en: "Update administrator account details in Tashtiba system. Modify account information and permissions.",
        }}
        keywords={{
          ar: [
            "تحديث مسؤول",
            "تعديل أدمن",
            "تحديث حساب مسؤول",
            "تشطيبة",
            "إدارة المستخدمين",
            "صلاحيات",
          ],
          en: [
            "update admin",
            "edit administrator",
            "update admin account",
            "Tashtiba",
            "user management",
            "permissions",
          ],
        }}
      />
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("UpdateAdmin:admin.update_title")}
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-10 flex flex-col items-center"
      >
        {errors.general && (
          <p className="text-red-500 text-sm mt-4">{errors.general}</p>
        )}
        {errors.global && (
          <p className="text-error-500 text-sm mt-1">{errors.global}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* First Name */}
          <div className="col-span-1">
            <Label htmlFor="first_name">
              {t("UpdateAdmin:admin.first_name")}
            </Label>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              value={updateData.first_name}
              placeholder={t("UpdateAdmin:admin.placeholder.first_name")}
              onChange={handleChange}
            />
            {(errors.first_name?.[0] || clientSideErrors.first_name) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name?.[0] || clientSideErrors.first_name}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="col-span-1">
            <Label htmlFor="last_name">
              {t("UpdateAdmin:admin.last_name")}
            </Label>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              value={updateData.last_name}
              placeholder={t("UpdateAdmin:admin.placeholder.last_name")}
              onChange={handleChange}
            />
            {(errors.last_name?.[0] || clientSideErrors.last_name) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.last_name?.[0] || clientSideErrors.last_name}
              </p>
            )}
          </div>
        </div>

        {/* Role */}
        <div className="col-span-1 w-full">
          <Label htmlFor="role">{t("UpdateAdmin:admin.select_role")}</Label>
          <Select
            options={options?.map((role: Role) => ({
              value: role.name,
              label: role.name,
            }))}
            onChange={handleSelectChange}
            value={updateData.role}
            placeholder={t("UpdateAdmin:admin.placeholder.select_role")}
            className="dark:bg-dark-900"
          />
          {(errors.role?.[0] || clientSideErrors.role) && (
            <p className="text-red-500 text-sm mt-1">
              {errors.role?.[0] || clientSideErrors.role}
            </p>
          )}
          {fetchingRoleError && (
            <p className="text-red-500 text-sm mt-1">{fetchingRoleError}</p>
          )}
        </div>

        {/* Email */}
        <div className="col-span-1 w-full">
          <Label htmlFor="email">{t("UpdateAdmin:admin.email")}</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={updateData.email}
            placeholder={t("UpdateAdmin:admin.placeholder.email")}
            onChange={handleChange}
          />
          {errors.email && errors.email[0] && (
            <p className="text-red-500 text-sm mt-1">
              {t("UpdateAdmin:admin.errors.email_taken")}
            </p>
          )}
          {clientSideErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="col-span-1 w-full">
          <Label htmlFor="phone">{t("UpdateAdmin:admin.phone")}</Label>
          <Input
            type="text"
            name="phone"
            id="phone"
            value={updateData.phone}
            placeholder={t("UpdateAdmin:admin.placeholder.phone")}
            onChange={handleChange}
          />
          {errors.phone?.[0] && (
            <p className="text-red-500 text-sm mt-1">
              {t("UpdateAdmin:admin.errors.phone_taken")}
            </p>
          )}
          {clientSideErrors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.phone}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="col-span-1 w-full">
          <Label htmlFor="password">{t("UpdateAdmin:admin.password")}</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={updateData.password}
              placeholder={t("UpdateAdmin:admin.placeholder.password")}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute z-30 -translate-y-1/2 cursor-pointer ${
                dir === "rtl" ? "left-4" : "right-4"
              } top-1/2`}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </button>
          </div>
          {(errors.password?.[0] || clientSideErrors.password) && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password?.[0] || clientSideErrors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 flex gap-4 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <FiUserPlus size={20} />
          {loading
            ? t("UpdateAdmin:admin.button.submitting")
            : t("UpdateAdmin:admin.button.submit")}
        </button>
      </form>
    </div>
  );
};

export default UpdateAdmin;
