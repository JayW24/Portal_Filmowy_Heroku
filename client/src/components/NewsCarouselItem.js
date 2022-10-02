import React from 'react';
import NewsCarouselCard from './NewsCarouselCard';
import { Link } from 'react-router-dom';

function NewsCarouselItem(props) {
    return (
        <div>
            <div className="w-100 text-right">
                <Link to={`/new/${props._id}`}>
                    <NewsCarouselCard title={props.title} description={props.description} thumbnail={props.thumbnail} />
                </Link>
            </div>
        </div>
    )
}

export default NewsCarouselItem;