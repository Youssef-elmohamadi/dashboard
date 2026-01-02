import { FormDataType } from "../../../types/Auth";

const convertToFormData = (data: FormDataType) => {
  const formData = new FormData();


  formData.append("adminInfo[first_name]", data.adminInfo.first_name);
  formData.append("adminInfo[last_name]", data.adminInfo.last_name);
  formData.append("adminInfo[phone]", data.adminInfo.phone);
  formData.append("adminInfo[email]", data.adminInfo.email);
  formData.append("adminInfo[password]", data.adminInfo.password);


  formData.append("vendorInfo[name]", data.vendorInfo.name);
  formData.append("vendorInfo[email]", data.vendorInfo.email);
  formData.append("vendorInfo[phone]", data.vendorInfo.phone);


  // formData.append("bankInfo[phone]", data.bankInfo.phone);

  data.documentInfo.forEach((doc: any, index: any) => {
    if (doc.document_file) {
      formData.append(
        `documentInfo[${index}][document_file]`,
        doc.document_file
      );
      formData.append(
        `documentInfo[${index}][document_type]`,
        doc.document_type
      );
    }
  });

  return formData;
};

export default convertToFormData;
