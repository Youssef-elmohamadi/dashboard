import React, { useEffect, useRef, useState } from "react";
import Input from "../../common/input/InputField";
import Label from "../../common/form/Label";
import Radio from "../../common/input/Radio";
import Checkbox from "../../common/input/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import TextArea from "../../common/input/TextArea";
import { SweetAlert } from "../../common/SweetAlert";
import { clearCart } from "../Redux/cartSlice/CartSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Checkout, ClientErrors, Location } from "../../../types/CheckoutType";
import { RootState } from "../Redux/Store";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import {
  useCheckout,
  useCheckoutInfo,
  useTransportInfo,
} from "../../../hooks/Api/EndUser/Checkout/useCheckout";
import WalletIcon from "../../../icons/WalletIcon";
import Select from "../../common/form/Select";
import { Transport } from "../../../types/transports";
import { CartItem } from "../../../types/Redux";

const CheckoutForm: React.FC<{
  setShippingPrice: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setShippingPrice }) => {
  const { t } = useTranslation(["EndUserCheckout"]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { data: checkoutInfoSaved } = useCheckoutInfo();

  const [clientSideErrors, setClientSideErrors] = useState<ClientErrors>({
    payment_method: "",
    transport: "",
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
    transportation_price: 0,
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

  const { lang } = useDirectionAndLanguage();
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
      if (!loc[field]) fieldErrors[field] = [t(`checkout.${field}_required`)];
      if (
        field === "phone" &&
        loc.phone &&
        !/^01[0125][0-9]{8}$/.test(loc.phone)
      )
        fieldErrors["phone"] = [t("checkout.phone_invalid")];
    });

    if (!checkoutForm.payment_method)
      fieldErrors.payment_method = [t("checkout.payment_required")];
    if (!selectedArea || !selectedTruck) {
      fieldErrors.transport = [t("checkout.transport_required")];
    } else if (notAvailable) {
      fieldErrors.transport = [t("checkout.transport_not_available")];
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
      transport: fieldErrors.transport?.[0] || "",
    }));

    const isValid = Object.keys(fieldErrors).length === 0;
    return { isValid, fieldErrors };
  };

  const { data, isLoading, isError } = useTransportInfo();
  const transportData = data?.data?.data || [];
  const allAreas = [
    ...new Set(transportData.map((item: Transport) => item[`area_${lang}`])),
  ];

  const truckTypes = [
    { name: "جامبو (نقل كبير)", value: "jumbo" },
    { name: "تانكر (عربية صهريج)", value: "tanker" },
    { name: "سطحة (نقل مفتوح)", value: "flatbed" },
    { name: "كونتينر (حاوية شحن)", value: "container" },
    { name: "تلاجة (نقل مبرد)", value: "refrigerated" },
  ];

  const [selectedArea, setSelectedArea] = useState("");
  const [selectedTruck, setSelectedTruck] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [notAvailable, setNotAvailable] = useState(false);

  useEffect(() => {
    if (selectedArea && selectedTruck) {
      const match = transportData.find(
        (item: Transport) =>
          item[`area_${lang}`] === selectedArea &&
          item.vehicle_type === selectedTruck
      );
      if (match) {
        const transportPrice = match.fixed_price || match.price_per_km;
        setPrice(transportPrice);
        setShippingPrice(transportPrice);
        setCheckoutForm((prev) => ({
          ...prev,
          transportation_price: transportPrice,
        }));
        setNotAvailable(false);
      } else {
        setPrice(null);
        setShippingPrice(0);
        setCheckoutForm((prev) => ({ ...prev, transportation_price: 0 }));
        setNotAvailable(true);
      }
    } else {
      setPrice(null);
      setNotAvailable(false);
    }
  }, [selectedArea, selectedTruck, transportData]);

  const focusOnError = (errors: Record<string, string | string[]>) => {
    const errorEntry = Object.entries(errors).find(
      ([_, value]) =>
        (typeof value === "string" && value !== "") ||
        (Array.isArray(value) && value.length > 0)
    );
    if (errorEntry) {
      const fieldName = errorEntry[0];
      const ref = inputRefs?.current[fieldName];
      ref?.focus();
    }
  };

  useEffect(() => {
    const updatedItems = items.map((item: CartItem) => ({
      product_id: item.id,
      quantity: item.quantity,
      varient_id: item.variant_id,
      answer_ids: item.custom_selections?.map((sel) => sel.id) || [],
    }));
    setCheckoutForm((prev) => {
      const newFormState = { ...prev, items: updatedItems };
      if (checkoutInfoSaved?.data) {
        const savedData = checkoutInfoSaved.data.data;
        newFormState.location = {
          full_name: savedData.full_name || prev.location.full_name,
          phone: savedData.phone || prev.location.phone,
          city: savedData.city || prev.location.city,
          area: savedData.area || prev.location.area,
          street: savedData.street || prev.location.street,
          building_number:
            savedData.building_number || prev.location.building_number,
          floor_number: savedData.floor_number || prev.location.floor_number,
          apartment_number:
            savedData.apartment_number || prev.location.apartment_number,
          landmark: savedData.landmark || prev.location.landmark,
          notes: savedData.notes || prev.location.notes,
        };
      }
      return newFormState;
    });
  }, [items, checkoutInfoSaved]);

  const handleChangeLocation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleRadio = (name: keyof Checkout, value: string) => {
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckBox = (id: "save_info" | "newsletter", checked: boolean) => {
    setCheckoutForm((prev) => ({ ...prev, [id]: checked }));
  };

  const afterSuccess = () => {
    localStorage.removeItem("state");
    dispatch(clearCart());
    navigate(`/${lang}`);
  };

  const { mutateAsync: checkout } = useCheckout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const { isValid, fieldErrors } = validate();
    if (!isValid) {
      toast.error(t("checkout.toast_validation"));
      focusOnError(fieldErrors);
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
          if (!formattedErrors[err.code]) formattedErrors[err.code] = [];
          formattedErrors[err.code].push(err.message);
        });
        setErrors(formattedErrors);
        focusOnError(errors);
      } else {
        setErrors({ general: [t("checkout.general")] });
        toast.error(t("checkout.general"));
      }
    }
  };

  const getFieldError = (
    name: string,
    locationKey: keyof Location | null = null
  ) => {
    if (locationKey)
      return (
        clientSideErrors.location[locationKey] ||
        (errors[locationKey] && errors[locationKey][0])
      );
    return (
      clientSideErrors[name as keyof ClientErrors] ||
      (errors[name] && errors[name][0])
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. قسم تفاصيل التوصيل */}
      <div className="">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#d62828]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("checkout.deliveryDetails")}
          </h2>
        </div>

        {errors.general && (
          <p className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {errors.general}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* حقول الإدخال الأساسية */}
          {[
            { id: "full_name", label: t("checkout.full_name") },
            { id: "phone", label: t("checkout.phone") },
            { id: "city", label: t("checkout.city") },
            { id: "area", label: t("checkout.area") },
          ].map((field) => (
            <div key={field.id} className="space-y-1">
              <Label className="!text-gray-600 font-bold text-xs">
                {field.label}
              </Label>
              <Input
                type="text"
                name={field.id}
                className={`!rounded-xl border-gray-200 focus:ring-red-500/10 ${
                  getFieldError("", field.id as keyof Location)
                    ? "!border-red-500"
                    : ""
                }`}
                placeholder={field.label}
                value={checkoutForm.location[field.id as keyof Location]}
                onChange={handleChangeLocation}
                ref={(ref) => (inputRefs.current[field.id] = ref)}
              />
              {getFieldError("", field.id as keyof Location) && (
                <p className="text-xs text-red-500 font-medium">
                  {getFieldError("", field.id as keyof Location)}
                </p>
              )}
            </div>
          ))}

          {/* الشارع */}
          <div className="md:col-span-2 space-y-1">
            <Label className="!text-gray-600 font-bold text-xs">
              {t("checkout.street")}
            </Label>
            <Input
              name="street"
              className={`!rounded-xl border-gray-200 ${
                getFieldError("", "street") ? "!border-red-500" : ""
              }`}
              placeholder={t("checkout.street")}
              value={checkoutForm.location.street}
              onChange={handleChangeLocation}
              ref={(ref) => (inputRefs.current.street = ref)}
            />
            {getFieldError("", "street") && (
              <p className="text-xs text-red-500 font-medium">
                {getFieldError("", "street")}
              </p>
            )}
          </div>

          {/* تفاصيل المبنى */}
          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            {["building_number", "floor_number", "apartment_number"].map(
              (key) => (
                <div key={key} className="space-y-1">
                  <Label className="!text-gray-600 font-bold text-[10px] truncate">
                    {t(`checkout.${key}`)}
                  </Label>
                  <Input
                    name={key}
                    className={`!rounded-xl text-center border-gray-200 ${
                      getFieldError("", key as keyof Location)
                        ? "!border-red-500"
                        : ""
                    }`}
                    value={checkoutForm.location[key as keyof Location]}
                    onChange={handleChangeLocation}
                    ref={(ref) => (inputRefs.current[key] = ref)}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* العلامة المميزة والملاحظات */}
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="!text-gray-600 font-bold text-xs">
              {t("checkout.landmark")}
            </Label>
            <Input
              name="landmark"
              className="!rounded-xl border-gray-200"
              placeholder={t("checkout.landmark")}
              value={checkoutForm.location.landmark}
              onChange={handleChangeLocation}
            />
          </div>
          <div className="space-y-1">
            <Label className="!text-gray-600 font-bold text-xs">
              {t("checkout.notes")}
            </Label>
            <TextArea
              name="notes"
              className="!rounded-xl border-gray-200 min-h-[100px]"
              placeholder={t("checkout.notes_placeholder")}
              value={checkoutForm.location.notes}
              onChange={(val) =>
                setCheckoutForm((prev) => ({
                  ...prev,
                  location: { ...prev.location, notes: val },
                }))
              }
            />
          </div>
        </div>

        {/* خيارات الحفظ */}
        <div className="flex flex-col sm:flex-row gap-6 p-4 bg-gray-50 rounded-xl">
          <Checkbox
            label={t("checkout.save_info")}
            id="save_info"
            checked={checkoutForm.save_info}
            onChange={(checked) => handleCheckBox("save_info", checked)}
          />
          <Checkbox
            label={t("checkout.newsletter")}
            id="newsletter"
            checked={checkoutForm.newsletter}
            onChange={(checked) => handleCheckBox("newsletter", checked)}
          />
        </div>
      </div>

      {/* 2. قسم معلومات الشحن */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("checkout.transport_info")}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isError ? (
          <p className="text-red-500 text-center">
            {t("checkout.error_transport")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="!text-gray-600 font-bold text-xs">
                {t("checkout.select_area")}
              </Label>
              <Select
                options={allAreas?.map((area: any) => ({
                  value: area,
                  label: area,
                }))}
                onChange={(value) => setSelectedArea(value)}
                value={selectedArea}
                placeholder={t("checkout.choose_area")}
              />
            </div>
            <div className="space-y-1">
              <Label className="!text-gray-600 font-bold text-xs">
                {t("checkout.select_truck_type")}
              </Label>
              <Select
                options={truckTypes?.map((vehicle: any) => ({
                  value: vehicle.value,
                  label: vehicle.name,
                }))}
                value={selectedTruck}
                onChange={(value) => setSelectedTruck(value)}
                placeholder={t("checkout.choose_truck_type")}
              />
            </div>
            {isSubmitted && clientSideErrors.transport && (
              <p className="md:col-span-2 text-sm text-red-500 font-medium">
                {clientSideErrors.transport}
              </p>
            )}

            {price && !notAvailable && (
              <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl flex justify-between items-center">
                <span className="text-blue-700 font-medium">
                  {t("checkout.price")}
                </span>
                <span className="text-blue-700 font-bold text-lg">
                  {price} {t("checkout.currency")}
                </span>
              </div>
            )}
            {notAvailable && (
              <p className="md:col-span-2 text-red-500 bg-red-50 p-4 rounded-xl font-medium">
                {t("checkout.not_available")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. قسم طرق الدفع */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("checkout.payment_method")}
          </h2>
        </div>

        <div className="space-y-4">
          {/* محفظة إلكترونية (قريباً) */}
          <div className="relative border border-gray-100 p-5 rounded-2xl bg-gray-50/50 opacity-60 grayscale cursor-not-allowed overflow-hidden">
            <div className="absolute top-2 left-2 bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
              {t("checkout.coming_soon")}
            </div>
            <div className="flex items-center gap-4">
              <Radio
                name="payment_method"
                id="wallet"
                value="wallet"
                checked={false}
                disabled
                onChange={() => {}}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  {t("checkout.pay_wallet")}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("checkout.wallet_unavailable")}
                </p>
              </div>
              <WalletIcon className="text-4xl text-gray-400" />
            </div>
          </div>

          {/* دفع نقدي */}
          <div
            className={`border p-5 rounded-2xl transition-all cursor-pointer ${
              checkoutForm.payment_method === "cash"
                ? "border-[#d62828] bg-red-50/10 ring-1 ring-[#d62828]"
                : "border-gray-100 bg-white"
            }`}
            onClick={() => handleRadio("payment_method", "cash")}
          >
            <div className="flex items-center gap-4">
              <Radio
                name="payment_method"
                id="cash"
                value="cash"
                checked={checkoutForm.payment_method === "cash"}
                onChange={(val) => handleRadio("payment_method", val)}
              />
              <div className="flex-1">
                <div className="font-bold text-gray-800">
                  {t("checkout.pay_cash")}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("checkout.payment_security")}
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isSubmitted &&
          (getFieldError("payment_method") ||
            getFieldError("payment_method")) && (
            <p className="text-sm text-red-500 font-medium px-2">
              {getFieldError("payment_method")}
            </p>
          )}
      </div>

      {/* زر إتمام الطلب */}
      <button
        type="submit"
        className="w-full bg-[#d62828] hover:bg-[#b52222] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
      >
        <span>{t("checkout.order_now")}</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </button>
    </form>
  );
};

export default CheckoutForm;
