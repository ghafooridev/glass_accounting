import { combineReducers } from "redux";
import user from "./UserReducer";
import alert from "./AlertReducer";
import dialog from "./dialogReducer";

const appReducer = combineReducers({
  user,
  alert,
  dialog,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;
