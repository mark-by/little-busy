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
                const clientName = inputData['new_client'] ? inputData['client_name'] : inputData.selected_client_title;
                const clientID = response.data['client_id'];
                if (response.status === 200) {
                    dispatch(changeEvent(year, month, day,
                        {...inputData, new_client: false, client_name: "", client_number: "",
                            client: {id: clientID, text: clientName}}, event.constant, scheduleRef));
                    close();
                } else if (response.status === 201) {
                    dispatch(addEvent({...response.data, ...inputData, new_client: false, client_name: "", client_number: "",
                        client: {id: clientID, text: clientName}}, scheduleRef));
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
        {type: "checkbox", name: "new_client", label: "Новый клиент"},
    ]

    if (inputData["new_client"]) {
        inputs.push(
            {type: "text", name: "client_name", label: "Имя клиента", required: true},
            {type: "tel", name: "client_number", label: "Тел. клиента"}
        )
    } else {
        inputs.push(
            {type: "autoselect", name: "client", placeholder: "Выберите клиента", label: "Клиент", api: apiAutoCompleteClient, width: "200px", selected: event.client},
        )
    }

    inputs.push(
        {type: "date", name: "date", label: "Дата", required: true},
        {type: "time", name: "start_time", label: "Начало", required: true},
        {type: "time", name: "end_time", label: "Конец", required: true},
        {type: "textarea", name: "description", label: "Комментарий"},
        {type: "checkbox", name: "active", label: "Активна"},
        {type: "checkbox", name: "constant", label: "Постоянна"}
    )

    if (inputData["constant"]) {
        inputs.push(
            {type: "date", name: "beginning", label: "Начиная с"},
            {type: "date", name: "finish", label: "Заканчивая"},
        )
    }


    const gridTemplateColumns = "120px 200px";

    return (
        <div className="wrapper" onClick={e => {if (e.target.className === "wrapper") close()}}>
            <form className="form-grid form-modal" onSubmit={submitHandler}>
                <div className="close-button" onClick={close}>
                    <img src={closeImg} alt="close button"/>
                </div>
                <div>
                    <h2>{event.new ? "Добавить сеанс" : "Изменить сеанс"}</h2>
                    {!event.new && event.client ? <a href={`/admin/leads/client/${event.client.id}/change/`} target="_blank" style={{fontSize: "14px", color: "blueviolet"}}>Подробнее о клиенте</a> : ""}
                </div>
                {inputs.map((input, idx) => (
                    <Input options={input} gridTemplate={gridTemplateColumns} value={inputData[input.name]} key={input.name} stateHandler={setData} errors={errors[input.name]}/>
                ))}

                <div className="bottom-control">
                    <div className={"button" + (event.new ? "" : " red-button")} style={{background: event.new ? "#cacaca" : ""}} onClick={() => event.new ? {} : deleteEventHandler(event.id, event.constant)}>Удалить</div>
                    <Submit>Сохранить</Submit>
                </div>
            </form>
        </div>
    )
}
