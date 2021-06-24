import Constant from "../../helpers/constant";
import Storage from "../../services/storage";

const initialState = JSON.parse(
  Storage.getItem(Constant.STORAGE.PRODUCT_UNITS),
);

function unitReducer(state = initialState, action) {
  switch (action.type) {
    case Constant.ACTION_TYPES.GET_UNITS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
}

export default unitReducer;
