import React, { useState, useEffect, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';
import MessagesReverseMessage from './MessagesReverseMessage';
import { LoginContext } from "./LoginContext";
import { useHistory } from 'react-router-dom';

function MessagesReverse(props) {
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true)
    const [skip, setSkip] = useState(0);
    const limit = 10;  // amount of messages loaded when scroll up
    const scrollableDivStyle = {
        maxHeight: "70vh",
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
    };
    const loginIndicator = useContext(LoginContext)
    const history = useHistory()

    //reset skip if changed location
    useEffect(() => {
        return history.listen((location) => {
            setSkip(0)
        })
    }, [history])

    //default
    useEffect(() => {
        const onStart = async () => {
            try {
                // SET MESSAGES STATUS
                await axios.post(`/api/set-messages-status/${props.url_Params.user1}/${props.url_Params.user2}`);
                // GET MESSAGES
                let resp = await axios.get(`/api/getmessages/${props.url_Params.user1}/${props.url_Params.user2}/${skip}/${limit}`);
                let data = resp.data;
                setItems(data);
                setSkip(skip + 10);
                if (resp.data.length) {
                    setHasMore(true);
                }
                else {
                    setHasMore(false);
                }
            }
            catch (error) {
                alert('Something gone wrong...')
            }
        }
        onStart();
    }, [props.url_Params.user1, props.url_Params.user2, skip])

    // new message
    useEffect(() => {
        const newMessage = async () => {
            if (props.message) {
                const newItem = props.message
                if (!items.includes(newItem)) {                     // prevents from running multiple times error
                    let newItems = [newItem].concat(items);
                    setItems(newItems);
                }
            }
        }
        newMessage()
    }, [props.message, items])

    // set status as read in real time
    useEffect(() => {
        try {
            if (props.status && items.length > 0) {
                const messagesStatus = async () => {
                    if (props.status) {
                        let currentTime = await axios.get('/api/servertime');
                        currentTime = currentTime.data;
                        let newItems = items;
                        newItems.forEach(el => {
                            if (el.status === "missed") {
                                el.status = "read"
                                el.time_received = currentTime
                            }
                        })
                        newItems = newItems.map(el => { return { ...el, status: "read" } });
                        setItems(newItems);
                    }
                }
                messagesStatus()
            }
        }
        catch(error) {
            alert('Something went wrong...');
        }
    }, [props.status, items])

    const fetchMoreData = () => {
        try {
            setTimeout(async () => {
                if (hasMore) {
                    let resp = await axios.get(`/api/getmessages/${props.url_Params.user1}/${props.url_Params.user2}/${skip}/${limit}`)
                    if (resp.status === 200) {
                        let data = resp.data
                        if (data.length > 0) {
                            setItems(items.concat(data))
                            setSkip(skip + 10)
                            setHasMore(true)
                        }
                        else if (data.length > 0 && data.length < 10) {
                            setHasMore(true)
                        }
                        else {
                            setHasMore(false)
                        }
                    }
                    else {
                        setHasMore(false)
                    }
                }
            }, 100)
        }
        catch (error) {
            alert('Something went wrong...')
        }
    }

    if (loginIndicator) {
        return (
            <div id="scrollableDiv" style={scrollableDivStyle}>
                {String(hasMore)}
                <div className="p-0 bg-white">
                    <InfiniteScroll
                        dataLength={items.length}
                        next={fetchMoreData}
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                        hasMore={hasMore}
                        loader={<p>Loading...</p>}
                        inverse={true}
                        scrollableTarget="scrollableDiv"
                    >
                        {items.map((i, index) => (
                            <MessagesReverseMessage sender={i.sender} receiver={props.receiver} key={index}
                                index={index} content={i.content}
                                time_sent={i.time_sent} status={i.status}
                                time_received={i.time_received}
                            />
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>You are not logged in!</div>
        )
    }

}

export default MessagesReverse