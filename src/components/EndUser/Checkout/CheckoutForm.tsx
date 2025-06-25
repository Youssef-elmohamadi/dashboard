import React, { useEffect, useState } from "react";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Radio from "../../form/input/Radio";
import { SlWallet } from "react-icons/sl";
import Checkbox from "../../form/input/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import { checkout } from "../../../api/EndUserApi/ensUserProducts/_requests";
import TextArea from "../../form/input/TextArea";
import { SweetAlert } from "../../common/SweetAlert";
import { clearCart } from "../Redux/cartSlice/CartSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Checkout, ClientErrors, Location } from "../../../types/CheckoutType";
import { RootState } from "../Redux/Store";
import { Product } from "../../../types/Product";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const CheckoutForm: React.FC = () => {
  const { t } = useTranslation(["EndUserCheckout"]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [clientSideErrors, setClientSideErrors] =
    useState<ClientErrors>({
      payment_method: "",
      location: {
        full_name: "",
        phone: "",
        city: "",
        area: "",
        street: "",
        building_number: "",
        floor_number: "",
        apartment_number: "",
        landmark: "",
        notes: "",
      },
      save_info: false,
      newsletter: false,
    });

  const [checkoutForm, setCheckoutForm] = useState<Checkout>({
    items: [],
    payment_method: "",
    location: {
      full_name: "",
      phone: "",
      city: "",
      area: "",
      street: "",
      building_number: "",
      floor_number: "",
      apartment_number: "",
      landmark: "",
      notes: "",
    },
    save_info: false,
    newsletter: false,
  });

  const items = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    const fieldErrors: Record<string, string[]> = {};
    const loc = checkoutForm.location;

    const locationFields: (keyof Location)[] = [
      "full_name",
      "phone",
      "city",
      "area",
      "street",
      "building_number",
      "floor_number",
      "apartment_number",
    ];

    locationFields.forEach((field) => {
      if (!loc[field]) {
        fieldErrors[field] = [t(`checkout.${field}_required`)];
      }

      if (
        field === "phone" &&
        loc.phone &&
        !/^01[0125][0-9]{8}$/.test(loc.phone)
      ) {
        fieldErrors["phone"] = [t("checkout.phone_invalid")];
      }
    });

    if (!checkoutForm.payment_method) {
      fieldErrors.payment_method = [t("checkout.payment_required")];
    }

    setClientSideErrors((prev) => ({
      ...prev,
      location: {
        full_name: fieldErrors.full_name?.[0] || "",
        phone: fieldErrors.phone?.[0] || "",
        city: fieldErrors.city?.[0] || "",
        area: fieldErrors.area?.[0] || "",
        street: fieldErrors.street?.[0] || "",
        building_number: fieldErrors.building_number?.[0] || "",
        floor_number: fieldErrors.floor_number?.[0] || "",
        apartment_number: fieldErrors.apartment_number?.[0] || "",
        landmark: fieldErrors.landmark?.[0] || "",
        notes: fieldErrors.notes?.[0] || "",
      },
      payment_method: fieldErrors.payment_method?.[0] || "",
    }));

    return Object.keys(fieldErrors).length === 0;
  };

  useEffect(() => {
    const updatedItems = items.map((item:Product) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));
    setCheckoutForm((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  }, [items]);

  const handleChangeLocation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name as keyof Location]: value,
      },
    }));
  };

  const handleRadio = (name: keyof Checkout, value: string) => {
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckBox = (id: "save_info" | "newsletter", checked: boolean) => {
    setCheckoutForm((prev) => ({ ...prev, [id]: checked }));
  };
  const { lang } = useDirectionAndLanguage();
  const afterSuccess = () => {
    localStorage.removeItem("state");
    dispatch(clearCart());
    navigate(`/${lang}/`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate()) {
      toast.error(t("checkout.toast_validation"));
      return;
    }

    try {
      await checkout(checkoutForm);
      SweetAlert(t("checkout.success_message"), afterSuccess);
    } catch (error: any) {
      const rawErrors = error?.response?.data.errors;

      if (Array.isArray(rawErrors)) {
        const formattedErrors: Record<string, string[]> = {};

        rawErrors.forEach((err: { code: string; message: string }) => {
          if (!formattedErrors[err.code]) {
            formattedErrors[err.code] = [];
          }
          formattedErrors[err.code].push(err.message);
        });

        setErrors(formattedErrors);
      } else {
        setErrors({ general: [t("checkout.general")] });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {t("checkout.deliveryDetails")}
      </h2>
      {errors.general && (
        <p className="text-red-500 text-sm mt-1">{errors.general}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(
          [
            "full_name",
            "phone",
            "city",
            "area",
            "street",
            "building_number",
            "floor_number",
            "apartment_number",
          ] as const
        ).map((name) => (
          <div key={name}>
            <Label className="dark:!text-gray-700">
              {t(`checkout.${name}`)}
            </Label>
            <Input
              type="text"
              name={name}
              className="dark:!bg-transparent dark:placeholder:!text-gray-400 !placeholder:text-gray-400 text-gray-800 dark:!border-gray-200 dark:!text-gray-800"
              placeholder={t(`checkout.${name}`)}
              value={checkoutForm.location[name]}
              onChange={handleChangeLocation}
            />
            {clientSideErrors.location[name] && (
              <p className="text-red-500 text-sm mt-1">
                {clientSideErrors.location[name]}
              </p>
            )}
            {errors[name] && !clientSideErrors.location[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name][0]}</p>
            )}
          </div>
        ))}
      </div>

      <div>
        <Label className="dark:!text-gray-700">{t("checkout.landmark")}</Label>
        <Input
          type="text"
          name="landmark"
          placeholder={t("checkout.landmark")}
          value={checkoutForm.location.landmark}
          onChange={handleChangeLocation}
          className="dark:!bg-transparent dark:placeholder:!text-gray-400 dark:!border-gray-200 dark:!text-gray-800"
        />
        {clientSideErrors.location.landmark && (
          <p className="text-red-500 text-sm mt-1">
            {clientSideErrors.location.landmark}
          </p>
        )}
        {errors.landmark && (
          <p className="text-red-500 text-sm mt-1">{errors.landmark[0]}</p>
        )}
      </div>

      <div>
        <Label className="dark:!text-gray-700">{t("checkout.notes")}</Label>
        <TextArea
          name="notes"
          placeholder={t("checkout.notes_placeholder")}
          value={checkoutForm.location.notes}
          onChange={(value) =>
            setCheckoutForm((prev) => ({
              ...prev,
              location: {
                ...prev.location,
                notes: value,
              },
            }))
          }
          className="dark:!bg-transparent dark:!border-gray-200 dark:!text-gray-800"
        />
        {clientSideErrors.location.notes && (
          <p className="text-red-500 text-sm mt-1">
            {clientSideErrors.location.notes}
          </p>
        )}
        {errors.notes && (
          <p className="text-red-500 text-sm mt-1">{errors.notes[0]}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Checkbox
          label={t("checkout.save_info")}
          id="save_info"
          checked={checkoutForm.save_info}
          onChange={(checked) => handleCheckBox("save_info", checked)}
          className="dark:!bg-transparent dark:text-gray-900 dark:!border-gray-300 dark:checked:!bg-brand-500"
        />
        <Checkbox
          label={t("checkout.newsletter")}
          id="newsletter"
          checked={checkoutForm.newsletter}
          onChange={(checked) => handleCheckBox("newsletter", checked)}
          className="dark:!bg-transparent dark:text-gray-900 dark:!border-gray-300 dark:checked:!bg-brand-500"
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-6">
        {t("checkout.payment_method")}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {t("checkout.payment_security")}
      </p>

      {isSubmitted && clientSideErrors.payment_method && (
        <p className="text-sm text-red-500 mb-2">
          {clientSideErrors.payment_method}
        </p>
      )}
      {isSubmitted && errors.payment_method?.length && (
        <p className="text-sm text-red-500 mb-2">{errors.payment_method[0]}</p>
      )}

      <div className="border border-gray-200 p-4 rounded-xl mb-4">
        <Radio
          name="payment_method"
          id="wallet"
          value="wallet"
          label={t("checkout.pay_wallet")}
          onChange={(value) => handleRadio("payment_method", value)}
          checked={checkoutForm.payment_method === "wallet"}
          className="dark:!bg-transparent dark:text-gray-900 dark:!border-gray-300 dark:checked:!bg-brand-500"
        />
        <div className="flex justify-center my-4">
          <SlWallet className="text-6xl text-purple-700" />
        </div>
        <p className="text-center text-gray-500">
          {t("checkout.redirect_payment")}
        </p>
      </div>

      <div className="border border-gray-200 p-4 rounded-xl">
        <Radio
          name="payment_method"
          id="cash"
          value="cash"
          label={t("checkout.pay_cash")}
          onChange={(value) => handleRadio("payment_method", value)}
          checked={checkoutForm.payment_method === "cash"}
          className="dark:!bg-transparent dark:text-gray-900 dark:!border-gray-300 dark:checked:!bg-brand-500"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-medium shadow-sm"
      >
        {t("checkout.pay_now")}
      </button>
    </form>
  );
};

export default CheckoutForm;
