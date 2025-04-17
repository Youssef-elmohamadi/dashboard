import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import { getAllPermissions, updateRole } from "../../../api/rolesApi/_requests";
import Loading from "../../common/Loading";

type UpdateAdminProps = {
  role: any;
  onClose: () => void;
  isModalOpen: boolean;
};

type Permission = {
  id: number;
  name: string;
};

const UpdateAdmin: React.FC<UpdateAdminProps> = ({
  role,
  onClose,
  isModalOpen,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    permissions: [] as number[],
  });

  useEffect(() => {
    // IDs from Role permissions
    const permissionIds = role.permissions?.map((perm: any) =>
      typeof perm === "object" ? perm.id : perm
    );

    setUpdateData({
      name: role.name || "",
      permissions: permissionIds || [],
    });
  }, [role]);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const response = await getAllPermissions();
        if (response?.data?.data) {
          setPermissions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (permissionId: number) => {
    setUpdateData((prev) => {
      const isChecked = prev.permissions.includes(permissionId);
      return {
        ...prev,
        permissions: isChecked
          ? prev.permissions.filter((id) => id !== permissionId)
          : [...prev.permissions, permissionId],
      };
    });
  };
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRole(updateData, role.id);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div
          style={{ zIndex: 99999 }}
          className="fixed top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-[#00000080]"
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
                  className="text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={updateData.name}
                      onChange={handleChange}
                      placeholder="Edit the Name"
                    />
                  </div>
                  {loading && <Loading text="wait Getting Permissions" />}
                  {permissions.map((permission) => (
                    <Checkbox
                      key={permission.id}
                      label={permission.name}
                      checked={updateData.permissions.includes(permission.id)}
                      onChange={() => handleCheckbox(permission.id)}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateAdmin;
/*

*/
