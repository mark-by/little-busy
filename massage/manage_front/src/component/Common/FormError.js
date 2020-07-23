import React from 'react'

export default function FormError(props) {

    const errorStyle = {
        color: "red",
        textAlign: "center",
        fontSize: "12px",
    }

    return <p style={errorStyle}>{props.children}</p>
}