import React from 'react';
import showdown from 'showdown';
var converter = new showdown.Converter();

//RENDER HTML FROM DB "DANGEROUSLY" + ADDITIONAL FUNCTIONS TO MAKE IT WORK
function createMarkup(html) {
    if (html) {
        html = converter.makeHtml(html);
        html = html.replace('/uploads/', 'http://localhost:1337/uploads/');  //change relative src to CMS
        return { __html: html };
    }
}

export default function HtmlReturner(html) {
    return <div dangerouslySetInnerHTML={createMarkup(html.html)} />;
}