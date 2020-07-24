import React from 'react'

export default function Submit(props) {
    return (
        <input type="submit" className="button" value={props.children} onClick={props.onClick} style={props.style}/>
    )
}