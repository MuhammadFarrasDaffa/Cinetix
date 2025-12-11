import { configureStore } from "@reduxjs/toolkit";
import { movieReducer } from "./movieSlice";
import { recommendationsReducer } from "./recommendationsSlice";


const store = configureStore({
    reducer: {
        movie: movieReducer,
        recommendations: recommendationsReducer
    }
})

export default store;