import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import NewsCarouselItem from './NewsCarouselItem';
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";
import '../styles/News.css';
import SwiperCore, { Autoplay, Pagination } from 'swiper/core';
import VerticalSpacer from './VerticalSpacer';
import Spinner from "./Spinner";

SwiperCore.use([Autoplay, Pagination]);

function News(props) {
    const [firstNewsItem, setFirstNewsItem] = useState([]);
    const [allNewsData, setAllNewsData] = useState(null);
    const [restOfNewsData, setRestOfNewsData] = useState([]);

    useEffect(() => {
        const fetchallNewsData = async () => {
            const resp = await fetch(props.url);
            const allNewsData = await resp.json();

            let firstNewsItemallNewsData = [];
            let carouselallNewsData = [];
            let restOfNewsItemsallNewsData = [];

            allNewsData.forEach((newsItem, index) => {
                if (index === 0) {
                    firstNewsItemallNewsData.push(newsItem);
                }
                else if (index <= 4) {
                    carouselallNewsData.push(
                        <SwiperSlide key={`navItem${index}`} className="w-100 bg-white">
                            <NewsCarouselItem {...newsItem}></NewsCarouselItem>
                        </SwiperSlide>
                    )
                }
                else {
                    restOfNewsItemsallNewsData.push(newsItem);
                }
            })
            setAllNewsData(carouselallNewsData);
            setRestOfNewsData(restOfNewsItemsallNewsData);
            setFirstNewsItem(firstNewsItemallNewsData);
        }
        fetchallNewsData();
    }, [props.url]);

    return (
        <>
            {allNewsData ?
                <div className="container">
                    <div className="row m-0">
                        {/*FIRST ITEM IS A BIG ITEM - SAME SIZE AS CAROUSEL*/}
                        <div className="card-group col-sm-12 col-md-6 p-0 m-0">
                            {firstNewsItem.map((newsItemallNewsDataForProps, index) =>
                                <div key={`${newsItemallNewsDataForProps}${index}`} className=" col-sm-12 p-0 m-0">
                                    <div className="card p-2 rounded-0 border-0">
                                        <NewsCarouselItem {...newsItemallNewsDataForProps}></NewsCarouselItem>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/*CAROUSEL*/}
                        <div className="card-group col-sm-12 col-md-6 p-0 m-0 bg-white">
                            <Swiper className="card mySwiper"
                                spaceBetween={0}
                                centeredSlides={true}
                                autoplay={{ "delay": 5000, "disableOnInteraction": false }}
                                pagination={{ "clickable": true }}>
                                {allNewsData}
                            </Swiper>
                        </div>
                    </div>
                    <VerticalSpacer />
                    {/*REST OF ITEMS - SMALLER SIZE*/}
                    <div className="card-group m-0 p-0 bg-white">
                        {restOfNewsData.map((newsItemallNewsDataForProps, index) =>
                            <div key={`${newsItemallNewsDataForProps}${index}`} className="col-sm-4 p-0 m-0">
                                <div className="card p-2 rounded-0 border-0">
                                    <NewsCarouselItem {...newsItemallNewsDataForProps}></NewsCarouselItem>
                                </div>
                            </div>
                        )}
                    </div>
                    <VerticalSpacer />
                </div>
                : <Spinner />}
        </>
    )
}

export default News;