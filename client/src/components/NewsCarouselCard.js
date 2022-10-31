import React from 'react';
import ImageLoading from './ImageLoading';

const noImageStyle = {
    height: '300px',
    width: '100%'
  }

function NewsCarouselCard(props) {
    return (
        <>
            <ImageLoading src={props.thumbnail} className_="card-img-top" style_={noImageStyle} alt_={props.thumbnail}/>
            <div className="card-body text-left p-0 m-0 text-dark">
                <h3 className="card-title p-0 m-0 text-dark">{props.title}</h3>
                <p className="card-text p-0 m-0">{props.description}</p>
            </div>
        </>
    )
}

export default NewsCarouselCard;