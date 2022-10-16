import React, { useContext } from 'react';
import { LoginContext } from './LoginContext';
import statusStyler from '../services/statusStyler';
import messageStyler from '../services/messageStyler';
import MessengerAvatar from './MessengerAvatar';
import interlocutor from '../services/interlocutor';
import { Link } from 'react-router-dom';

function MessagesReverseMessage(props) {
    const loginIndicator = useContext(LoginContext);

    return (
        <div className={`d-flex mt-2 p-0 m-0 ${messageStyler(loginIndicator, props.sender).side}`}>

            <div className={`p-2 border border-light rounded ${messageStyler(loginIndicator, props.sender).bgColors}`} key={props.index}>
                <Link to={`/users/${props.sender}`} className="d-flex flex-wrap align-items-center">
                    <span className="mr-1"><MessengerAvatar name={interlocutor(loginIndicator, props.sender, props.sender)} /></span>
                    <h6 className={`d-flex ${messageStyler(loginIndicator, props.sender).secondary}`}>
                        {props.sender}
                    </h6>
                </Link>
                <p>{props.content}</p>
                <div className={`${messageStyler(loginIndicator, props.sender).secondary}`}>
                    {statusStyler(props.status, props.time_sent, props.time_received)}
                </div>
            </div>
        </div>
    )
}

export default MessagesReverseMessage