import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import { getAllCategories } from "../../../api/AdminApi/categoryApi/_requests";
import FileInput from "../../form/input/FileInput";
import { createProduct } from "../../../api/AdminApi/products/_requests";
import { getAllBrands } from "../../../api/AdminApi/brandsApi/_requests";
import TextArea from "../../form/input/TextArea";
import { FiDelete } from "react-icons/fi";

type Attribute = { label: string; value: string };
type Category = { id: string; name: string };
type Brand = { id: string; name: string };
type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  category_id: string;
  brand_id: string;
  status: string;
  is_featured: boolean;
};

export default function CreateProducts() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [productData, setProductData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    brand_id: "",
    status: "active",
    is_featured: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const navigate = useNavigate();

  const addTag = () => {
    setTags([...tags, ""]);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.data) setCategories(response.data.data.original);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        if (response.data) setBrands(response.data.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleAttributeChange = (
    index: number,
    field: keyof Attribute,
    value: string
  ) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const handleTagChange = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const removeAttribute = (index: number) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
  };

  const removeTag = (index: number) => {
    const updated = [...tags];
    updated.splice(index, 1);
    setTags(updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!productData.name) newErrors.name = "Name is required";
    if (!productData.price) newErrors.price = "Price is required";
    if (!productData.stock_quantity)
      newErrors.stock_quantity = "Stock quantity is required";
    if (!productData.category_id)
      newErrors.category_id = "Category is required";
    if (!productData.brand_id) newErrors.brand_id = "Brand is required";
    if (!productData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "is_featured") {
        formData.append(key, value.toString());
      }
    });

    formData.append("is_featured", productData.is_featured ? "1" : "0");
    images.forEach((image) => formData.append("images[]", image));
    attributes.forEach((attr, i) => {
      formData.append(`attributes[${i}][name]`, attr.label);
      formData.append(`attributes[${i}][value]`, attr.value);
    });
    tags
      .filter((tag) => tag.trim() !== "")
      .forEach((tag, i) => formData.append(`tags[${i}]`, tag));

    try {
      await createProduct(formData);
      navigate("/admin/products", {
        state: { successCreate: "Roles Created Successfully" },
      });
    } catch (error) {
      console.log("Error creating product:", error);
    }

    setLoading(false);
  };

  return (
    <div className="">
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create Product
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              value={productData.name}
              placeholder="Enter product name"
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              type="text"
              name="price"
              placeholder="Enter price"
              value={productData.price}
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              type="text"
              name="stock_quantity"
              placeholder="Enter quantity in stock"
              value={productData.stock_quantity}
              onChange={handleChange}
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock_quantity}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category_id">Category</Label>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
            )}
          </div>
          <div>
            <Label htmlFor="brand_id">Brand</Label>
            <select
              name="brand_id"
              value={productData.brand_id}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand_id && (
              <p className="text-red-500 text-sm mt-1">{errors.brand_id}</p>
            )}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              name="status"
              value={productData.status}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <Label htmlFor="is_featured">Featured</Label>
            <Checkbox
              checked={productData.is_featured}
              onChange={(checked) =>
                setProductData((prev) => ({ ...prev, is_featured: checked }))
              }
            />
          </div>
        </div>

        <div>
          <Label>Upload Images</Label>
          <FileInput multiple={true} onChange={handleImageChange} />
          <div className="flex gap-4 mt-2 flex-wrap">
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className="h-20 rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <TextArea
            name="description"
            placeholder="Enter product description"
            value={productData.description}
            onChange={(value) =>
              setProductData((prev) => ({ ...prev, description: value }))
            }
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <Label>Attributes</Label>
          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                className="text-red-600 text-xl"
              >
                <FiDelete className="text-red-600 text-xl" />
              </button>
              <Input
                placeholder="Label"
                value={attr.label}
                onChange={(e) =>
                  handleAttributeChange(index, "label", e.target.value)
                }
              />
              <Input
                placeholder="Value"
                value={attr.value}
                onChange={(e) =>
                  handleAttributeChange(index, "value", e.target.value)
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setAttributes([...attributes, { label: "", value: "" }])
            }
            className="text-blue-500 mt-1"
          >
            + Add Attribute
          </button>
        </div>

        <div>
          {tags.length > 0 && (
            <div>
              <Label>Tags</Label>
              {tags.map((tag, index) => (
                <div key={index} className="mb-2 flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-red-600 text-xl"
                  >
                    <FiDelete className="text-red-600 text-xl" />
                  </button>
                  <Input
                    placeholder="Tag"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={addTag} className="text-blue-500 mt-1">
            + Add Tag
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 w-1/4 mx-auto"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
