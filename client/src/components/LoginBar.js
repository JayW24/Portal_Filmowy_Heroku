import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MessagesPreview from './MessagesPreview';
import { Link } from 'react-router-dom';
import { LoginContext } from './LoginContext';
import { SocketContext } from './SocketContext';
import { useHistory } from "react-router-dom";
import HideWhenClickedOutside from '../services/HideWhenClickedOutsite';
import '../styles/LoginBar.css';

const loginBar = { backgroundColor: 'black', color: 'white' };
const loginBarClasses = 'container d-flex justify-content-end';
const loginStyle = { marginLeft: '10px' };
const LoggedAs = { color: '#cfcfcf' };

async function logout(e, history, fetchUserName) {
    e.preventDefault();
    const logout = await axios.get('/api/logout');
    if (logout.status == 200) {
        await fetchUserName();
        history.push('/')
    }
    else {
        alert('Logout problem');
    }
}

function LoginBar(props) {
    const loginIndicator = useContext(LoginContext);
    const [unreadMessagesAmount, setUnreadMessagesAmount] = useState(0);
    const socket = useContext(SocketContext);
    const [newMessages, setNewMessages] = useState([]);
    const history = useHistory();

    const fetchData = async () => {
        if (loginIndicator) {
            const amount = await axios(`/api/get-unread-messages/${loginIndicator}`);
            setUnreadMessagesAmount(amount.data);
        }
    }

    // fetch amount of unread messages
    useEffect(() => {
        try {
            fetchData();
        }
        catch (error) {
            alert('Something went wrong!');
        }
    }, [loginIndicator])

    // Socket context for notifications. Count new messages.
    useEffect(() => {
        if (socket) {
            try {
                socket.on('chat message', async function (msg) {
                    if (loginIndicator) {
                        let newArr = newMessages;

                        if (!newArr.includes(msg.sender) && msg.msg.status !== 'read' && msg.userName !== loginIndicator) {
                            newArr.push(msg.sender);
                            setNewMessages(newArr);
                            setUnreadMessagesAmount(newMessages.length);
                        }
                    }
                })
                socket.on('read messages', async () => {
                    if (loginIndicator) {
                        const amount = await axios(`/api/get-unread-messages/${loginIndicator}`);
                        setUnreadMessagesAmount(amount.data);
                    }
                })
            }
            catch (error) {
                alert('Something went wrong!');
                console.log('bad error: ');
                console.log(error);
            }
        }
    }, [loginIndicator])

    //MESSAGES PREVIEW HIDING IF CLICKED OUTSIDE
    useEffect(() => {
        HideWhenClickedOutside('#messagesPreviewCollapse');
    }, [])


    // user not authorized
    if (loginIndicator === "User not authorized via email") {
        alert('Potrzebna autoryzacja! Sprawdź swój adres email.');
        return (
            <div style={loginBar}>
                <div className={loginBarClasses}>
                    <div className="">
                        <span><strong>Wymagana autoryzacja!</strong></span>
                        <Link onClick={e => { logout(e, history, props.fetchUserName) }} to={`/`} className="ml-2">
                            <i className="fas fa-sign-out-alt"></i>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // user authorized
    if (loginIndicator) {
        return (
            <div style={loginBar} className="p-0 m-0">
                <div className="container d-flex justify-content-end">
                    <div className="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-between p-0 m-0">
                        <span style={LoggedAs}>
                            Zalogowano jako: <strong>{loginIndicator}</strong>
                        </span>
                        <a href={`/users/${loginIndicator}`}>
                            <i className="fas fa-user-alt"></i>
                        </a>

                        <a data-toggle="collapse" href="#messagesPreviewCollapse" role="button" aria-expanded="false" aria-controls="messagesPreviewCollapse" className="navbar-toggle" id="toggle">
                            <i className="fa-brands fa-forumbee"><span className="unreadMessagesAmount">{unreadMessagesAmount}</span></i>
                        </a>

                        <div className="collapse position-absolute w-100" id="messagesPreviewCollapse" style={{ zIndex: 10000, marginTop: "25px" }}>
                            <div className="bg-white text-primary">
                                <MessagesPreview login={loginIndicator}></MessagesPreview>
                            </div>
                        </div>

                        <Link onClick={e => { logout(e, history, props.fetchUserName) }} to={`/`} className="ml-2">
                            <i className="fas fa-sign-out-alt"></i>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    // user not registered
    else {
        return (
            <div style={loginBar}>
                <div className={loginBarClasses}>
                    <div className="">
                        <a href="/register">Rejestracja |</a>
                        <a href="/login">
                            <span><strong> Zaloguj się</strong></span>
                            <i className="fas fa-sign-in-alt" style={loginStyle}></i>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}


export default LoginBar;
