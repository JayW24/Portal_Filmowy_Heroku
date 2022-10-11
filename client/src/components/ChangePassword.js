import React, { useState } from 'react';
import axios from 'axios';
import checkPassword from '../services/checkPassword';
import VerticalSpacer from './VerticalSpacer';

function ChangePassword() {
    const [oldPass, setOldPass] = useState(null);
    const [newPass, setNewPass] = useState(null);
    const [passwordChangeResponse, setpasswordChangeResponse] = useState(null);
    const [newPasswordValidation, setNewPasswordValidation] = useState(false);
    const [oldPasswordValidation, setOldPasswordValidation] = useState(false);
    const [newPasswordCheck, setNewPasswordCheck] = useState('');
    const [oldPasswordCheck, setOldPasswordCheck] = useState('');

    const onSubmit = async (event) => {
        try {
            event.preventDefault();
            const response = await axios.put('/api/editpassword', { oldPass: oldPass, newPass: newPass });
            setpasswordChangeResponse(response.data);
        }
        catch (error) {
            alert('error!')
            setpasswordChangeResponse('Something went wrong...');
        }
    }

    return (
        <>
            <p>
                <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#passwordEditCollapse"
                    aria-expanded="false" aria-controls="passwordEditCollapse">
                    Zmień hasło
                </button>
            </p>
            <div class="collapse" id="passwordEditCollapse">
                <form onSubmit={(event) => { onSubmit(event) }}>
                    <span>Stare hasło:</span>
                    <input type="text" name="oldPass" onChange={event => {
                        setOldPass(event.target.value);
                        checkPassword(event, setOldPasswordCheck, setOldPasswordValidation);
                    }} />
                    {oldPasswordCheck}<br /><br />
                    <span>Nowe hasło:</span>
                    <input type="text" name="newPass" onChange={event => {
                        setNewPass(event.target.value);
                        checkPassword(event, setNewPasswordCheck, setNewPasswordValidation);
                    }} />
                    {newPasswordCheck}
                    <VerticalSpacer />
                    <input type="submit" className="btn btn-primary" disabled={!(newPasswordValidation && oldPasswordValidation)} />
                </form>
                {passwordChangeResponse}
            </div>
        </>
    )
}

export default ChangePassword