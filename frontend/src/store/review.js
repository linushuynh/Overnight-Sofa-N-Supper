import { csrfFetch } from "./csrf";

// Action Type
const LOAD_REVIEWS = "reviews/loadreviews"
const CREATE_REVIEW = "reviews/createreview"
const DELETE_REVIEW = "reviews/deletereview"

// Action Creators
export const setReviewsAction = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

// export const createReviewAction = (review) => {
//     return {
//         type: CREATE_REVIEW,
//         review
//     }
// }

export const deleteReviewAction = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
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
        dispatch(loadReviews(spotId))
    }
    return response
}

export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })
    const data = await response.json();
    console.log("THIS IS DATA RESPONSE***", data)
    if (response.ok) {
        dispatch(deleteReviewAction(reviewId))
    }
}

//Reducer
const initialState = { reviews: [] }

export const reviewReducer = (state = initialState, action) => {
    const newState = { ...state };
    const reviewArray = newState.reviews
    switch (action.type) {
        case LOAD_REVIEWS:
            newState.reviews = action.reviews
            return newState
        // case CREATE_REVIEW:
        //     let addReviewArr = newState.reviews.concat(action.review)
        //     newState.reviews = addReviewArr
        //     return newState;
        case DELETE_REVIEW:
            const deleteIndex = newState.reviews.findIndex((review) => Number(review.id) === Number(action.reviewId))
            reviewArray.splice(deleteIndex, 1)
            return newState
        default:
            return state
    }
}
