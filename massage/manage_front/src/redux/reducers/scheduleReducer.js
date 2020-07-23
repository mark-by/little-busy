import {typeAddEvent, typeDeleteEvent, typeSetEvents} from "../types";
import {normalizeNumber} from '../../utils';

const initialState = {
    constant: {},
    startWorkTime: [8, 0],
    stopWorkTime: [21, 0],
}

function timeToMinutes(time) {
    return time[0] * 60 + time[1];
}

function calcPos(event, ref, state) {
    const offsetWidth = ref.current.offsetWidth;
    const startTime = event.start_time.split(':').map(num => Number(num));
    const endTime = event.end_time.split(':').map(num => Number(num));
    const pxPerMin = offsetWidth / (timeToMinutes(state.stopWorkTime) - timeToMinutes(state.startWorkTime));
    const left = `${((timeToMinutes(startTime) - timeToMinutes(state.startWorkTime)) * pxPerMin) * 100 / offsetWidth}%`; // * 100 / offsetHeight
    const width = `${((timeToMinutes(endTime) - timeToMinutes(startTime)) * pxPerMin) * 100 / offsetWidth}%`;
    return {...event, left, width};
}


export default function scheduleReducer(state = initialState, action) {
    switch (action.type) {
        case typeSetEvents:
            const constantEvents = {};
            const events = {};
            for (const date in action.payload.events) {
                action.payload.events[date].forEach(event => {
                    const separatedDate = date.split(".").reverse();
                    const calculatedEvent = calcPos(event, action.payload.ref, state);
                    if (event.constant) {
                        const week = new Date(+separatedDate[0], +separatedDate[1] - 1, +separatedDate[2]).getUTCDay();
                        if (constantEvents[week]) {
                            constantEvents[week].push(calculatedEvent);
                        } else {
                            constantEvents[week] = [calculatedEvent];
                        }
                    } else {
                        if (events[+separatedDate[2]]) {
                            events[+separatedDate[2]].push(calculatedEvent);
                        } else {
                            events[+separatedDate[2]] = [calculatedEvent];
                        }
                    }
                })
            }

            if (state[action.payload.year] && state[action.payload.year][action.payload.month]) {
                return {
                    ...state,
                    [action.payload.year]: {
                        ...state[action.payload.year],
                        [action.payload.month]: events
                    },
                    constant: {...state.constant, ...constantEvents}
                }
            }
            return {
                ...state,
                [action.payload.year]: {
                    ...state[action.payload.year],
                    [action.payload.month]: events
                },
                constant: {...state.constant, ...constantEvents}
            }
        case typeDeleteEvent:
            if (action.payload.constant) {
                const weekday = new Date(action.payload.year, action.payload.month - 1, action.payload.day).getUTCDay();
                state.constant[weekday] = state.constant[weekday].filter(event => event.id !== action.payload.id);
                return {...state};
            }
            state[action.payload.year][action.payload.month][action.payload.day] =
            state[action.payload.year][action.payload.month][action.payload.day].filter(event => event.id !== action.payload.id);
            return {...state};
        case typeAddEvent:
            const date = action.payload.event.date.split('-').map(num => +num);
            const calculatedEvent = calcPos(action.payload.event, action.payload.ref, state);
            if (action.payload.event.constant) {
                const weekday = new Date(date[0], date[1] - 1, date[2]).getUTCDay();
                if (state.constant[weekday]) {
                    state.constant[weekday].push(calculatedEvent);
                } else {
                    state.constant[weekday] = [calculatedEvent];
                }
                return {...state};
            }

            if (state[date[0]] && state[date[0]][date[1]]) {
                if (state[date[0]][date[1]][date[2]]) {
                    state[date[0]][date[1]][date[2]].push(calculatedEvent);
                } else {
                    state[date[0]][date[1]][date[2]] = [calculatedEvent];
                }
            } else {
                state = {...state,
                [date[0]]: {
                    ...state[date[0]],
                    [date[1]]: {[date[2]]: [calculatedEvent]}
                }}
            }
            return {...state}
        default:
            return state;
    }
}