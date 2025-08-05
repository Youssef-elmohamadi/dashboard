import { useEffect, useState } from "react";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Checkbox from "../../common/input/Checkbox";
import Loading from "../../common/Loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useCreateRole,
  useGetAllPermissions,
} from "../../../hooks/Api/Admin/useRoles/useRoles";
import SEO from "../../common/SEO/seo";
import {
  CreateRoleInput,
  Permission,
  ServerErrors,
} from "../../../types/Roles";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useCheckOnline from "../../../hooks/useCheckOnline";
export default function CreateRole() {
  const [roleData, setRoleData] = useState<CreateRoleInput>({
    name: "",
    permissions: [],
  });
  const [fetchingPermissionsError, setFetchingPermissionsError] =
    useState<string>("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<ServerErrors>({
    name: [],
    permissions: [],
    global: "",
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const { t } = useTranslation(["CreateRole", "Meta"]);

  const {
    data,
    isLoading,
    error: permissionError,
    isError: isPermissionError,
  } = useGetAllPermissions();
  console.log(data);

  const permissions = data;

  useEffect(() => {
    if (isPermissionError && permissionError instanceof AxiosError) {
      const status = permissionError?.response?.status;
      if (status === 401 || status === 403) {
        setErrors((prev) => ({
          ...prev,
          global: t("CreateRole:role.errors.global"),
        }));
      } else {
        setFetchingPermissionsError(
          t("CreateRole:role.errors.fetching_permissions")
        );
      }
    }
  }, [isPermissionError, permissionError, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (permissionId: number) => {
    setRoleData((prev) => {
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
    if (!roleData.name.trim()) {
      errors.name = t("CreateRole:role.errors.name");
    }
    if (roleData.permissions.length === 0) {
      errors.permissions = t("CreateRole:role.errors.permission");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { mutateAsync } = useCreateRole();

  const isCurrentlyOnline = useCheckOnline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    if (!isCurrentlyOnline()) {
      toast.error(t("CreateRole:role.errors.no_internet"));
      setIsSubmitting(false);
      return;
    }

    try {
      await mutateAsync(roleData);
      navigate("/admin/roles", {
        state: { successCreate: t("CreateRole:role.success_message") },
      });
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 403 || status === 401) {
        setErrors({
          ...errors,
          global: t("CreateRole:role.errors.global"),
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
        setErrors((prev) => ({
          ...prev,
          ...formattedErrors,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("CreateRole:admin.errors.general"),
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" p-6">
      <SEO
        title={{
          ar: "تشطيبة - إنشاء صلاحية جديدة",
          en: "Tashtiba - Create New Role",
        }}
        description={{
          ar: "صفحة إنشاء صلاحية (دور) جديد للمستخدمين في نظام تشطيبة. حدد الاسم والصلاحيات المخصصة.",
          en: "Create a new user role (permission set) in Tashtiba system. Define the role name and assigned permissions.",
        }}
        keywords={{
          ar: [
            "إنشاء صلاحية",
            "إضافة دور",
            "صلاحية جديدة",
            "أدوار المستخدمين",
            "تشطيبة",
            "صلاحيات",
            "تحكم",
          ],
          en: [
            "create role",
            "add new role",
            "new permission set",
            "user roles",
            "Tashtiba",
            "permissions",
            "access control",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("CreateRole:role.create_title")}
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
            <Label htmlFor="name">{t("CreateRole:role.name")}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={roleData.name}
              onChange={handleChange}
              placeholder={t("CreateRole:role.placeholder.name")}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
            {errors.name[0] && (
              <p className="text-red-500 text-sm mt-1">
                {t("CreateRole:role.errors.name_unique")}
              </p>
            )}
          </div>

          {isLoading ? (
            <Loading text={t("CreateRole:role.get_permissions")} />
          ) : (
            <div className="col-span-2">
              <h2 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-400">
                {t("CreateRole:role.permission")}
              </h2>
              <div className="grid grid-cols-2 gap-2 max-h-60 pr-2">
                {permissions?.map((permission: Permission) => (
                  <Checkbox
                    key={permission.id}
                    label={permission.name}
                    checked={roleData.permissions.includes(permission.id)}
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
          className={`text-white inline-flex items-center bg-brand-500 hover:bg-brand-600 focus:ring-4 focus:outline-none focus:ring-brand-500 font-medium rounded-lg text-sm px-5 py-2.5 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? t("CreateRole:role.button.submitting")
            : t("CreateRole:role.button.submit")}
        </button>
      </form>
    </div>
  );
}
