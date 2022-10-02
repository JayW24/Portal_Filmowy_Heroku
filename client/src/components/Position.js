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
import '../styles/Film.css';
//import HtmlReturner from './HtmlReturner'

function Film(props) {
    const loginIndicator = useContext(LoginContext),
        [positionData, setFilmData] = useState(''),
        [commentForLift, setCommentForLift] = useState(null),
        [commentToRemove, setCommentToRemove] = useState({ comment_Id: null, parent_id: null }),
        params = props.match.params

    //LIFT UP COMMENT
    const liftCommentUp = async (comment) => {
        let currentTime = await fetch('/api/servertime')
        currentTime = await currentTime.json()
        if (comment) {
            setCommentForLift({ ...comment, timeCreated: currentTime })
        }
    }
    const resetLiftUp = () => {
        setCommentForLift(null)
    }

    // REMOVE COMMENT
    const removeCommentApod = (commentData) => {
        setCommentToRemove(commentData)
    }
    const resetCommentRemove = () => {
        setCommentToRemove({ comment_Id: null, parent_id: null })
    }

    const fetchData = async () => {
        let response = await fetch(`/api/getoneitem/${props.dbName}/${params.id}`)
        if (response.status == 200) {
            let data = await response.json()
            setFilmData(data)
        }
        else {
            alert('Something gone wrong!')
        }
    }

    useEffect(() => {
        try {
            fetchData()
        }
        catch (error) {
            alert('Something gone wrong!')
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <Tags title={positionData.name} description="Some description..." keywords="keyword1, keyword2, keyword3" />
            <div className="container section-block">
                <div className="row m-0 p-2">
                    <NameAndThumbnail name={positionData.name} thumbnail={positionData.thumbnail} />
                    <div className="col-sm-9 m-0 p-0">
                        <Rate film_rating={positionData.rating} source_id={positionData._id} dbName={props.dbName} params={params} ratingsAmount={positionData.ratingsAmount} />
                        {positionData.categories ? <Categories dbName={props.dbName} categories={positionData.categories} /> : null}
                        {positionData.dateOfBirth ? <PositionParam name="Data urodzenia" value={positionData.dateOfBirth} /> : null}
                        {positionData.duration ? <PositionParam name="Czas trwania" value={positionData.duration} /> : null}
                        {positionData.yearOfProduction ? <PositionParam name="Rok produkcji" value={`${positionData.yearOfProduction} r.`} /> : null}
                        {positionData.episodesAmount ? <PositionParam name="Ilość odcinków" value={positionData.episodesAmount} /> : null}
                        <VerticalSpacer />
                        <p className="text-justify">{positionData.shortDescription}<br /></p>
                    </div>
                </div>
                {/*HTML FROM CSS - NOT NECESSARY HERE BUT IT WORKS*/}
                {/*
                    <div className="cms-content p-2 text-center">
                        <HtmlReturner html={positionData.longDescriptionHTML} />
                    </div>
                */}
                <ResponsiveGallery folderName='/img/films_galleries' urls={positionData.photos}></ResponsiveGallery>
                <Similar text="Podobne filmy" path="film" data={positionData.similar} />
            </div>
            <VerticalSpacer />
            <div className="section-block container p-2">
                <h3>Komentarze</h3>
                <div>
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
        </>
    )
}

export default Film;