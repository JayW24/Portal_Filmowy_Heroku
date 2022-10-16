import { LoginContext } from './LoginContext';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UploadAvatar from './UploadAvatar';
import ConvertDate from '../services/ConvertDate';
import ChangePassword from "./ChangePassword";
import { Link } from 'react-router-dom';
import checkFrom from '../services/checkFrom';
import checkAbout from '../services/checkAbout';
import UserProp from './UserProp';
import VerticalSpacer from './VerticalSpacer';
import UserEditableField from './UserEditableField';
import Spinner from './Spinner';

const avatarImgStyle = { borderRadius: "50%", maxHeight: "200px", maxWidth: "200px", border: "1px solid #fff" };

async function handleSubmit(event, userData) {
    event.preventDefault();
    const response = await fetch(`/api/editUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We convert the React state to JSON and send it as the POST body
        body: JSON.stringify(userData)
    })
    if (response.status === 200) {
        alert(response.statusText)
        return response.json()
    }
    else {
        alert('Update user data error.')
    }
}

function handleChange(event, setUserData) {
    setUserData(event.target.value)
}

function UserProfile(props) {
    const loginIndicator = useContext(LoginContext);
    const [userData, setUserData] = useState(null);
    const [about, setAbout] = useState('');
    const [CurrentAbout, setCurrentAbout] = useState('');
    const [aboutCheck, setAboutCheck] = useState('');
    const [aboutValidation, setAboutValidation] = useState(true);
    const [sendAccess, setSendAccess] = useState(false);
    const [from, setFrom] = useState('');
    const [CurrentFrom, setCurrentFrom] = useState('');
    const [fromCheck, setFromCheck] = useState('');
    const [fromValidation, setFromValidation] = useState(true);
    const [dataFetched, setDataFetched] = useState(null);
    const [userNotFound, setUserNotFound] = useState(false);
    const params = props.match.params;
    const view = props.match.params.view;
    const defaultPath = '/img/avatars/defaultAvatar.jpg';

    const setNewPath = (newPath) => {
        if (newPath) {
            setUserData({ ...userData, avatar: newPath });
        }
        else {
            alert('Error during avatar change...');
        }
    }

    useEffect(() => {
        // Front end validation
        (aboutValidation && fromValidation && (about !== CurrentAbout || from !== CurrentFrom)) ? setSendAccess(true) : setSendAccess(false);
    }, [aboutValidation, fromValidation, setSendAccess, CurrentAbout, CurrentFrom, about, from])

    useEffect(() => {
        const fetchData = async () => {
            try {
                var result = await axios.get(`/api/userDetails/${params.username}`);
            }
            catch (err) {
                if (err.response.status === 404) {
                    setUserNotFound(true);
                    return;
                }
            }

            if (result.status === 200) {
                const userData = result.data[0];
                setUserData(userData);
                setAbout(userData.about);
                setFrom(userData.from);
                setCurrentAbout(userData.about);
                setCurrentFrom(userData.from);
                setDataFetched(true);
            }
            else {
                alert('Get user details error!');
            }
        }

        try {
            fetchData();
        }
        catch (error) {
            alert('User profile error!');
        }
    }, [params.username])

    // User logged in - edit profile
    if (userNotFound) {
        return (<div className=" container section-block"><h1 className="display-6">User not found!</h1></div>)
    }
    if (loginIndicator === params.username && view === undefined) {
        return (
            dataFetched ?
                <div class="container section-block p-2 user-profile">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <h1>Twój profil</h1>
                        <Link to={`/users/${params.username}/view-as-stranger`}>Wyświetl jako gość</Link>
                        <strong>{userData.username}</strong><br />
                        <img style={avatarImgStyle} className="col-lg-2" src={userData.avatar ? userData.avatar : defaultPath} alt={userData.avatar ? userData.avatar : "userAvatar"} /><br />
                        <UploadAvatar login={loginIndicator} setNewPath={setNewPath} />
                        <VerticalSpacer />
                    </div>
                    <div>
                        <h1 className="font-italic">Dane użytkownika:</h1> <br />
                        <UserProp name={'Data urodzenia'} value={ConvertDate(userData.dateofbirth)} />
                        <UserProp name={'Ilość komentarzy'} value={userData.commentsamount} />
                        <UserProp name={'Ilość ocen'} value={userData.ratingsamount} />
                    </div>
                    <hr />
                    <form onSubmit={event => handleSubmit(event, { about, from })}>
                        <h1 className="font-italic">Edytuj profil:</h1>
                        <br />
                        <ChangePassword />
                        <UserEditableField name="Pochodzenie" defaultValue={from} handleChange={handleChange} setVal={setFrom} checkVal={checkFrom} setValCheck={setFromCheck} setValValidation={setFromValidation} valCheck={fromCheck} />
                        <UserEditableField name="O mnie" defaultValue={about} handleChange={handleChange} setVal={setAbout} checkVal={checkAbout} setValCheck={setAboutCheck} setValValidation={setAboutValidation} valCheck={aboutCheck} />
                        <button className="btn btn-primary w-100 border-0" type="submit" disabled={!sendAccess}>Zmień dane</button>
                    </form>
                    <VerticalSpacer />
                </div>
                : <Spinner />
        )
    }
    // User not logged in - view as stranger
    else {
        return (
            dataFetched ?
                <div class="container section-block">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        {loginIndicator !== params.username ? <Link to={`/messenger/${loginIndicator}/${params.username}`}>Napisz wiadomość</Link> : null}
                        {loginIndicator === params.username ? <Link to={`/users/${params.username}`}>Edytuj profil</Link> : null}
                        <strong>{userData.username}</strong><br />
                        <img style={avatarImgStyle} className="col-lg-2" src={userData.avatar ? userData.avatar : defaultPath} alt={userData.avatar ? userData.avatar : "userAvatar"} />
                        <br />
                    </div>
                    <div className="d-flex flex-wrap justify-content-center flex-column bg-light">
                        <UserProp name={'Data urodzenia'} value={ConvertDate(userData.dateofbirth)} />
                        <UserProp name={'Ilość komentarzy'} value={userData.commentsamount} />
                        <UserProp name={'Ilość ocen'} value={userData.ratingsamount} />
                        <UserProp name={'Z'} value={userData.from} />
                        <UserProp name={'O użytowniku'} value={userData.about} />
                    </div>
                </div>
                : <Spinner />
        )
    }
}

export default UserProfile;