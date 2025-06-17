import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { useEffect, useState } from "react";
import {
  getAdminById,
  updateAdmin,
} from "../../../api/AdminApi/usersApi/_requests";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  roles: [{ name: string }];
  avatar: string;
  password: string;
}

const initialUserData: UserData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  roles: [{ name: "" }],
  avatar: "",
  password: "",
};

export default function UserInfoCard({ userType }: { userType: string }) {
  const { t } = useTranslation(["UserProfile"]);
  const { isOpen, openModal, closeModal } = useModal();
  const [dataUser, setDataUser] = useState<UserData>(initialUserData);
  const [updateData, setUpdateData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery<UserData, Error>({
    queryKey: ["userData"],
    queryFn: async () => {
      const storedUserId = localStorage.getItem("admin_id");
      if (!storedUserId) throw new Error("User ID not found in localStorage");
      if (userType === "admin") {
        const res = await getAdminById(storedUserId);
        return res.data.data;
      } else {
        return {
          first_name: "Mariam",
          last_name: "Darouich",
          email: "Mariam@yahoo.com",
          phone: "796423522",
          roles: [{ name: "" }],
          avatar: "",
          password: "",
        };
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // تحديث dataUser لما userData تتغير
  useEffect(() => {
    if (userData) {
      setDataUser(userData);
    }
  }, [userData]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleOpenModal = () => {
    setUpdateData({
      first_name: dataUser.first_name || "",
      last_name: dataUser.last_name || "",
      email: dataUser.email || "",
      phone: dataUser.phone || "",
      password: "",
    });
    setSelectedImage(null);
    setImageFile(null);
    setValidationErrors({});
    openModal();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("validation.invalid_file_type"));
        return;
      }
      setImageFile(file);
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // التحقق من الحقول
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!updateData.first_name)
      newErrors.first_name = t("validation.first_name");
    if (!updateData.last_name) newErrors.last_name = t("validation.last_name");
    if (
      !updateData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)
    )
      newErrors.email = t("validation.email_invalid");
    if (!updateData.phone || !/^\+?\d{10,15}$/.test(updateData.phone))
      newErrors.phone = t("validation.phone_invalid");
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // تحديث بيانات المستخدم باستخدام useMutation
  const updateUserMutation = useMutation({
    mutationFn: (formData: FormData) => {
      const userId = localStorage.getItem("admin_id");
      if (!userId) throw new Error("User ID not found in localStorage");
      return updateAdmin(userId, formData);
    },
    onSuccess: () => {
      toast.success(t("editInfoCard.successUpdate"));
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      closeModal();
      setSelectedImage(null);
      setImageFile(null);
    },
    onError: (error: any) => {
      toast.error(t("editInfoCard.errorUpdate"));
      console.error("Failed to update user", error);
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append("first_name", updateData.first_name);
    formData.append("last_name", updateData.last_name);
    formData.append("email", updateData.email);
    formData.append("phone", updateData.phone);
    if (updateData.password) {
      formData.append("password", updateData.password);
    }
    formData.append("role", dataUser.roles[0].name);
    if (imageFile) {
      formData.append("avatar", imageFile);
    }

    updateUserMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300">
        {t("userInfoCard.loading")}
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-600">{t("userInfoCard.errorFetching")}</div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {t("userInfoCard.title")}
          </h4>

          <div className="mb-5">
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {t("userInfoCard.avatar")}
            </p>
            <div className="w-24 h-24 overflow-hidden rounded-full border border-gray-300 dark:border-gray-600">
              <img
                src={dataUser?.avatar || "/images/default-avatar.jpg"}
                alt="User"
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "/images/default-avatar.jpg")
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("userInfoCard.first_name")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dataUser.first_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("userInfoCard.last_name")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dataUser.last_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("userInfoCard.email")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dataUser.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {t("userInfoCard.phone")}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {dataUser.phone}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          {t("userInfoCard.update")}
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {t("userInfoCard.title")}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {t("editInfoCard.editDescription")}
            </p>
          </div>
          <form onSubmit={handleSave} className="flex flex-col ">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative">
                <img
                  src={
                    selectedImage || dataUser.avatar || "/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a1 1 0 011-1h2a1 1 0 01.894.553L8.618 4H13a1 1 0 011 1v1h-1V5H8.382l-.724-1.447A1 1 0 006.618 3H5v1H4V3zM3 6a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V7a1 1 0 00-1-1H3zm7 2a3 3 0 110 6 3 3 0 010-6z" />
                  </svg>
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t("editInfoCard.change_avatar")}
              </p>
            </div>
            <div className="overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  {t("userInfoCard.title")}
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>{t("userInfoCard.first_name")}</Label>
                    <Input
                      name="first_name"
                      type="text"
                      value={updateData.first_name}
                      onChange={handleChange}
                    />
                    {validationErrors.first_name && (
                      <p className="text-red-600 text-sm mt-1">
                        {validationErrors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{t("userInfoCard.last_name")}</Label>
                    <Input
                      name="last_name"
                      type="text"
                      value={updateData.last_name}
                      onChange={handleChange}
                    />
                    {validationErrors.last_name && (
                      <p className="text-red-600 text-sm mt-1">
                        {validationErrors.last_name}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{t("userInfoCard.email")}</Label>
                    <Input
                      name="email"
                      type="email"
                      value={updateData.email}
                      onChange={handleChange}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>{t("userInfoCard.phone")}</Label>
                    <Input
                      name="phone"
                      type="text"
                      value={updateData.phone}
                      onChange={handleChange}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-600 text-sm mt-1">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label>{t("editInfoCard.password")}</Label>
                    <Input
                      name="password"
                      type="password"
                      value={updateData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                {t("editInfoCard.close")}
              </Button>
              <button type="submit">{t("editInfoCard.save")}</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
