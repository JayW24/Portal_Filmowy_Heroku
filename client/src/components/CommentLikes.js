import React, { useState, useEffect, useContext } from 'react';
import GenerateRandomKey from '../services/GenerateRandomKey';
import axios from 'axios';
import { LoginContext } from './LoginContext';

function CommentLikes(props) {
    const _id = GenerateRandomKey(10);
    const collapse_id = GenerateRandomKey(10);
    const [likesAmount, setLikesAmount] = useState(null);
    const [commentLiked, setCommentLiked] = useState(false);
    const loginIndicator = useContext(LoginContext);
    const [usersLiked, setUsersLiked] = useState('secondary');

    useEffect(() => {
        const fetchLike = async () => {
            if (loginIndicator) {
                let resp = await axios.get(`/api/checkifuserlikedcomment/${props.comment_id}`);
                if (resp.status === 200) {
                    setCommentLiked(resp.data);
                }
                else {
                    alert('User likes error.');
                }
            }
        }

        try {
            // Check if comment is liked by user
            fetchLike();
        }
        catch (error) {
            alert('Something went wrong!');
        }
    }, [loginIndicator, props.comment_id])


    useEffect(() => {
        setLikesAmount(props.likes);
        setUsersLiked(usersThatLikedButtonStyle(props.likes));
    }, [props.likes])

    return (
        <div id={_id} className="d-flex justify-items-center align-items-center">
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
                onClick={event => { showUsersThatLiked(event, props.comment_id, collapse_id, props.likersGetter) }}
                className={`btn btn-${usersLiked}`} data-toggle="collapse" data-target={`#${collapse_id}`} aria-expanded="false"
                aria-controls={collapse_id}>
                <i className="fas fa-users text-white"></i>
            </button>
        </div>
    )
}

async function showUsersThatLiked(event, comment_id, collapse_id, likersGetter) {
    try {
        event.preventDefault();
        const data = await axios.get(`/api/comment_likes/${comment_id}`);
        let users = data.data;
        users = users.split(', ');
        likersGetter({ users: users, collapse_id: collapse_id });
    }
    catch (error) {
        alert('Something went wrong!');
    }
}


async function likeComment(event, comment_id, setLikesAmount, commentLiked, setCommentLiked, setUsersLiked) {
    try {
        event.preventDefault();
        let data = await axios.post(`/api/comment_likes/post/${comment_id}`);
        if (data.data === "Nie jesteś zalogowany.") {
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
    if (amount > 0) {
        return 'primary';
    }
    else {
        return 'secondary';
    }
}

function usersThatLikedButtonStyleState(amount) {
    if (amount > 0) {
        return false;
    }
    else {
        return true;
    }
}


function commentLikedStyler(data) {
    if (data) {
        return 'btn-success';
    }
    else {
        return 'btn-outline-success';
    }
}

export default CommentLikes;