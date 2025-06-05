import { useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import Loading from "../../common/Loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useCreateRole,
  useGetAllPermissions,
} from "../../../hooks/Api/Admin/useRoles/useRoles";
type Permission = {
  id: number;
  name: string;
};

export default function CreateRole() {
  const [roleData, setRoleData] = useState({
    name: "",
    permissions: [] as number[],
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState({
    name: [] as string[],
    permissions: [] as string[],
    global: "",
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation(["CreateRole"]);

  const { data, isLoading, error, isError } = useGetAllPermissions();

  const permissions = data?.data.data;

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
      errors.name = t("role.errors.name");
    }
    if (roleData.permissions.length === 0) {
      errors.permissions = t("role.errors.permission");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { mutateAsync } = useCreateRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await mutateAsync(roleData);
      navigate("/admin/roles", {
        state: { successCreate: t("role.success_message") },
      });
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
        setErrors((prev) => ({
          ...prev,
          ...formattedErrors,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: t("admin.errors.general"),
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" p-6">
      <div className="p-4 border-b  dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("role.create_title")}
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
              value={roleData.name}
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

          {isLoading ? (
            <Loading text={t("role.get_permissions")} />
          ) : (
            <div className="col-span-2">
              <h2 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-400">
                {t("role.permission")}
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
            </div>
          )}
        </div>

        {errors.global && (
          <p className="text-red-500 text-sm mt-4">{errors.global}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-sm mt-4">{errors.general}</p>
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
}
