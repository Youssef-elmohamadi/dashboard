import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAdminById,
  getAllRoles,
  updateAdmin,
} from "../../../api/AdminApi/usersApi/_requests";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { FiUserPlus } from "react-icons/fi";
const UpdateAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    roles: [{ name: "" }],
    role: "",
    avatar: "",
  });

  const [updateData, setUpdateData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });

  const [options, setOptions] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({
    first_name: [],
    last_name: [],
    phone: [],
    email: [],
    password: [],
    role: [],
  });

  const [clientSideErrors, setClientSideErrors] = useState({
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
  const { t } = useTranslation(["UpdateAdmin"]);
  const { dir } = useDirectionAndLanguage();

  // Fetch admin by ID
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        if (id) {
          const res = await getAdminById(id);
          const admin = res.data.data;

          setAdminData(admin);
          setUpdateData({
            first_name: admin.first_name || "",
            last_name: admin.last_name || "",
            phone: admin.phone || "",
            email: admin.email || "",
            password: "",
            role: admin.roles[0]?.name || "",
          });
        }
      } catch (err) {
        console.error("Error fetching admin:", err);
        const status = err?.response?.status;
        if (status === 403 || status === 401) {
          setErrors({
            ...errors,
            global: "You don't have permission to perform this action.",
          });
        }
      }
    };

    fetchAdmin();
  }, [id]);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getAllRoles();
        setOptions(res.data.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

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

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (id) {
        const dataToSend = {
          ...updateData,
          password: updateData.password || adminData.password,
        };

        await updateAdmin(id, dataToSend);
        navigate("/admin/admins", {
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
        setErrors(formattedErrors);
      } else {
        setErrors({ general: [t("admin.errors.general")] });
      }
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
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
        </div>

        {/* Role */}
        <div className="col-span-1 w-full">
          <Label htmlFor="role">{t("admin.select_role")}</Label>
          <Select
            options={options?.map((role) => ({
              value: role.name,
              label: role.name,
            }))}
            onChange={handleSelectChange}
            defaultValue={updateData.role}
            placeholder={t("admin.placeholder.select_role")}
          />
          {errors.role?.[0] && (
            <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
          )}
          {clientSideErrors.role && (
            <p className="text-red-500 text-sm mt-1">{clientSideErrors.role}</p>
          )}
        </div>
        {/* Email */}
        <div className="col-span-1 w-full">
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
            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
          )}
          {clientSideErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="col-span-1 w-full">
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
            <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
          )}
          {clientSideErrors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.phone}
            </p>
          )}
        </div>
        {/* Password */}
        <div className="col-span-1 w-full">
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
