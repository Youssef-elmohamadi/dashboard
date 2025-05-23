import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import "font-awesome/css/font-awesome.min.css";

export async function showReviewPopup(
  product_id: number,
  ratePlaceholder: string,
  titleRate: string,
  rateError: string,
  confirmText: string,
  cancelText: string
) {
  const { value: formValues } = await Swal.fire({
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    title: titleRate,
    html: `
      <style>
        .swal2-popup #rating-stars i {
          font-size: 25px;
          margin: 0 2px;
          cursor: pointer;
          color: #ccc;
          transition: color 0.2s ease;
        }
        .swal2-popup #rating-stars i.active {
          color: #FFD700;
        }

        .swal2-popup .swal2-textarea {
        margin: 5px 3px;
        width:90%;
        }
      </style>
      <div id="rating-stars">
        ${[1, 2, 3, 4, 5]
          .map((i) => `<i class="fa fa-star-o" data-value="${i}"></i>`)
          .join("")}
      </div>
      <textarea id="review-text" class="swal2-textarea" placeholder=${ratePlaceholder}></textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const rating = document.querySelectorAll("#rating-stars i.active").length;
      const review = (
        document.getElementById("review-text") as HTMLTextAreaElement
      )?.value;

      if (!rating) {
        Swal.showValidationMessage(rateError);
        return;
      }

      return {
        product_id,
        rating: rating.toString(),
        review,
      };
    },
    didOpen: () => {
      const stars = document.querySelectorAll("#rating-stars i");
      stars.forEach((star, index) => {
        star.addEventListener("click", () => {
          stars.forEach((s, i) => {
            s.classList.toggle("fa-star", i <= index);
            s.classList.toggle("fa-star-o", i > index);
            s.classList.toggle("active", i <= index);
          });
        });
      });
    },
  });

  return formValues;
}
