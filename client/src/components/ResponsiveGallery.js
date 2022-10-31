import React from 'react';
import { SRLWrapper } from "simple-react-lightbox";
import ResponsiveGalleryCard from './ResponsiveGalleryCard';

// USE THE IMPORT BELOW INSTEAD IF YOU ARE USING THE PRO VERSION
// import { SRLWrapper } from 'simple-react-lightbox-pro'

function ResponsiveGallery(props) {
  return (
    <div className="container p-0 responsive-gallery">
      <h3 className="p-2">Galeria</h3>
      <SRLWrapper>
        <div className="d-flex p-0 m-0 card-deck row">
          {props.urls? props.urls
            .split(',')
            .map((fileName, index) => 
              <ResponsiveGalleryCard  key={`${fileName}${index}`} path={`${props.folderName}/${fileName}`}></ResponsiveGalleryCard>)
            :null}
        </div>
      </SRLWrapper>
    </div>
  )
}

export default ResponsiveGallery