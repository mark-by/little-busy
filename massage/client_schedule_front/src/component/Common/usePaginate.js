import React from 'react';
import {useDispatch} from "react-redux";
import axios from "axios";

const fetchPage = (type, toggleLoading, api, page, limit) => {
    return async dispatch => {
        dispatch(toggleLoading(true));
        let cancel;
        try {
            const response = await axios.get(api, {params: {page, limit}, cancelToken: new axios.CancelToken(c => cancel = c)});
            if (response.status === 200) {
                dispatch({type, payload: {list: response.data, hasMore: true, page}});
            } else {
                dispatch({type, payload: {hasMore: false}});
            }
        } catch (e) {
            if (axios.isCancel(e)) return
        }
        dispatch(toggleLoading(false));
        return () => cancel();
    }
}

export default function usePaginate(actionTypeSet, toggleLoading, api, page, limit) {
    const dispatch = useDispatch();
    if (!limit) {
        limit = 3;
    }

    React.useEffect(() => {
        dispatch(fetchPage(actionTypeSet, toggleLoading, api, page, limit))
    }, [page])
}