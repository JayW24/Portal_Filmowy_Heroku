import React, { useEffect, useState } from 'react';
import ParamsToJson from '../services/ParamsToJson';

const charsAmountToTriggerSearch = 0;

function CategoriesSearchFilter(props) {
    const [inputVal, setInputVal] = useState(undefined);

    const onInputChange = (event) => {
        event.preventDefault();
        setInputVal(event.target.value);
        if (event.target.value.length > charsAmountToTriggerSearch) {
            props.handleCategoryChange({ name: event.target.value });
        }
        else {
            props.handleCategoryChange({ name: null });
        }
    }

    // on param coming from url
    useEffect(() => {
        const searchString = ParamsToJson(props.urlParams).name;
        setInputVal(searchString);
    }, [props.urlParams])

    //on reset filter
    useEffect(() => {
        if (props.resetFilters > 0) {
            setInputVal('');
        }
    }, [props.resetFilters])

    return (
        <div className="col-md-4 p-1 m-0 d-flex align-items-center">
            <h5 className="mr-1 mt-1">Szukaj: </h5>
            <input value={inputVal} id="searchFilter" type="text" placeholder="Nazwa" onChange={onInputChange} autoComplete="off" />
        </div>
    )
}

export default CategoriesSearchFilter;
