import axios from 'axios'
import {apiArticles, apiAvatar, apiCertificates, apiEvents, apiFeedback} from "../backend/api";
import {
    typeSetArticles,
    typeSetAvatar,
    typeSetCertificates,
    typeSetEvents,
    typeSetFeedback,
    typeToggleLoading
} from "./types";

export const toggleLoading = (state) => ({type: typeToggleLoading, payload: state});

export const fetchAvatar = () => {
    return async dispatch => {
        const response = await axios.get(apiAvatar);
        dispatch({type: typeSetAvatar, payload: response.data.src});
    }
}

export const fetchEvents = (year, month, day, setEvents) => {
    return async dispatch => {
        dispatch(toggleLoading(true));
        const response = await axios.get(apiEvents, {params: {year, month, day}});
        setEvents(response.data);
        dispatch({type: typeSetEvents, payload: {events: response.data, year, month, day} });
        dispatch(toggleLoading(false));
    }
}

export const fetchArticles = () => {
    return async dispatch => {
        dispatch(toggleLoading(true));
        const response = await axios.get(apiArticles);
        dispatch({type: typeSetArticles, payload: response.data});
        dispatch(toggleLoading(false));
    }
}


