import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from './LoginContext';
import NameAndThumbnail from './NameAndThumbnail';
import InfiniteComments from './InfiniteComments';
import CommentForm from './CommentForm';
import Rate from './Rate';
import Similar from './Similar';
import PositionParam from './PositionParam';
import Categories from './Categories';
import ResponsiveGallery from './ResponsiveGallery';
import VerticalSpacer from './VerticalSpacer';
import Tags from './Tags';
import Spinner from './Spinner';
import HtmlReturner from './HtmlReturner';
import '../styles/Film.css';
//import HtmlReturner from './HtmlReturner';

function Position(props) {
    const loginIndicator = useContext(LoginContext)
    const [positionData, setPositionData] = useState('');
    const [commentForLift, setCommentForLift] = useState(null);
    const [commentToRemove, setCommentToRemove] = useState({ comment_Id: null, parent_id: null });
    const params = props.match.params;

    //LIFT UP COMMENT
    const liftCommentUp = async (comment) => {
        let currentTime = await fetch('/api/servertime');
        currentTime = await currentTime.json();
        if (comment) {
            setCommentForLift({ ...comment, timeCreated: currentTime });
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
        const fetchData = async () => {
            let response = await fetch(`/api/getoneitem/${props.dbName}/${params.id}`);
            if (response.status === 200) {
                let data = await response.json();
                setPositionData(data);
            }
            else {
                alert('Something gone wrong!');
            }
        }

        try {
            fetchData();
        }
        catch (error) {
            alert('Something gone wrong!');
        }
    }, [props.dbName, params.id])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <>
            <Tags title={positionData.name} description="Some description..." keywords="keyword1, keyword2, keyword3" />
            {positionData ?
                <>
                    <div className="container section-block">
                        {/*BASIC DATA*/}
                        <div className="row m-0 p-2">
                            <NameAndThumbnail name={positionData.name} thumbnail={positionData.thumbnail} />
                            <div className="col-sm-9 m-0 p-0">
                                <Rate film_rating={positionData.rating} source_id={positionData._id} dbName={props.dbName} params={params} ratingsAmount={positionData.ratingsAmount} />
                                {positionData.categories && <Categories dbName={props.dbName} categories={positionData.categories} />}
                                {positionData.dateOfBirth && <PositionParam name="Data urodzenia" value={positionData.dateOfBirth} /> }
                                {positionData.duration && <PositionParam name="Czas trwania" value={positionData.duration} /> }
                                {positionData.yearOfProduction && <PositionParam name="Rok produkcji" value={`${positionData.yearOfProduction} r.`} />}
                                {positionData.episodesAmount && <PositionParam name="Ilość odcinków" value={positionData.episodesAmount} />}
                                <VerticalSpacer /><br/>
                                <p className="text-justify">{positionData.shortDescription}<br /></p>
                            </div>
                        </div>
                        <hr/>
                        {/*HTML FROM CSS*/}
                        {
                            <div className="cms-content p-2">
                                <HtmlReturner html={positionData.longDescriptionHTML} />
                            </div>
                        }
                        <ResponsiveGallery folderName='/img/films_galleries' urls={positionData.photos}></ResponsiveGallery>
                        <Similar text="Podobne filmy" path="film" data={positionData.similar} />
                    </div>
                    <VerticalSpacer />
                    <div className="section-block container p-2">
                        <h3>Komentarze</h3>
                        <div>
                        <VerticalSpacer />
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
                </> : <Spinner />
            }
        </>
    )
}

export default Position;