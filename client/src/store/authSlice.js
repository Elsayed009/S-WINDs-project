import {createSlice} from '@reduxjs/toolkit';
// create the reducer
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: FontFace,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated= true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated= false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {setLoading, clearUser, setUser} = authSlice.actions;
export default authSlice.reducer;