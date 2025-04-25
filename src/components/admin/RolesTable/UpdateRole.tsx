import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import {
  getAllPermissions,
  getRoleById,
  updateRole,
} from "../../../api/AdminApi/rolesApi/_requests";
import Loading from "../../common/Loading";

type Permission = {
  id: number;
  name: string;
};

const UpdateRole: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: "",
    permissions: [] as number[],
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({}); // إضافة حالة لتخزين الأخطاء

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب كل الصلاحيات
        const permissionsRes = await getAllPermissions();
        setPermissions(permissionsRes.data.data || []);

        // جلب بيانات الرول
        if (id) {
          const roleRes = await getRoleById(id);
          const roleData = roleRes.data.data;

          const permissionIds = Array.isArray(roleData.permissions)
            ? roleData.permissions.map((perm: any) => perm.id)
            : [];

          setUpdateData({
            name: roleData.name || "",
            permissions: permissionIds,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!updateData.name) {
      errors.name = "Name is required.";
    }
    if (updateData.permissions.length === 0) {
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
      await updateRole(updateData, id);
      navigate("/admin/roles", {
        state: { successUpdate: "Roles Updated Successfully" },
      });
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle invalid role ID
  if (!id) {
    return <p className="text-red-500 p-4">Invalid role ID</p>;
  }

  return (
    <div className="p-6">
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Update Role
        </h3>
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
            {formErrors.name && (
              <p className="text-red-500">{formErrors.name}</p>
            )}{" "}
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
                    checked={updateData.permissions.includes(permission.id)}
                    onChange={() => handleCheckbox(permission.id)}
                  />
                ))}
              </div>
              {formErrors.permissions && (
                <p className="text-red-500 text-sm">{formErrors.permissions}</p>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

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
  );
};

export default UpdateRole;
