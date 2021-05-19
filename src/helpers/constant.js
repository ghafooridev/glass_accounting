const Constant = {
  API_ADDRESS: "http://185.204.197.95:5000/",
  TABLE_PAGE_SIZE: 10,
  ACTION_TYPES: {
    SHOW_ALERT: "SHOW_ALERT",
    HIDE_ALERT: "HIDE_ALERT",
    SHOW_DIALOG: "SHOW_DIALOG",
    HIDE_DIALOG: "HIDE_DIALOG",
    LOG_IN_USER: "LOG_IN_USER",
    LOG_OUT_USER: "LOG_OUT_USER",
    GET_UNITS: "GET_UNITS",
  },
  STORAGE: {
    CURRENT_USER: "CURRENT_USER",
    TOKEN: "TOKEN",
    MODE: "MODE",
    CURRENT_LINK: "CURRENT_LINK",
    PRODUCT_UNITS: "PRODUCT_UNITS",
  },
  VALIDATION: {
    REQUIRED: "این فیلد الزامی است",
    MOBILE_NUMBER: "موبایل باید 11 عدد داشته باشد",
    PASSWORD: "رمز عبور باید حداقل 5 حرف یا رقم باشد",
    CARD_NUMBER: "شماره کارت باید 16 رقم باشد",
    POSITIVE_NUMBER: "این عدد باید مثبت باشد",
  },
  MESSAGES: {},
  ERROR_MESSAGE: {
    BAD_CREDENTIAL: "نام کاربری یا رمز عبور اشتباه است",
  },
  PERSON_STATUS: {
    DEBTIOR: "بدهکار",
    NODEBT: "بستانکار",
    CREDITOR: "طلبکار",
  },
  PERMISSIONS: [
    { value: "USER_SHOW", label: "لیست کاربران" },
    { value: "USER_EDIT", label: "ویرایش کاربران" },
    { value: "PRODCUT_SHOW", label: "لیست محصولات" },
    { value: "PRODCUT_EDIT", label: "ویرایش محصولات" },
    { value: " CUSTOMER_SHOW", label: "لیست مشتریان" },
    { value: " CUSTOMER_EDIT", label: "ویرایش مشتریان" },
  ],
};
export default Constant;
