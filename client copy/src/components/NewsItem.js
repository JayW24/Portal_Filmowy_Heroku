import React from 'react';
import { Link } from 'react-router-dom';

export default function NewsItem(props) {
    return (
        <div key={props.item._id} class="col-md-3 col-sm-6 item">
            <Link to={`/new/${props.item._id}`}>
                <div class="card item-card card-block">
                    <h4 class="card-title text-right"></h4>
                    <img src={props.item.thumbnail} alt="item.photo" />
                    <h5 class="item-card-title mt-3 mb-3">{props.item.title}</h5>
                    <p class="card-text">This is a company that builds websites, web apps and e-commerce solutions.</p>
                </div>
            </Link>
        </div>
    )
}