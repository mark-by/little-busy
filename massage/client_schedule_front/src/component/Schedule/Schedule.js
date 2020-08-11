import React from "react";
import './Schedule.css';
import HorizontalList from "../Common/HorizontalList/HorizontalList";
import Form from "./Form";
import {useDispatch, useSelector} from "react-redux";
import {fetchEvents} from "../../redux/actions";
import ScheduleDay from "./ScheduleDay";
import {normalizeNumber} from '../../utils';

function daysInMonth(year, month) {
    return 33 - new Date(year, month, 33).getDate();
}

function weekDayToStr(weekday) {
    switch (weekday) {
        case 0:
            return "Пн";
        case 1:
            return "Вт";
        case 2:
            return "Ср";
        case 3:
            return "Чт";
        case 4:
            return "Пт";
        case 5:
            return "Сб";
        case 6:
            return "Вс";
    }
}

function weekDay(year, month, day) {
    return weekDayToStr(new Date(year, month, day).getUTCDay());
}

function dateToStr(year, month, day) {
    return `${normalizeNumber(day)}.${normalizeNumber(month)}.${year % 100}`
}

function getValidDays(numDays, currYearIdx, currMonthIdx, currDay) {
    const days = [];
    for (let i = 1; i <= numDays; i++) {
        if (currMonthIdx === 0 && currYearIdx === 0) {
            if (i >= currDay) {
                days.push(i);
            }
        } else {
            days.push(i);
        }
    }
    return days;
}

const months = ['Янфарь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export default function Schedule(props) {
    const schedule = useSelector(state => state.schedule);
    const dispatch = useDispatch();

    const [formOpened, toggleForm] = React.useState(false);

    const now = new Date();

    const [currYearIdx, setCurrYear] = React.useState(0);
    const [currMonthIdx, setCurrMonth] = React.useState(0);
    const currYear = currYearIdx + now.getFullYear();
    const currMonth = currMonthIdx + (!currYearIdx ? now.getMonth() : 0) + 1;
    const currDay = (!(currYearIdx || currMonthIdx) ? now.getDate() : 1);
    const days = getValidDays(daysInMonth(currYear, currMonth - 1), currYearIdx, currMonthIdx, now.getDate())

    const times = [];
    for (let hour = schedule.startWorkTime[0]; hour <= schedule.stopWorkTime[0]; hour++) {
        times.push(hour);
    }

    const scheduleRef = React.useRef(null);
    React.useEffect(() => {
        if (scheduleRef.current && (!schedule[currYear] || !schedule[currYear][currMonth])) {
            dispatch(fetchEvents(currYear, currMonth, props.match.params.token, scheduleRef));
        }
    }, [scheduleRef.current, currMonthIdx, currYearIdx]);


    const startWeekday = new Date(currYear, currMonth - 1, currDay).getUTCDay();

    return (
        <main className="container schedule">
            <HorizontalList list={[now.getFullYear(), now.getFullYear() + 1]} title={item => (item)}
                            click={(item, idx) => {
                                setCurrYear(idx)
                            }} current={(item, idx) => idx === currYearIdx}/>
            <HorizontalList list={months.filter((month, idx) => {
                if (currYearIdx === 0) {
                    return idx >= now.getMonth();
                } else {
                    return true;
                }
            })} title={item => (item)} click={(item, idx) => {setCurrMonth(idx)}}
                            current={(item, idx) => idx === currMonthIdx}/>
            <div className="schedule__legend">
                <div className="schedule__legend_box"/>
                <p>- мои сеансы</p>
            </div>
            <div className="schedule__legend">
                <div className="schedule__legend_box not_active"/>
                <p>- мои неподтвержденные сеансы</p>
            </div>
            <div className="schedule__legend">
                <div className="schedule__legend_box not_my"/>
                <p>- не мои сеансы</p>
            </div>
            <div className="schedule__row">{times.map((time, idx) => (
                <div key={idx} className="schedule__time">{time}</div>
            ))}</div>
            {days.map((day, idx) => {
                const currWeekday = (startWeekday + idx) % 7;
                let events = [];
                if (schedule[currYear] && schedule[currYear][currMonth]) {
                    if (schedule[currYear][currMonth][day])
                       events = events.concat(schedule[currYear][currMonth][day]);
                }
                if (schedule.constant[currWeekday]) {
                    events = events.concat(schedule.constant[currWeekday]);
                }
                return (
                    <>
                        <ScheduleDay token={props.match.params.token} times={times} events={events} weekday={weekDayToStr(currWeekday)} ref={scheduleRef} day={day} month={currMonth} year={currYear}/>
                        {currWeekday === 6 && <div className="schedule__days-division"/>}
                    </>
                )
            })}
            {formOpened && <Form close={() => toggleForm(false)} date={{currYear, currMonth, currDay}}/>}
        </main>
    )
}