const convertToFormData = (data: any) => {
  const formData = new FormData();

  // إضافة بيانات المعلومات الأساسية للمسؤول
  formData.append("adminInfo[first_name]", data.adminInfo.first_name);
  formData.append("adminInfo[last_name]", data.adminInfo.last_name);
  formData.append("adminInfo[phone]", data.adminInfo.phone);
  formData.append("adminInfo[email]", data.adminInfo.email);
  formData.append("adminInfo[password]", data.adminInfo.password);

  // إضافة بيانات المعلومات الخاصة بالبائع
  formData.append("vendorInfo[name]", data.vendorInfo.name);
  formData.append("vendorInfo[email]", data.vendorInfo.email);
  formData.append("vendorInfo[phone]", data.vendorInfo.phone);

  // إضافة بيانات معلومات البنك
  // formData.append("bankInfo[phone]", data.bankInfo.phone);

  // إضافة الملفات الخاصة بالمستندات
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
