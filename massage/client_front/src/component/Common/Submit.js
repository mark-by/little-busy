import React from 'react'

export default function Submit(props) {
    return (
        <input type="submit" value={props.children} onClick={props.onClick} style={props.style}/>
    )
}