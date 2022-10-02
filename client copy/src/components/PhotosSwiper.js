// Import Swiper React components
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/swiper-bundle.css'

function PhotosSwiper(props) {
    let swiperData = props.swiperData
    swiperData = swiperData.map(x =>
        <SwiperSlide><img className="img-fluid" src={`${props.photosDir}${x}`} /></SwiperSlide>
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