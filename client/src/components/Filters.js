import React, { useState, useEffect } from 'react';
import CategoriesButtons from './CategoriesButtons';
import CategoriesRanges from './CategoriesRanges';
import CategoriesSort from './CategoriesSort';
import CategoriesSearchFilter from './CategoriesSearchFilter';
import GenerateRandomKey from '../services/GenerateRandomKey';
import axios from 'axios';

// to create filters dynamically basing on fetched data
const filtersMap = {
    'CategoriesButtons': CategoriesButtons,
    'CategoriesRanges': CategoriesRanges,
    'CategoriesSort': CategoriesSort,
    'CategoriesSearchFilter': CategoriesSearchFilter
}

function Filters(props) {
    const [filters, setFilters] = useState([]);
    const [filtersData, setFiltersData] = useState([]);

    useEffect(() => {
        const fetchFiltersData = async () => {
            const result = await axios(`/api/filters/${props.filters_Id}`);
    
            if (result.status === 200) {
                const json = await result.data
                delete json['_id']
                setFiltersData(json)
            }
            else {
                alert('Filters error!')
            }
        }

        try {
            fetchFiltersData();
        }
        catch (err) {
            alert('Filters error!');
        }
    }, [props.filters_Id])

    useEffect(() => {
        const filtersKeys = Object.keys(filtersData);
        let filtersComponents = [];
        filtersKeys.forEach(filterKey => {
            let Type = filtersMap[filterKey];
            filtersComponents.push(
                <Type key={GenerateRandomKey(10)} urlParams={props.urlParams}
                    {...filtersData[filterKey]}
                    handleCategoryChange={props.handleCategoryChange}
                    resetFilters={props.resetFilters}
                />
            )
        })
        setFilters(filtersComponents);
    }, [props.resetFilters, filtersData, props.handleCategoryChange, props.urlParams])

    return (
        <div className="section-block filters d-flex row p-0 m-0">
            <button className="btn btn-primary rounded-0" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                Filtry
            </button>
            <div className="collapse p-0 m-0" id="collapseExample">
                {filters}
            </div>
        </div>
    )
}

export default Filters

