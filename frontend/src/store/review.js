import { csrfFetch } from "./csrf";

// Action Type
const LOAD_REVIEWS = "reviews/loadreviews"
const CREATE_REVIEW = "reviews/createreview"

// Action Creators
export const setReviewsAction = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

export const createReviewAction = (review) => {
    return {
        type: CREATE_REVIEW,
        review
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

export const createReview = (review, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(review)
    })
    const data = await response.json();

    if (response.ok) {
        dispatch(createReviewAction(data))
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
        case CREATE_REVIEW:
            let addReviewArr = newState.reviews.concat(action.review)
            newState.reviews = addReviewArr
            return newState
        default:
            return state
    }
}
