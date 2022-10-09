import React from 'react';

export default function NameAndThumbnail(props) {
    return (
        <div className="col-sm-3 m-0 p-0 pr-2 text-center">
            <h3>{props.name}</h3>
            <img id="main-thumbnail" alt="main-thumbnail" src={props.thumbnail} />
        </div>
    )
}