// Manages login/logout, token, etc.
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload;
            state.isLoading = false;
        },
        loginFailure: (state) => {
            state.isLoading = false;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
