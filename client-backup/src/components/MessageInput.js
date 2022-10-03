import React, { useState, useEffect } from 'react';
import VerticalSpacer from './VerticalSpacer';

function MessageInput(props) {
    const [messageText, setMessageText] = useState('');

    function handleChange(event) {
        setMessageText(event.target.value);
    }

    useEffect(() => {
        setMessageText("");
    }, [props.clearTextInput])

    return (
        <>
            <VerticalSpacer />
            <form id="form">
                <textarea className="w-100" id="input" autoComplete="off" value={messageText} onChange={event => { handleChange(event) }} />
                <div className="d-flex w-100 justify-content-end">
                    <button onClick={event => { props.liftMessageToSend(event, messageText) }}
                        className="btn btn-success col-sm-12 col-md-4">Send</button>
                </div>
            </form>
        </>
    )
}

export default MessageInput;