import React from 'react';
import { Link } from "react-router-dom";
import roundRating from '../services/roundRating';
const thumbnailHeight = { height: '150px' };

//This is a single premiere component with basic info such as rating, duration, thumbnail etc.
export default function PremiereTile(props) {
    return (
        <>
            <div className="d-flex row">
                <div className="col-sm-3 col-md-4 col-lg-3 d-flex align-items-center justify-content-center">
                    <img className="img-fluid" style={thumbnailHeight} src={props.thumbnail} alt={props.thumbnail} />
                </div>
                {/*props._id*/}
                <div className="col-sm-9 col-md-8 col-lg-9 d-flex flex-column justify-content-center">
                    <Link to={`/${props.path}/${props._id}`}><h5>{props.name}</h5></Link>
                    <div><strong>Czas trwania:</strong> {props.duration}min</div>
                    <div><strong>Data premiery:</strong> {props.premiere}</div>
                    <div><strong>Kategorie:</strong> {props.categories}</div>
                    <div><strong>Oczekiwania:</strong> {roundRating(props.rating)}</div>
                </div>
            </div>
            <br />
            <hr />
        </>
    )
}