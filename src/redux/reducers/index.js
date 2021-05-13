import { combineReducers } from "redux";
import alert from "./AlertReducer";
import dialog from "./dialogReducer";
import unit from "./unitReducer";

const appReducer = combineReducers({
  alert,
  dialog,
  unit,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
