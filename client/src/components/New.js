import React, { useState, useEffect, useContext } from 'react';
import ConvertDate from '../services/ConvertDate';
import axios from 'axios';
import MetaTags from 'react-meta-tags';
import HtmlReturner from './HtmlReturner';
import { Link } from 'react-router-dom';
import InfiniteComments from './InfiniteComments';
import CommentForm from './CommentForm';
import VerticalSpacer from './VerticalSpacer';
import convertToObjArr from '../services/convertToObjArr';
import { LoginContext } from './LoginContext';
import Spinner from './Spinner';

export default function New(props) {
    const loginIndicator = useContext(LoginContext);
    const [data, setData] = useState({ title: null, photo: null, code: null, related_articles: [], date: null });
    const [commentForLift, setCommentForLift] = useState(null);
    const [commentToRemove, setCommentToRemove] = useState({ comment_Id: null, parent_id: null });
    const params = props.match.params;

    //LIFT UP COMMENT
    const liftCommentUp = async (comment) => {
        try {
            let currentTime = await fetch('/api/servertime');
            currentTime = await currentTime.json();
            if (comment) {
                setCommentForLift({ ...comment, timeCreated: currentTime });
            }
        }
        catch (error) {
            alert('Somethiing gone wrong!');
        }
    }
    const resetLiftUp = () => {
        setCommentForLift(null);
    }

    // REMOVE COMMENT
    const removeCommentApod = (commentData) => {
        setCommentToRemove(commentData);
    }

    const resetCommentRemove = () => {
        setCommentToRemove({ comment_Id: null, parent_id: null });
    }

    useEffect(() => {
        const getData = async () => {
            let data = await axios.get(`/api/getoneitem/news/${params.id}`);
            data = await data.data;
            data.related_articles = convertToObjArr(data.related_articles);
            setData(data);
        }
        try {
            getData();
        }
        catch (error) {
            alert('Something gone wrong!');
        }
    }, [params.id])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            <MetaTags>
                <title>{data.title} | FilmHub</title>
                <meta name="description" content="Some description. Ready to become dynamic." />
                <meta name="keywords" content="Some, random, keywords, ready, to, become, dynamic"></meta>
                <meta property="og:title" content="MyApp" />
                <meta property="og:image" content="path/to/image.jpg" />
            </MetaTags>
            {data.title ?
                <div className="container section-block p-2">
                    {ConvertDate(data.date)}
                    <h3>{data.title}</h3>
                    {data.description} <br />
                    <img src={data.photos && data.photos.replace('/uploads/', ':1337/uploads/')} className="img-fluid" alt={data.photos} />
                    {/*DATA FROM CMS*/}
                    <div>
                        <HtmlReturner html={data.code} /><br />
                    </div>
                    <hr />
                    <VerticalSpacer />
                    <h3>Podobne artykuły:</h3>
                    <div className="related-articles d-flex flex-column">
                        {data.related_articles ?
                            data.related_articles.map((related_article, index) => <Link key={`${related_article.name}-${index}`} to={`/new/${related_article.url}`}>{related_article.name}</Link>)
                            : null}
                    </div>
                    <VerticalSpacer />
                    <hr />
                    <div className="p-0 m-0">
                        <h3>Komentarze</h3>
                        <div className="p-0 m-0">
                            {loginIndicator ? <div>Dodaj nowy komentarz</div> : <a href="/login"><div className="font-italic">Zaloguj się aby dodać komentarz. <i className="fas fa-sign-in-alt text-primary"></i></div><br /></a>}
                            {/*Main Thread Comment. Always Active.*/}
                            <CommentForm
                                login={loginIndicator}
                                render={true}
                                source_id={params.id}
                                parent_id="0"
                                liftCommentUp={liftCommentUp}
                                mainThread={true}
                                active={true}
                            />
                            {loginIndicator ? <hr /> : null}
                        </div>
                        <InfiniteComments
                            login={loginIndicator}
                            source_id={params.id}
                            commentForLift={commentForLift}
                            liftCommentUp={liftCommentUp}
                            resetLiftUp={resetLiftUp}
                            removeCommentApod={removeCommentApod}
                            commentToRemove={commentToRemove}
                            resetCommentRemove={resetCommentRemove}
                        />
                    </div>
                </div>
                : <Spinner />}
        </>
    )
}