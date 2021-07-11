import { configureStore } from '@reduxjs/toolkit';
import chat from './features/chat';

export default configureStore({
    reducer: {
        chat: chat
    },
});