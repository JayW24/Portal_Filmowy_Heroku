import React from 'react';
import { Link } from "react-router-dom";

const thumbnailHeight = { height: '150px' };
const imageContainerClassName = "col-sm-3 col-md-4 col-lg-3 d-flex align-items-center justify-content-center";
const imageClassName="img-fluid";
const dataClassName="col-sm-9 col-md-8 col-lg-9 d-flex flex-column justify-content-center";
const actorTileClassName = "d-flex row";
const actorDescriptionClassName = "font-italic";
const limitDescription = (description) => description.substring(0, 250);
const descriptionIsLong = (description) => {
    if(description.length > 250) {
        return "...";
    }};
const roundRating = (rating) => Math.round(rating* 100) / 100;

export default function ActorTile(props) {
    return (
        <>
            <div className={actorTileClassName}>
                <div className={imageContainerClassName}>
                    <img className={imageClassName} style={thumbnailHeight} src={props.thumbnail} alt={props.thumbnail} />
                </div>
                <div className={dataClassName}>
                    <Link to={`/${props.path}/${props._id}`}><h5>{props.name}</h5></Link>
                    <div><strong>Data urodzenia: </strong>{props.dateOfBirth}r.</div>
                    <div><strong>Ocena: </strong>{roundRating(props.rating)}</div>
                    <div><p className={actorDescriptionClassName}>{limitDescription(props.shortDescription)}{descriptionIsLong(props.shortDescription)}</p></div>
                </div>
            </div>
            <br />
            <hr />
        </>
    )
}