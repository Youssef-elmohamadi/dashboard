import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { Circles } from "react-loader-spinner";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { useNavigate } from "react-router";
import {
  useProfile,
  useUpdateProfile,
} from "../../../hooks/Api/EndUser/useProfile/useProfile";
import {
  ClientErrors,
  ServerErrors,
  UserProfileFormData,
} from "../../../types/UserProfile";

const UserProfile = () => {
  const { t } = useTranslation(["EndUserProfile"]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserProfileFormData>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    avatar: null as File | null,
  });

  const [existingImage, setExistingImage] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<ClientErrors>({});
  const [errors, setErrors] = useState<ServerErrors>({
    first_name: [],
    last_name: [],
    email: [],
    phone: [],
    password: [],
    password_confirmation: [],
    avatar: [],
    general: "",
    global: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  const { data: userProfileData, isLoading } = useProfile();

  useEffect(() => {
    if (userProfileData) {
      setFormData({
        id: userProfileData.id,
        first_name: userProfileData.first_name,
        last_name: userProfileData.last_name,
        email: userProfileData.email,
        phone: userProfileData.phone,
        password: "",
        password_confirmation: "",
        avatar: null,
      });
      setExistingImage(userProfileData.avatar || "/images/default-avatar.jpg");
    }
  }, [userProfileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setImageUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.first_name.trim()) {
      errors.first_name = t("validation.first_name_required");
    }

    if (!formData.last_name.trim()) {
      errors.last_name = t("validation.last_name_required");
    }

    if (!formData.email.trim()) {
      errors.email = t("validation.email_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t("validation.email_invalid");
    }

    if (!formData.phone.trim()) {
      errors.phone = t("validation.phone_required");
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = t("validation.password_short");
    }

    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = t(
        "validation.password_confirmation_mismatch"
      );
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { mutate: updateProfileMutation } = useUpdateProfile({
    onSuccess: () => {
      toast.success(t("toast.update_success"));
    },
    onError: (error: any) => {
      const rawErrors = error?.response?.data?.errors;
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

      toast.error(t("toast.update_fail"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error(t("toast.form_error"));
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        payload.append(key, value as any);
      }
    });

    updateProfileMutation(payload);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medium mb-4 border-b border-gray-200 pb-3">
        {t("title")}
      </h2>

      {isLoading && !userProfileData ? (
        <div className="flex justify-center">
          <Circles height="80" width="80" color="#6B46C1" ariaLabel="loading" />
        </div>
      ) : (
        <>
          <div className="flex mb-4">
            <div
              className="relative w-36 h-36 cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                src={imageUrl || existingImage}
                alt="User"
                className="w-36 h-36 rounded-full object-cover border-4 border-purple-700"
              />
              <div className="absolute inset-0 bg-[#8826bd35] rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm">{t("form.avatar")}</span>
              </div>
            </div>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 grid-cols-1  gap-3">
              <div>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder={t("form.first_name")}
                  className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20"
                />
                {errors.first_name[0] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.first_name[0]}
                  </p>
                )}
                {clientErrors.first_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.first_name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder={t("form.last_name")}
                  className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20"
                />
                {errors.last_name[0] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.last_name[0]}
                  </p>
                )}
                {clientErrors.last_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("form.email")}
                  className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20"
                />
                {errors.email[0] && (
                  <p className="text-red-600 text-sm mt-1">
                    {t("backend.emailTaken")}
                  </p>
                )}
                {clientErrors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.email}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("form.phone")}
                  className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20"
                />
                {errors.phone[0] && (
                  <p className="text-red-600 text-sm mt-1">
                    {t("backend.phoneTaken")}
                  </p>
                )}
                {clientErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
              {(["password", "password_confirmation"] as const).map((field) => (
                <div key={field} className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name={field}
                    value={
                      (formData[field] as string) || ""
                    }
                    onChange={handleChange}
                    placeholder={t(`form.${field}`)}
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20"
                  />
                  {errors[field][0] && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors[field][0]}
                    </p>
                  )}
                  {clientErrors[field] && (
                    <p className="text-red-600 text-sm mt-1">
                      {clientErrors[field]}
                    </p>
                  )}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 ${
                      document.documentElement.dir === "rtl"
                        ? "left-4"
                        : "right-4"
                    }`}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-700 text-white px-4 py-2 rounded md:w-1/4 w-1/2"
            >
              {isLoading ? t("form.updating") : t("form.submit")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UserProfile;
