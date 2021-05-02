const Constant = {
  API_ADDRESS: "http://185.204.197.95:5000/",
  ACTION_TYPES: {
    SHOW_ALERT: "SHOW_ALERT",
    HIDE_ALERT: "HIDE_ALERT",
    SHOW_DIALOG: "SHOW_DIALOG",
    HIDE_DIALOG: "HIDE_DIALOG",
    LOG_IN_USER: "LOG_IN_USER",
    LOG_OUT_USER: "LOG_OUT_USER",
  },
  STORAGE: {
    CURRENT_USER: "CURRENT_USER",
    MODE: "MODE",
    CURRENT_LINK: "CURRENT_LINK",
  },
  VALIDATION: {
    REQUIRED: "این فیلد الزامی است",
    MOBILE_NUMBER: "موبایل باید 11 عدد داشته باشد",
    PASSWORD: "رمز عبور باید حداقل 5 حرف یا رقم باشد",
  },
  MESSAGES: {},
};
export default Constant;
