import { createSlice } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
    },
    reducers: {
        update: (state, action) => {

        }
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = messageSlice.actions

export default messageSlice.reducer