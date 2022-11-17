import { csrfFetch } from "./csrf";

// Action Type
const LOAD_REVIEWS = "reviews/loadreviews"

// Action Creators
export const setReviewsAction = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

// Thunks
export const loadReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();

    if (response.ok) {
        dispatch(setReviewsAction(data.Reviews))
    }
    return response
}

//Reducer
const initialState = { reviews: [] }

export const reviewReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case LOAD_REVIEWS:
            newState.reviews = action.reviews
            return newState
        default:
            return state
    }
}
