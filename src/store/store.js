import { configureStore } from '@reduxjs/toolkit'
import authSlice from "./authSlice"
import postSlice from "./postSlice"
import profileSlice from "./profileSlice"
import commentSlice from "./commentSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    post: postSlice,
    profile: profileSlice,
    comment:commentSlice
  }
});

export default store;