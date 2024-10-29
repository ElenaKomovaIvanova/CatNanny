import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice'; // User reducer
import profileReducer from './profileSlice'; // Profile reducer
import logger from 'redux-logger'; // Logger middleware
import requestReducer from './orderSlice'
import ordersReducer from './ordersSlice'
import nanniesReducer from './nannySlice'
// Create Redux store
const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer,
        request: requestReducer,
        orders: ordersReducer,
        nannies: nanniesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
});

// Export types for components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
