import React, {useState} from 'react';

export default function TestComp3(props) {
    const [headerVisible, setHeaderVisible] = useState(localStorage.getItem('toggler-visibility') === "true");

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