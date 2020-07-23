import axios from 'axios'
import {apiEvents} from "../backend/api";
import {
    typeAddEvent, typeChangeEvent, typeDeleteEvent,
    typeSetEvents,
    typeToggleLoading
} from "./types";

export const toggleLoading = (state) => ({type: typeToggleLoading, payload: state});

export const fetchEvents = (year, month, ref) => {
    return async dispatch => {
        dispatch(toggleLoading(true));
        const response = await axios.get(apiEvents, {params: {year, month}});
        dispatch({type: typeSetEvents, payload: {events: response.data, year, month, ref}});
        dispatch(toggleLoading(false));
    }
}

export const addEvent = (event, ref) => ({type: typeAddEvent, payload: {event, ref}})

export const deleteEvent = (year, month, day, id, constant) => ({type: typeDeleteEvent, payload: {year, month, day, id, constant}})

export const changeEvent = (year, month, day, event, constant, ref) => {
    return async dispatch => {
        dispatch(deleteEvent(year, month, day, event.id, constant));
        dispatch(addEvent(event, ref));
    }
}
