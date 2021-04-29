// import userRepository from "../../repositories/user"
// import Storage from "../../services/Storage"
import Constant from "../../helpers/constant";
import store from "../store";

export default {
  async login(data) {
    // await userRepository.login(data).then((user) => {
    //   if (user) {
    //     Storage.push(Constant.STORAGE.CURRENT_USER, JSON.stringify(user.data))
    //     store.dispatch({
    //       type: Constant.ACTION_TYPES.LOG_IN_USER,
    //       payload: user.data,
    //     })
    //   }
    // })
  },

  logout() {
    store.dispatch({ type: Constant.ACTION_TYPES.LOG_OUT_USER });
  },
};
