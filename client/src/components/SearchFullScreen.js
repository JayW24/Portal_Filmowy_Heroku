import React from 'react';
import { Link } from "react-router-dom";
import getDbNameByType from '../services/getDbNameByType';

export default function SearchFullScreen(props) {
  return (
    <div className="full-screen-search">
      <div>
        <button className="close-button search-button" onClick={props.onClose}>X</button>
        <h6 className="fullScreenSearchHeader">Szukaj</h6>
        <input id="fullScreenSearchInput" className="full-screen-search-input" type="text" autoComplete="off" name="searchlarge" onChange={props.onChange} />
        <h6 className="fullScreenSearchHeader">Wyniki:</h6>
        <div id="full-screen-search-results" onClick={props.onClose}>
          {props.searchResult.map(searchResult => {
            return (
              <Link to={`/${getDbNameByType(searchResult.type)}/${searchResult._id}`}>
                <div className="d-flex align-items-center p-1 m-0 mb-1 search-item">
                  <div className="col-1 d-flex justify-content-center p-1 search-item-img-container">
                    <img className="search-thumbnail" src={searchResult.thumbnail} alt={searchResult.thumbnail} />
                  </div>
                  <div className="col-11 d-flex align-items-center">
                    <div>{searchResult.name} <span className="text-secondary">({searchResult.type})</span></div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        <br />
      </div>
    </div>
  )
}