import React, { useState, useEffect } from 'react';
import CategoryButton from './CategoryButton';

export default function CategoriesButtons(props) {
    const searchedProperty = props.searchedProperty;
    const propertyName = props.propertyName;
    const [categories, setCategories] = useState([]);
    const [chosenCategoryName, setChosenCategoryName] = useState(null);

    const handleCategoryChangeStyle = function(categoryName) {
        setChosenCategoryName(categoryName);
    }

    useEffect(() => {
        const abortController = new AbortController();
        const fetchCategoriesData = async () => {
            const response = await fetch(props.dbName);
            const categories = await response.json();
    
            setCategories(categories);
        }
        try {
            fetchCategoriesData();
        }
        catch (error) {
            alert('Something gone wrong with fetching categories...');
        }
        return () => {
            abortController.abort();
          };

    }, [props.dbName])

    useEffect(() => {
        setChosenCategoryName(null);
    }, [props.resetFilters])

    return (
        <div className="col-sm-12 p-1 m-0 d-flex flex-wrap align-items-center" key="categories-filter">
            <h5 className="mr-1 mt-1">Kategoria: </h5>
                {categories.map((category, index) => (
                    <CategoryButton key={`${category}-${index}`} category={category} searchedProperty={searchedProperty} chosenCategoryName={chosenCategoryName}
                    propertyName={propertyName} handleCategoryChange={props.handleCategoryChange} handleCategoryChangeStyle={handleCategoryChangeStyle}/>
                ))}
        </div>
    )
}