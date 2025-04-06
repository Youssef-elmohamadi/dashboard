import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { Data_Form } from "../../api/authApi/core/_modales";

function StoreSignupForm() {
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [taxRegistrationDocument, setTaxRegistrationDocument] =
    useState<File | null>(null);
  const [storeCategory, setStoreCategory] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [dataForm, setDataForm] = useState<Data_Form>({
    store_name: "",
    store_email: "",
    store_phone: "",
    tax_registration_document: null,
    category: "",
    location: "",
    website_url: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    national_id_document: null,
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setTaxRegistrationDocument(file);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* <!-- First Name --> */}
        <div className="sm:col-span-1">
          <Label>
            Store Name<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="fname"
            name="fname"
            placeholder="Enter Store name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>
        {/* <!-- Last Name --> */}
        <div className="sm:col-span-1">
          <Label>
            Store Phone<span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            id="lname"
            name="lname"
            placeholder="Enter Store phone"
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
          />
        </div>
      </div>
      {/* <!-- Email --> */}
      <div>
        <Label>
          Store Email<span className="text-error-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter store email"
          value={storeEmail}
          onChange={(e) => setStoreEmail(e.target.value)}
        />
      </div>
      <div>
        <Label>
          Store Category<span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          id="email"
          name="email"
          placeholder="Enter store category"
          value={storeCategory}
          onChange={(e) => setStoreCategory(e.target.value)}
        />
      </div>

      <div>
        <Label>
          TAX Registration<span className="text-error-500">*</span>
        </Label>
        <Input
          type="file"
          id="email"
          name="email"
          placeholder="Enter store email"
          onChange={handleFileChange}
          hint="Upload TAX Registration"
        />
      </div>

      {/* <!-- Password --> */}
      {/* <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div> */}
      {/* <!-- Checkbox --> */}
      {/* <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div> */}
      {/* <!-- Button --> */}
    </div>
  );
}
export default StoreSignupForm;
