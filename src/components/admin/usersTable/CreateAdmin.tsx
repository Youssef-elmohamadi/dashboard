import { useEffect, useRef, useState } from "react";
import Label from "../../common/form/Label";
import Input from "../../common/input/InputField";
import Select from "../../common/form/Select";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useCreateAdmin } from "../../../hooks/Api/Admin/useVendorAdmins/useVendorAdmins";
import { useRoles } from "../../../hooks/Api/Admin/useRoles/useRoles";
import SEO from "../../common/SEO/seo";
import {
  ClientErrors,
  CreateAdminInput,
  ServerErrors,
} from "../../../types/Admins";
import { AxiosError } from "axios";
import UserPlusIcon from "../../../icons/UserPlusIcon";
import { toast } from "react-toastify";
import useCheckOnline from "../../../hooks/useCheckOnline";

export default function CreateAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingRoleError, setFetchingRoleError] = useState("");
  const [errors, setErrors] = useState<ServerErrors>({
    first_name: [] as string[],
    last_name: [] as string[],
    phone: [] as string[],
    email: [] as string[],
    password: [] as string[],
    role: [] as string[],
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

  const [adminData, setAdminData] = useState<CreateAdminInput>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { t } = useTranslation(["CreateAdmin", "Meta"]);
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
      newErrors.first_name = t("CreateAdmin:admin.errors.first_name");
    } else if (!adminData.last_name) {
      newErrors.last_name = t("CreateAdmin:admin.errors.last_name");
    } else if (!adminData.role) {
      newErrors.role = t("CreateAdmin:admin.errors.role");
    } else if (!adminData.email) {
      newErrors.email = t("CreateAdmin:admin.errors.email_required");
    } else if (
      !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(adminData.email)
    ) {
      newErrors.email = t("CreateAdmin:admin.errors.email_invalid");
    } else if (!adminData.phone) {
      newErrors.phone = t("CreateAdmin:admin.errors.phone_required");
    } else if (!/^01[0125][0-9]{8}$/.test(adminData.phone)) {
      newErrors.phone = t("CreateAdmin:admin.errors.phone_invalid");
    } else if (!adminData.password) {
      newErrors.password = t("CreateAdmin:admin.errors.password");
    } else if (adminData.password.length < 8) {
      newErrors.password = t("CreateAdmin:admin.errors.length_password");
    }
    const isValid = Object.values(newErrors).every((error) => error === "");
    setClientSideErrors(newErrors);
    return { isValid, newErrors };
  };

  const focusOnError = (errors: Record<string, string | string[]>) => {
    const errorEntry = Object.entries(errors).find(
      ([_, value]) =>
        (typeof value === "string" && value !== "") ||
        (Array.isArray(value) && value.length > 0)
    );

    if (errorEntry) {
      const fieldName = errorEntry[0];
      const ref = inputRefs?.current[fieldName];
      ref?.focus();
    }
  };
  const { dir } = useDirectionAndLanguage();
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

  const {
    data,
    isLoading: isLoadingRoles,
    isError: isRoleError,
    error: roleError,
  } = useRoles();
  const options = data?.data.data;
  useEffect(() => {
    if (isRoleError && roleError instanceof AxiosError) {
      const status = roleError?.response?.status;
      if (status === 401 || status === 403) {
        setFetchingRoleError(t("CreateAdmin:admin.errors.global"));
      } else {
        setFetchingRoleError(t("CreateAdmin:admin.errors.fetching_roles"));
      }
    }
  }, [isRoleError, roleError, t, options]);
  const { mutateAsync } = useCreateAdmin();
  const isCurrentlyOnline = useCheckOnline();

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
    if (!isCurrentlyOnline()) {
      toast.error(t("CreateAdmin:admin.errors.no_internet"));
      return;
    }
    const { isValid, newErrors } = validate();
    if (!isValid) {
      focusOnError(newErrors);
      return;
    }
    setLoading(true);

    try {
      await mutateAsync(adminData);
      navigate("/admin/admins", {
        state: { successCreate: t("CreateAdmin:admin.success_message") },
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const status = error?.response?.status;

      if (status === 403 || status === 401) {
        setErrors((prev) => ({
          ...prev,
          global: t("CreateAdmin:admin.errors.global"),
        }));
      } else {
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
          focusOnError(formattedErrors);
        } else {
          setErrors((prev) => ({
            ...prev,
            general: t("CreateAdmin:admin.errors.general"),
          }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEO
        title={{
          ar: "إنشاء مسؤول جديد",
          en: "Create New Admin",
        }}
        description={{
          ar: "صفحة إنشاء حساب مسؤول جديد في نظام تشطيبة. املأ البيانات المطلوبة لإنشاء حساب إداري.",
          en: "Create a new administrator account on Tashtiba system. Fill in the required details to set up an admin account.",
        }}
        keywords={{
          ar: [
            "إنشاء مسؤول",
            "إضافة أدمن",
            "حساب مسؤول جديد",
            "تشطيبة",
            "إدارة المستخدمين",
            "صلاحيات",
          ],
          en: [
            "create admin",
            "add administrator",
            "new admin account",
            "Tashtiba",
            "user management",
            "permissions",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("CreateAdmin:admin.create_title")}
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
            <Label htmlFor="input">{t("CreateAdmin:admin.first_name")}</Label>
            <Input
              type="text"
              id="input"
              name="first_name"
              placeholder={t("CreateAdmin:admin.placeholder.first_name")}
              onChange={handleChange}
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["first_name"] = el;
                }
              }}
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
          <div>
            <Label htmlFor="inputTwo">{t("CreateAdmin:admin.last_name")}</Label>
            <Input
              type="text"
              id="inputTwo"
              name="last_name"
              placeholder={t("CreateAdmin:admin.placeholder.last_name")}
              onChange={handleChange}
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["last_name"] = el;
                }
              }}
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
        </div>
        <div className="w-full">
          <Label>{t("CreateAdmin:admin.select_role")}</Label>
          <Select
            options={options?.map((role: { name: string }) => ({
              value: role.name,
              label: role.name,
            }))}
            value={adminData.role}
            onChange={handleSelectChange}
            placeholder={t("CreateAdmin:admin.placeholder.select_role")}
            className="dark:bg-dark-900"
            disabled={isRoleError || isLoadingRoles}
          />
          {errors.role?.[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
          )}
          {clientSideErrors.role && (
            <p className="text-red-500 text-sm mt-1">{clientSideErrors.role}</p>
          )}
          {fetchingRoleError && (
            <p className="text-red-500 text-sm mt-1">{fetchingRoleError}</p>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="inputTwo">{t("CreateAdmin:admin.email")}</Label>
          <Input
            type="email"
            id="inputTwo"
            name="email"
            placeholder={t("CreateAdmin:admin.placeholder.email")}
            onChange={handleChange}
            ref={(el) => {
              if (inputRefs?.current) {
                inputRefs.current["email"] = el;
              }
            }}
          />
          {errors.email?.[0] && (
            <p className="text-red-500 text-sm mt-1">
              {t("CreateAdmin:admin.errors.email_taken")}
            </p>
          )}
          {clientSideErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.email}
            </p>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="inputTwo">{t("CreateAdmin:admin.phone")}</Label>
          <Input
            type="text"
            id="inputTwo"
            name="phone"
            placeholder={t("CreateAdmin:admin.placeholder.phone")}
            onChange={handleChange}
            ref={(el) => {
              if (inputRefs?.current) {
                inputRefs.current["phone"] = el;
              }
            }}
          />
          {errors.phone?.[0] && (
            <p className="text-red-500 text-sm mt-1">
              {t("CreateAdmin:admin.errors.phone_taken")}
            </p>
          )}
          {clientSideErrors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.phone}
            </p>
          )}
        </div>
        <div className="w-full">
          <Label>{t("CreateAdmin:admin.password")}</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("CreateAdmin:admin.placeholder.password")}
              onChange={handleChange}
              ref={(el) => {
                if (inputRefs?.current) {
                  inputRefs.current["password"] = el;
                }
              }}
            />
            {errors.password?.[0] && (
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
          className="bg-brand-500 hover:bg-brand-600 flex gap-4 text-white px-5 py-2 rounded  disabled:opacity-50"
        >
          <UserPlusIcon className="text-xl text-white" />
          {loading
            ? t("CreateAdmin:admin.button.submitting")
            : t("CreateAdmin:admin.button.submit")}
        </button>
      </form>
    </div>
  );
}
