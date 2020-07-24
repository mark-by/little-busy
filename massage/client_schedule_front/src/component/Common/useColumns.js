import React from "react";

export default function useColumns(data, calcColumns) {
    const [columnsNumber, setColumnsNumber] = React.useState(calcColumns());
    const [columns, setColumns] = React.useState([]);

    React.useEffect(() => {
        const bufColumns = [];

        for (let colIdx = 0; colIdx < columnsNumber; colIdx++) {
            bufColumns.push([]);
        }

        for (let itemIdx = 0; itemIdx < data.length; itemIdx++) {
            bufColumns[itemIdx % columnsNumber].push(data[itemIdx]);
        }
        setColumns(bufColumns);
    }, [columnsNumber, data]);

    React.useEffect(() => {
        window.onresize = () => {
            setColumnsNumber(calcColumns())
        }
    }, [])
    return columns;
}