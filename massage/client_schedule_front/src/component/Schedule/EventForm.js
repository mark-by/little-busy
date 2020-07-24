import React from 'react';
import Submit from "../Common/Submit";
import closeImg from "../../images/close.svg"
import {csrfAxios, normalizeNumber} from "../../utils";
import Input from "../Common/Input";
import {apiCreateEvent} from "../../backend/api";
import {useDispatch} from "react-redux";
import {addEvent} from "../../redux/actions";
import {showMessage} from "../Common/Message/redux/actions";
import {msgTypeFail, msgTypeSuccess} from "../Common/Message/types";

export default function EventForm({close, day, month, year, token, scheduleRef}) {
    const dispatch = useDispatch();
    const [inputData, setData] = React.useState({
        active: false,
        own: true,
        date: `${year}-${normalizeNumber(month)}-${normalizeNumber(day)}`,
    });

    function submitHandler(e) {
        e.preventDefault();
        const start_time = inputData.start_time.split(':')
        const end_time = `${+start_time[0] + 1}:${start_time[1]}`;
        csrfAxios(apiCreateEvent, {...inputData, end_time, token})
            .then(response => {
                if (response.status === 201) {
                    dispatch(addEvent({...inputData, end_time}, scheduleRef));
                    close();
                    dispatch(showMessage({value: "Спасибо! Я Вам скоро перезвоню", type: msgTypeSuccess}))
                }
            })
            .catch(e => {
                dispatch(showMessage({value: "Ошибка", type: msgTypeFail}));
            });
    }

    const inputs = [
        {type: "date", name: "date", label: "Дата", required: true},
        {type: "time", name: "start_time", label: "Время", required: true},
        {type: "textarea", name: "description", label: "Комментарий"},
    ]

    const gridTemplateColumns = "100px 200px";

    return (
        <div className="wrapper" onClick={e => {if (e.target.className === "wrapper") close()}}>
            <form className="form-grid form-modal" onSubmit={submitHandler}>
                <div className="close-button" onClick={close}>
                    <img src={closeImg} alt="close button"/>
                </div>
                <h2>Записаться на сеанс</h2>
                {inputs.map((input, idx) => (
                    <Input options={input} gridTemplate={gridTemplateColumns} value={inputData[input.name]} key={idx} stateHandler={setData}/>
                ))}

                <div className="bottom-control single">
                    <Submit>Записаться</Submit>
                </div>
            </form>
        </div>
    )
}