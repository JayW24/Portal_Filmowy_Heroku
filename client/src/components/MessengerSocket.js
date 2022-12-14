import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from './SocketContext';
import { LoginContext } from './LoginContext';
import axios from 'axios';
import MessageInput from './MessageInput';

function MessengerSocket(props) {
  const [messageText, setMessageText] = useState('');
  const [response, setResponse] = useState('');
  const [clearTextInput, setClearTextInput] = useState(null);
  const [receiverID, setReceiverID] = useState('');
  const socket = useContext(SocketContext);
  const loginIndicator = useContext(LoginContext);

  function liftMessageToSend(event, messageText) {
    event.preventDefault();
    socket.emit('chat message', { content: messageText, receiver: receiverID });
  }

  // emit reading messages
  useEffect(() => {
    const abortController = new AbortController();
    const getReceiverId = async () => {
      let dat = await axios(`/api/get-user-id/${props.receiver}`);
      let receiverID = dat.data._id;
      socket.emit('read messages', receiverID);
      setReceiverID(receiverID);
    }
    getReceiverId();

    return () => {
      abortController.abort();
    };

  }, [props.receiver, socket]);


  // incoming message
  useEffect(() => {
    const abortController = new AbortController();
    socket.on('chat message', async function (msg) {
      let currentTime = await axios('/api/servertime');
      currentTime = currentTime.data;
      if (msg.userName === props.receiver || props.sender === msg.userName) {
        props.forwardMessageToArr({
          sender: msg.userName,
          time_sent: currentTime,
          time_received: msg.msg.time_received,
          content: msg.msg.content,
          status: msg.msg.status
        });
      }

      if (loginIndicator === msg.userName) {
        setClearTextInput("clear");
      }

      return () => {
        abortController.abort();
      };
      
    })

    // users are present - set all messages statuses as read
    socket.on('read messages', (senderID) => {
      props.forwardMessageStatus(senderID);
    })
  }, [])

  return (
    <MessageInput messageText={messageText} setMessageText={setMessageText}
      response={response} setResponse={setResponse} clearTextInput={clearTextInput} setClearTextInput={setClearTextInput} liftMessageToSend={liftMessageToSend}
    />
  )
}

export default MessengerSocket;