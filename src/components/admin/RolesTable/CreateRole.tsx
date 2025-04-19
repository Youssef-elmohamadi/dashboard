import { useEffect, useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import { createRole, getAllPermissions } from "../../../api/rolesApi/_requests";
import Loading from "../../common/Loading";
import { useNavigate } from "react-router-dom";

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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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
    setRoleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!roleData.name.trim()) {
      errors.name = "Name is required.";
    }
    if (roleData.permissions.length === 0) {
      errors.permissions = "At least one permission must be selected.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await createRole(roleData);
      if (response?.status === 200 || response?.status === 201) {
        navigate("/admin/roles", {
          state: { successCreate: "Role Created Successfully" },
        });
      }
    } catch (error) {
      console.error("Error creating role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Create Role</h1>
      </header>

      <div className="bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <form onSubmit={handleSubmit} className="p-4 md:p-5">
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={roleData.name}
                onChange={handleChange}
                placeholder="Enter the Role Name"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            {loading ? (
              <Loading text="Wait, getting permissions..." />
            ) : (
              <div className="col-span-2">
                <h2 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-400">
                  Permissions
                </h2>
                <div className="grid grid-cols-2 gap-2 max-h-60 pr-2">
                  {permissions.map((permission) => (
                    <Checkbox
                      key={permission.id}
                      label={permission.name}
                      checked={roleData.permissions.includes(permission.id)}
                      onChange={() => handleCheckbox(permission.id)}
                    />
                  ))}
                </div>
                {formErrors.permissions && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.permissions}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
