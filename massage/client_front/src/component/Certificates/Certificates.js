import React from "react";
import './Certificates.css'
import Certificate from "./Certificate";
import useColumns from "../Common/useColumns";
import {useSelector} from "react-redux";
import useLastRef from "../Common/useLastRef";
import {typeIncPageCertificates, typeSetCertificates} from "../../redux/types";
import usePaginate from "../Common/usePaginate";
import {apiCertificates} from "../../backend/api";
import {toggleLoading} from "../../redux/actions";

export default function Certificates() {
    const list = useSelector(state => state.certificates.list);
    const hasMore = useSelector(state => state.certificates.hasMore);
    const page = useSelector(state => state.certificates.page);
    const loading = useSelector(state => state.app.loading);
    const ref = useLastRef(loading, hasMore, typeIncPageCertificates);
    usePaginate(typeSetCertificates, toggleLoading, apiCertificates, page, 3);

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
                        {column.map((certificate, idx) => {
                            console.log(list.length, counter)
                            counter++;
                            if (counter === list.length) {
                                return <Certificate image={certificate.image} key={counter} ref={ref}/>
                            } else {
                                return <Certificate image={certificate.image} key={counter}/>
                            }
                        })}
                    </div>
                )
            })}

        </main>
    )
}