import React from "react";
import Constant from "../helpers/constant";
import storageService from "../services/storage";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload,
      };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false, currentUser: {} };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem(Constant.STORAGE.TOKEN),
    currentUser: JSON.parse(
      localStorage.getItem(Constant.STORAGE.CURRENT_USER),
    ),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

async function loginUser(
  loginRequest,
  dispatch,
  username,
  password,
  history,
  setIsLoading,
  setError,
) {
  setError(false);
  setIsLoading(true);
  const result = await loginRequest.execute({ username, password });

  if (result) {
    storageService.setItem(Constant.STORAGE.TOKEN, result.data.token);
    storageService.setItem(Constant.STORAGE.CURRENT_USER, result.data);
    setError(null);
    setIsLoading(false);
    dispatch({ type: "LOGIN_SUCCESS", payload: result.data });

    history.push("/app/dashboard");
  } else {
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem(Constant.STORAGE.TOKEN);
  localStorage.removeItem(Constant.STORAGE.CURRENT_USER);
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
