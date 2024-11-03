import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice'; // User reducer
import profileReducer from './profileSlice'; // Profile reducer
import logger from 'redux-logger'; // Logger middleware
import requestReducer from './orderSlice'
import ordersReducer from './ordersSlice'
import nanniesReducer from './nannySlice'
import calendarReducer from './calendarSlice'
import reviewsReducer from './reviewsSlice'
import reviewReducer from './reviewSlice'


// Create Redux store
const store = configureStore({
    reducer: {
        user: userReducer,
        profile: profileReducer,
        request: requestReducer,
        orders: ordersReducer,
        nannies: nanniesReducer,
        calendar:calendarReducer,
        review:reviewReducer,
        reviews:reviewsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
});

// Export types for components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
