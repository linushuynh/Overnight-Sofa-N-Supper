import { csrfFetch } from "./csrf";

// Action Type
const GET_ALL_SPOTS = "spots/getallspots"
const GET_SPOT_BY_ID = "spots/getspotbyid"
const CREATE_NEW_SPOT = "spots/createnewspot"
const EDIT_SPOT = "spots/editspot"
const DELETE_SPOT = "spots/deletespot"

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

export const editSpotAction = (spot) => {
    return {
        type: EDIT_SPOT,
        spot
    }
}

export const deleteSpotAction = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
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

export const editSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}`,{
        method: "PUT",
        body: JSON.stringify(spot)
    });
    const data = await response.json();

    if (response.ok) {
        dispatch(editSpotAction(data));
    }
    return response
}

export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    });
    const data = await response.json()

    if (response.ok) {
        dispatch(deleteSpotAction(data))
        // ^^ maybe change data into data.message or data.statusCode or spot.id to read in later action case
    }
    return response
}

// Reducer
const initialState = { Spots: null, spotById: null }

export const spotReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case GET_ALL_SPOTS:
            return { ...state, Spots: action.spots, spotById: null };
        case GET_SPOT_BY_ID:
            return { ...state, spotById: action.spot };
        case CREATE_NEW_SPOT:
            return { ...state, Spots: [ ...state.Spots, action.spotDetails ]}
        case EDIT_SPOT:
            // FIND INDEX OF EXISTING SPOT AND SPLICE REPLACE
            return { ...state, Spots: [ ...state.Spots, action.spotDetails ]}
        case DELETE_SPOT:
            const { spotId } = action;
            const spotIndex = newState.Spots.find(spot => Number(spot.id) === Number(spotId));
            newState.Spots = newState.Spots.splice(spotIndex, 1);
            newState.spotById = null;
            return newState
        default:
            return state;
    }
}
