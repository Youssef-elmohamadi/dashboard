import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Checkbox from "../../common/input/Checkbox";
import Loading from "../../common/Loading";
import { useTranslation } from "react-i18next";
import {
  useGetAllPermissions,
  useGetRoleById,
  useUpdateRole,
} from "../../../hooks/Api/Admin/useRoles/useRoles";
// import PageMeta from "../../common/SEO/PageMeta"; // تم التعليق على استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component
import { AxiosError } from "axios";
import {
  Permission,
  ServerErrors,
  UpdateRoleInput,
} from "../../../types/Roles";

const UpdateRole: React.FC = () => {
  const [updateData, setUpdateData] = useState<UpdateRoleInput>({
    name: "",
    permissions: [],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<ServerErrors>({
    name: [],
    permissions: [],
    general: "",
    global: "",
  });
  const [fetchingPermissionsError, setFetchingPermissionsError] =
    useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["UpdateRole", "Meta"]); // استخدام الـ namespaces هنا

  const {
    data: permissionData,
    isLoading: isPermissionLoading,
    error: permissionError,
    isError: isPermissionError,
  } = useGetAllPermissions();

  const permissions: Permission[] = permissionData || [];
  useEffect(() => {
    if (isPermissionError && permissionError instanceof AxiosError) {
      const status = permissionError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateRole:role.errors.global"), // إضافة namespace
        }));
      } else {
        setFetchingPermissionsError(
          t("UpdateRole:role.errors.fetching_permissions")
        ); // إضافة namespace
      }
    }
  }, [isPermissionError, permissionError, t]);

  const {
    data: roleData,
    isLoading: isRoleLoading,
    isError: isRoleError,
    error: roleError,
  } = useGetRoleById(id);

  const role = roleData?.data?.data;
  useEffect(() => {
    if (isRoleError && roleError instanceof AxiosError) {
      const status = roleError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateRole:role.errors.global"), // إضافة namespace
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("UpdateRole:role.errors.general"), // إضافة namespace
        }));
      }
    }
  }, [isRoleError, roleError, t]);
  useEffect(() => {
    if (!role) return;
    const permissionIds = Array.isArray(role.permissions)
      ? role.permissions.map((perm: Permission) => perm.id)
      : [];

    setUpdateData({
      name: role.name || "",
      permissions: permissionIds,
    });
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (permissionId: number) => {
    setUpdateData((prev) => {
      const isChecked = prev.permissions.includes(permissionId);
      return {
        ...prev,
        permissions: isChecked
          ? prev.permissions.filter((id) => id !== permissionId)
          : [...prev.permissions, permissionId],
      };
    });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!updateData.name) {
      errors.name = t("UpdateRole:role.errors.name"); // إضافة namespace
    }
    if (updateData.permissions.length === 0) {
      errors.permissions = t("UpdateRole:role.errors.permission"); // إضافة namespace
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { mutateAsync } = useUpdateRole(id!!);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (id) {
        await mutateAsync({ id: id, roleData: updateData });
        navigate("/admin/roles", {
          state: { successUpdate: t("UpdateRole:role.success_message") }, // إضافة namespace
        });
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("UpdateRole:role.errors.global"), // إضافة namespace
        });
        return;
      }

      const rawErrors = error?.response?.data.errors;
      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};
        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) formattedErrors[code] = [];
          formattedErrors[code].push(message);
        });
        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors({ ...errors, general: t("UpdateRole:role.errors.general") }); // إضافة namespace
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isRoleLoading) {
    return (
      <>
        <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
          title={{
            ar: "تشطيبة - تحديث صلاحية",
            en: "Tashtiba - Update Role",
          }}
          description={{
            ar: "صفحة تحديث صلاحية (دور) المستخدمين في نظام تشطيبة. تعديل الاسم والصلاحيات المخصصة.",
            en: "Update a user role (permission set) in Tashtiba system. Modify the role name and assigned permissions.",
          }}
          keywords={{
            ar: [
              "تحديث صلاحية",
              "تعديل دور",
              "صلاحية المستخدم",
              "أدوار المستخدمين",
              "تشطيبة",
              "صلاحيات",
            ],
            en: [
              "update role",
              "edit role",
              "user permission",
              "user roles",
              "Tashtiba",
              "permissions",
            ],
          }}
        />
        <p className="text-gray-400 text-center p-4">
          {t("UpdateRole:role.loadingRole")}
        </p>{" "}
        {/* إضافة namespace */}
      </>
    );
  }
  if (!role && !errors.general) {
    return (
      <>
        <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
          title={{
            ar: "تشطيبة - صلاحية غير موجودة",
            en: "Tashtiba - Role Not Found",
          }}
          description={{
            ar: "الصلاحية المطلوبة لتحديث بياناتها غير موجودة في نظام تشطيبة.",
            en: "The requested role for update was not found in Tashtiba system.",
          }}
          keywords={{
            ar: [
              "صلاحية غير موجودة",
              "خطأ",
              "تحديث دور",
              "تشطيبة",
              "إدارة الصلاحيات",
            ],
            en: [
              "role not found",
              "error",
              "update role",
              "Tashtiba",
              "role management",
            ],
          }}
        />
        <p className="text-gray-400 text-center p-4">
          {t("UpdateRole:role.errors.notFound")} {/* إضافة namespace */}
        </p>
      </>
    );
  }
  if (errors.general) {
    return (
      <>
        <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
          title={{
            ar: "تشطيبة - خطأ في تحديث الصلاحية",
            en: "Tashtiba - Role Update Error",
          }}
          description={{
            ar: "حدث خطأ عام أثناء محاولة تحديث بيانات الصلاحية في تشطيبة. يرجى المحاولة مرة أخرى.",
            en: "A general error occurred while attempting to update role data in Tashtiba. Please try again.",
          }}
          keywords={{
            ar: [
              "خطأ تحديث صلاحية",
              "مشكلة دور",
              "تحديث تشطيبة",
              "فشل التعديل",
            ],
            en: [
              "role update error",
              "role issue",
              "Tashtiba update",
              "update failed",
            ],
          }}
        />
        <p className="text-red-500 text-center p-4">
          {t("UpdateRole:role.errors.general")} {/* إضافة namespace */}
        </p>
      </>
    );
  }

  return (
    <div className="p-6">
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - تحديث صلاحية",
          en: "Tashtiba - Update Role",
        }}
        description={{
          ar: "صفحة تحديث صلاحية (دور) المستخدمين في نظام تشطيبة. تعديل الاسم والصلاحيات المخصصة.",
          en: "Update a user role (permission set) in Tashtiba system. Modify the role name and assigned permissions.",
        }}
        keywords={{
          ar: [
            "تحديث صلاحية",
            "تعديل دور",
            "صلاحية المستخدم",
            "أدوار المستخدمين",
            "تشطيبة",
            "صلاحيات",
          ],
          en: [
            "update role",
            "edit role",
            "user permission",
            "user roles",
            "Tashtiba",
            "permissions",
          ],
        }}
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("UpdateRole:role.update_title")} {/* إضافة namespace */}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-5">
        <div className="grid gap-4 mb-4 grid-cols-2">
          {errors.global && ( // قد تكون موجودة هنا أيضاً
            <p className="text-red-500 text-sm my-4 col-span-2">
              {errors.global}
            </p>
          )}
          {errors.general && ( // قد تكون موجودة هنا أيضاً
            <p className="text-red-500 text-sm my-4 col-span-2">
              {errors.general}
            </p>
          )}
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="name">{t("UpdateRole:role.name")}</Label>{" "}
            {/* إضافة namespace */}
            <Input
              type="text"
              name="name"
              id="name"
              value={updateData.name}
              onChange={handleChange}
              placeholder={t("UpdateRole:role.placeholder.name")}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
            {errors.name[0] && (
              <p className="text-red-500 text-sm mt-1">
                {t("UpdateRole:role.errors.name_unique")}{" "}
                {/* إضافة namespace */}
              </p>
            )}
          </div>

          {isPermissionLoading ? (
            <Loading text={t("UpdateRole:role.get_permissions")} />
          ) : (
            <div className="col-span-2">
              <h2 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-400">
                {t("UpdateRole:role.permission")} {/* إضافة namespace */}
              </h2>
              <div className="grid grid-cols-2 gap-2 max-h-60 pr-2">
                {permissions?.map((permission: Permission) => (
                  <Checkbox
                    key={permission.id}
                    label={permission.name} // اسم الصلاحية نفسه قد لا يكون مترجم، لأنه يأتي من الـ API
                    checked={updateData.permissions.includes(permission.id)}
                    onChange={() => handleCheckbox(permission.id)}
                  />
                ))}
              </div>
              {formErrors.permissions && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.permissions}
                </p>
              )}
              {errors.permissions && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.permissions[0]}
                </p>
              )}
              {fetchingPermissionsError && (
                <p className="text-red-500 text-sm mt-1">
                  {fetchingPermissionsError}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? t("UpdateRole:role.button.submitting")
            : t("UpdateRole:role.button.submit")}{" "}
          {/* إضافة namespace */}
        </button>
      </form>
    </div>
  );
};

export default UpdateRole;
