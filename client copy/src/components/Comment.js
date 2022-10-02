import ReactDOM from 'react-dom';
import React, { useState, useContext } from 'react';
import CommentForm from './CommentForm';
import { Link } from 'react-router-dom';
import ConvertDate from '../services/ConvertDate';
import GenerateRandomKey from '../services/GenerateRandomKey';
import { LoginContext } from './LoginContext';
import CommentLikes from './CommentLikes';
import $ from 'jquery';
import '../styles/Comment.css';

export default function Comment(props) {
    const loginIndicator = useContext(LoginContext);
    const [collapseID, setCollapseID] = useState(null);
    const [likers, setLikers] = useState(null);
    const likersGetter = function (likers) {
        setCollapseID(likers.collapse_id);
        console.log(likers.users);
        setLikers(likers.users);
    };

    return (
        <>
            <div className="d-flex col-sm-12 someclass">
                <div className={`${props.apodColour} commentTrail mr-2`}></div>
                <div className="w-100">
                    {/*USER:  */}
                    <Link to={`/users/${props.data.user}/view-as-stranger`}>{props.data.user}</Link> {/*CZAS:  */}{ConvertDate(parseInt(props.data.timeCreated))} <br />
                    {/*COMMENT CONTENT: */}
                    {props.data.commentContent}<br />
                    <div className="d-flex w-100 justify-content-between">
                        {/*COMMENT CONTROLS*/}
                        <div>
                            {createRespondButton(props.data._id, props.data.source_id, props.data.parent_id, loginIndicator, props.liftCommentUp)}
                            {createRemoveButton(props.data.user, loginIndicator, props.data._id, props.removeCommentApod, props.data.parent_id)}
                        </div>
                        {/*COMMENT LIKES*/}
                        <div className="d-flex justify-items-center align-items-center">
                            <CommentLikes likersGetter={likersGetter} likes={props.data.likes} comment_id={props.data._id} />
                        </div>
                    </div>
                    {/*LIST OF USERS THAT LIKED PARTICULAR COMMENT*/}
                    {likers && collapseID ?
                        <div className="collapse d-flex w-100 justify-content-end" id={collapseID}>
                            <div>
                                {likers.map(user => <Link key={GenerateRandomKey(10)} className="mr-1 text-success" to={`/users/${user}`}>{user}</Link>)}
                            </div>
                        </div>
                        : null
                    }
                    {<div id={props.data._id}></div>}
                    {/*RESPONDS TO COMMENT*/}
                    <div className="pl-3 mt-2 bg-light col-sm-12 d-flex flex-column">
                        {props.data.childComments}
                    </div>
                </div>
            </div>
            <br />
        </>

    )
}

function createRespForm(parent_id, source_id, _id, login, liftCommentUp, form_id) {
    // Scroll to created form
    $([document.documentElement, document.body])
        .animate( {scrollTop: $(`#${form_id}`).offset().top - 45}, 0 );

    // Remove form
    let id = parent_id == 0 ? parent_id : _id
    ReactDOM.render(
        <CommentForm
            login={login}
            comment_id={_id}
            parent_id={parent_id}
            source_id={source_id}
            liftCommentUp={liftCommentUp}
            mainThread={false}
        />,
        document.getElementById(id))
}

function createRespondButton(_id, source_id, parent_id, login, liftCommentUp) {
    if (login == "User not authorized via email") {
        return null;
    }
    if (login) {
        let form_id = GenerateRandomKey(10);
        let id = parent_id == 0 ? _id : parent_id;
        return (
            <button id={form_id}
                className="btn btn-success"
                onClick={ () => { createRespForm(id, source_id, _id, login, liftCommentUp, form_id) }}>
                Odpowiedz
            </button>
        )
    }
    else {
        return null
    }
}

async function removeComment(comment_id, removeCommentApod, parent_id) {
    removeCommentApod({ comment_id: comment_id, parent_id: parent_id });
    let response = await fetch(`/api/deleteComment/comments/${comment_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
    if (response.status == 200) {
        alert('Comment removed!');
    }
    else {
        alert(response.text());
    }
}


function createRemoveButton(user, login, comment_id, removeCommentApod, parent_id) {
    if (user === login) {
        return <button className="btn btn-danger" onClick={() => { removeComment(comment_id, removeCommentApod, parent_id) }}>USUŃ</button>
    }
}