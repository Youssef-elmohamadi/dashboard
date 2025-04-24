import React, { useEffect, useState } from "react";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import Select from "../../form/Select";
import Radio from "../../form/input/Radio";
import { SlWallet } from "react-icons/sl";
import Checkbox from "../../form/input/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import { checkout } from "../../../api/EndUserApi/ensUserProducts/_requests";
import TextArea from "../../form/input/TextArea";

const CheckoutForm: React.FC = () => {
  const [errors, setErrors] = useState({
    full_name: [] as string[],
    phone: [] as string[],
    email: [] as string[],
    password: [] as string[],
    role: [] as string[],
  });

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

  const items = useSelector((state) => state.cart.items);

  const handleChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCheckBox = (id: string, checked: boolean) => {
    setCheckoutForm((prev) => ({ ...prev, [id]: checked }));
  };

  useEffect(() => {
    const updatedItems = items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));
    setCheckoutForm((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await checkout(checkoutForm);
    } catch (error) {
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

  return (
    <div className="w-1/2 enduser_container">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-4 bg-transparent rounded-xl space-y-4"
      >
        <h2 className="text-xl font-bold">Delivery</h2>

        <div className="space-y-2">
          <div>
            <Label>Full Name</Label>
            <Input
              type="text"
              placeholder="Full Name"
              name="full_name"
              className="p-2 border rounded-md"
              onChange={handleChangeLocation}
              value={checkoutForm.location.full_name}
              error={errors.full_name?.length}
              hint={errors.full_name?.[0] || "Please enter your full name."}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              type="text"
              placeholder="Phone"
              name="phone"
              className="p-2 border rounded-md"
              onChange={handleChangeLocation}
              value={checkoutForm.location.phone}
              error={!!errors.phone?.length}
              hint={errors.phone?.[0] || "Enter a valid phone number to reach you."}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>City</Label>
            <Input
              type="text"
              placeholder="City"
              name="city"
              className="p-2 border rounded-md"
              onChange={handleChangeLocation}
              value={checkoutForm.location.city}
              hint="Mention your current city."
            />
          </div>
          <div>
            <Label>Area</Label>
            <Input
              type="text"
              placeholder="Area"
              name="area"
              className="p-2 border rounded-md"
              onChange={handleChangeLocation}
              value={checkoutForm.location.area}
              hint="Provide your local area or neighborhood."
            />
          </div>
        </div>

        <div>
          <Label>Street</Label>
          <Input
            type="text"
            placeholder="Street"
            name="street"
            className="p-2 border rounded-md"
            onChange={handleChangeLocation}
            value={checkoutForm.location.street}
            hint="Street name for accurate delivery."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Home Number</Label>
            <Input
              type="text"
              placeholder="Home Number"
              name="building_number"
              className="p-2 border rounded-md"
              onChange={handleChangeLocation}
              value={checkoutForm.location.building_number}
              hint="Building number or house identifier."
            />
          </div>
          <div>
            <Label>Floor Number</Label>
            <Input
              type="text"
              placeholder="Floor Number"
              name="floor_number"
              className="p-2 border rounded-md"
              onChange={handleChangeLocation}
              value={checkoutForm.location.floor_number}
              hint="Mention which floor your apartment is on."
            />
          </div>
          <div>
            <Label>Apartment Number</Label>
            <Input
              type="text"
              placeholder="Apartment Number"
              name="apartment_number"
              className="w-full p-2 border rounded-md"
              onChange={handleChangeLocation}
              value={checkoutForm.location.apartment_number}
              hint="Your specific apartment or flat number."
            />
          </div>
        </div>

        <div>
          <Label>Landmark</Label>
          <Input
            type="text"
            placeholder="Landmark"
            name="landmark"
            className="w-full p-2 border rounded-md"
            onChange={handleChangeLocation}
            value={checkoutForm.location.landmark}
            hint="Optional: A nearby place to help locate you."
          />
        </div>

        <div>
          <Label>Notes</Label>
          <TextArea
            placeholder="Any Extra Notes"
            onChange={(val) =>
              setCheckoutForm((prev) => ({
                ...prev,
                location: { ...prev.location, notes: val },
              }))
            }
            name="notes"
            value={checkoutForm.location.notes}
          />
        </div>

        <Checkbox
          label="Keep Information for next time"
          id="save_info"
          checked={checkoutForm.save_info}
          onChange={(checked) => {
            handleCheckBox("save_info", checked);
          }}
        />

        <Checkbox
          label="Send me News and Offers"
          checked={checkoutForm.newsletter}
          id="newsletter"
          onChange={(checked) => {
            handleCheckBox("newsletter", checked);
          }}
        />

        <h2 className="text-xl font-semibold mb-4">Payment</h2>
        <p className="text-sm text-gray-500 mb-2">
          All payments are secure and encrypted.
        </p>

        <div className="border rounded-md p-4 mb-6">
          <Radio
            onChange={(value) => handleRadio("payment_method", value)}
            value="online"
            name="payment_method"
            id="wallet"
            label="Pay via (Debit/Credit cards / Wallets / Installments)"
            checked={checkoutForm.payment_method === "ًWallet"}
          />

          <div className="flex justify-center my-3">
            <SlWallet className="text-black text-9xl" />
          </div>

          <div className="border border-dashed p-6 text-center text-gray-500">
            After clicking "Pay Now", you'll be redirected to complete the
            purchase securely.
          </div>
        </div>

        <div className="mb-6">
          <Radio
            onChange={(value) => handleRadio("payment_method", value)}
            checked={checkoutForm.payment_method === "cash"}
            value="cash"
            label="Cash on Delivery"
            name="payment_method"
            id="cash"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium transition"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
