import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './features/chat';
import userSlice from './features/user';

export default configureStore({
    reducer: {
        chat: chatSlice,
        user: userSlice,
    },
});
