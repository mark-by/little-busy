import React from 'react'
import './Message.css'
import {useSelector} from "react-redux";
import {msgTypeFail, msgTypeNeutral, msgTypeSuccess} from "./types";

export default function Message() {
    const message = useSelector(state => state.message)

    let color;
    switch (message.type) {
        case msgTypeFail:
            color = "#ff7575";
            break;
        case msgTypeSuccess:
            color = "#99ff7c";
            break;
        default:
            color = "white"
    }

    const style = {
        background: color,
        transform : message.isShowed ? "translate(0, 0)" : "",
    }

    return (
        <div className="message" style={style}>
            <div className="message-content">
                {message.value}
            </div>
        </div>
    )
}