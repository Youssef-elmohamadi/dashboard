import React, { useEffect, useRef, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../../api/EndUserApi/endUserAuth/_requests";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { Circles } from "react-loader-spinner";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { useNavigate } from "react-router";

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
  const [existingImage, setExistingImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("uToken");
    if (!token) {
      navigate("/signin", { replace: true });
    }
  }, []);
  // const [userProfileData, setUserProfileData] = useState({
  //   id: "",
  //   first_name: "",
  //   last_name: "",
  //   email: "",
  //   phone: "",
  //   password: "",
  //   password_confirmation: "",
  //   avatar: null as File | null,
  // });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(false);
  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [errors, setErrors] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     setLoadLoading(true);
  //     try {
  //       const res = await getProfile();
  //       const data = res.data.data;
  //       setFormData({
  //         id: data.id,
  //         first_name: data.first_name,
  //         last_name: data.last_name,
  //         email: data.email,
  //         phone: data.phone,
  //         password: "",
  //         password_confirmation: "",
  //         avatar: null,
  //       });
  //       setImageUrl(data.image);
  //     } catch (error) {
  //       setLoadLoading(false);
  //       console.error("Failed to fetch profile:", error);
  //     } finally {
  //       setLoadLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  const { data: userProfileData, isLoading: isLoading } = useQuery({
    queryKey: ["endUserProfileData"],
    queryFn: async () => {
      const res = await getProfile();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

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
        avatar: null as File | null,
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

  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await updateProfile(formData);
    },
    onSuccess: () => {
      toast.success(t("toast.update_success"));
      queryClient.invalidateQueries({ queryKey: ["endUserProfileData"] });
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
        setErrors(formattedErrors);
      } else {
        setErrors({ general: "" });
      }

      toast.error(t("toast.update_fail"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
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

    updateProfileMutation.mutate(payload);
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
              <div className="col-span-1">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder={t("form.first_name")}
                  className="h-11 w-full rounded-lg  border border-gray-200 appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 "
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
                  className="h-11 w-full rounded-lg  border border-gray-200 appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 "
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
                  className="h-11 w-full rounded-lg  border border-gray-200 appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 "
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
                  className="h-11 w-full rounded-lg  border border-gray-200 appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 "
                />
                {clientErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1  gap-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("form.password")}
                  className="h-11 w-full rounded-lg  border border-gray-200 appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 "
                />
                {clientErrors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.password}
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder={t("form.password_confirmation")}
                  className="h-11 w-full rounded-lg  border border-gray-200 appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 "
                />
                {clientErrors.password_confirmation && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.password_confirmation}
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
