import { csrfFetch } from "./csrf"

// Action Type
const LOAD_BOOKINGS = "bookings/loadbookings"
const CREATE_BOOKING = "bookings/createbooking"
const DELETE_BOOKING = "bookings/deletebooking"

// Action Creators
export const loadBookingsAction = (payload) => {
    return {
        type: LOAD_BOOKINGS,
        payload
    }
}

export const createBookingAction = (payload) => {
    return {
        type: CREATE_BOOKING,
        payload
    }
}

export const deleteBookingAction = (bookingId) => {
    return {
        type: DELETE_BOOKING,
        bookingId
    }
}

// Thunks
export const loadBookingsThunk = () => async (dispatch) => {
    const response = await csrfFetch("/api/bookings/current")
    const data = await response.json()
    if (response.ok) {
        await dispatch(loadBookingsAction(data))
    }
    return data
}

export const createBookingThunk = (booking, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: "POST",
        body: JSON.stringify(booking)
    })
    const data = await response.json()
    if (response.ok) {
        await dispatch(createBookingAction(data))
    }
    return data
}

export const deleteBookingThunk = (bookingId) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: "DELETE"
    })
    const data = await response.json()
    if (response.ok) {
        await dispatch(deleteBookingAction(bookingId))
    }
    return data
}

// Reducer
const initialState = { bookings: [] }

export const bookingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_BOOKINGS:
            state.bookings = action.payload
            return state
        default:
            return state
    }
}
