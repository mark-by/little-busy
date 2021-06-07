import React from 'react';
import EventForm from "./EventForm";
import plus from '../../images/plus.svg';

function ScheduleDay({weekday, year, month, day, times, events}, ref) {
    const [selectedEvent, select] = React.useState(false);

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
                        if (!event.active) {
                            style = {...style, ...notActiveStyle};
                        }
                        return (
                            <div className="schedule__event" key={idx} onClick={() => select(event)} style={style}>
                                <div className="schedule__event_start-time">{event.start_time}</div>
                                <p className="schedule__event_client-name">{event.client.text}</p>
                                <div className="schedule__event_end-time">{event.end_time}</div>
                            </div>
                        )
                    })}
                </div>
                <div className="schedule__add-event" onClick={() => select({new: true})}><img src={plus}
                                                                                              alt="добавить"/></div>
            </div>
            {selectedEvent &&
            <EventForm event={selectedEvent} day={day} month={month} year={year} scheduleRef={ref} close={() => select(false)}/>}
        </>
    )
}

export default React.forwardRef(({times, day, weekday, events, month, year}, ref) => ScheduleDay({
    times,
    day,
    weekday,
    events,
    month,
    year
}, ref))
