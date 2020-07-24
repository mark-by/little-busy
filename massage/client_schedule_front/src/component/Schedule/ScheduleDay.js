import React from 'react';
import EventForm from "./EventForm";
import plus from '../../images/plus.svg';

function ScheduleDay({token, weekday, year, month, day, times, events}, ref) {
    const [opened, toggle] = React.useState(false);

    const notMy = {
        background: "rgba(160, 160, 160, 0.2)",
        borderColor: "rgba(180, 180, 180, 0.7)",
    }

    const notActiveStyle = {
        background: "rgba(160, 160, 160, 0.5)",
        borderColor: "gray",
    }


    return (
        <>
            <div className="schedule__day">
                <div className="schedule__weekday">{day}, {weekday}</div>
                <div className="schedule__row" ref={ref}>
                    {times.map((tm, idx) => (<div key={idx} className="schedule__line"/>))}

                    {events.map((event, idx) => {
                        let style = {left: event.left, width: event.width};
                        if (!event.own) {
                            style = {...style, ...notMy};
                        } else {
                            if (!event.active) {
                                style = {...style, ...notActiveStyle};
                            }
                        }

                        return (
                            <div className="schedule__event" key={idx} style={style}>
                                <div className="schedule__event_start-time">{event.start_time}</div>
                                <div className="schedule__event_end-time">{event.end_time}</div>
                            </div>
                        )
                    })}
                </div>
                <div className="schedule__add-event" onClick={() => toggle(true)}><img src={plus}
                                                                                              alt="добавить"/></div>
            </div>
            {opened &&
            <EventForm token={token} day={day} month={month} year={year} scheduleRef={ref} close={() => toggle(false)}/>}
        </>
    )
}

export default React.forwardRef(({token, times, day, weekday, events, month, year}, ref) => ScheduleDay({
    token,
    times,
    day,
    weekday,
    events,
    month,
    year
}, ref))