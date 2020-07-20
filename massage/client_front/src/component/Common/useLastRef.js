import React from 'react'
import {useDispatch} from "react-redux";

export default function useLastRef(loading, hasMore, actionTypeIncPage) {
    const observer = React.useRef();
    const dispatch = useDispatch();
    const lastPostElementRef = React.useCallback(node => {
        if (loading) {
            return
        }
        if (observer.current) {
            observer.current.disconnect()
        }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                dispatch({type: actionTypeIncPage})
            }
        })
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return lastPostElementRef;
}