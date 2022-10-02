import React from 'react';

export default function UserProp(props) {
    return (
        <div className="d-flex">
            <div className="col-sm-6 col-md-3 p-0 m-0 p-2">
                {<strong>{props.name}:</strong>}
            </div>
            <div className="col-sm-6 col-md-3 p-0 m-0 p-2">
                {props.value}
            </div>
        </div>
    )
}