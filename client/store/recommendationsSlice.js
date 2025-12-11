import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const recommendationsSlice = createSlice({
    name: "recommendations",
    initialState: {
        items: [],
        loading: false,
        error: null,
        lastFetchedAt: null,
    },
    reducers: {
        setRecommendations(state, action) {
            state.items = action.payload || [];
            state.loading = false;
            state.error = null;
            state.lastFetchedAt = Date.now();
        },
        clearRecommendations(state) {
            state.items = [];
            state.error = null;
            state.loading = false;
            state.lastFetchedAt = null;
        },
        fetchStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchFailure(state, action) {
            state.loading = false;
            state.error = action.payload || "Failed to fetch";
        },
    },
});

export const recommendationsActions = recommendationsSlice.actions;
export const recommendationsReducer = recommendationsSlice.reducer;

export function fetchRecommendations() {
    return async function thunk(dispatch) {
        try {
            dispatch(recommendationsActions.fetchStart());
            const { data } = await axios({
                method: "GET",
                url: `http://localhost:3000/movies/recommendations`,
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });
            dispatch(recommendationsActions.setRecommendations(data));
        } catch (error) {
            dispatch(
                recommendationsActions.fetchFailure(error?.response?.data?.message || "Something went wrong")
            );
        }
    };
}
