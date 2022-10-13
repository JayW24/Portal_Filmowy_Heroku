import React, { useState, useEffect } from 'react';
import ParamsToJson from '../services/ParamsToJson';

const sortByData = [['rating', 'ocena'], ['name', 'nazwa']];
const sortTypeData = [[-1, 'malejąco'], [1, 'rosnąco']];

export default function CategoriesSort(props) {

    const [sortBy, setSortBy] = useState('rating');
    const [sortType, setSortType] = useState(-1);
    const [sortByValues, setSortByValues] = useState([]);
    const [sortTypeValues, setSortTypeValues] = useState([]);
    
    useEffect(() => {
        const setSortingByUrlParams = () => {
            setSortByValues(sortByData);
            setSortTypeValues(sortTypeData);
    
            let params = ParamsToJson(props.urlParams);
    
            if (params.order) {
                params = params.order.split(':');
                setSortBy(params[0]);
                setSortType(params[1]);
            }
        }
        setSortingByUrlParams();
    }, [props.urlParams])

    useEffect(() => {
        if (props.resetFilters > 0) {
            setSortBy('rating');
            setSortType(1);
            props.handleCategoryChange({ order: `rating:-1` });
        }
    }, [props])

    return (
        <div className="col-md-4 p-1 m-0">
            <div className="d-flex align-items-center justify-content-between">
                <h5 className="mr-1 mt-1">Sortowanie:</h5>
                <select name="sortBy" id="sortBy" value={sortBy} onChange={event => {
                    setSortBy(event.target.value);
                    props.handleCategoryChange({ order: `${event.target.value}:${sortType}` });
                }}>
                    {sortByValues
                        .map((sortByOption, index) => <option key={`sortByOption${index}`} value={sortByOption[0]}>{sortByOption[1]}</option>)
                    }
                </select>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <h5 className="mr-1 mt-1">Typ sortowania:</h5>
                <select name="sortType" id="sortType" value={sortType} onChange={event => {
                    setSortType(event.target.value);
                    props.handleCategoryChange({ order: `${sortBy}:${event.target.value}` });
                }}>
                    {sortTypeValues.map((sortTypeOption, index) => <option key={`sortTypeOption${index}`} value={sortTypeOption[0]}>{sortTypeOption[1]}</option>)}
                </select>
            </div>
        </div>
    )
}