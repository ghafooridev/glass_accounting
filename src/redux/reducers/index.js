import { combineReducers } from "redux";
import alert from "./AlertReducer";
import dialog from "./dialogReducer";

const appReducer = combineReducers({
  alert,
  dialog,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
