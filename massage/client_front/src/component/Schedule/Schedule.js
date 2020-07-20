import React from "react";
import './Schedule.css';
import HorizontalList from "../Common/HorizontalList/HorizontalList";
import Submit from "../Common/Submit";
import Form from "./Form";
import {useDispatch, useSelector} from "react-redux";
import {fetchEvents} from "../../redux/actions";

function daysInMonth(year, month) {
    return 33 - new Date(year, month, 33).getDate();
}

function weekDayToStr(weekday) {
    console.log('weekday', weekday)
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
    console.log(year, month, day)
    return weekDayToStr(new Date(year, month, day).getUTCDay());
}

function timeToMinutes(time) {
    return time[0] * 60 + time[1];
}

export default function Schedule() {
    const schedule = useSelector(state => state.schedule);
    const dispatch = useDispatch();


    const [formOpened, toggleForm] = React.useState(false);

    const now = new Date();

    const [currYearIdx, setCurrYear] = React.useState(0);
    const [currMonthIdx, setCurrMonth] = React.useState(0);
    const [currDayIdx, setCurrDay] = React.useState(0);
    const currYear = currYearIdx + now.getFullYear();
    const currMonth = currMonthIdx + (!currYearIdx ? now.getMonth() : 0) + 1;
    const currDay = currDayIdx + (!(currYearIdx || currMonthIdx) ? now.getDate() : 1);
    const months = ['Янфарь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const days = [];
    const month = currYearIdx === 0 ? now.getMonth() : 0;
    for (let i = 1; i <= daysInMonth(now.getFullYear() + currYearIdx, currMonthIdx + month); i++) {
        if (currMonthIdx === 0 && currYearIdx === 0) {
            if (i >= now.getDate()) {
                days.push(i);
            }
        } else {
            days.push(i);
        }
    }

    const times = [];
    const startWorkTime = [8, 0];
    const stopWorkTime = [21, 0];

    for (let hour = startWorkTime[0]; hour <= stopWorkTime[0]; hour++) {
        times.push(`${hour}:00`);
    }


    const [events, setEvents] = React.useState([]);
    const [weekday, setWeekday] = React.useState(weekDay(currYear, currMonth - 1, currDay));

    const scheduleRef = React.useRef(null);

    function calcPos(start_time, end_time, ref) {
        const offsetHeight = ref.current.offsetHeight;
        const topPadding = 10;
        const height = offsetHeight - topPadding - 27;  // - top - bottom
        const startTime = start_time.split(':').map(num => Number(num));
        const endTime = end_time.split(':').map(num => Number(num));
        const pxPerMin = height / (timeToMinutes(stopWorkTime) - timeToMinutes(startWorkTime));
        const top = `${((timeToMinutes(startTime) - timeToMinutes(startWorkTime)) * pxPerMin + topPadding)}px`; // * 100 / offsetHeight
        const eventHeight = `${((timeToMinutes(endTime) - timeToMinutes(startTime)) * pxPerMin)}px`;
        return {top, eventHeight}
    }

    const [calculatedEvents, setCalculatedEvents] = React.useState([]);

    React.useEffect(() => {
        if (!schedule[currYear] || !schedule[currYear][currMonth] || !schedule[currYear][currMonth][currDay]) {
            dispatch(fetchEvents(currYear, currMonth, currDay, setEvents));
        } else {
            setEvents(schedule[currYear][currMonth][currDay]);
        }

        setWeekday(weekDay(currYear, currMonth - 1, currDay));
    }, [currDayIdx, currMonthIdx, currYearIdx]);


    React.useEffect(() => {
            setCalculatedEvents(events.map(e => ({...e, ...calcPos(e.start_time, e.end_time, scheduleRef)})))
    }, [scheduleRef, currDayIdx, currMonthIdx, currYearIdx, events]);


    return (
        <main className="container schedule">
            <HorizontalList list={[now.getFullYear(), now.getFullYear() + 1]} title={item => (item)}
                            click={(item, idx) => {
                                setCurrYear(idx)
                            }} current={(item, idx) => idx === currYearIdx}/>
            <HorizontalList list={months.filter((month, idx) => {
                if (currYearIdx === 0){
                    return idx >= now.getMonth();
                } else {
                    return true;
                }
            })} title={item => (item)}
                            click={(item, idx) => {
                                setCurrMonth(idx)
                                if (idx !== 0 && idx !== currMonthIdx) {
                                    setCurrDay(0);
                                }
                            }} current={(item, idx) => idx === currMonthIdx}/>
            <HorizontalList list={days} title={day => (day)} click={(day, idx) => setCurrDay(idx)}
                            current={(day, idx) => idx === currDayIdx}/>
            <div className="schedule__legend">
                <div className="schedule__legend_box"/>
                <p>- занято</p>
            </div>
            <div className="schedule__day" ref={scheduleRef} onClick={() => toggleForm(true)}>
                <div className="schedule__weekday">{weekday}</div>
                {times.map((tm, idx) => (<>
                    <div key={idx}>{tm}</div>
                    <div className="schedule__line"/>
                </>))}
                {calculatedEvents.map((event, idx) => (
                    <div className="schedule__event" style={{top: event.top, height: event.eventHeight}}>
                        <div className="schedule__event_start-time">{event.start_time}</div>
                        <div className="schedule__event_end-time">{event.end_time}</div>
                    </div>
                ))}
            </div>
            <div className="bottom-control">
                <Submit onClick={() => toggleForm(true)}>Записаться</Submit>
            </div>
            {formOpened && <Form close={() => toggleForm(false)} date={{currYear, currMonth, currDay}}/>}
        </main>
    )
}