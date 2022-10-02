import { LoginContext } from './LoginContext';
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';
import MessagesPreviewBigConversation from './MessagesPreviewBigConversation';
//todo: implement updating messages states etc. by using socket context

class MessagesPreviewBig extends React.Component {
    static contextType = LoginContext
    state = {
        items: [],
        hasMore: true,
        skip: 0,
        limit: 5
    };

    async componentDidMount() {
        try {
            const resp = await axios.get(`/api/messagespreview/${this.state.skip}/${this.state.limit}`);
            const data = resp.data;

            this.setState({
                items: data,
                skip: this.state.skip + 5
            })

            if (resp.data !== []) {
                this.setState({ hasMore: true });
            }
            else {
                this.setState({ hasMore: false });
            }
        }
        catch (error) {
            alert('Something went wrong!');
        }
    }

    fetchMoreData = async () => {
        try {
            if (this.state.hasMore) {
                console.log(`/api/messagespreview/${this.state.skip}/${this.state.limit}`);
                const resp = await axios.get(`/api/messagespreview/${this.state.skip}/${this.state.limit}`);
                const data = resp.data;
                if (data.length > 0) {
                    this.setState(
                        {
                            items: this.state.items.concat(data),
                            skip: this.state.skip + 5,
                            hasMore: true
                        })
                }
                else if (data.length > 0 && data.length < 10) {
                    this.setState({ hasMore: false });
                }
                else {
                    this.setState({ hasMore: false });
                }
            }
        }
        catch (error) {
            alert('Something went wrong!');
        }
    };

    render() {
        return (
            <div className="container">
                <InfiniteScroll
                    dataLength={this.state.items.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMore}
                    loader={<p>Loading...</p>}
                >
                    {this.state.items.map((i, index) => (
                        <MessagesPreviewBigConversation key={index}
                            content={i.content} sender={i.sender} receiver={i.receiver}
                            time_sent={i.time_sent}
                            time_received={i.time_received} status={i.status} />
                    ))}
                </InfiniteScroll>
                {!this.state.hasMore && <div className="font-italic">Nie ma więcej wiadomości.</div>}
            </div>
        )
    }
}

export default MessagesPreviewBig
