import { useState } from "react";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import { useNavigate } from "react-router-dom";
import BrandImageUpload from "./BrandImageUpload";
import { createBrand } from "../../../api/brandsApi/_requests";

export default function CreateBrand() {
  const [brandData, setBrandData] = useState<{
    name: string;
    status: string;
    image: File | null;
  }>({
    name: "",
    status: "active",
    image: null,
  });

  const [errors, setErrors] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setBrandData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setBrandData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    let hasError = false;
    let newErrors: { name?: string } = {};

    if (!brandData.name.trim()) {
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
      const brandFormData = new FormData();
      brandFormData.append("name", brandData.name);
      brandFormData.append("status", brandData.status || "active");

      if (brandData.image) {
        brandFormData.append("image", brandData.image);
      }

      await createBrand(brandFormData);
      navigate("/admin/brands", {
        state: { successCreate: "Brand Created Successfully" },
      });
    } catch (error: any) {
      setSubmitError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create Brand
        </h3>
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pt-3">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
          <div>
            <Label htmlFor="name">Brand Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={brandData.name}
              onChange={handleChange}
              placeholder="Enter the Brand Name"
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
              defaultValue={brandData.status}
            />
          </div>
        </div>

        <div>
          <Label>Brand Image</Label>
          <BrandImageUpload
            file={brandData.image}
            onFileChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Add Brand"}
        </button>
      </form>
    </div>
  );
}
