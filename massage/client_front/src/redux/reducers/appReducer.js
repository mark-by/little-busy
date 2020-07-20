import {typeSetArticles, typeSetAvatar, typeToggleLoading} from "../types";

const initialState = {
    loading: false,
    avatar: null,
    articles: null,
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case typeToggleLoading:
            return {...state, loading: action.payload};
        case typeSetArticles:
            return {...state, articles: action.payload};
        case typeSetAvatar:
            return {...state, avatar: action.payload}
        default:
            return state;
    }
}