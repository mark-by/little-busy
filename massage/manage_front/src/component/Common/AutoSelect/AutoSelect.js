import React from "react";
import './Select.css'
import axios from "axios";

//api должно возвращать json вида {results: [{id: 4, text: "sample"}, ...]}
export default function AutoSelect({name, setData, title, api, width, defaultValue}) {
    const [selected, select] = React.useState(defaultValue)
    const [isOpen, toggle] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState(null);

    React.useEffect(() => {
        if (defaultValue) {
            setData(prev => ({...prev, [`selected_${name}_title`]: defaultValue.text}))
        }
    }, [])

    function selectOption(option) {
        setData(prev => ({...prev, [name]: option.id, [`selected_${name}_title`]: option.text}))
        select(option)
    }

    function handleSelectOption(option) {
        selectOption(option)
        toggle(false);
    }

    function closeHandler(e) {
        if (e.target.className === "select" ||
            e.target.className === "main-wrapper" ||
            e.target.className === "select-title" ||
            e.target.classList.contains("arrow")
        ) {
            if (!suggestions) {
                axios.get(api)
                    .then(response => {
                        setSuggestions(response.data.results)
                        }
                    )
            }
            toggle(prev => !prev)
        }
    }

    function searchInputHandler(e) {
        axios.get(api, {params: {term: e.target.value}})
            .then(response => {
                    setSuggestions(response.data.results)
                }
            )
    }

    return (
        <div className="select" onClick={e => closeHandler(e)} style={{width: width}}>
            <div className="main-wrapper">
                <p className="select-title" style={{marginLeft: "10px"}}>{selected ? selected.text : title}</p>
                <span className={isOpen ? "arrow up" : "arrow down"}/>
            </div>
            {isOpen && <div className="options">
                <input type="text" onChange={searchInputHandler} placeholder="Введите для поиска"/>
                <div style={{maxHeight: "200px", overflowY: "scroll"}}>
                    {(!suggestions || !suggestions.length) && <div className="option">Нет предложений</div>}
                    {suggestions && suggestions.map((option, idx) => {
                        return <div className="option" key={idx} onClick={() => handleSelectOption(option)}>
                            <p>{option.text}</p>
                        </div>
                    })}
                </div>
            </div>}
        </div>
    )
}