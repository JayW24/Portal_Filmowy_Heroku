import React, { useEffect, useReducer } from 'react';

const initialState = { users: [] };
const userToAdd = {
    "id": 11,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
            "lat": "-37.3159",
            "lng": "81.1496"
        }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
    }
};

function reducer(state, action) {
    switch (action.type) {
        case 'addUser':
            return { users: state.users.concat(action.user) };
        case 'addUsers':
            return { users: state.users.concat(action.users) };
        default:
            throw new Error();
    }
}


export default function TestComp(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const fetchUsers = async function () {
        const req = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await req.json();
        dispatch({ type: 'addUsers', users: users })
    }

    useEffect(() => {
        alert('ok')
        fetchUsers();
    }, [])

    return (
        <>
            Count: {state.users ? state.users.map(user => <div>{user.id}, {user.name}</div>) : null}
            <button onClick={() => dispatch({ type: 'addUser', user: userToAdd })}>-</button>
        </>
    );
}