import React, { useState, useEffect } from 'react';
import GenerateRandomKey from '../services/GenerateRandomKey';
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
        const fetchCategoriesData = async () => {
            const response = await fetch(props.dbName);
            const categories = await response.json();
    
            setCategories(categories);
        }
        try {
            fetchCategoriesData();
        }
        catch (error) {
            alert('Something gone wrong.');
        }
    }, [props.dbName])

    return (
        <div className="col-sm-12 p-1 m-0 d-flex align-items-center" key={GenerateRandomKey(10)}>
            <h5 className="mr-1 mt-1">Kategoria: </h5>
                {categories.map((category, index) => (
                    <CategoryButton key={`${category}-${index}`} category={category} searchedProperty={searchedProperty} chosenCategoryName={chosenCategoryName}
                    propertyName={propertyName} handleCategoryChange={props.handleCategoryChange} handleCategoryChangeStyle={handleCategoryChangeStyle}/>
                ))}
        </div>
    )
}