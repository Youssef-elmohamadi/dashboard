import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { getAllCategories } from "../../api/categoryApi/_requests";
import FileInput from "../form/input/FileInput";
import { createProduct, getAllProducts } from "../../api/products/_requests";
import { getAllBrands } from "../../api/brandsApi/_requests";
import TextArea from "../form/input/TextArea";

// Types

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  category_id: string;
  brand_id: string;
  status: "active" | "inactive";
  is_featured: boolean;
};

type Attribute = {
  label: string;
  value: string;
};

type Category = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  parent_id: number | null;
  status: string;
  order: number;
  commission_rate: number;
  appears_in_website: string;
  created_at: string | null;
  updated_at: string | null;
  category: string | null;
};

type Brand = {
  id: number;
  name: string;
  image: File | string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export default function CreateProducts() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  // const [variants, setVariants] = useState<Attribute[]>([
  //   { label: "", value: "" },
  // ]);
  const [tags, setTags] = useState<string[]>([]);
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

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 0,
      name: "",
      description: "",
      image: null,
      parent_id: null,
      status: "",
      order: 0,
      commission_rate: 0,
      appears_in_website: "no",
      created_at: null,
      updated_at: null,
      category: null,
    },
  ]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.data) {
          const categories = response.data.data.original;
          setCategories(categories); // <-- هنا
          console.log(categories);
        } else {
          console.error("Data not available in response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        console.log(response);

        if (response.data) {
          const brands = response.data.data;
          setBrands(brands); // <-- هنا
          console.log(brands);
        } else {
          console.error("Data not available in response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const addAttribute = () => {
    setAttributes([...attributes, { label: "", value: "" }]);
  };

  // const handleVariantChange = (
  //   index: number,
  //   field: keyof Attribute,
  //   value: string
  // ) => {
  //   const updated = [...variants];
  //   updated[index][field] = value;
  //   setVariants(updated);
  // };

  // const addVariant = () => {
  //   setVariants([...variants, { label: "", value: "" }]);
  // };

  const handleTagChange = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };
  const addTag = () => {
    setTags([...tags, ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    // variants.forEach((variant, i) => {
    //   formData.append(`variants[${i}][label]`, variant.label);
    //   formData.append(`variants[${i}][value]`, variant.value);
    // });
    tags.forEach((tag, i) => formData.append(`tags[${i}]`, tag));

    try {
      const response = createProduct(formData);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  console.log(categories[0].name);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input name="name" value={productData.name} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            type="number"
            name="stock_quantity"
            value={productData.stock_quantity}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="category_id">Category</Label>
          <select
            name="category_id"
            value={productData.category_id}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="brand_id">Brand</Label>
          <select
            name="brand_id"
            value={productData.brand_id}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          >
            <option value="">Select Brand</option>
            {brands.map((brand, index) => (
              <option key={index} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            name="status"
            value={productData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-4 items-center">
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
        {/* <Input /> */}
        <TextArea
          name="description"
          value={productData.description}
          onChange={(value) =>
            setProductData((prev) => ({ ...prev, description: value }))
          }
        ></TextArea>
        {/* <textarea
          id="message"
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
        ></textarea> */}
      </div>
      <div>
        <Label>Attributes</Label>
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-2 mb-2">
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
          onClick={addAttribute}
          className="text-blue-500 mt-1"
        >
          + Add Attribute
        </button>
      </div>

      {/* <div>
        <Label>Variants</Label>
        {variants.map((variant, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Label"
              value={variant.label}
              onChange={(e) =>
                handleVariantChange(index, "label", e.target.value)
              }
            />
            <Input
              placeholder="Value"
              value={variant.value}
              onChange={(e) =>
                handleVariantChange(index, "value", e.target.value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="text-blue-500 mt-1"
        >
          + Add Variant
        </button>
      </div> */}

      <div>
        <Label>Tags</Label>
        {tags.map((tag, index) => (
          <div key={index} className="mb-2">
            <Input
              placeholder="Tag"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addTag} className="text-blue-500 mt-1">
          + Add Tag
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 w-1/4 mx-auto"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
