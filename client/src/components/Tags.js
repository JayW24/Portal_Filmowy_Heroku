import React from 'react';
import { MetaTags } from 'react-meta-tags';

export default function Tags(props) {
    return (
        <MetaTags>
            <title>{props.title} | FilmHub</title>
            <meta name="description" content={props.description} />
            <meta name="keywords" content={props.keywords}></meta>
        </MetaTags>
    )
}