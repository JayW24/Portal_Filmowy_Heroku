import React from 'react';

export default function PositionParam(props) {
    return (
        <div className="d-flex w-100 flex-column m-0 p-0">
            <div className="d-flex w-100">
                <div className="col-sm-6 col-md-2 m-0 p-0 font-weight-bold">{props.name}:</div>
                <div className="col-sm-6 col-md-2 m-0 p-0">{props.value} min</div>
            </div>
        </div>
    )
}