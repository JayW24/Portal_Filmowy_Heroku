import { LoginContext } from './LoginContext';
import React, { useState, useEffect, useContext } from 'react';
import MessagesPreviewMessage from './MessagesPreviewMessage';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { SocketContext } from './SocketContext';

async function getPreviewData(setMessagesData) {
    try {
        const result = await axios('/api/messagespreview/0/3');
        let data = result.data;
        setMessagesData(data);
    }

    catch (err) {
        alert('Something gone wrong...');
    }
}

function MessagesPreview() {
    const loginIndicator = useContext(LoginContext);
    const [messagesData, setMessagesData] = useState([]);
    const socket = useContext(SocketContext);

    useEffect(() => {
        getPreviewData(setMessagesData);
    }, [])

    // socket context for notifications. Count new messages.
    useEffect(() => {
        // todo: handle the incoming message more efficiently
        socket.on('chat message', async function (msg) {
            getPreviewData(setMessagesData);
        })
    }, [loginIndicator, socket])

    // both users are online
    useEffect(() => {
        // todo: if message is visible in small preview, change it's state
        socket.on('read messages', async (senderID) => {getPreviewData(setMessagesData)});
    }, [messagesData, socket])

    if (messagesData) {
        return (
            <div>
                {messagesData.map(messageData => <MessagesPreviewMessage key={`message_${messageData._id}`} login={loginIndicator} data={messageData} />)}
                <hr style={{marginBottom: "10px"}}/>
                <Link to={'/messagespreviewbig'}>ZOBACZ WSZYSTKIE</Link>
            </div>
        )
    }
    else {
        return (
            <div>You have no messages yet!</div>
        )
    }
}

export default MessagesPreview;