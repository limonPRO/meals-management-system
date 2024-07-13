import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for user and state
interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  is_banned: number;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; role: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
