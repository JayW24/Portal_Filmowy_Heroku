import React from 'react'
function ratePossibility(userRatingValue, loginIndicator) {
    if (loginIndicator) {
        return (
            <div>
                <h6>Twoja ocena: {userRatingValue}</h6>
                <input className="btn btn-primary rate-button col-sm-6 col-md-4" type="submit" value="Oceń" />
            </div>
        )
    }
    else {
        return (
            <>
                <br/>
                <a className="font-italic" href="/login">
                    Zaloguj się aby ocenić <i className="fas fa-sign-in-alt"></i>
                </a>
            </>
        )
    }
}

export default ratePossibility