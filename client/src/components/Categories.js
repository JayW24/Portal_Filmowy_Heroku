import React from 'react';
import CategoriesLinks from './CategoriesLinks';

export default function Categories(props) {
    return (
        <div className="d-flex w-100 flex-column m-0 p-0">
            <div className="d-flex w-100">
                <div className="col-sm-6 col-md-2 m-0 p-0 font-weight-bold">Kategorie:</div>
                <div className="col-sm-6 col-md-10 m-0 p-0">
                    <CategoriesLinks dbName={props.dbName} categories={props.categories} />
                </div>
            </div>
        </div>
    )
}