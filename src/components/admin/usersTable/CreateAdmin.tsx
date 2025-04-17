import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { getAllRoles, createAdmin } from "../../../api/usersApi/_requests";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CreateAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
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
        setOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchData();
  }, []);

  // تعديل handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdmin(adminData);
      navigate("/admin/admins", {
        state: { successCreate: "Admin Created Successfully" },
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      const rawErrors = error?.response?.data.errors;

      if (Array.isArray(rawErrors)) {
        // نحول المصفوفة لكائن فيه كل خطأ حسب الكود
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
          </div>
        </div>
        <div className="w-full">
          <Label>Select Role</Label>
          <Select
            options={options.map((role) => ({
              value: role.name,
              label: role.name,
            }))}
            defaultValue={adminData.role}
            onChange={handleSelectChange}
            placeholder="Select a Role"
            className="dark:bg-dark-900"
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role[0]}</p>
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
          className="items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 flex justify-center w-1/4"
        >
          Add Admin
          <FiUserPlus size={20} />
        </button>
      </form>
    </div>
  );
}
