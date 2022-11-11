import { csrfFetch } from "./csrf";

//Action Type
const SET_SESSION = "session/setsession";
const REMOVE_SESSION = "session/removesession"

//Action Creator
export const setSession = (user) => {
    return {
        type: SET_SESSION,
        user
    }
};

export const removeSession = () => {
    return {
        type: REMOVE_SESSION
    }
}

export const login = (inputUser) => async (dispatch) => {
    const { credential, password } = inputUser;
    const response = await csrfFetch('/api/session',{
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    })
    const data = await response.json();
    console.log(data)
    if (response.ok) {
        dispatch(setSession(data.user))
    }

    return response
}

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setSession(data.user));
    return response;
  };

//Reducer
const initialState = { user: null }

export const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SESSION:
            return { ...state, user: action.user };
        case REMOVE_SESSION:
            return { ...state, user: null}
        default:
            return state;
    }
}
