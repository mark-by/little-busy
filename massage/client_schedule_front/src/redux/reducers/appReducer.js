import {typeToggleLoading} from "../types";

const initialState = {
    loading: false,
    avatar: null,
    articles: null,
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case typeToggleLoading:
            return {...state, loading: action.payload};
        default:
            return state;
    }
}