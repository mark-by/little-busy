import React from 'react';
import Submit from "../Common/Submit";
import closeImg from "../../images/close.svg"
import {csrfAxios, normalizeNumber} from "../../utils";
import Input from "../Common/Input";
import {apiAutoCompleteClient, apiCreateEvent, apiDeleteEvent, apiSaveEvent} from "../../backend/api";
import {useDispatch} from "react-redux";
import {addEvent, changeEvent, deleteEvent} from "../../redux/actions";
import {showMessage} from "../Common/Message/redux/actions";
import {msgTypeFail} from "../Common/Message/types";

export default function EventForm({close, event, day, month, year, scheduleRef}) {
    const dispatch = useDispatch();
    const [inputData, setData] = React.useState({
        active: true,
        constant: false,
        ...event,
        client: event.client ? event.client.id : null,
        date: `${year}-${normalizeNumber(month)}-${normalizeNumber(day)}`,
    });
    const [errors, setErrors] = React.useState({});

    function submitHandler(e) {
        e.preventDefault()
        let api;
        if (event.new) {
            api = apiCreateEvent;
        } else {
            api = apiSaveEvent;
        }
        csrfAxios(api, inputData)
            .then(response => {
                if (response.status === 200) {
                    dispatch(changeEvent(year, month, day, {...inputData, client: {id: inputData.client, text: inputData.selected_client_title}}, event.constant, scheduleRef));
                    close();
                } else if (response.status === 201) {
                    dispatch(addEvent({...response.data, ...inputData, client: {id: inputData.client, text: inputData.selected_client_title}}, scheduleRef));
                    close();
                }
            })
            .catch(e => {
                dispatch(showMessage({value: "Исправьте ошибки", type: msgTypeFail}));
                setErrors(e.response.data);
            });
    }

    function deleteEventHandler(id, constant) {
        csrfAxios(apiDeleteEvent, {id})
            .then(response => {
                if (response.status === 200) {
                    dispatch(deleteEvent(year, month, day, id, constant))
                    close();
                }
            });
    }

    const inputs = [
        {type: "autoselect", name: "client", placeholder: "Выберите клиента", label: "Клиент", api: apiAutoCompleteClient, width: "200px", selected: event.client},
        {type: "date", name: "date", label: "Дата", required: true},
        {type: "time", name: "start_time", label: "Начало", required: true},
        {type: "time", name: "end_time", label: "Конец", required: true},
        {type: "textarea", name: "description", label: "Комментарий"},
        {type: "checkbox", name: "active", label: "Активна"},
        {type: "checkbox", name: "constant", label: "Постоянна"},

    ]

    const gridTemplateColumns = "100px 200px";

    return (
        <div className="wrapper" onClick={e => {if (e.target.className === "wrapper") close()}}>
            <form className="form-grid form-modal" onSubmit={submitHandler}>
                <div className="close-button" onClick={close}>
                    <img src={closeImg} alt="close button"/>
                </div>
                <div>
                    <h2>{event.new ? "Добавить сеанс" : "Изменить сеанс"}</h2>
                    <a href="/admin/leads/client/add/" target="_blank" style={{fontSize: "14px", color: "blueviolet"}}>Добавиь клиента</a>
                </div>
                {inputs.map((input, idx) => (
                    <Input options={input} gridTemplate={gridTemplateColumns} value={inputData[input.name]} key={idx} stateHandler={setData} errors={errors[input.name]}/>
                ))}

                <div className="bottom-control">
                    <div className="button red-button" onClick={() => deleteEventHandler(event.id, event.constant)}>Удалить</div>
                    <Submit>Сохранить</Submit>
                </div>
            </form>
        </div>
    )
}