import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from './LoginContext';

function CommentLikes(props) {
    const [likesAmount, setLikesAmount] = useState(null);
    const [commentLiked, setCommentLiked] = useState(false);
    const loginIndicator = useContext(LoginContext);
    const [usersLiked, setUsersLiked] = useState('secondary');

    const fetchLike = async () => {
        if (loginIndicator) {
            let resp = await axios.get(`/api/checkifuserlikedcomment/${props.comment_id}`);
            if (resp.status == 200) {
                setCommentLiked(resp.data);
            }
            else {
                alert('User likes error.');
            }
        }
    }

    useEffect(() => {
        const abortController = new AbortController();

        try {
            // Check if comment is liked by user
            fetchLike();
        }
        catch (error) {
            alert('Something went wrong!');
        }

        return () => {
            abortController.abort();
        };
        
    }, [])

    useEffect(() => {
        setLikesAmount(props.likes);
        setUsersLiked(usersThatLikedButtonStyle(props.likes));
    }, [props.likes])

    return (
        <div className="d-flex justify-items-center align-items-center">
            {/*LIKE BUTTON*/}
            {loginIndicator &&
                <button onClick={event => { likeComment(event, props.comment_id, setLikesAmount, commentLiked, setCommentLiked, setUsersLiked) }}
                    className={`btn ${commentLikedStyler(commentLiked)}`}>
                    <strong>+</strong>
                </button>
            }

            {/*LIKES AMOUNT*/}
            <div className="ml-1 mr-1">{likesAmount}</div>

            {/*USERS THAT LIKED*/}
            <button disabled={usersThatLikedButtonStyleState(likesAmount)}
                onClick={event => { showUsersThatLiked(event, props.comment_id, props.likersGetter) }}
                className={`btn btn-${usersLiked}`} data-toggle="collapse" data-target={`#${props.comment_id}`} aria-expanded="false"
                aria-controls={props.comment_id}>
                <i className="fas fa-users text-white"></i>
            </button>
        </div>
    )
}

async function showUsersThatLiked(event, comment_id, likersGetter) {
    try {
        event.preventDefault();
        const data = await axios.get(`/api/comment_likes/${comment_id}`);
        let users = data.data;
        users = users.split(', ');
        likersGetter({ users: users, collapse_id: comment_id });
    }
    catch (error) {
        alert('Something went wrong!');
    }
}


async function likeComment(event, comment_id, setLikesAmount, commentLiked, setCommentLiked, setUsersLiked) {
    try {
        event.preventDefault();
        let data = await axios.post(`/api/comment_likes/post/${comment_id}`);
        if (data.data == "Nie jesteś zalogowany.") {
            alert(data.data);
        }
        else {
            setLikesAmount(data.data.newLikesAmount);
            setCommentLiked(!commentLiked);
            setUsersLiked(usersThatLikedButtonStyle(data.data.newLikesAmount));
        }
    }
    catch (error) {
        alert('Something went wrong!');
    }
}

function usersThatLikedButtonStyle(amount) {
    return amount > 0 ? 'primary' : 'secondary';
}

function usersThatLikedButtonStyleState(amount) {
    return amount > 0 ? false : true;
}


function commentLikedStyler(data) {
    return data? 'btn-success' : 'btn-outline-success';
}

export default CommentLikes;