import Constant from "../../helpers/constant";
import store from "../store";

export default {
  show(option) {
    store.dispatch({ type: Constant.ACTION_TYPES.SHOW_DIALOG, option });
  },

  hide() {
    store.dispatch({ type: Constant.ACTION_TYPES.HIDE_DIALOG });
  },
};
