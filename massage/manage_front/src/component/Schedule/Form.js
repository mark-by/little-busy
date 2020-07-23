import React from "react";
import Submit from "../Common/Submit";
import closeImg from '../../images/close.svg';
import {csrfAxios, inputChangeHandler} from "../../utils";
import {apiSignUpToMassage} from "../../backend/api";
import {showMessage} from "../Common/Message/redux/actions";
import {msgTypeFail, msgTypeNeutral, msgTypeSuccess} from "../Common/Message/types";
import {useDispatch} from "react-redux";

export default function Form({close, date}) {
    const [times, setTimes] = React.useState([]);
    const [inputData, setInputData] = React.useState({time: "8:00"});
    const dispatch = useDispatch();
    React.useEffect(() => {
        const times = [];
        for (let h = 8; h < 19; h++) {
            times.push(`${h}:00`)
            times.push(`${h}:30`)
        }
        times.push(`19:00`)

        setTimes(times);
    }, [])

    function submitHandler(e) {
        e.preventDefault();
        dispatch(showMessage({value: "Пожалуйста, подождите...", type: msgTypeNeutral}));
        console.log(date);
        console.log(inputData);
        csrfAxios(apiSignUpToMassage, {
            year: date.currYear,
            month: date.currMonth,
            day: date.currDay,
            description: "",
            ...inputData
        }).then(response => {
            if (response.status === 200) {
                close()
                dispatch(showMessage({value: "Спасибо! Cкоро я Вам перезвоню.", type: msgTypeSuccess}));
            }
        }).catch(e => {
            dispatch(showMessage({value: e.response.data ? e.response.data.error : "Ошибка!", type: msgTypeFail}));
        })
    }

    function normalizeNumber(num) {
        if (num < 10) {
            return "0" + num
        } else {
            return num + ""
        }
    }

    return (
       <div className="wrapper" onClick={e => {if (e.target.className === "wrapper") close()}}>
           <form className="schedule__form" onSubmit={submitHandler}>
               <div className="close-button" onClick={close}>
                   <img src={closeImg} alt="close button"/>
               </div>
               <h4 style={{color: "gray"}}>Выбранная дата: {normalizeNumber(date.currDay)}.{normalizeNumber(date.currMonth)}.{date.currYear}</h4>
               <h3>Во сколько хотели бы прийти?<span className="asterik">*</span></h3>
               <select name="time" onChange={e => inputChangeHandler(e, setInputData)} required={true}>
                   {times.map((time, idx) => (
                       <option value={time} key={idx}>{time}</option>
                   ))}
               </select>
               <h3>Какие проблемы хотите решить?</h3>
               <textarea placeholder="Здесь можете написать, что Вас волнует. Проблемы, диагнозы и прочее" name="description" onChange={e => inputChangeHandler(e, setInputData)}/>
               <h3>Ваше имя<span className="asterik">*</span></h3>
               <input type="text" name="name" onChange={e => inputChangeHandler(e, setInputData)} required={true}/>
               <h3>Ваш телефон<span className="asterik">*</span></h3>
               <input type="number" name="tel" onChange={e => inputChangeHandler(e, setInputData)} required={true}/>
               <p style={{color: "gray", marginTop: "10px"}}>Я обязательно перезвоню Вам в течение дня</p>
               <p style={{color: "gray", marginTop: "10px"}}>* - обязательное поле</p>
               <div className="bottom-control">
                   <Submit>Записаться</Submit>
               </div>
           </form>
       </div>
    )
}