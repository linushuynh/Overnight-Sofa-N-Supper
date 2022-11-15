import { csrfFetch } from "./csrf";

// Action Type
const GET_ALL_SPOTS = "spots/getallspots"

// Action Creator
export const setSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}


// Thunks
export const getAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots')
    const data = await response.json();

    if (response.ok) {
        dispatch(setSpots(data.Spots))
    }

    return response
}

// Reducer
const initialState = { Spots: null }

export const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            return { ...state, Spots: action.spots }
        default:
            return state;
    }
}
