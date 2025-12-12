import { createSlice } from "@reduxjs/toolkit";
import { http } from "../helpers/http-client";

const movieSlice = createSlice({
    name: 'movie',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        fetchItemsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchItemsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        fetchItemsSuccess(state, action) {
            console.log(state, action);
            state.items = action.payload;
            state.loading = false;
        }
    }
})

export const movieActions = movieSlice.actions

export const movieReducer = movieSlice.reducer

export function fetchMovies() {
    return async function fetchMoviesThunk(dispatch, getState) {
        try {
            const state = getState();
            console.log("Current menu state:", state.movie);
            if (state.movie.items.length > 0) {
                // Data sudah ada, tidak perlu fetch ulang
                return;
            }

            dispatch(movieActions.fetchItemsStart());

            const { data } = await http({
                method: "GET",
                url: `/movies`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                }
            });

            dispatch(movieActions.fetchItemsSuccess(data));
        } catch (error) {
            console.log(error);
            dispatch(movieActions.fetchItemsFailure(error?.response?.data?.message || "Something went wrong"));
        }
    }
}