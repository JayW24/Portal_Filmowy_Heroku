import React from 'react';
const paramsUnits = {
    'Kategorie' : null,
    'Czas trwania' : 'min',
    'Rok produkcji' : 'r.',
    'Ilość odcinków' : null
}
export default function PositionParam(props) {
    return (
        <div className="d-flex w-100 flex-column m-0 p-0">
            <div className="d-flex w-100">
                <div className="col-sm-6 col-md-2 m-0 p-0 font-weight-bold">{props.name}:</div>
                <div className="col-sm-6 col-md-2 m-0 p-0">{props.value} {paramsUnits[props.name]}</div>
            </div>
        </div>
    )
}