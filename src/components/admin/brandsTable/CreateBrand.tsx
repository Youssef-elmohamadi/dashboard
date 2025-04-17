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
    status: "",
    image: null,
  });

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

  console.log(brandData);

  const handleFileChange = (file: File | null) => {
    setBrandData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // تعديل handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const brandFormData = new FormData();
    brandFormData.append("name", brandData.name);
    brandFormData.append("status", brandData.status || "active");

    if (brandData.image) {
      brandFormData.append("image", brandData.image);
    }
    try {
      const response = await createBrand(brandFormData);
      navigate("/brands");
    } catch (error) {
      console.error("Error creating brand:", error);
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
            <Label htmlFor="input">Brand Name</Label>
            <Input
              type="text"
              id="input"
              name="name"
              placeholder="Enter the Admin First Name"
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <Label>Select Role</Label>
            <Select
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              onChange={handleSelectChange}
              placeholder="Select a Status"
              defaultValue="Active"
              className="dark:bg-dark-900"
            />
          </div>
          <div>
            <BrandImageUpload
              file={brandData.image}
              onFileChange={handleFileChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 flex justify-center w-1/4"
        >
          Add Brand
        </button>
      </form>
    </div>
  );
}
