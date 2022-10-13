import React from 'react'

export default function UserEditableField(props) {
    return (
        <div className="d-flex mb-3">
            <div className="d-flex align-items-center userEditableFieldName">
                {props.name}: 
            </div>
            <textarea className="d-flex w-100 pt-4 border border-light" type="text" name="from" defaultValue={props.defaultValue} onChange={event => {
                props.handleChange(event, props.setVal)
                props.checkVal(event, props.setValCheck, props.setValValidation)
            }} />
            <div className="d-flex align-items-center">
                {props.valCheck}
            </div>
        </div>
    )
}