import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { getAllRoles, createAdmin } from "../../api/usersApi/_requests";
import { FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function CreateAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
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
      const response = await createAdmin(adminData);
      navigate("/admins");
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full flex justify-between items-center flex-col"
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
          </div>
        </div>
        <div className="w-full">
          <Label>Select Role</Label>
          <Select
            options={options.map((role) => ({
              value: role.name,
              label: role.name,
            }))}
            onChange={handleSelectChange}
            placeholder="Select a Role"
            className="dark:bg-dark-900"
          />
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
        </div>
        <div className="w-full">
          <Label>Password Input</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter The Admin password"
              onChange={handleChange}
            />
            <button
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
