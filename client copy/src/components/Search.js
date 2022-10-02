import React, { useState } from 'react'
import SearchField from './SearchField'
import SearchFullScreen from './SearchFullScreen';
import sleep from '../services/sleep'
import '../styles/Search.css';


function Search() {
  const [showLargeSearch, setshowLargeSearch] = useState({ display: 'none' }),
  [_form, set_form] = useState(''),
  [searchResult, setSearchResult] = useState([])

  const _handleChange = (e) => {
    e.preventDefault();
    let n = e.target.name;
    if (e.target.value.length > 0) {
      setshowLargeSearch({ display: 'block' })
      _form.searchlarge.focus();

      if (n === 'search') {
        _form.searchlarge.value = e.target.value;
      }
      else {
        _form.search.value = e.target.value;
        _handleData(e)
      }
    }
    else {
      _handleClose(e);
      _form.search.value = e.target.value;
    }
  }

  const _handleClose = e => {
    e.preventDefault();
    setshowLargeSearch({ display: 'none' })
  }

  const _handleData = async (e) => {
    try {
      const targetVal = e.target.value
      if (e.target.value.length >= 3) {
        //let startTime = performance.now()
        await sleep(300)  //300ms delay
        const resp = await fetch(`/api/search/string=${targetVal}`)
        let data = await resp.json()
        if (data.length !== 0) {
          setSearchResult(data)
        }
        else {
          setSearchResult('No results')
          setSearchResult([])
        }
        //var endTime = performance.now()
        //console.log('Diff=' + `(${endTime-startTime})` + 'ms')
      }
      else {
        setSearchResult([])
      }
    }
    catch (error) {
      alert('Something went wrong!')
    }
  }


  return (
    <div className="d-flex align-items-center">
      <form ref={f => set_form(f)}>
        <SearchField name="search" onChange={_handleChange} />
        <div style={showLargeSearch}>
          <SearchFullScreen onChange={_handleChange} onClose={_handleClose} searchResult={searchResult} />
        </div>
      </form>
    </div>
  )
}

export default Search;