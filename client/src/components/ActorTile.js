import React from 'react';
import { Link } from "react-router-dom";

const thumbnailHeight = { height: '150px' };

export default function ActorTile(props) {
    return (
        <>
            <div className="d-flex row">
                <div className="col-sm-3 col-md-4 col-lg-3 d-flex align-items-center justify-content-center">
                    <img className="img-fluid" style={thumbnailHeight} src={props.thumbnail} alt={props.thumbnail} />
                </div>
                <div className="col-sm-9 col-md-8 col-lg-9 d-flex flex-column justify-content-center">
                    <Link to={`/${props.path}/${props._id}`}><h5>{props.name}</h5></Link>
                    <div>Data urodzenia: {props.dateOfBirth}</div>
                    <div>Opis: {props.shortDescription.substring(0, 250)}...</div>
                    <div>Ocena: {Math.round(props.rating* 100) / 100}</div>
                </div>
            </div>
            <br />
            <hr />
        </>
    )
}