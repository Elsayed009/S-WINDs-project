import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripReducer from './tripSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        trip: tripReducer,
    },
});

export default store;