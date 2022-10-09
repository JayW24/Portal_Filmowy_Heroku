import React from 'react'

function ResponsiveGalleryImage(props) {
    return (
                <img className="responsive-gallery-image border-0 card-img-top img-fluid" src={props.src} alt={props.src} />
    )
}

export default ResponsiveGalleryImage