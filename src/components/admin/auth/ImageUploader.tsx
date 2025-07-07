import React, { useEffect, useState } from "react";
import Input from "../../common/input/InputField";

type Props = {
  file: File | null;
  file_type: string;
  field: string;
  onFileChange: (file: File | null, file_type: "1" | "2") => void;
};

function ImageUploader({ file, field, onFileChange }: Props) {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      const type = field === "commercialRegisterDoc" ? "1" : "2";
      onFileChange(selectedFile, type);
    }
  };

  const removeImage = () => {
    const type = field === "commercialRegisterDoc" ? "1" : "2";
    onFileChange(null, type);
  };

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImage(null);
    }
  }, [file]);

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor={`dropzone-file-${field}`}
        className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 overflow-hidden"
      >
        {!image ? (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <img
              src={image}
              alt="Uploaded"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        )}

        <Input
          id={`dropzone-file-${field}`}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e, field)}
        />
      </label>
    </div>
  );
}

export default ImageUploader;
