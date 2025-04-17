import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRoles, updateAdmin } from "../../../api/usersApi/_requests";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
type UpdateAdminProps = {
  user: any;
  onClose: () => void;
  isModalOpen: any;
};
const UpdateAdmin: React.FC<UpdateAdminProps> = ({
  user,
  onClose,
  isModalOpen,
}) => {
  const [updateData, setUpdateData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    email: user.email,
    password: user.password,
    role: user.roles?.[0]?.name || "",
  });

  const [options, setOptions] = useState<any[]>([]);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(user);
  const handleSelectChange = (value: string) => {
    setUpdateData((prev) => ({
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
  console.log(updateData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateAdmin(user.id, updateData);
      navigate("/admins");
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div
          style={{ zIndex: 99999 }}
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 flex justify-center items-center w-full h-screen !bg-[#00000080]"
        >
          <div className="relative p-4 w-full max-w-1/2">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-600 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Admin
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 14 14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <Label
                      htmlFor="first_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      First Name
                    </Label>
                    <Input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={updateData.first_name}
                      placeholder="Edit the Name"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label
                      htmlFor="last_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={updateData.first_name}
                      placeholder="Edit the Last Name"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      value={updateData.email}
                      placeholder="Edit the Last Name"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Edit the Password"
                      value={updateData.password}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone
                    </Label>
                    <Input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Edit the Phone"
                      value={updateData.phone}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Role
                    </Label>
                    <Select
                      options={options.map((role) => ({
                        value: role.name,
                        label: role.name,
                      }))}
                      onChange={handleSelectChange}
                      defaultValue={updateData.role}
                      placeholder="Select a Role"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    ></Select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateAdmin;
