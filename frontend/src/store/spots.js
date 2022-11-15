import { csrfFetch } from "./csrf";

// Action Type
const GET_ALL_SPOTS = "spots/getallspots"
const GET_SPOT_BY_ID = "spots/getspotbyid"

// Action Creator
export const setSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

export const setSpotById = (spot) => {
    return {
        type: GET_SPOT_BY_ID,
        spot
    }
}

// Thunks
export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json();

    if (response.ok) {
        dispatch(setSpots(data.Spots))
    }

    return response
}

export const getSpotById = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();

    if (response.ok) {
        dispatch(setSpotById(data))
    }
}

// Reducer
const initialState = { Spots: null, spotById: null }

export const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            return { ...state, Spots: action.spots };
        case GET_SPOT_BY_ID:
            return { ...state, spotById: action.spot };
        default:
            return state;
    }
}
