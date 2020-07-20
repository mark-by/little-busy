import React from 'react';
import './Header.css';
import inst from '../../images/inst.svg';
import tel from '../../images/tel.svg';
import HeaderButton from "./HeaderButton";
import {Link, Route, Switch} from "react-router-dom";
import HeaderMenu from "./HeaderMenu";
import {useDispatch, useSelector} from "react-redux";
import {fetchAvatar} from "../../redux/actions";

export default function Header() {
    const avatar = useSelector(state => state.app.avatar);
    const dispatch = useDispatch();
    React.useEffect(() => {
        if (!avatar) {
            dispatch(fetchAvatar());
        }
    }, [])

    return (
        <header>
            <div className="header__content">
                <div className="header__bg-image"/>
                <div className="container">
                    <a href="https://instagram.com/armavir_massage_by_irina" target="_blank" rel="noopener noreferrer">
                        <HeaderButton img={inst} title="@armavir_massage_by_irina"/>
                    </a>
                    <Link to="/">
                        <HeaderButton img={"/resize-img/w100/" + avatar} title="Ирина" main={true}/>
                    </Link>
                    <a href="tel:+79288434940">
                        <HeaderButton img={tel} title="+7 (928) 843-49-40"/>
                    </a>
                </div>
            </div>
            <Switch>
                <Route path="/:tab" component={HeaderMenu}/>
                <HeaderMenu/>
            </Switch>
        </header>
    )
}