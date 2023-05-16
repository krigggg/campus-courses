import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { splitApi } from "./splitApi";

export const store = configureStore({
    reducer: {
        [splitApi.reducerPath]: splitApi.reducer,
    },

    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(splitApi.middleware),
})

setupListeners(store.dispatch)