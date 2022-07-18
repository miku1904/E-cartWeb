import { GET_CURRENT_USER, LOGOUT } from "./currentUserType";
let initialState = {
  name:"",
  email: "",
  uid: "",
  
};

const currentUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_USER:
      return action.payload;
    case LOGOUT:
      return action.payload;
    default:
      return state;
  }
};

export default currentUserReducer;
