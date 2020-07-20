import React from "react";
import {Link} from "react-router-dom";

export default function HeaderMenu(props) {
    const buttons = [
        {title: "Сертификаты", link: "certificate"},
        {title: "Записаться", link: "schedule"},
        {title: "Отзывы", link: "feedback"}
    ]

    let current;
    if (props.match)
        current = props.match.params.tab

    return (
        <div className="header__menu">
            {buttons.map((button, idx) => (
                <Link to={button.link} key={idx}>
                    <div className={"header__menu_button" + (current === button.link ? " active" : "")}>
                        {button.title}
                    </div>
                </Link>
            ))}
        </div>
    )
}