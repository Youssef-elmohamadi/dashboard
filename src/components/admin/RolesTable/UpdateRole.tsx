import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import Loading from "../../common/Loading";
import { useTranslation } from "react-i18next";
import {
  useGetAllPermissions,
  useGetRoleById,
  useUpdateRole,
} from "../../../hooks/Api/Admin/useRoles/useRoles";
import PageMeta from "../../common/PageMeta";
type Permission = {
  id: number;
  name: string;
};
const UpdateRole: React.FC = () => {
  const [updateData, setUpdateData] = useState({
    name: "",
    permissions: [] as number[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); // إضافة حالة لتخزين الأخطاء
  const [errors, setErrors] = useState({
    name: [] as string[],
    permissions: [] as string[],
    general: "",
    global: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["UpdateRole"]);
  const {
    data: permissionData,
    isLoading: isPermissionLoading,
    error: permissionError,
    isError: isPermissionError,
  } = useGetAllPermissions();

  const permissions = permissionData?.data.data;

  const {
    data: roleData,
    isLoading: isRoleLoading,
    isError: isRoleError,
    error: roleError,
  } = useGetRoleById(id);

  const role = roleData?.data?.data;
  useEffect(() => {
    if (isRoleError) {
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
    const permissionIds = Array.isArray(role.permissions)
      ? role.permissions.map((perm: any) => perm.id)
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

  const { mutateAsync } = useUpdateRole(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (id) {
        await mutateAsync({ id: +id, roleData: updateData });
        navigate("/admin/roles", {
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
        setErrors({ ...errors, general: t("admin.errors.general") });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isRoleLoading) {
    return (
      <>
        <PageMeta title={t("role.main_title")} description="Update Role" />
        <p className="text-gray-400 text-center p-4">{t("role.loadingRole")}</p>
      </>
    );
  }
  if (!id) {
    return (
      <>
        <PageMeta title={t("role.main_title")} description="Update Role" />
        <p className="text-gray-400 text-center p-4">
          {t("role.errors.notFound")}
        </p>
      </>
    );
  }
  if (roleData?.data.success === false) {
    return (
      <>
        <PageMeta title={t("role.main_title")} description="Update Role" />
        <p className="text-red-500 text-center p-4">
          {t("role.errors.general")}
        </p>
      </>
    );
  }

  return (
    <div className="p-6">
      <PageMeta title={t("role.main_title")} description="Update Role" />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("role.update_title")}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 md:p-5">
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
            </div>
          )}
        </div>

        {errors.global && (
          <p className="text-red-500 text-sm my-4">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm my-4">{errors.general}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? t("role.button.submitting") : t("role.button.submit")}
        </button>
      </form>
    </div>
  );
};

export default UpdateRole;
