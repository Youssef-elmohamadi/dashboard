export type Data_Form = {
  "basicInfo":{
    "first_name": string,
    "last_name": string,
    "phone": string,
    "email": string,
    "password": string,
    "confirm_password": string,
  }
  "bankInfo":{
    "bank_name": string,
    "account_number": string,
    "account_name": string,
  }
  "taxCardDoc": File,
  "commercialRegisterDoc": File
};