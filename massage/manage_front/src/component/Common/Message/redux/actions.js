import {HIDE_MESSAGE, SHOW_MESSAGE} from "./types";

export const hideMessage = () => ({type: HIDE_MESSAGE})
export const showMessage = (options) => {
    return async dispatch => {
        dispatch({type: SHOW_MESSAGE, payload: options})
        setTimeout(() => dispatch(hideMessage()), options.time ? options.time : 2000)
    }
}