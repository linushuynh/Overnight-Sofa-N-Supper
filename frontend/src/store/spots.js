import { csrfFetch } from "./csrf";

// Action Type
const GET_ALL_SPOTS = "spots/getallspots"
const GET_SPOT_BY_ID = "spots/getspotbyid"
const CREATE_NEW_SPOT = "spots/createnewspot"

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

export const createNewSpotAction = (spotDetails) => {
    return {
        type: CREATE_NEW_SPOT,
        spotDetails
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
    return response
}

export const createSpot = (spotInfo) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify(spotInfo)
    });

    const data = await response.json();
    if (response.ok) {
        dispatch(createNewSpotAction(data));
    }
    return response
}

// Reducer
const initialState = { Spots: null, spotById: null }

export const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            return { ...state, Spots: action.spots };
        case GET_SPOT_BY_ID:
            return { ...state, spotById: action.spot };
        case CREATE_NEW_SPOT:
            return { ...state, Spots: { ...state.Spots, [action.spotDetails.id]: action.spotDetails }}
        default:
            return state;
    }
}
