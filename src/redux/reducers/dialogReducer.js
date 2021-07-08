import Constant from "../../helpers/constant";
const initialState = {
  show: false,
  component: null,
  title: "",
  size: "8",
  disableCloseButton: false,
  confirm: false,
  names: [],
  onAction: () => {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case Constant.ACTION_TYPES.SHOW_DIALOG: {
      return {
        ...state,
        ...action.option,
        names: [...state.names, action.option],
      };
    }
    case Constant.ACTION_TYPES.HIDE_DIALOG: {
      return {
        names: state.names.filter((item) => item.name !== action.option.name),
      };
    }
    default:
      return state;
  }
}
