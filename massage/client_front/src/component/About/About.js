import React from "react";
import './About.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchArticles} from "../../redux/actions";

export default function About() {
    const list = useSelector(state => state.app.articles);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!list) {
            dispatch(fetchArticles());
        }
    }, [])

    return (
        <main className={"container about"}>
                {list && list.map((article, idx) => (
                    <article key={idx}>
                        <h2 id={article.id}>{article.title}</h2>
                        <p className="about_content" dangerouslySetInnerHTML={{__html: article.content}}/>
                    </article>
            ))}
        </main>
    )
}