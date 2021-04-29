import Constant from "../../helpers/constant";

const initialState = {
  show: false,
  text: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case Constant.ACTION_TYPES.SHOW_ALERT: {
      return {
        ...state,
        ...action.option,
        show: true,
      };
    }
    case Constant.ACTION_TYPES.HIDE_ALERT: {
      return {
        ...state,
        show: false,
      };
    }
    default:
      return state;
  }
}
