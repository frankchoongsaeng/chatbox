import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        username: '',
    },
    reducers: {
        login: (state, { payload: username }) => {
            state.isLoggedIn = true;
            state.username = username;
        },
        logout: state => {

            state.isLoggedIn = false;
            state.username = '';
        }
    }
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;