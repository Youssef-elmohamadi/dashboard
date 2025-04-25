import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getOrdersWithPaginate,
  shipmentOrder,
} from "../../../api/AdminApi/ordersApi/_requests";

const MySwal = withReactContent(Swal);

export const openShipmentModal = async (orderId: number) => {
  const { value: formValues } = await MySwal.fire({
    title: "Enter Shipment Details",
    html: `
      <input id="tracking_number" class="swal2-input" placeholder="Tracking Number">
      <input id="estimated_delivery_date" type="date" class="swal2-input">
    `,
    confirmButtonText: "Submit",
    focusConfirm: false,
    preConfirm: () => {
      const trackingNumber = (
        document.getElementById("tracking_number") as HTMLInputElement
      ).value;
      const estimatedDeliveryDate = (
        document.getElementById("estimated_delivery_date") as HTMLInputElement
      ).value;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(estimatedDeliveryDate);

      const oldMessage = document.getElementById("date-error-message");
      if (oldMessage) oldMessage.remove();

      if (!trackingNumber || !estimatedDeliveryDate) {
        Swal.showValidationMessage("Please fill in all fields");
        return false;
      }

      if (selectedDate < today) {
        const input = document.getElementById("estimated_delivery_date");
        const message = document.createElement("div");
        message.id = "date-error-message";
        message.style.color = "red";
        message.style.fontSize = "0.8rem";
        message.style.marginTop = "4px";
        message.innerText = "Estimated date must be today or later.";
        input?.parentElement?.appendChild(message);
        return false;
      }

      return {
        tracking_number: trackingNumber,
        estimated_delivery_date: estimatedDeliveryDate,
      };
    },
  });

  if (formValues) {
    try {
      await shipmentOrder(formValues, orderId); // Send to API
      toast.success("Shipment info submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit shipment info.");
    }
  }
};
