import React from 'react';

function NewsCarouselCard(props) {
    return (
        <>
            <img src={props.thumbnail} alt={props.thumbnail} className="card-img-top" />
            <div className="card-body text-left p-0 m-0 text-dark">
                <h3 className="card-title p-0 m-0 text-dark">{props.title}</h3>
                <p className="card-text p-0 m-0">{props.description}</p>
            </div>
        </>
    )
}

export default NewsCarouselCard;