import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { Circles } from "react-loader-spinner";
import { EyeCloseIcon, EyeIcon } from "../../../icons"; // Assuming these are valid paths
import { useNavigate } from "react-router-dom"; // Import useParams
import {
  useProfile,
  useUpdateProfile,
} from "../../../hooks/Api/EndUser/useProfile/useProfile";
import {
  ClientErrors,
  ServerErrors,
  UserProfileFormData,
} from "../../../types/UserProfile";
import SEO from "../../../components/common/SEO/seo"; // Import your custom SEO component
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import ProfileIcon from "../../../icons/ProfileIcon";
import PhotoIcon from "../../../icons/PhotoIcon";
import LazyImage from "../../../components/common/LazyImage";

const UserProfile = () => {
  const { t } = useTranslation(["EndUserProfile"]);
  const navigate = useNavigate();
  const primaryColor = "#d62828";
  const secondaryColor = "#d62828";

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
  const { lang } = useDirectionAndLanguage();
  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      toast.error(
        t("authRequired", {
          defaultValue: "Please login first to view your profile.",
        })
      );
      navigate(`/${lang}/signin`, { replace: true });
    }
  }, [navigate, t]);

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
      setExistingImage(
        !userProfileData?.avatar ||
          userProfileData?.avatar.trim() === "" ||
          userProfileData?.avatar ===
            "https://tashtiba.com/storage/app/public/content/user/profile/"
          ? "/images/default-avatar.webp"
          : userProfileData.avatar
      );
    }
  }, [userProfileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setImageUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, avatar: [] })); // Clear avatar error on new selection
      setClientErrors((prev) => ({ ...prev, avatar: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear errors for the specific field when changed
      setErrors((prev) => ({ ...prev, [name]: [] }));
      setClientErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newClientErrors: { [key: string]: string } = {};

    if (!formData.first_name.trim()) {
      newClientErrors.first_name = t("validation.first_name_required");
    }

    if (!formData.last_name.trim()) {
      newClientErrors.last_name = t("validation.last_name_required");
    }

    if (!formData.email.trim()) {
      newClientErrors.email = t("validation.email_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newClientErrors.email = t("validation.email_invalid");
    }

    if (!formData.phone.trim()) {
      newClientErrors.phone = t("validation.phone_required");
    }

    if (formData.password && formData.password.length < 6) {
      newClientErrors.password = t("validation.password_short");
    }

    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    ) {
      newClientErrors.password_confirmation = t(
        "validation.password_confirmation_mismatch"
      );
    }

    setClientErrors(newClientErrors);
    return Object.keys(newClientErrors).length === 0;
  };

  const { mutate: updateProfileMutation, isPending: isUpdating } =
    useUpdateProfile({
      onSuccess: () => {
        toast.success(t("toast.update_success"));
        // Clear password fields after successful update
        setFormData((prev) => ({
          ...prev,
          password: "",
          password_confirmation: "",
        }));
        setErrors({
          first_name: [],
          last_name: [],
          email: [],
          phone: [],
          password: [],
          password_confirmation: [],
          avatar: [],
          general: "",
          global: "",
        }); // Clear server errors
      },
      onError: (error: any) => {
        const rawErrors = error?.response?.data?.errors;
        const newServerErrors: ServerErrors = {
          first_name: [],
          last_name: [],
          email: [],
          phone: [],
          password: [],
          password_confirmation: [],
          avatar: [],
          general: "",
          global: "",
        };

        if (rawErrors) {
          // Handle Laravel validation errors (often objects with arrays)
          if (typeof rawErrors === "object" && !Array.isArray(rawErrors)) {
            for (const key in rawErrors) {
              if (key in newServerErrors && Array.isArray(rawErrors[key])) {
                (newServerErrors as any)[key] = rawErrors[key];
              }
            }
          }
          // Handle a general error message if available
          if (rawErrors.message) {
            newServerErrors.general = rawErrors.message;
          }
        } else {
          newServerErrors.general = t("admin.errors.general");
        }
        setErrors(newServerErrors);
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
    if (formData.id) payload.append("id", formData.id);
    if (formData.first_name) payload.append("first_name", formData.first_name);
    if (formData.last_name) payload.append("last_name", formData.last_name);
    if (formData.email) payload.append("email", formData.email);
    if (formData.phone) payload.append("phone", formData.phone);
    if (formData.password) payload.append("password", formData.password);
    if (formData.password_confirmation)
      payload.append("password_confirmation", formData.password_confirmation);
    if (formData.avatar) payload.append("avatar", formData.avatar);

    updateProfileMutation(payload);
  };

  return (
    <div className="p-4">
      <SEO
        title={{
          ar: `ملفي الشخصي`,
          en: `My Profile`,
        }}
        description={{
          ar: `قم بتحديث معلومات ملفك الشخصي على تشطيبة. إدارة بيانات الاتصال، تغيير كلمة المرور، وتحديث صورة الملف الشخصي بأمان في مصر.`,
          en: `Update your personal profile information on Tashtiba. Manage contact details, change password, and update your profile picture securely in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "ملفي الشخصي",
            "تعديل البيانات",
            "تغيير كلمة المرور",
            "صورة الملف الشخصي",
            "بيانات الحساب",
            "إدارة الملف",
            "مصر",
            "حسابي",
          ],
          en: [
            "tashtiba",
            "my profile",
            "edit profile",
            "change password",
            "profile picture",
            "account settings",
            "manage account",
            "Egypt",
            "my account",
          ],
        }}
        url={`https://tashtiba.com/${lang}/profile`}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/profile" },
          { lang: "en", href: "https://tashtiba.com/en/profile" },
          { lang: "x-default", href: "https://tashtiba.com/ar/profile" },
        ]}
        robotsTag="noindex, nofollow"
      />

      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-6 border-b-2" style={{ borderColor: primaryColor }}>
          <h1
            className="md:text-3xl text-xl font-bold flex items-center gap-3"
            style={{ color: secondaryColor }}
          >
            <ProfileIcon className="md:h-8 md:w-8 w-6 h-6" />
            {t("title", { defaultValue: "ملفي الشخصي" })}
          </h1>
          <p className="mt-2 text-black">
            {t("subtitle", {
              defaultValue:
                "قم بإدارة معلومات حسابك وتفاصيل الاتصال الخاصة بك.",
            })}
          </p>
        </div>
        <div className="p-6">
          {isLoading && !userProfileData ? (
            <div className="flex justify-center items-center py-10">
              <Circles
                height="80"
                width="80"
                color={secondaryColor}
                ariaLabel="loading-profile"
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div
                  className="relative w-36 h-36 cursor-pointer group" // Added group for hover effect
                  onClick={handleImageClick}
                >
                  <LazyImage
                    src={imageUrl || existingImage}
                    alt="User Avatar"
                    className="w-36 h-36 rounded-full object-cover border-4"
                    style={{ borderColor: primaryColor }} // Using primary brand color for border
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PhotoIcon className="text-white h-6 w-6 text-center mr-4" />
                    <span className="text-white text-sm text-center">
                      {t("form.avatar")}
                    </span>
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
                {errors.avatar[0] && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.avatar[0]}
                  </p>
                )}
                {clientErrors.avatar && (
                  <p className="text-red-600 text-sm mt-1">
                    {clientErrors.avatar}
                  </p>
                )}
              </div>
              {/* Form Fields */}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                {" "}
                {/* Increased gap */}
                {/* First Name */}
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("form.first_name")}
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder={t("form.first_name")}
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-red-200 focus:ring-red-500/20" // Updated focus colors
                  />
                  {(errors.first_name[0] || clientErrors.first_name) && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.first_name[0] || clientErrors.first_name}
                    </p>
                  )}
                </div>
                {/* Last Name */}
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("form.last_name")}
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder={t("form.last_name")}
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-red-200 focus:ring-red-500/20" // Updated focus colors
                  />
                  {(errors.last_name[0] || clientErrors.last_name) && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.last_name[0] || clientErrors.last_name}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("form.email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("form.email")}
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-red-200 focus:ring-red-500/20" // Updated focus colors
                  />
                  {(errors.email[0] || clientErrors.email) && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.email[0] === "validation.email_taken"
                        ? t("backend.emailTaken")
                        : errors.email[0] || clientErrors.email}
                    </p>
                  )}
                </div>
                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("form.phone")}
                  </label>
                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("form.phone")}
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-red-200 focus:ring-red-500/20" // Updated focus colors
                  />
                  {(errors.phone[0] || clientErrors.phone) && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.phone[0] === "validation.phone_taken"
                        ? t("backend.phoneTaken")
                        : errors.phone[0] || clientErrors.phone}
                    </p>
                  )}
                </div>
                {(["password", "password_confirmation"] as const).map(
                  (field) => (
                    <div key={field} className="relative">
                      <label
                        htmlFor={field}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t(`form.${field}`)}
                      </label>
                      <input
                        id={field}
                        type={showPassword ? "text" : "password"}
                        name={field}
                        value={(formData[field] as string) || ""}
                        onChange={handleChange}
                        placeholder={t(`form.${field}`)}
                        className="h-11 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-3 focus:border-red-200 focus:ring-red-500/20" // Updated focus colors
                      />
                      {(errors[field][0] || clientErrors[field]) && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[field][0] || clientErrors[field]}
                        </p>
                      )}
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 mt-4 ${
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
                  )
                )}
              </div>
              {(errors.general || errors.global) && (
                <p className="text-red-600 text-sm text-center mt-4">
                  {errors.general || errors.global}
                </p>
              )}
              <div className="flex justify-start pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-[#d62828] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#d62828]/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ minWidth: "150px" }}
                >
                  {isUpdating ? (
                    <Circles
                      height="20"
                      width="20"
                      color="#fff"
                      ariaLabel="loading-submit"
                      wrapperClass="inline-block"
                    />
                  ) : (
                    t("form.submit")
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserProfile);
