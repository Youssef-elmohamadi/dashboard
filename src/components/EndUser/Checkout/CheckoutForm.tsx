import React, { useEffect, useState } from "react";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Radio from "../../form/input/Radio";
import { SlWallet } from "react-icons/sl";
import Checkbox from "../../form/input/Checkbox";
import { useSelector } from "react-redux";
import { checkout } from "../../../api/EndUserApi/ensUserProducts/_requests";
import TextArea from "../../form/input/TextArea";
import { SweetAlert } from "../../common/SweetAlert";
import { useDispatch } from "react-redux";
import { clearCart } from "../Redux/cartSlice/CartSlice";
import { useNavigate } from "react-router-dom";

const CheckoutForm: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
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

  const items = useSelector((state: any) => state.cart.items);
  const navigate = useNavigate();
  const handleChangeLocation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleRadio = (name: string, value: string) => {
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const dispatch = useDispatch();
  const handleCheckBox = (id: string, checked: boolean) => {
    setCheckoutForm((prev) => ({ ...prev, [id]: checked }));
  };

  useEffect(() => {
    const updatedItems = items.map((item: any) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));
    setCheckoutForm((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  }, [items]);

  const afterSuccess = () => {
    localStorage.removeItem("state");
    dispatch(clearCart());
    navigate("/");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      await checkout(checkoutForm);
      SweetAlert("Your request has been received successfully.", afterSuccess);
    } catch (error: any) {
      const rawErrors = error.response?.data?.errors || [];
      const formattedErrors: Record<string, string[]> = {};
      rawErrors.forEach((err: { code: string; message: string }) => {
        if (!formattedErrors[err.code]) {
          formattedErrors[err.code] = [];
        }
        formattedErrors[err.code].push(err.message);
      });
      setErrors(formattedErrors);
    }
  };

  const getLocationError = (field: string) => {
    return isSubmitted ? errors[`location.${field}`]?.[0] : "";
  };

  const getError = (field: string) => {
    return isSubmitted ? errors[field]?.[0] : "";
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 ">
        <h2 className="text-2xl font-bold">Delivery Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={checkoutForm.location.full_name}
              onChange={handleChangeLocation}
              error={!!getLocationError("full_name")}
            />
            {isSubmitted && errors["location.full_name"] && (
              <p className="text-error-500 text-sm">Full Name Is Required</p>
            )}
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              type="text"
              name="phone"
              placeholder="Phone"
              value={checkoutForm.location.phone}
              onChange={handleChangeLocation}
              error={!!getLocationError("phone")}
            />
            {isSubmitted && errors["location.phone"] && (
              <p className="text-error-500 text-sm">Phone Is Required</p>
            )}
          </div>
          <div>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              placeholder="City"
              value={checkoutForm.location.city}
              onChange={handleChangeLocation}
              error={!!getLocationError("city")}
            />
            {isSubmitted && errors["location.city"] && (
              <p className="text-error-500 text-sm">City Is Required</p>
            )}
          </div>
          <div>
            <Label>Area</Label>
            <Input
              type="text"
              name="area"
              placeholder="Area"
              value={checkoutForm.location.area}
              onChange={handleChangeLocation}
              error={!!getLocationError("area")}
              hint={getLocationError("area")}
            />
          </div>
          <div>
            <Label>Street</Label>
            <Input
              type="text"
              name="street"
              placeholder="Street"
              value={checkoutForm.location.street}
              onChange={handleChangeLocation}
              error={!!getLocationError("street")}
              hint={getLocationError("street")}
            />
          </div>
          <div>
            <Label>Building Number</Label>
            <Input
              type="text"
              name="building_number"
              placeholder="Building Number"
              value={checkoutForm.location.building_number}
              onChange={handleChangeLocation}
              error={!!getLocationError("building_number")}
              hint={getLocationError("building_number")}
            />
          </div>
          <div>
            <Label>Floor Number</Label>
            <Input
              type="text"
              name="floor_number"
              placeholder="Floor Number"
              value={checkoutForm.location.floor_number}
              onChange={handleChangeLocation}
              error={!!getLocationError("floor_number")}
              hint={getLocationError("floor_number")}
            />
          </div>
          <div>
            <Label>Apartment Number</Label>
            <Input
              type="text"
              name="apartment_number"
              placeholder="Apartment Number"
              value={checkoutForm.location.apartment_number}
              onChange={handleChangeLocation}
              error={!!getLocationError("apartment_number")}
              hint={getLocationError("apartment_number")}
            />
          </div>
        </div>
        <div>
          <Label>Landmark</Label>
          <Input
            type="text"
            name="landmark"
            placeholder="Landmark"
            value={checkoutForm.location.landmark}
            onChange={handleChangeLocation}
            error={!!getLocationError("landmark")}
            hint={getLocationError("landmark")}
          />
        </div>
        <div>
          <Label>Notes</Label>
          <TextArea
            name="notes"
            placeholder="Any Extra Notes"
            value={checkoutForm.location.notes}
            onChange={handleChangeLocation}
          />
        </div>

        <Checkbox
          label="Save my information for next time"
          id="save_info"
          checked={checkoutForm.save_info}
          onChange={(checked) => handleCheckBox("save_info", checked)}
        />
        <Checkbox
          label="Subscribe to newsletter"
          id="newsletter"
          checked={checkoutForm.newsletter}
          onChange={(checked) => handleCheckBox("newsletter", checked)}
        />

        <h2 className="text-2xl font-bold mt-6">Payment Method</h2>
        <p className="text-sm text-gray-500 mb-4">
          All transactions are secure and encrypted.
        </p>

        {isSubmitted && errors.payment_method?.length && (
          <p className="text-sm text-red-500 mb-2">
            {errors.payment_method[0]}
          </p>
        )}

        <div className="border p-4 rounded-lg mb-4">
          <Radio
            name="payment_method"
            id="wallet"
            value="wallet"
            label="Pay via Wallet / Credit Card / Installments"
            onChange={(value) => handleRadio("payment_method", value)}
            checked={checkoutForm.payment_method === "wallet"}
          />
          <div className="flex justify-center my-4">
            <SlWallet className="text-6xl text-purple-700" />
          </div>
          <p className="text-center text-gray-500">
            After clicking Pay Now, you’ll be redirected to the secure payment
            page.
          </p>
        </div>

        <div className="border p-4 rounded-lg">
          <Radio
            name="payment_method"
            id="cash"
            value="cash"
            label="Cash on Delivery"
            onChange={(value) => handleRadio("payment_method", value)}
            checked={checkoutForm.payment_method === "cash"}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium"
        >
          Pay Now
        </button>
      </form>
    </>
  );
};

export default CheckoutForm;
