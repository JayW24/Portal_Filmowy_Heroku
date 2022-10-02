import React, { useContext } from 'react';
import GenerateRandomKey from '../services/GenerateRandomKey';
import interlocutor from '../services/interlocutor';
import '../styles/MessagesPreviewBigConversation.css';
import { LoginContext } from './LoginContext';
import { Link } from "react-router-dom";
import statusStyler from '../services/statusStyler';
import MessengerAvatar from './MessengerAvatar';

export default function MessagesPreviewBigConversation(props) {
    const loginIndicator = useContext(LoginContext);
    const interlctr = interlocutor(loginIndicator, props.sender, props.receiver);
    
    return (
        <>
            <Link to={`/messenger/${loginIndicator}/${interlocutor(loginIndicator, props.sender, props.receiver)}`}>
                <div key={GenerateRandomKey(10)} className="MessagesPreviewBigConversation d-flex col-sm-12 p-0 m-0 mb-2 row hoverer">
                    <div className="d-flex col-sm-12 col-md-2 align-items-center justify-content-around">
                        <MessengerAvatar name={interlctr} />
                        {interlocutor(loginIndicator, props.sender, props.receiver)}
                    </div>
                    <div className="d-flex col-sm-12 col-md-7 align-items-center text-dark">
                        {props.content}
                    </div>
                    <div className="d-flex text-secondary col-sm-12 col-md-3 align-items-center justify-content-end date">
                        {statusStyler(props.status, props.time_sent, props.time_received)}
                    </div>
                </div>
            </Link>
        </>
    )
}