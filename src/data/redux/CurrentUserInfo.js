import { createSlice } from "@reduxjs/toolkit";

const initialState = {  
    data: null,
};

const dataSlice = createSlice({
    name: 'CurrentUserInfoData',
    initialState,  
    reducers: {
        setDataOfCurrentUser: (state, action) => {
            state.data = action.payload;
        }
    }
});

export const { setDataOfCurrentUser } = dataSlice.actions;

export default dataSlice.reducer;
