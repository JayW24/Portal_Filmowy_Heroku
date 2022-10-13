import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CategoriesLinks(props) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (props.categories) {
            setCategories(props.categories.split(','));
        }
    }, [props.categories])

    return (
        <>
            {categories.map(
                (category, index) =>
                    <Link key={`${category}`} to={`/${props.dbName}/order=rating:1&categories=${category}/page=1`} >
                        {index === categories.length - 1 ? category : `${category}, `}
                    </Link>)}
        </>

    )
}