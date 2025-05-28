import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import i18n from "../../../i18n"; // أو استخدم useTranslation لو في React component
import "./ShipmentModal.css";

const MySwal = withReactContent(Swal);

export const openShipmentModal = async (orderId: number, apiFn: any) => {
  const t = i18n.getFixedT(null, "OrdersTable");

  const { value: formValues } = await MySwal.fire({
    title: t("ordersPage.ship.title"),
    customClass: { popup: "custom-popup" },
    html: `
    <input id="tracking_number" class="swal2-input" placeholder="${t(
      "ordersPage.ship.tracking_placeholder"
    )}">
    
    <label for="estimated_delivery_date" class="block w-[300px] text-gray-700 mt-3 mr-3 ml-7 -mb-3 dark:text-white">
      ${t("ordersPage.ship.estimated_label")}
    </label>
    
    <input id="estimated_delivery_date" type="date" class="swal2-input !w-[300px]">
  `,
    confirmButtonText: t("ordersPage.ship.confirm_button"),
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
        Swal.showValidationMessage(t("ordersPage.ship.fill_all_fields"));
        return false;
      }

      if (selectedDate < today) {
        const input = document.getElementById("estimated_delivery_date");
        const message = document.createElement("div");
        message.id = "date-error-message";
        message.style.color = "red";
        message.style.fontSize = "0.8rem";
        message.style.marginTop = "4px";
        message.innerText = t("ordersPage.ship.date_error");
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
      await apiFn({ data: formValues, id: orderId });
      toast.success(t("ordersPage.ship.success_message"));
    } catch (error) {
      console.error(error);
      toast.error(t("ordersPage.ship.error_message"));
    }
  }
};
