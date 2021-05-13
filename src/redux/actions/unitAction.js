import http from "../../configs/axios";
import Constant from "../../helpers/constant";
import store from "../store";
import Storage from "../../services/storage";

export default {
  async setProdcutUnit() {
    const result = await http.get("/product/unit");
    if (result) {
      Storage.setItem(
        Constant.STORAGE.PRODUCT_UNITS,
        JSON.stringify(result.data),
      );
      store.dispatch({
        type: Constant.ACTION_TYPES.GET_UNITS,
        payload: result.data,
      });
    }
  },

  getProductUnit() {
    console.log(store.getState());
    return store.getState().unit;
  },
};
