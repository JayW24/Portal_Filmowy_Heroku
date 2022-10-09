import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function UserConfirmation(props) {
    const params = props.match.params,
        [confirmationStatus, setConfirmationStatus] = useState('')

    useEffect(() => {
        try {
            const checkConfirmationStatus = async () => {
                const resp = await axios.get(`/api/userconfirmation/${params.username}/${params.token}`)
                if (resp.status === 200) {
                    setConfirmationStatus(resp.data)
                }
                else {
                    alert('User confirmation gone wrong!')
                }
            }
            checkConfirmationStatus()
        }
        catch (err) {
            alert('User confirmation gone wrong.')
        }
    }, [params.username, params.token])
    return (
        <div>
            {confirmationStatus}
            <h1>Przejdź do logowania.</h1>
        </div>
    )
}