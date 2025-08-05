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
import SEO from "../../common/SEO/seo";
import { AxiosError } from "axios";
import {
  Permission,
  ServerErrors,
  UpdateRoleInput,
} from "../../../types/Roles";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import useCheckOnline from "../../../hooks/useCheckOnline";
import { toast } from "react-toastify";

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

  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["UpdateRole", "Meta"]);

  const {
    data: roleData,
    isLoading: isRoleLoading,
    isError: isRoleError,
    error: roleError,
    refetch: refetchRole,
  } = useGetRoleById(id);

  const role = roleData?.data?.data;
  useEffect(() => {
    if (role) {
      const permissionIds = Array.isArray(role.permissions)
        ? role.permissions.map((perm: Permission) => perm.id)
        : [];
      setUpdateData({
        name: role.name || "",
        permissions: permissionIds,
      });
    }
  }, [role]);

  const {
    data: permissionData,
    isLoading: isPermissionLoading,
    error: permissionError,
    isError: isPermissionError,
    refetch: refetchPermissions,
  } = useGetAllPermissions();

  let pageStatus = PageStatus.SUCCESS;
  let pageError = "";

  if (isRoleLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isRoleError) {
    const axiosError = roleError as AxiosError;
    pageStatus = PageStatus.ERROR;
    if (
      axiosError?.response?.status === 401 ||
      axiosError?.response?.status === 403
    ) {
      pageError = t("UpdateRole:role.errors.global");
    } else {
      pageError = t("UpdateRole:role.errors.general");
    }
  } else if (!role) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  const fetchingPermissionsError =
    isPermissionError && permissionError instanceof AxiosError
      ? [401, 403].includes(permissionError.response?.status || 0)
        ? t("UpdateRole:role.errors.global")
        : t("UpdateRole:role.errors.fetching_permissions")
      : undefined;

  const permissions: Permission[] = permissionData || [];

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
    const newFormErrors: { [key: string]: string } = {};
    if (!updateData.name) {
      newFormErrors.name = t("UpdateRole:role.errors.name");
    }
    if (
      updateData.permissions.length === 0 &&
      !isPermissionError &&
      !isPermissionLoading
    ) {
      newFormErrors.permissions = t("UpdateRole:role.errors.permission");
    }
    setFormErrors(newFormErrors);
    return Object.keys(newFormErrors).length === 0;
  };

  const { mutateAsync } = useUpdateRole(id!!);
  const isCurrentlyOnline = useCheckOnline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({
      name: [],
      permissions: [],
      general: "",
      global: "",
    });

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    if (!isCurrentlyOnline()) {
      toast.error(t("UpdateRole:role.errors.no_internet"));
      setIsSubmitting(false);
      return;
    }

    try {
      if (id) {
        await mutateAsync({ id: id, roleData: updateData });
        navigate("/admin/roles", {
          state: { successUpdate: t("UpdateRole:role.success_message") },
        });
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setErrors((prev) => ({
          ...prev,
          global: t("UpdateRole:role.errors.global"),
        }));
        return;
      }
      const rawErrors = error?.response?.data?.errors;
      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};
        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) formattedErrors[err.code] = [];
          formattedErrors[err.code].push(err.message);
        });
        setErrors((prev) => ({ ...prev, ...formattedErrors }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("UpdateRole:role.errors.general"),
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    refetchRole();
    refetchPermissions();
  };

  return (
    <PageStatusHandler
      status={pageStatus}
      errorMessage={pageError}
      loadingText={t("UpdateRole:role.loadingRole")}
      notFoundText={t("UpdateRole:role.errors.notFound")}
      onRetry={handleRetry}
    >
      <SEO
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
        robotsTag="noindex, nofollow"
      />
      <div className="p-6">
        <div className="p-4 border-b dark:border-gray-600 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("UpdateRole:role.update_title")}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-5">
          <div className="grid gap-4 mb-4 grid-cols-2">
            {errors.global && (
              <p className="text-red-500 text-sm my-4 col-span-2">
                {errors.global}
              </p>
            )}
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="name">{t("UpdateRole:role.name")}</Label>
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
                  {t("UpdateRole:role.errors.name_unique")}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <h2 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-400">
                {t("UpdateRole:role.permission")}
              </h2>
              {isPermissionLoading ? (
                <Loading text={t("UpdateRole:role.get_permissions")} />
              ) : fetchingPermissionsError ? (
                <p className="text-red-500 text-sm mt-1">
                  {fetchingPermissionsError}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-60 pr-2">
                  {permissions?.map((permission: Permission) => (
                    <Checkbox
                      key={permission.id}
                      label={permission.name}
                      checked={updateData.permissions.includes(permission.id)}
                      onChange={() => handleCheckbox(permission.id)}
                      // تم تعديل هذا الجزء: تعطيل خانات الاختيار أثناء التحميل أو في حالة وجود خطأ
                      disabled={isPermissionError || isPermissionLoading}
                    />
                  ))}
                </div>
              )}
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
              : t("UpdateRole:role.button.submit")}
          </button>
        </form>
      </div>
    </PageStatusHandler>
  );
};

export default UpdateRole;
