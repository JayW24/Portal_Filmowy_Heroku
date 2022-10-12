import React from 'react';
import { LoginContext } from './LoginContext';
import '../styles/CommentForm.css';
import GenerateRandomKey from '../services/GenerateRandomKey';

class CommentForm extends React.Component {
    static contextType = LoginContext
    constructor(props) {
        super(props)
        this.state = {
            commentContent: '',
            source_id: this.props.source_id,
            parent_id: this.props.parent_id,
            active: true
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async (event, form) => {
        try {
            event.preventDefault();
            const liftUp = this.props.liftCommentUp;
            const liftUpData = { ...this.state, user: this.props.login };
            const resp = await fetch(`/api/comment/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            });
            const newID = await resp.json();

            liftUp({ ...liftUpData, likes: 0, _id: newID });

            if (form.state.parent_id == 0) {
                form.setState( {commentContent: ''} );
            }
            else {
                form.setState( {commentContent: '', active: false} );
            }
        }
        catch (error) {
            alert('Something gone wrong.');
        }
    }

    // remove specific comment form
    removeCommentForm() {
        this.setState({ active: false });
    }

    componentWillReceiveProps() {
        this.setState({ active: true });
    }

    render() {
        if (this.props.login && this.state.active) {
            let formID = GenerateRandomKey(10)
            return (
                <form id={formID} className="w-100" onSubmit={event => { this.handleSubmit(event, this) }}>
                    <div className="d-flex">
                        <label className=" col-sm-12 p-0 m-0 d-flex flex-column">
                            <textarea
                                className="commentInput m-0 p-0"
                                type="text"
                                value={this.state.commentContent}
                                name="commentContent"
                                onChange={this.handleChange}
                            />
                            <div className="d-flex w-100 p-0 m-0">
                                <input className={`btn btn-success ${this.props.mainThread ? `col-sm-12` : `col-sm-10`} p-0 m-0`} type="submit" value="Opublikuj" />
                                {this.props.mainThread ? null : <button onClick={() => { this.removeCommentForm(formID) }} className="btn btn-secondary col-sm-2 p-0 m-0 border-none remove-comment-input" type="button">X</button>}
                            </div>
                        </label>
                    </div>
                </form>
            )
        }
        else {
            return null;
        }
    }
}

export default CommentForm;