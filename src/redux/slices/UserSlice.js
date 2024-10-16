import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

// Define API URL
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Entity Adapter for user
const usersAdapter = createEntityAdapter();

// Define initial state using the adapter
const initialState = usersAdapter.getInitialState({
  loading: 'idle',
  error: null,
});

// Async Thunks for CRUD operations
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
  const response = await axios.post(API_URL, newUser);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (updatedUser) => {
  const response = await axios.put(`${API_URL}/${updatedUser.id}`, updatedUser);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  await axios.delete(`${API_URL}/${userId}`);
  return userId;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      usersAdapter.setAll(state, action.payload);
      state.loading = 'idle';
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = 'idle';
      state.error = action.error.message;
    });

    // Add User (Optimistic Update)
    builder.addCase(addUser.pending, (state, action) => {
      const newUser = action.meta.arg;
      usersAdapter.addOne(state, { ...newUser, id: Math.random().toString(36) });
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      usersAdapter.updateOne(state, {
        id: action.meta.arg.id,
        changes: action.payload,
      });
    });
    builder.addCase(addUser.rejected, (state, action) => {
      usersAdapter.removeOne(state, action.meta.arg.id); // Rollback on failure
    });

    // Update User (Optimistic Update)
    builder.addCase(updateUser.pending, (state, action) => {
      const updatedUser = action.meta.arg;
      usersAdapter.updateOne(state, {
        id: updatedUser.id,
        changes: updatedUser,
      });
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      // Rollback on failure (you might need to refetch the user to fully rollback)
    });

    // Delete User (Optimistic Update)
    builder.addCase(deleteUser.pending, (state, action) => {
      usersAdapter.removeOne(state, action.meta.arg);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      // Handle rollback or refetching if deletion failed
    });
  },
});

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state) => state.users);

export default usersSlice.reducer;
