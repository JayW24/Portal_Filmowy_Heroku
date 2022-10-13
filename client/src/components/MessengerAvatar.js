import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MessengerAvatar(props) {
    const [avatarPath, setAvatarPath] = useState(null);
    const defaultPath = '/img/avatars/defaultAvatar.jpg';

    useEffect(() => {
        const fetchPath = async () => {
            try {
                if(localStorage.getItem(props.name)) {
                    setAvatarPath(localStorage.getItem(props.name));
                    return;
                }

                const req = await axios.get(`/api/user-avatar/${props.name}`);
                const path = req.data;

                setAvatarPath(`${path}`);
                localStorage.setItem(props.name, `${path}`);
            }
            catch (error) {
                alert('Something gone wrong!');
            }
        }
        fetchPath();
    }, [props.name])

    return (
        <>
            {avatarPath && <img src={avatarPath === 'default' ? defaultPath : avatarPath} alt='User avatar' class="rounded-circle bg-secondary img-fluid avatarWrapper" />}
        </>
    )
}