import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Checkbox from "../../common/input/Checkbox";
import { useTranslation } from "react-i18next";
import {
  useGetAllPermissions,
  useGetRoleById,
  useUpdateRole,
} from "../../../hooks/Api/SuperAdmin/useRoles/useSuperAdminRoles";
import SEO from "../../common/SEO/seo";
import {
  Permission,
  ServerErrors,
  UpdateRoleInput,
} from "../../../types/Roles";
import { AxiosError } from "axios";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import Loading from "../../common/Loading";
const UpdateRole: React.FC = () => {
  const [updateData, setUpdateData] = useState<UpdateRoleInput>({
    name: "",
    permissions: [],
  });
  const [errors, setErrors] = useState<ServerErrors>({
    name: [],
    permissions: [],
    global: "",
    general: "",
  });
  const [fetchingPermissionsError, setFetchingPermissionsError] =
    useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["UpdateRole", "Meta"]);
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
          global: t("role.errors.global"),
        }));
      } else {
        setFetchingPermissionsError(t("role.errors.fetching_permissions"));
      }
    }
  }, [isPermissionError, permissionError, t]);
  const {
    data: roleData,
    isLoading: isRoleLoading,
    isError: isRoleError,
    error: roleError,
  } = useGetRoleById(id);

  const role = roleData;
  useEffect(() => {
    if (isRoleError && roleError instanceof AxiosError) {
      const status = roleError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("role.errors.global"),
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("role.errors.general"),
        }));
      }
    }
  }, [isRoleError, roleError, t]);
  useEffect(() => {
    if (!role) return;
    const permissionIds: number[] = Array.isArray(role.permissions)
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
      errors.name = t("role.errors.name");
    }
    if (updateData.permissions.length === 0) {
      errors.permissions = t("role.errors.permission");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const { mutateAsync } = useUpdateRole(id!!);
  const isCurrentlyOnline = useCheckOnline();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    if (!isCurrentlyOnline()) {
      toast.error(t("role.errors.no_internet"));
      setIsSubmitting(false);
      return;
    }

    try {
      if (id) {
        await mutateAsync({ id: +id, roleData: updateData });
        navigate("/super_admin/roles", {
          state: { successUpdate: t("role.success_message") },
        });
      }
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("role.errors.global"),
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
        setErrors((prev) => ({ ...prev, general: t("role.errors.general") }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  let status = PageStatus.SUCCESS;
  if (isRoleLoading) {
    status = PageStatus.LOADING;
  } else if (isRoleError) {
    status = PageStatus.ERROR;
  } else if (!role) {
    status = PageStatus.NOT_FOUND;
  }

  return (
    <PageStatusHandler
      status={status}
      loadingText={t("role.loadingRole")}
      errorMessage={errors.general || t("role.errors.general")}
    >
      <div className="p-6">
        <SEO
          title={{
            ar: ` تحديث صلاحية ${role?.name || ""}`,
            en: `Update Role ${role?.name || ""} (Super Admin)`,
          }}
          description={{
            ar: `صفحة تحديث الصلاحية "${
              role?.name || "غير معروف"
            }" بواسطة المشرف العام في تشطيبة. عدّل الاسم والصلاحيات.`,
            en: `Update role "${
              role?.name || "unknown"
            }" details by Super Admin on Tashtiba. Modify name and permissions.`,
          }}
          keywords={{
            ar: [
              `تحديث صلاحية ${role?.name || ""}`,
              "تعديل دور",
              "إدارة الصلاحيات",
              "سوبر أدمن",
              "أدوار المستخدمين",
              "تشطيبة",
            ],
            en: [
              `update role ${role?.name || ""}`,
              "edit role",
              "role management",
              "super admin",
              "user roles",
              "Tashtiba",
            ],
          }}
          robotsTag="noindex, nofollow"
        />

        <div className="p-4 border-b dark:border-gray-600 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("role.update_title")}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-4 md:p-5">
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
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="name">{t("role.name")}</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={updateData.name}
                onChange={handleChange}
                placeholder={t("role.placeholder.name")}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
              {errors.name[0] && (
                <p className="text-red-500 text-sm mt-1">
                  {t("role.errors.name_unique")}
                </p>
              )}
            </div>

            {isPermissionLoading ? (
              <Loading text={t("role.get_permissions")} />
            ) : (
              <div className="col-span-2">
                <h2 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-400">
                  {t("role.permission")}
                </h2>
                <div className="grid grid-cols-2 gap-2 max-h-60 pr-2">
                  {permissions.map((permission: Permission) => (
                    <Checkbox
                      key={permission.id}
                      label={permission.name}
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
              ? t("role.button.submitting")
              : t("role.button.submit")}
          </button>
        </form>
      </div>
    </PageStatusHandler>
  );
};

export default UpdateRole;
