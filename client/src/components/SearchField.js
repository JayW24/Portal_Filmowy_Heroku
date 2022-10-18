import React from 'react';
import '../styles/Search.css';

export default function SearchField(props) {
    return (
      <input className="m-0 p-0 navbar-search-field" placeholder=" Szukaj" type="text" id="search-small-input" name={props.name} autoComplete="off" onChange={props.onChange} />
    );
  }