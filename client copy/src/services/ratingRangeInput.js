import React from 'react'
export default function ratingRangeInput(login, initialValue, setUserRatingValue) {
    if (login) {
        return (
            <div>
                <input className="col-sm-6 col-md-4" id="range-input" type="range" min="1" max="10" value={initialValue} onChange={() => { setUserRatingValue(document.getElementById('range-input').value) }} /> <br />
            </div>
        )
    }
}