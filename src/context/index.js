import React, { createContext, useContext, useReducer, useMemo } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Setting custom name for the context
const MyContext = createContext();
MyContext.displayName = "MyContext";

// React reducer
function reducer(state, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userLogin: action.value };
    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, action.value] };
    // Add other cart-related actions (remove from cart, update quantity, etc.)
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// React context provider
function MyContextControllerProvider({ children }) {
  const initialState = {
    userLogin: null,
    cart: [],
  };
  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// React custom hook for using context
function useMyContextController() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error(
      "useMyContextController should be used inside the MyContextControllerProvider."
    );
  }
  return context;
}

function useCart() {
  const [controller, dispatch] = useMyContextController();
  const { cart } = controller;
  const addToCart = (item) => dispatch({ type: "ADD_TO_CART", value: item });

  return { cart, addToCart };
}

// Table
const USERS = firestore().collection("USERS");
const SERVICES = firestore().collection("SERVICES");

// Actions
const login = (dispatch, email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() =>
      USERS.doc(email).onSnapshot((u) => {
        const value = u.data();
        console.log("Đăng Nhập Thành Công voi user: ", value);
        dispatch({ type: "USER_LOGIN", value });
      })
    )
    .catch((e) => alert("Sai user va password"));
};

const logout = (dispatch) => {
  dispatch({ type: "USER_LOGIN" });
};

const createNewService = (newService) => {
  newService.finalUpdate = firestore.FieldValue.serverTimestamp();
  SERVICES.add(newService)
    .then(() => alert("Add new service!"))
    .catch((e) => alert(e));
};

export {
  MyContextControllerProvider,
  useMyContextController,
  useCart,
  login,
  logout,
  createNewService,
};
