import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import '../styles/Login.css';

async function login(e, nameRef, passRef, setLoginResponse, history) {
    e.preventDefault();
    let username = nameRef.current.value;
    let password = passRef.current.value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password })
    });
  
    if (response.status == 200 && response.url == "http://localhost:3000/") {
        history.push("/")
    }
    else if (response.status == 200 && response.url == "http://localhost:3000/login?error=true") {
        setLoginResponse('Username or password is wrong!');
    }
    else {
        setLoginResponse('There is some problem with login to application. Try again later.');
    }
}

function Login() {
    const nameRef = useRef(null);
    const passRef = useRef(null);
    const [loginResponse, setLoginResponse] = useState(null);
    const history = useHistory();

    return (
        <>
            <div className="d-flex justify-content-center mt-5">
                <form className="login-form">
                    <p className="text-danger">{loginResponse}</p>
                    <div>
                        <h1>Zaloguj się</h1>
                    </div>
                    <div class="form-group">
                        <label>Nazwa użytkownika: </label>
                        <input
                            ref={nameRef}
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter your username"
                            required />
                    </div>
                    <div class="form-group">
                        <label>Hasło:</label>
                        <input
                            ref={passRef}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            required />
                    </div>
                    <div>
                        <input type="submit" value="Login" onClick={e => login(e, nameRef, passRef, setLoginResponse, history)} />
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;