import React from "react";

export default function HeaderButton({img, title, main}) {

    const mainSize = 85;
    const mainButtonStyle = {
        width: mainSize + "px",
        height: mainSize + "px",
    }

    const mainTitleStyle = {
        paddingTop: "3px",
        fontSize: "16px",
        fontWeight: "bold"
    }

    const mainImageStyle = {width: "100%", height: "100%", objectFit: "cover"};

    return (
        <div className="header__button">
            <div className="header__button_circle" style={main ? mainButtonStyle : {}}>
                <img src={img} style={main ? mainImageStyle : {}}/>
            </div>
            <div className="header__button_title" style={main ? mainTitleStyle : {}}>
                {title}
            </div>
        </div>
    )
}