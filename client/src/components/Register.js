import React, { useState, useEffect, useContext } from 'react'
import checkPassword from '../services/checkPassword'
import checkAbout from '../services/checkAbout'
import checkUsername from '../services/checkUsername'
import checkEmail from '../services/checkEmail'
import checkFrom from '../services/checkFrom'
import { LoginContext } from './LoginContext'
import handleDateOfBirthChange from '../services/handleDateOfBirthChange'
import '../styles/Register.css'


function Register() {
    const loginIndicator = useContext(LoginContext),
        [userName, setUserName] = useState(''),
        [userNameCheck, setUserNameCheck] = useState(''),
        [userNameValidation, setUserNameValidation] = useState(false),
        [userPassword, setUserPassword] = useState(''),
        [passwordCheck, setPasswordCheck] = useState(''),
        [passwordValidation, setPasswordValidation] = useState(false),
        [email, setUserEmail] = useState(''),
        [emailCheck, setEmailCheck] = useState(''),
        [emailValidation, setEmailValidation] = useState(false),
        [from, setFrom] = useState(''),
        [fromCheck, setFromCheck] = useState(''),
        [fromValidation, setFromValidation] = useState(false),
        [dateofbirth, setDateOfBirth] = useState(''),
        [dateOfBirthCheck, setDateOfBirthCheck] = useState(''),
        [dateOfBirthValidation, setDateOfBirthValidation] = useState(false),
        [about, setAbout] = useState(''),
        [aboutCheck, setAboutCheck] = useState(''),
        [aboutValidation, setAboutValidation] = useState(false),
        [registerResult, setRegisterResult] = useState(null),
        [sendAccess, setSendAccess] = useState(true)

    useEffect(() => {
        if (userNameValidation && passwordValidation && emailValidation && fromValidation && dateOfBirthValidation && aboutValidation) {
            setSendAccess(false)
        }
        else {
            setSendAccess(true)
        }
    })


    if (registerResult) {
        return (
            <div>
                {registerResult}
            </div>
        )
    }
    else {
        if (!loginIndicator) {
            return (
                <div className="d-flex container justify-content-center section-block">
                    <form className="d-flex flex-column col-sm-12 col-md-6" onSubmit={event => handleSubmit(event, { ...userName, ...userPassword, ...email, ...dateofbirth, ...about, ...from }, setRegisterResult)}>
                    <h2>Rejestracja</h2>
                    <hr/>
                        {/*USERNAME*/}
                                <input className="register-input" placeholder="Nazwa użytkownika" type="text" name="username" onKeyUp={event => {
                                    handleChange(event, setUserName)
                                    checkUsername(event, setUserNameCheck, setUserNameValidation)
                                }} />
                                {userNameCheck} <br />
                        {/*PASSWORD*/}
                        <input className="register-input" placeholder="Hasło" type="password" name="password" onChange={event => {
                            handleChange(event, setUserPassword)
                            checkPassword(event, setPasswordCheck, setPasswordValidation)
                        }} />
                        {passwordCheck}<br />
                        {/*DATE-OF-BIRTH*/}
                        <label className="register-label" for="dateofbirth">Data urodzenia:</label>
                        <input className="register-input" type="datetime-local" name="dateofbirth" onChange={
                            (event) => {
                                handleDateOfBirthChange(event, setDateOfBirth, setDateOfBirthCheck, setDateOfBirthValidation)
                            }
                        } />
                        {dateOfBirthCheck}<br />
                        {/*EMAIL*/}
                        <input className="register-input" placeholder="Adres e-mail" type="email" name="email" onChange={event => {
                            handleChange(event, setUserEmail)
                            checkEmail(event, setEmailCheck, setEmailValidation)
                        }} />
                        {emailCheck}<br />
                        {/*FROM*/}
                        <input className="register-input" placeholder="Miejsce zamieszkania" type="text" name="from" onKeyUp={event => {
                            handleChange(event, setFrom, setFromCheck)
                            checkFrom(event, setFromCheck, setFromValidation)
                        }} />
                        {fromCheck}<br />
                        {/*ABOUT*/}
                        <input className="register-input" placeholder="O sobie" type="text" name="about" onChange={event => {
                            handleChange(event, setAbout)
                            checkAbout(event, setAboutCheck, setAboutValidation)
                        }} />
                        {aboutCheck}<br />
                        <input className="register-input btn btn-primary" type="submit" value="Zarejestruj" disabled={sendAccess} />
                    </form>
                </div>
            )
        }
        else {
            return <div className="container">Jesteś już zalogowany!</div>
        }
    }
}

function handleChange(event, setUserData) {
    setUserData({ [event.target.name]: event.target.value })
}



async function handleSubmit(event, userData, setRegisterResult) {
    try {
        event.preventDefault();
        const resp = await fetch(`/api/newUser/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // We convert the React state to JSON and send it as the POST body
            body: JSON.stringify(userData)
        })
        setRegisterResult(resp.url)
    }
    catch(err) {
        alert('Register error!')
    }
}

export default Register