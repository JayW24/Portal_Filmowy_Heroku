import React, { useState, useEffect, useContext } from 'react'
import { LoginContext } from './LoginContext'
import roundRating from '../services/roundRating'
import ratePossibility from '../services/ratePossibility'
import ratingRangeInput from '../services/ratingRangeInput'
import '../styles/Rate.css'


function Rate(props) {
    const [userRatingValue, setUserRatingValue] = useState(10),
    [ratingValue, setRatingValue] = useState("Ocena"),
    [ratingsAmount, setRatingsAmount] = useState(null),
    loginIndicator = useContext(LoginContext),
    params = props.params

    //SET USER RANKING, IF USER DIDN'T RANKED SET RANGE INPUT DEFAULT VALUE TO 10 (MAX)
    useEffect(() => {
        const setUserRank = async () => {
            try {
                if (loginIndicator) {
                    let userRank = await fetch(`/api/dbquery/ratings/0/1/username=${loginIndicator}&ratedPositionID=${params.id}`)
                    userRank = await userRank.json()
                    if (userRank.length > 0) {
                        setUserRatingValue(userRank[0].rating)
                    }
                    else {
                        setUserRatingValue("Brak oceny")
                    }
                }
            }
            catch(err) {
                alert('Rating error!')
            }
        }
        setUserRank()
    }, [loginIndicator])

    useEffect(() => {
        setRatingValue(props.film_rating)
    }, [props.film_rating])

    useEffect(() => {
        setRatingsAmount(props.ratingsAmount)
    }, [props.ratingsAmount])

    return (
        <div>
            <form onSubmit={(event) => handleSubmit(event, props.source_id, userRatingValue, props.dbName, setRatingValue, setRatingsAmount)}>
                {ratingRangeInput(loginIndicator, userRatingValue, setUserRatingValue)}
                {ratePossibility(userRatingValue, loginIndicator)} <br />
                <label>Ocena użytkowników : {ratingValue ? roundRating(ratingValue) : null}</label>
                <span className="ml-1">(Liczba ocen: {ratingsAmount ? ratingsAmount : null})</span>
            </form>
        </div>
    )
}

async function handleSubmit(event, source_id, userRatingValue, dbName, setRatingValue, setRatingsAmount) {
    try {
        event.preventDefault()
        const resp = await fetch(`/api/rate/${dbName}/${source_id}/${userRatingValue}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await resp.json()
        setRatingValue(parseFloat(data.averageRank))
        setRatingsAmount(data.ratingsAmount)
        alert('New rank added!')
    }
    catch(error) {
        alert('Rating gone wrong.')
    }
}

export default Rate