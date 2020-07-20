import React from "react";
import useColumns from "../Common/useColumns";
import './Feedback.css';
import {useSelector} from "react-redux";
import useLastRef from "../Common/useLastRef";
import {typeIncPageFeedback, typeSetFeedback} from "../../redux/types";
import usePaginate from "../Common/usePaginate";
import {toggleLoading} from "../../redux/actions";
import {apiFeedback} from "../../backend/api";

export default function Feedback() {
    const list = useSelector(state => state.feedback.list);
    const hasMore = useSelector(state => state.feedback.hasMore);
    const page = useSelector(state => state.feedback.page);
    const loading = useSelector(state => state.app.loading);
    const ref = useLastRef(loading, hasMore, typeIncPageFeedback);
    usePaginate(typeSetFeedback, toggleLoading, apiFeedback, page, 6)

    function calcColumns() {
        if (window.innerWidth > 768) {
            return 3;
        } else if (window.innerWidth > 425) {
            return 2;
        } else {
            return 1;
        }
    }

    const columns = useColumns(list, calcColumns);
    let counter = 0;

    return (
        <main className="container certificates">
            {columns.map((column, colIdx) => {
                return (
                    <div className={"certificates__column"}>
                        {column.map((feedback, idx) => {
                            counter++;
                            if (counter === list.length) {
                                return (
                                    <div className="feedback-card" ref={ref} key={counter}>
                                        <div className="feedback-card__content"
                                             dangerouslySetInnerHTML={{__html: feedback.content}}/>
                                        <div className="feedback-card__date">{feedback.date}</div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="feedback-card" key={counter}>
                                        <div className="feedback-card__content"
                                             dangerouslySetInnerHTML={{__html: feedback.content}}/>
                                        <div className="feedback-card__date">{feedback.date}</div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                )
            })}
        </main>
    )
}