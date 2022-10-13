import { LoginContext } from './LoginContext';
import React, { useEffect, useState, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';
import MessagesPreviewBigConversation from './MessagesPreviewBigConversation';
//todo: implement updating messages states etc. by using socket context

function MessagesPreviewBig(props) {
    const loginIndicator = useContext(LoginContext);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [skip, setSkip] = useState(0);
    const [dataFetched, setDataFetched] = useState(false);
    const limit = 5;

    useEffect(() => {
        try {
            const onStart = async () => {
                const resp = await axios.get(`/api/messagespreview/${skip}/${limit}`);
                const data = resp.data;

                setItems(data);
                setSkip(skip + 5);
                if (resp.data.length > 0) {
                    resp.data.length < 5 ? setHasMore(false) : setHasMore(true);
                }
                else {
                    setHasMore(false);
                }

                //resp.data.length > 0 ? setHasMore(true) : setHasMore(false);
                setDataFetched(true);
            }
            onStart();
        }
        catch (error) {
            alert('Something went wrong!');
        }
    }, [])

    const fetchMoreData = async () => {
        try {
            if (hasMore) {
                console.log(`/api/messagespreview/${skip}/${limit}`);
                const resp = await axios.get(`/api/messagespreview/${skip}/${limit}`);
                const data = resp.data;
                if (data.length > 0) {
                    setItems(items.concat(data));
                    setSkip(skip + 5);
                    setHasMore(true);
                }
                else {
                    setHasMore(false);
                }
            }
        }
        catch (error) {
            alert('Something went wrong!');;
        }
    };

    return (
        <div className="container">
            {loginIndicator ?
                <div>
                    <InfiniteScroll
                        dataLength={items.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={<p>Loading...</p>}
                    >
                        {items.map((i, index) => (
                            <MessagesPreviewBigConversation key={index}
                                content={i.content} sender={i.sender} receiver={i.receiver}
                                time_sent={i.time_sent}
                                time_received={i.time_received} status={i.status} />
                        ))}
                    </InfiniteScroll>
                    {!hasMore && items.length > 0 && dataFetched > 0 && <div className="font-italic">Nie ma więcej wiadomości.</div>}
                    {!hasMore && items.length > 0 && dataFetched === 0 && <div className="font-italic">Nie masz żadnych wiadomości.</div>}
                </div>
                : <p className="font-italic ml-2">Nie jesteś zalogowany!</p>
            }
        </div>
    )
}

export default MessagesPreviewBig
