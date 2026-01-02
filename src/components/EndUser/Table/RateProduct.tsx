import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

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
        /* 2. تعديل الـ CSS عشان يتعامل مع SVG */
        .swal2-popup #rating-stars svg {
          width: 25px;
          height: 25px;
          margin: 0 2px;
          cursor: pointer;
          fill: #ccc; /* لون النجمة الفاضية */
          transition: fill 0.2s ease;
        }
        
        /* لما النجمة تكون Active */
        .swal2-popup #rating-stars svg.active {
          fill: #FFD700; /* لون النجمة الذهبي */
        }

        .swal2-popup .swal2-textarea {
          margin: 5px 3px;
          width: 90%;
        }
      </style>
      
      <div id="rating-stars" class="flex justify-center">
        ${[1, 2, 3, 4, 5]
          .map(
            (i) => `
            <svg viewBox="0 0 24 24" data-value="${i}">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>`
          )
          .join("")}
      </div>
      <textarea id="review-text" class="swal2-textarea" placeholder="${ratePlaceholder}"></textarea>
    `,
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      // 4. هنا بنعد الكلاس active بس
      const rating = document.querySelectorAll("#rating-stars svg.active").length;
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
      const stars = document.querySelectorAll("#rating-stars svg");
      stars.forEach((star, index) => {
        star.addEventListener("click", () => {
          stars.forEach((s, i) => {
            if (i <= index) {
              s.classList.add("active");
            } else {
              s.classList.remove("active");
            }
          });
        });
      });
    },
  });

  return formValues;
}