import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        isChatScrolled: false,
    },
    reducers: {
        loadHistory: (state, action) => {
            state.messages = action.payload;
        },
        recieve: (state, action) => {
            state.messages.push(action.payload);
        },
        scrolled: (state, action) => {
            state.isChatScrolled = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { recieve, loadHistory, scrolled } = chatSlice.actions;

export default chatSlice.reducer;
