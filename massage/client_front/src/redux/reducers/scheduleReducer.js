import {typeSetEvents} from "../types";

const initialState = {}

export default function scheduleReducer(state = initialState, action) {
    switch (action.type) {
        case typeSetEvents:
            if (state[action.payload.year] && state[action.payload.year][action.payload.month]) {
                return {
                    ...state,
                    [action.payload.year]: {
                        ...state[action.payload.year],
                        [action.payload.month]: {
                            ...state[action.payload.year][action.payload.month],
                            [action.payload.day]: action.payload.events
                        }
                    }
                }
            }
            return {
                ...state,
                [action.payload.year]: {
                    ...state[action.payload.year],
                    [action.payload.month]: {[action.payload.day]: action.payload.events}
                }
            }
        default:
            return state;
    }
}