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

const UpdateAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
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

    try {
      if (id) {
        const dataToSend = {
          ...updateData,
          password: updateData.password || adminData.password,
        };

        await updateAdmin(id, dataToSend);
        navigate("/admin/admins", {
          state: { successEdit: "Admin Updated Successfully" },
        });
      }
    } catch (err: any) {
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
        setErrors({ general: ["Something went wrong."] });
      }
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Edit Admin
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-10 flex flex-col items-center"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* First Name */}
          <div className="col-span-1">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              value={updateData.first_name}
              placeholder="Edit the First Name"
              onChange={handleChange}
            />
            {errors.first_name?.[0] && (
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name[0]}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="col-span-1">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              value={updateData.last_name}
              placeholder="Edit the Last Name"
              onChange={handleChange}
            />
            {errors.last_name?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="col-span-1">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={updateData.email}
              placeholder="Edit the Email"
              onChange={handleChange}
            />
            {errors.email?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="col-span-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={updateData.password}
                placeholder="Enter New Password"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
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
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="text"
              name="phone"
              id="phone"
              value={updateData.phone}
              placeholder="Edit the Phone"
              onChange={handleChange}
            />
            {errors.phone?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
            )}
          </div>

          {/* Role */}
          <div className="col-span-1">
            <Label htmlFor="role">Role</Label>
            <Select
              options={options.map((role) => ({
                value: role.name,
                label: role.name,
              }))}
              onChange={handleSelectChange}
              defaultValue={updateData.role}
              placeholder="Select a Role"
            />
            {errors.role?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          <svg
            className="me-1 -ms-1 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateAdmin;
