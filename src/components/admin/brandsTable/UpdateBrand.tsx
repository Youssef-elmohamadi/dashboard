import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import BrandImageUpload from "./BrandImageUpload";
import { updateRole } from "../../../api/rolesApi/_requests";
import { updateBrand } from "../../../api/brandsApi/_requests";

type UpdateBrandProps = {
  brand: any;
  onClose: () => void;
  isModalOpen: boolean;
};

const UpdateBrand: React.FC<UpdateBrandProps> = ({
  brand,
  onClose,
  isModalOpen,
}) => {
  const [updateData, setUpdateData] = useState({
    name: "",
    status: "",
    image: null,
  });

  useEffect(() => {
    setUpdateData({
      name: brand.name || "",
      status: brand.status || "",
      image: null,
    });
  }, []);

  const imageUrl: any = updateData.image;
  console.log(updateData);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (file: File | null) => {
    setUpdateData((prev: any) => ({
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
    if (!updateData.name) {
      alert("Brand name is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", updateData.name);
      formData.append("status", updateData.status);

      if (updateData.image) {
        formData.append("image", updateData.image);
      }

      console.log(formData);

      await updateBrand(formData, brand.id); // إرسال البيانات عبر FormData
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating brand:", error);
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
                  Edit Brand
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
                    <Label htmlFor="name">Brand Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={updateData.name}
                      onChange={handleChange}
                      placeholder="Edit the Brand Name"
                    />
                  </div>
                  <div className="w-full">
                    <Label>Select Status</Label>
                    <Select
                      options={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                      ]}
                      onChange={handleSelectChange}
                      placeholder="Select a Status"
                      defaultValue={updateData.status || "active"}
                      className="dark:bg-dark-900"
                    />
                  </div>
                  <div>
                    <BrandImageUpload
                      file={updateData.image}
                      onFileChange={handleFileChange}
                      endPointImage={imageUrl}
                    />
                  </div>
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

export default UpdateBrand;
