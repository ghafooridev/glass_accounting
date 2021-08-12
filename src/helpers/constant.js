const Constant = {
  // API_ADDRESS: "http://185.204.197.95:5000/",
  API_ADDRESS: "http://account.toosbloor.ir",
  TABLE_PAGE_SIZE: 100,
  EMPLOYEE_CONTACRT: [
    { value: "FACTORY", label: "کارخانه" },
    { value: "DEPOT", label: "انبار" },
  ],
  TRAFFIC_STATUS: {
    PRESENT: "حاضر",
    APSET: "غایب",
  },
  UNITS_MAP: {
    KILOGRAM: "کیلوگرم",
    GRAM: "گرم",
    TON: "تن",
    BOX: "کارتن",
    SHEL: "شل",
    CUBICMETERS: "مترمکعب",
    PALLET: "پالت",
  },
  ACTION_TYPES: {
    SHOW_ALERT: "SHOW_ALERT",
    HIDE_ALERT: "HIDE_ALERT",
    SHOW_DIALOG: "SHOW_DIALOG",
    HIDE_DIALOG: "HIDE_DIALOG",
    LOG_IN_USER: "LOG_IN_USER",
    LOG_OUT_USER: "LOG_OUT_USER",
    GET_UNITS: "GET_UNITS",
  },
  PERSON_TYPE: {
    EMPLOYEE: "employee",
    CUSTOMER: "customer",
    USER: "user",
    DRIVER: "driver",
    PERSON: "person",
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
    ACCESS_DENIED: "شما دسترسی لازم برای تغییر با نمایش این قسمت را ندارید",
  },
  PERSON_STATUS: {
    DEBTOR: "بدهکار",
    NODEBT: "بی حساب",
    CREDITOR: "طلبکار",
  },
  PAYMENT_TYPE: {
    INCOME: "دریافتی",
    OUTCOME: "پرداختی",
    ALL: "دریافتی و پرداختی",
  },
  INVOICE_TYPE: {
    SELL: "فروش",
    BUY: "خرید",
  },
  ALL_PERMISSIONS: {
    ATTENDANCE_SHOW: "ATTENDANCE_SHOW",
    ATTENDANCE_EDIT: "ATTENDANCE_EDIT",
    ATTENDANCE_ADMIN: "ATTENDANCE_ADMIN",
    USER_SHOW: "USER_SHOW",
    USER_EDIT: "USER_EDIT",
    USER_DELETE: "USER_DELETE",
    CUSTOMER_SHOW: "CUSTOMER_SHOW",
    CUSTOMER_EDIT: "CUSTOMER_EDIT",
    CUSTOMER_DELETE: "CUSTOMER_DELETE",
    DRIVER_SHOW: "DRIVER_SHOW",
    DRIVER_EDIT: "DRIVER_EDIT",
    DRIVER_DELETE: "DRIVER_DELETE",
    EMPLOYEE_SHOW: "EMPLOYEE_SHOW",
    EMPLOYEE_EDIT: "EMPLOYEE_EDIT",
    EMPLOYEE_DELETE: "EMPLOYEE_DELETE",
    PRODUCT_SHOW: "PRODUCT_SHOW",
    PRODUCT_EDIT: "PRODUCT_EDIT",
    PRODUCT_DELETE: "PRODUCT_DELETE",
    DEPOT_SHOW: "DEPOT_SHOW",
    DEPOT_EDIT: "DEPOT_EDIT",
    DEPOT_DELETE: "DEPOT_DELETE",
    ACCOUNT_SHOW: "ACCOUNT_SHOW",
    ACCOUNT_EDIT: "ACCOUNT_EDIT",
    ACCOUNT_DELETE: "ACCOUNT_DELETE",
    PAYMENT_SHOW: "PAYMENT_SHOW",
    PAYMENT_EDIT: "PAYMENT_EDIT",
    INVOICE_SHOW: "INVOICE_SHOW",
    INVOICE_EDIT: "INVOICE_EDIT",
    CASH_DESK_SHOW: "CASH_DESK_SHOW",
    CASH_DESK_EDIT: "CASH_DESK_EDIT",
    CASH_DESK_DELETE: "CASH_DESK_DELETE",
    CHEQUE_SHOW: "CHEQUE_SHOW:",
    CHEQUE_EDIT: "CHEQUE_EDIT",
    CHEQUE_DELETE: "CHEQUE_DELETE",
  },
  PERMISSIONS: [
    { value: "ATTENDANCE_ADMIN", label: "ویرایش حضور و غیاب" },
    { value: "ATTENDANCE_SHOW", label: "لیست حضور و غیاب  " },
    { value: "ATTENDANCE_EDIT", label: "ثبت حضور و غیاب " },
    { value: "PAYMENT_SHOW", label: "لیست پرداختی و دریافتی" },
    { value: "PAYMENT_EDIT", label: "ویرایش پرداختی و دریافتی " },
    { value: "INVOICE_SHOW", label: "لیست فاکتور ها" },
    { value: "INVOICE_EDIT", label: "ویرایش فاکتور ها" },
    { value: "CASH_DESK_SHOW", label: "لیست صندوق ها" },
    { value: "CASH_DESK_EDIT", label: "ویرایش صندوق ها" },
    { value: "CASH_DESK_DELETE", label: "حذف صندوق ها" },
    { value: "CHEQUE_SHOW", label: "لیست چک ها" },
    { value: "CHEQUE_EDIT", label: "ویرایش چک ها" },
    { value: "CHEQUE_DELETE", label: "حذف چک ها" },
    { value: "USER_SHOW", label: "لیست کاربران" },
    { value: "USER_EDIT", label: "ویرایش کاربران" },
    { value: "USER_DELETE", label: "حذف کاربران" },
    { value: "EMPLOYEE_SHOW", label: "لیست پرسنل" },
    { value: "EMPLOYEE_EDIT", label: "ویرایش پرسنل" },
    { value: "EMPLOYEE_DELETE", label: "حذف پرسنل" },
    { value: "PRODUCT_SHOW", label: "لیست محصولات" },
    { value: "PRODUCT_EDIT", label: "ویرایش محصولات" },
    { value: "PRODUCT_DELETE", label: "حذف محصولات" },
    { value: "CUSTOMER_SHOW", label: "لیست مشتریان" },
    { value: "CUSTOMER_EDIT", label: "ویرایش مشتریان" },
    { value: "CUSTOMER_DELETE", label: "حذف مشتریان" },
    { value: "DRIVER_SHOW", label: "لیست رانندگان" },
    { value: "DRIVER_EDIT", label: "ویرایش رانندگان" },
    { value: "DRIVER_DELETE", label: "حذف رانندگان" },
    { value: "DEPOT_SHOW", label: "لیست انبارها" },
    { value: "DEPOT_EDIT", label: "ویرایش انبارها" },
    { value: "DEPOT_DELETE", label: "حذف انبارها" },
    { value: "ACCOUNT_SHOW", label: "لیست حساب ها" },
    { value: "ACCOUNT_EDIT", label: "ویرایش حساب ها" },
  ],
  BANK_TRANSACTION_TYPE: [
    { value: "کارت به کارت", label: "کارت به کارت" },
    { value: "دستگاه پوز", label: "دستگاه پوز" },
    { value: "پایا/ساتنا", label: "پایا/ساتنا" },
    { value: "واریز به/از حساب", label: "واریز به/از حساب" },
  ],
};
export default Constant;
