import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../redux/slices/UserSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});
