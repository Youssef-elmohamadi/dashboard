import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import BrandImageUpload from "./BrandImageUpload";
import { updateBrand, getBrandById } from "../../../api/brandsApi/_requests";
type Brand = {
  name: string;
  status: string;
  image: string | File;
};
const UpdateBrandPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState({
    name: "",
    status: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(false);
  // Fetch brand data when component mounts
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const brandData = await getBrandById(id); // تأكد من وجود هذا الميثود
        setUpdateData({
          name: brandData.data.data.name || "",
          status: brandData.data.data.status || "active",
          image: brandData.data.data?.image,
        });
        console.log(brandData);
      } catch (err) {
        setError("Failed to load brand data.");
      }
    };
    fetchBrand();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setUpdateData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSelectChange = (value: string) => {
    setUpdateData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // تحقق من الأخطاء
    let hasError = false;
    let newErrors: { name?: string } = {};

    if (!updateData.name) {
      newErrors.name = "Brand name is required.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", updateData.name);
      formData.append("status", updateData.status);

      // إرسال الصورة فقط لو كانت جديدة
      if (updateData.image && typeof updateData.image !== "string") {
        formData.append("image", updateData.image);
      }

      await updateBrand(formData, id);
      navigate("/admin/brands");
    } catch (err: any) {
      setError(err.message || "An error occurred while updating the brand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-gray-700 dark:text-gray-400 font-bold mb-4 text-xl">
        Update Brand
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Brand Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={updateData.name}
            onChange={handleChange}
            placeholder="Edit the Brand Name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label>Select Status</Label>
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            onChange={handleSelectChange}
            placeholder="Select a Status"
            defaultValue={updateData.status || "active"}
          />
          {errors.status && (
            <p className="text-red-600 text-sm mt-1">{errors.status}</p>
          )}
        </div>

        <div>
          <Label>Brand Image</Label>
          <BrandImageUpload
            file={updateData.image}
            onFileChange={handleFileChange}
          />

          {/* Preview for server image */}
          {typeof updateData.image === "string" && updateData.image && (
            <div className="mt-4">
              <p className=" text-gray-700 dark:text-gray-400 font-medium mb-4 text-sm">
                Current Brand Image:
              </p>
              <img
                src={updateData.image}
                alt="Brand Preview"
                className="w-32 h-32 text-gray-700 dark:text-gray-400 object-cover rounded border dark:border-gray-700"
              />
              {errors.image && (
                <p className="text-red-600 text-sm mt-1">{errors.image}</p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default UpdateBrandPage;
