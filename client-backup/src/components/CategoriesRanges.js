import React, { useState, useEffect } from 'react';
import ParamsToJson from '../services/ParamsToJson';
import axios from 'axios';
import GenerateRandomKey from '../services/GenerateRandomKey';

function CategoriesRanges(props) {
    const propertyName = props.propertyName;
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(ParamsToJson(props.urlParams).duration);
    
    const fetchCategoriesData = async () => {
        try {
            const filtersDataEndpointURL = props.dbName;
            const result = await axios(filtersDataEndpointURL);
            setCategories(result.data);
        }
        catch (error) {
            alert('Something gone wrong.');
        }
    }

    useEffect(() => {
        fetchCategoriesData();
    }, [])

    useEffect(() => {
        if (props.resetFilters > 0) {
            setCurrentCategory(categories[0]);
        }
    }, [props.resetFilters])

    return (
        <div className="col-md-4 p-1 m-0 d-flex align-items-center">
            <h5 className="mt-1 mr-1">Czas trwania filmu:</h5>
            <div style={{ color: 'dodgerblue', listStyleType: 'none', display: 'flex' }}>
                <select name="sortBy" id="sortBy" value={currentCategory} onChange={event => {
                    setCurrentCategory(event.target.value)
                    props.handleCategoryChange(JSON.parse(`{ "${propertyName}" : "${event.target.value}" }`))
                }}>
                    <option key={GenerateRandomKey(10)} value={""}>-</option>
                    {categories
                        .map(category => category.duration)
                        .map(categoryDuration => (
                            <option key={categoryDuration} value={`${categoryDuration[0]},${categoryDuration[1]}`}>
                                Duration: {categoryDuration[0]}-{categoryDuration[1]} min
                            </option>
                        ))}
                </select>
            </div>
        </div>
    )
}

export default CategoriesRanges;