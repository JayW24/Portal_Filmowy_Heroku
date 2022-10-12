import React, { useState, useContext } from 'react';
import MessengerSocket from './MessengerSocket';
import MessagesReverse from './MessagesReverse';
import MetaTags from 'react-meta-tags';
import { LoginContext } from './LoginContext';


function Messenger(props) {
    const [message, setMessage] = useState(undefined);       // lifting up message to MessagesReverse
    const [status, setStatus] = useState(undefined);         // lifting up info that user is present for change message status
    const loginIndicator = useContext(LoginContext);
    const forwardMessageToArr = (item) => {
            setMessage(item)
        };
  
    const forwardMessageStatus = (item) => {             // lift up status
        setStatus({ item: item });
    };

    const resetStatus = () => {
        setStatus(undefined);
    }

    if (loginIndicator) {
        return (
            <>
                <MetaTags>
                    <title>{props.match.params.user2} | Messages</title>
                    <meta name="description" content="Some description. Ready to become dynamic." />
                    <meta name="keywords" content="Some, random, keywords, ready, to, become, dynamic"></meta>
                    <meta property="og:title" content="MyApp" />
                    <meta property="og:image" content="path/to/image.jpg" />
                </MetaTags>
                <div className="d-flex justify-content-center">
                    <div className="d-flex col-sm-12 col-md-6 col-lg-4 flex-column">
                        <MessagesReverse url_Params={props.match.params} sender={props.match.params.user1} receiver={props.match.params.user2} message={message} status={status} resetStatus={resetStatus} />
                        <MessengerSocket sender={props.match.params.user1} receiver={props.match.params.user2} forwardMessageToArr={forwardMessageToArr} forwardMessageStatus={forwardMessageStatus} />
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <div>
                You are not logged in!
            </div>
        )
    }
}

export default Messenger;