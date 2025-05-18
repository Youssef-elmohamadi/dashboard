import React, { useEffect, useRef, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../../api/EndUserApi/endUserAuth/_requests";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { Circles } from "react-loader-spinner";

const UserProfile = () => {
  const { t } = useTranslation(["EndUserProfile"]);
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    avatar: null as File | null,
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(false);
  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [errors, setErrors] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadLoading(true);
      try {
        const res = await getProfile();
        const data = res.data.data;
        setFormData({
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          password: "",
          password_confirmation: "",
          avatar: null,
        });
        setImageUrl(data.image);
      } catch (error) {
        setLoadLoading(false);
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoadLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      toast.error(t("toast.form_error"));
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          payload.append(key, value as any);
        }
      });

      await updateProfile(payload);
      toast.success(t("toast.update_success"));
    } catch (error) {
      const rawErrors = error?.response?.data?.errors;
      console.log(rawErrors);
      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};
        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) {
            formattedErrors[err.code] = [];
          }
          formattedErrors[err.code].push(err.message);
        });

        setErrors(formattedErrors);
      } else {
        setErrors({ general: "" });
      }
      toast.error(t("toast.update_fail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medium mb-4 border-b pb-3">{t("title")}</h2>

      {loadLoading ? (
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
                src={imageUrl || "/default-avatar.png"}
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
              <div className="col-span-1">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder={t("form.first_name")}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                />
                {clientErrors.first_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.first_name}
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder={t("form.last_name")}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                />
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
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                />
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
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                />
                {clientErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1  gap-3">
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("form.password")}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                />
                {clientErrors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.password}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder={t("form.password_confirmation")}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
                />
                {clientErrors.password_confirmation && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.password_confirmation}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 text-white px-4 py-2 rounded md:w-1/4 w-1/2"
            >
              {loading ? t("form.updating") : t("form.submit")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UserProfile;
