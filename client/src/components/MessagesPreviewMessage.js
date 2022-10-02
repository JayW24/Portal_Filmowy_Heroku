import { LoginContext } from './LoginContext'
import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import ConvertDate from '../services/ConvertDate'
import { createBrowserHistory } from "history"
import interlocutor from '../services/interlocutor';
import MessengerAvatar from './MessengerAvatar';
import statusStyler from '../services/statusStyler'
import '../styles/MessagesPreviewMessage.css'
const history = createBrowserHistory()

function MessagesPreviewMessage(props) {
    const loginIndicator = useContext(LoginContext);
    const interlctr = interlocutor(loginIndicator, props.data.sender, props.data.receiver);
    
    return (
        <div className="hoverer">
            <Link onClick={() => { history.push(`/messenger/${loginIndicator}/${interlctr}`) }}
                to={`/messenger/${loginIndicator}/${interlctr}`}> {/* url to conversation */}
                <div style={{ padding: "10px" }}>
                    <span className="mr-1"><MessengerAvatar name={interlocutor(loginIndicator, props.data.sender, props.data.receiver)} /></span>
                    <span>{interlctr}</span> <span style={{ fontSize: "9px" }}>{ConvertDate(props.data.time_sent)}</span>
                    <div className="d-flex flex-column">
                        <div className="text-dark messages-preview-message">
                            {props.data.content}
                        </div>
                        <div className="text-muted">
                            {statusStyler(props.data.status, props.data.time_sent, props.data.time_received)}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default MessagesPreviewMessage