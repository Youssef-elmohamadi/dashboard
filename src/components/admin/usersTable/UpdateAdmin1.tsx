import React, { useEffect, useState } from "react";
import {
  getAdminById,
  getAllRoles,
  updateAdmin,
} from "../../../api/usersApi/_requests";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
const UpdateAdmin1 = () => {
  const { id } = useParams<{ id: string }>();
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
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        if (id) {
          const response = await getAdminById(id);
          const adminData = response.data.data;
          setAdminData(adminData);
          setUpdateData({
            first_name: adminData.first_name || "",
            last_name: adminData.last_name || "",
            phone: adminData.phone || "",
            email: adminData.email || "",
            password: "",
            role: adminData.roles[0]?.name || "",
          });
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
      }
    };

    fetchAdmin();
  }, [id]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setUpdateData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        const dataToSubmit = {
          ...updateData,
          password: updateData.password || adminData.password,
        };

        const response = await updateAdmin(id, dataToSubmit);
        navigate("/admins", { state: { successUpdate: "Admin Created Successfully" } })
      }
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  return (
    <div>
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Edit Admin
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mt-10 flex justify-between items-center flex-col"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          <div className="col-span-1">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              value={updateData.first_name}
              placeholder="Edit the Name"
              onChange={handleChange}
            />
          </div>

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
          </div>

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
          </div>

          <div className="col-span-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value=""
              placeholder="Edit the Password"
              onChange={handleChange}
            />
          </div>

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
          </div>

          <div className="col-span-1">
            <Label htmlFor="category">Role</Label>
            <Select
              options={options.map((role) => ({
                value: role.name,
                label: role.name,
              }))}
              onChange={handleSelectChange}
              defaultValue={updateData.role}
              placeholder="Select a Role"
            />
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
  );
};

export default UpdateAdmin1;
