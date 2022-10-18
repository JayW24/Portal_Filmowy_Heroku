import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

function PhotosSwiper(props) {
    let swiperData = props.swiperData
    swiperData = swiperData.map(dataFragment =>
        <SwiperSlide><img className="img-fluid" src={`${props.photosDir}${dataFragment}`} /></SwiperSlide>
    )
    return (
        <Swiper
            spaceBetween={50}
            slidesPerView={3}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
        >
            {swiperData}
        </Swiper>
    );
};

export default PhotosSwiper;