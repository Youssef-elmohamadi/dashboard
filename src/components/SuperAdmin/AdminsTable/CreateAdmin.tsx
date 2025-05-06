import { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import {
  getAllRoles,
  createAdmin,
} from "../../../api/SuperAdminApi/Admins/_requests";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CreateAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    first_name: [] as string[],
    last_name: [] as string[],
    phone: [] as string[],
    email: [] as string[],
    password: [] as string[],
    role: [] as string[],
  });
  const [adminData, setAdminData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
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
    if (!adminData.first_name) {
      newErrors.first_name = "First Name is Required";
    } else if (!adminData.last_name) {
      newErrors.last_name = "Last Name is Required";
    } else if (!adminData.email) {
      newErrors.email = "The Email Required";
    } else if (
      /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newErrors.email)
    ) {
      newErrors.email = "InValid Email";
    } else if (!adminData.phone) {
      newErrors.phone = "The Phone Number is Required";
    } else if (!/^01[0125][0-9]{8}$/.test(adminData.phone)) {
      newErrors.phone = "Please Enter Valid Phone Number";
    } else if (!adminData.password) {
      newErrors.password = "The Password is Required";
    } else if (!adminData.role) {
      newErrors.role = "The Role is Required";
    }
    setClientSideErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllRoles();
        setOptions(response?.data?.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createAdmin(adminData);
      navigate("/super_admin/admins", {
        state: { successCreate: "Admin Created Successfully" },
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const rawErrors = error?.response?.data.errors;

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
        setErrors({ general: ["Something went wrong."] });
      }
    }
  };
  return (
    <div>
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create Admin
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-8 flex justify-between items-center flex-col"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label htmlFor="input">First Name</Label>
            <Input
              type="text"
              id="input"
              name="first_name"
              placeholder="Enter the Admin First Name"
              onChange={handleChange}
            />
            {errors.first_name && (
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
            <Label htmlFor="inputTwo">Last Name</Label>
            <Input
              type="text"
              id="inputTwo"
              name="last_name"
              placeholder="Enter the Admin Last Name"
              onChange={handleChange}
            />
            {errors.last_name && (
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
          <Label>Select Role</Label>
          <Select
            options={options?.map((role) => ({
              value: role?.name,
              label: role?.name,
            }))}
            defaultValue={adminData?.role}
            onChange={handleSelectChange}
            placeholder="Select a Role"
            className="dark:bg-dark-900"
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
          )}
          {clientSideErrors.role && (
            <p className="text-red-500 text-sm mt-1">{clientSideErrors.role}</p>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="inputTwo">Email</Label>
          <Input
            type="email"
            id="inputTwo"
            name="email"
            placeholder="Enter the Admin Email"
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
          )}
          {clientSideErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.email}
            </p>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="inputTwo">Phone</Label>
          <Input
            type="text"
            id="inputTwo"
            name="phone"
            placeholder="Enter the Admin Phone"
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
          )}
          {clientSideErrors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {clientSideErrors.phone}
            </p>
          )}
        </div>
        <div className="w-full">
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter The Admin password"
              onChange={handleChange}
            />
            {errors.password && (
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
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
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
          className="bg-blue-600 flex gap-4 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <FiUserPlus size={20} />
          {loading ? "Creating..." : "Add Admin"}
        </button>
      </form>
    </div>
  );
}
