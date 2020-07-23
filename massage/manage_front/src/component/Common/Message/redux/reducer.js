import {HIDE_MESSAGE, SHOW_MESSAGE} from "./types";

const initialState = {value: '', isShowed: false, display: "none"}

export const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_MESSAGE:
            return {...state, ...action.payload, isShowed: true}
        case HIDE_MESSAGE:
            return {...state, isShowed: false}
        default:
            return state;
    }
}

