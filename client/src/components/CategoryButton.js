import React from 'react';
const unchosenCategoryClasses = 'text-secondary';
const chosenCategoryClasses = 'text-primary';

export default function CategoryButton(props) {
    const handleCategoryChangeAndStyleChange = function() {
        props.handleCategoryChange(JSON.parse(`{"${props.searchedProperty}": "${props.category[props.propertyName]}"}`));
        props.handleCategoryChangeStyle(props.category[props.propertyName]);
    }
    const categoryButtonClassName = props.chosenCategoryName===props.category[props.propertyName]? chosenCategoryClasses : unchosenCategoryClasses;

    return (
        <button id={props.category._id} className={`border-0 ${categoryButtonClassName}`} key={props.category._id + props.category.name}
            onClick={() => {
                handleCategoryChangeAndStyleChange();
            }}>
            {props.category[props.propertyName]}
        </button>
    )
}