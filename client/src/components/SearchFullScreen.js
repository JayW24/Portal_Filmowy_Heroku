import React from 'react'
import { Link } from "react-router-dom";

import getDbNameByType from '../services/getDbNameByType'
export default function SearchFullScreen(props) {
  return (
    <div className="full-screen-search">
      <button className="close-button search-button" onClick={props.onClose}>X</button>
      <label>Szukaj...</label>
      <input className="full-screen-search-input" type="text" autoComplete="off" name="searchlarge" onChange={props.onChange} />
      WYNIKI:
      <div id="full-screen-search-results" onClick={props.onClose}>
        {props.searchResult.map(x => {
          return <div className="d-flex align-items-center p-2">
            <div className="d-flex justify-items-center align-items-center">
              <img className="search-thumbnail" src={x.thumbnail} />
              <Link className="ml-2" to={`/${getDbNameByType(x.type)}/${x._id}`}><div>{x.name}, type: {x.type}</div></Link>
            </div>
          </div>
        })}
      </div>
      <br />
    </div>
  )
}