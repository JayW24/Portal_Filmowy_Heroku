import React from 'react';
import debounce from 'lodash.debounce';
import Comment from './Comment';

const commentColoursClasses = ["bg-primary", "bg-secondary", "bg-success", "bg-danger", "bg-warning", "bg-dark"];

class InfiniteComments extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            hasMore: true,
            isLoading: false,
            apods: [],
            total: null,
        }
        window.onscroll = debounce(() => {
            const {
                loadApods,
                state: {
                    error,
                    isLoading,
                    hasMore,
                },
            } = this
            if (error || isLoading || !hasMore) return null;
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !isLoading) {
                loadApods();
            }
        }, 0)
    }

    async componentDidMount() {
        try {
            const res = await fetch(`/api/pagesamount/comments/source_id=${this.props.source_id}`);
            const resultsQuantity = await res.json();
            this.setState({ total: resultsQuantity });
        }
        catch (error) {
            alert('Something went wrong!');
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.commentToRemove.comment_id !== this.props.commentToRemove.comment_id) {
            if (this.props.commentToRemove.comment_id) {
                // Remove main comment
                if (this.props.commentToRemove.parent_id === 0) {
                    this.setState({
                        apods: this.state.apods.filter(el => {
                            return el._id !== this.props.commentToRemove.comment_id;
                        })
                    }, () => {
                        this.props.resetCommentRemove();
                    })
                }
                // Remove child comment
                else {
                    let currentApods = this.state.apods;

                    currentApods.forEach(el => {
                        let childComments = el.childComments;
                        childComments && childComments.forEach((e, i) => {
                            if (e.key === this.props.commentToRemove.comment_id || e.props.data._id === this.props.commentToRemove.comment_id) {
                                delete el.childComments[i];
                            }
                        })
                    })

                    this.setState({ apods: currentApods });
                    this.props.resetCommentRemove();
                }
            }
        }

        //ADDING NEW COMMENT
        if (prevProps.commentForLift !== this.props.commentForLift) {
            if (this.props.commentForLift) {
                // MAIN COMMENT - add to top of apods array
                if (this.props.commentForLift.parent_id === 0) {
                    const apodsWithNewComment = [this.props.commentForLift].concat(this.state.apods);

                    this.setState({ apods: apodsWithNewComment }, () => {
                        this.props.resetLiftUp();
                    })
                }
                // CHILD COMMENT - add to proper apod.childComments
                else {
                    let currentApods = this.state.apods
                    currentApods.forEach(el => {
                        if (!el.childComments) {
                            el.childComments = [];
                        }
                        if (el._id === this.props.commentForLift.parent_id) {
                            const renderComToAdd = () => {
                                return <Comment
                                    commentForLift={this.props.commentForLift}
                                    data={this.props.commentForLift}
                                    liftCommentUp={this.props.liftCommentUp}
                                    removeCommentApod={this.props.removeCommentApod}
                                />
                            }
                            el.childComments = el.childComments.concat(renderComToAdd());
                        }
                    })

                    this.setState({ apods: currentApods });
                }
            }
        }
    }

    loadApods = async () => {
        try {
            if (this.state.isLoading === false) {
                const loadSpeed = 10;
                this.setState({ isLoading: true }, async () => {
                    const response = await fetch(`/api/dbquery/comments/${this.state.apods.length}/${loadSpeed}/source_id=${this.props.source_id}&parent_id=0&order=timeCreated:-1`);    //fetch next comment for film with particular ID
                    const results = await response.json();

                    if (results[0]) {
                        for (const comment of results) {
                            let bodyResults = comment;
                            const nextApod = {
                                _id: bodyResults._id, commentContent: bodyResults.commentContent, source_id: bodyResults.source_id,
                                user: bodyResults.user, timeCreated: bodyResults.timeCreated, parent_id: bodyResults.parent_id,
                                likes: bodyResults.likes, hasChild: bodyResults.hasChild
                            };

                            if (nextApod.parent_id === "0") {
                                if (nextApod.hasChild) {
                                    const response = await fetch(`/api/dbquery/comments/0/null/parent_id=${nextApod._id}`)  // fetch child comments
                                    const childComments = await response.json()
                                    nextApod.childComments = childComments.map(el => {
                                        return <Comment
                                            key={el._id}
                                            commentForLift={this.props.commentForLift}
                                            data={el}
                                            liftCommentUp={this.props.liftCommentUp}
                                            removeCommentApod={this.props.removeCommentApod}
                                        />
                                    })
                                }
                                else {
                                    nextApod.childComments = [];
                                }

                                this.setState({
                                    hasMore: (this.state.apods.length < this.state.total - 1),
                                    isLoading: false,
                                    apods: [
                                        ...this.state.apods,
                                        nextApod
                                    ]
                                })
                            }
                        }
                    }
                    else {
                        this.setState({ hasMore: false, isLoading: false });
                    }
                })
            }
        }
        catch (error) {
            alert('Something went wrong!');
        }
    }

    render() {
        const {
            error,
            hasMore,
            isLoading,
            apods
        } = this.state
        return (
            <div>
                {apods.map((apod, index) => {
                    if (apod.parent_id === "0") {
                        return (
                            <React.Fragment key={apod._id}>
                                <Comment
                                    key={apod._id}
                                    commentForLift={this.props.commentForLift}
                                    data={apod}
                                    liftCommentUp={this.props.liftCommentUp}
                                    removeCommentApod={this.props.removeCommentApod}
                                    apodColour={commentColoursClasses[index % commentColoursClasses.length]}
                                />
                            </React.Fragment>)
                    }
                    else {
                        return null;
                    }
                })}
                {apods.length > 0 ? <hr /> : null}
                {error &&
                    <div style={{ color: '#900' }}>
                        {error}
                    </div>
                }
                {isLoading &&
                    <div>Loading...</div>
                }
                {!hasMore &&
                    <div>Koniec komentarzy <i className="fas fa-check-square text-success"></i></div>
                }
            </div>
        )
    }
}

export default InfiniteComments