import axios from 'axios'
import {apiEvents} from "../backend/api";
import {
    typeAddEvent,
    typeSetEvents,
    typeToggleLoading
} from "./types";
import {showMessage} from "../component/Common/Message/redux/actions";
import {msgTypeFail} from "../component/Common/Message/types";

export const toggleLoading = (state) => ({type: typeToggleLoading, payload: state});

export const fetchEvents = (year, month, token, ref) => {
    return async dispatch => {
        dispatch(toggleLoading(true));
        try {
            const response = await axios.get(apiEvents, {params: {year, month, token}});
            dispatch({type: typeSetEvents, payload: {events: response.data, year, month, ref}});
        } catch (e) {
            dispatch(showMessage({value: "Ошибка. Скорее всего неправильная ссылка", type: msgTypeFail}))
        }
        dispatch(toggleLoading(false));
    }
}

export const addEvent = (event, ref) => ({type: typeAddEvent, payload: {event, ref}})
