import React, {useEffect, useState} from 'react';

export default function TestComp3(props) {
    const [headerVisible, setHeaderVisible] = useState(localStorage.getItem('toggler-visibility') === "true");

    useEffect(() => {
        console.log('fetching...')
        callApi = async () => {
            const response = await fetch('/api/hello');
            const body = await response.json();
        
            if (response.status !== 200) throw Error(body.message);
        
            console.log(body);
          };
    }, []);

    const handleToggle = function() {
        localStorage.setItem('toggler-visibility', !headerVisible);
        setHeaderVisible(!headerVisible);
    }

    return (
        <div>
            {headerVisible? <h1>Header</h1> : null}
            {}
            <button onClick={handleToggle}>Toggle Header</button>
        </div>
    )
}