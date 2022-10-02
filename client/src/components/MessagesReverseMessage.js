import React, { useContext } from 'react';
import { LoginContext } from './LoginContext';
import statusStyler from '../services/statusStyler';
import messageStyler from '../services/messageStyler';

function MessagesReverseMessage(props) {
    const loginIndicator = useContext(LoginContext);

    return (
        <div className={`d-flex mt-2 p-0 m-0 ${messageStyler(loginIndicator, props.sender).side}`}>
            <div className={`${messageStyler(loginIndicator, props.sender).bgColors}`} key={props.index}>
                <h6 className={`d-flex ${messageStyler(loginIndicator, props.sender).secondary}`}>
                    {props.sender}
                </h6>
                <p>{props.content}</p>
                <div className={`${messageStyler(loginIndicator, props.sender).secondary}`}>
                    {statusStyler(props.status, props.time_sent, props.time_received)}
                </div>
            </div>
        </div>
    )
}

export default MessagesReverseMessage