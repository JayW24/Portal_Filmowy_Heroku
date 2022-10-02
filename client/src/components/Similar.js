import React from 'react'
import convertToObjArr from '../services/convertToObjArr'
import { Link } from 'react-router-dom'
import GenerateRandomKey from '../services/GenerateRandomKey'

export default function Similar(props) {
    return (
        <div className="p-2">
            {props.text}:
            <div className="similar--s d-flex flex-column">
                {props.data? convertToObjArr(props.data).map(similar => {
                    return <Link key={GenerateRandomKey(10)} to={`/${props.path}/${similar.url}`}>{similar.name}</Link>
                }): null}
            </div>
        </div>
    )
}