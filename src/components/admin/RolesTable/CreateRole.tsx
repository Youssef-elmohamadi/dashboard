import { useEffect, useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useNavigate } from "react-router-dom";
import Checkbox from "../../form/input/Checkbox";
import { createRole, getAllPermissions } from "../../../api/rolesApi/_requests";
import Loading from "../../common/Loading";
type Permission = {
  id: number;
  name: string;
};
export default function CreateRole() {
  const [loading, setLoading] = useState(false);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roleData, setRoleData] = useState({
    name: "",
    permissions: [] as number[],
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleCheckbox = (permissionId: number) => {
    setRoleData((prev) => {
      const isChecked = prev.permissions.includes(permissionId);
      return {
        ...prev,
        permissions: isChecked
          ? prev.permissions.filter((id) => id !== permissionId)
          : [...prev.permissions, permissionId],
      };
    });
  };

  // تعديل handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createRole(roleData);
      navigate("/roles");
      window.location.reload();
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
        <div className="grid grid-cols-1 gap-5  w-full">
          <div>
            <Label htmlFor="input">Name</Label>
            <Input
              type="text"
              id="input"
              name="name"
              placeholder="Enter the Role Name"
              value={roleData.name}
              onChange={handleChange}
            />
          </div>
          {loading && <Loading text="wait for Getting permissions..." />}
          {permissions.map((permission) => (
            <Checkbox
              key={permission.id}
              label={permission.name}
              checked={roleData.permissions.includes(permission.id)}
              onChange={() => handleCheckbox(permission.id)}
            />
          ))}
        </div>
        <button
          type="submit"
          className="items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 flex justify-center w-1/4"
        >
          Add Role
        </button>
      </form>
    </div>
  );
}
