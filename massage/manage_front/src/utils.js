import axios from 'axios'
import Cookies from 'js-cookie'

export const inputChangeHandler = (event, stateHandler, {type, localStorageKey} = {}) => {
    event.persist();
    stateHandler(prev => {
        let value;
        switch (type) {
            case "checkbox":
                value = event.target.checked;
                break;
            default:
                value = event.target.value;
        }
        const newState = {...prev, [event.target.name]: value};
        if (localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify(newState));
        }
        return newState;
    })
}

export function csrfAxios(url, data, config) {
    const csrfToken = Cookies.get('csrftoken');
    if (!config) {
        config = {}
    }
    return axios.post(url, data, {...config, headers: {...config.headers, 'X-CSRFToken': csrfToken}});
}

export function normalizeNumber(num) {
    if (num < 10) {
        return "0" + num
    } else {
        return num + ""
    }
}

