import React from 'react';
import ResponsiveGalleryImage from './ResponsiveGalleryImage';

function ResponsiveGalleryCard(props) {
    return (
        <a href={props.path} className="card p-0 m-0 border-0" style={{maxWidth: "50%", height: "auto"}}>
            <ResponsiveGalleryImage src={props.path} />
        </a>
    )
}

export default ResponsiveGalleryCard;