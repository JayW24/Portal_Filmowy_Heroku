import React from 'react';
import '../styles/Pagination.css';
import $ from 'jquery';
import { Link } from "react-router-dom";
import history from '../history';
import mergeJSONForQueryString from '../services/mergeJSONForQueryString';
import jsonToParams from '../services/jsonToParams';
import ParamsToJson from '../services/ParamsToJson';
import Filters from '../components/Filters';
import MetaTags from 'react-meta-tags';
import firstLetterToUppercase from '../services/firstLetterToUppercase';
import Cookies from 'universal-cookie';
import VerticalSpacer from './VerticalSpacer';
import generateRandomKey from '../services/GenerateRandomKey';
import generateSearchTIles from '../services/generateSearchTIles';
const cookies = new Cookies();
const cookiesLimit = cookies.get('paginationLimit');


//  REUSABLE PAGINATION - use in a component, pass the following data via props:
//  props.dbName - database name
//  props.query - query for searching database

export default class Pagination extends React.Component {
  constructor(props) {
    super(props)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)  // 
    this.state = {
      data: null,                     //fetched data from database
      skip: 0,                        //default skip
      limit: cookiesLimit ? cookiesLimit : 5,
      query: {},                      //query to database - JSON
      queryString: '',                //query to database - String
      searchString: '',
      searchStringFromUrlParam: '',
      ResultsAmount: null,            //amount of results from database
      currentPagesAmount: null,       //amount of pages depending on resultsamount and some logic
      paginationPages: null,           //rendered html elements to switch page
      resetFilters: 0
    }
  }


  //ON FILTERS CHANGE
  handleCategoryChange(queryPart) {           // query part comes from child components and updates state
    //console.log('======== HANDLE CATEGORY CHANGE ========')
    const result = mergeJSONForQueryString(this.state.query, queryPart);
    const stringifyResult = jsonToParams(result);

    this.setState(
      {
        query: result,
        queryString: stringifyResult,
        searchStringFromUrlParam: '',                   //reset URL 
        searchString: this.state.query.name,
        skip: 0
      }, () => {
        this.fetchData(this.state.skip, this.state.limit)
        this.setResultsAmount(true)
        this.generatePagination()
        history.push(`/${this.props.dbName}/${stringifyResult}/page=1`)
      })
  }

  componentWillMount() {
    const params = this.props.match.params;

    if (params.query) {
      if (ParamsToJson(params.query)['name']) {
        var name = ParamsToJson(params.query)['name'];
      }
    }

    const pagenumber = params.page;
    const currentSkip = (pagenumber - 1) * this.state.limit;

    this.setState({ skip: currentSkip, searchStringFromUrlParam: params.name }, () => {
      params.query && this.setState({ query: ParamsToJson(params.query), queryString: params.query, searchStringFromUrlParam: name }, () => {
        this.fetchData(this.state.skip, this.state.limit);
        this.setResultsAmount();
      })
    })
  }


  async fetchData(skip, limit) {
    try {
      var response = await fetch(`/api/dbquery/${this.props.dbName}/${skip}/${limit}${this.state.queryString ? '/' + this.state.queryString : ""}`);
      let data = await response.json();
      data = generateSearchTIles(data, this.props.path);  // map to HTML
      this.setState({ data: data, skip: skip }, () => {
        this.generatePagination();
      })
    }
    catch (error) {
      alert('Something gone wrong!');
    }
  }


  async setResultsAmount(filtersChanged) {
    let query = ParamsToJson(this.state.queryString);
    delete query['order'];
    query = jsonToParams(query);
    const response = await fetch(`/api/pagesamount/${this.props.dbName}/${query}`);
    let pagesAmount = await response.json();
    this.setState({ ResultsAmount: (pagesAmount), currentPagesAmount: (Math.ceil(pagesAmount / this.state.limit) - 1) }, () => { this.generatePagination(filtersChanged) });
  }

  // Jquery is not the best choice here!
  generatePagination(filtersChanged) {
    let pageNumParam = this.props.match.params.page
    // JQUERY EVENTS HANDLING
    $(document).ready(function () {
      if (!filtersChanged) {
        // PAGE NUMBER || URL
        $(".paginationPage").removeClass("active")
        $(`[id*=paginationPageButton]`).css("color", "#242424")
        $(`#paginationPageButton${pageNumParam}`).css("color", "#004ebd")
        $(`#paginationPageButton${pageNumParam}`).addClass("active")
        // PAGE NUMBER || ON CLICK
        $(".paginationPage").click((event) => {
          $(".paginationPage").css("color", '#242424')
          $(".paginationPage").removeClass("active")
          $(`#${event.target.id}`).css("color", "#004ebd")
        })
        // RESULTS AMOUNT || COOKIES
        const resultsAmountButtonsMap = { 5: '0', 10: '1', 25: '2', 50: '3' },
        // change results limit from cookies
        cookiesLimit = cookies.get('paginationLimit') ? cookies.get('paginationLimit') : 5  // default is 5
        $(`#paginationLimit${resultsAmountButtonsMap[cookiesLimit]}`).css("color", "#004ebd")
        $(`#paginationLimit${resultsAmountButtonsMap[cookiesLimit]}`).addClass("active")
        // RESULTS AMOUNT || ONCLICK
        $(".paginationLimit").click((event) => {
          $(".paginationLimit").css("color", '#242424')
          $(".paginationLimit").removeClass("active")
          $(`#${event.target.id}`).css("color", "#004ebd")
        })
        // NEXT PAGE
        $("#paginationPageButtonNext").click((event) => {
          $(".paginationPage").css("color", '#242424')
          $(".paginationPage").removeClass("active")
          $("#paginationPageButtonNext").removeClass("active")
          $(`#paginationPageButton${pageNumParam + 1}`).css("color", "#004ebd")
          $(`#paginationPageButton${pageNumParam + 1}`).addClass("active")
        })
        // PREVIOUS PAGE
        $("#paginationPageButtonPrevious").click((event) => {
          $(".paginationPage").css("color", '#242424')
          $(".paginationPage").removeClass("active")
          $("#paginationPageButtonPrevious").removeClass("active")
          $(`#paginationPageButton${pageNumParam - 1}`).css("color", "#004ebd")
          $(`#paginationPageButton${pageNumParam - 1}`).addClass("active")
        })
      }
      else {
        // SET SELECTED PAGE TO 1
        $(".paginationPage").removeClass("active")
        $(`[id*=paginationPageButton]`).css("color", "#242424")
        $("#paginationPageButton1").css("color", "#004ebd")
        $("#paginationPageButton1").addClass("active")
      }
    // JQUERY EVENTS - SCROLLING 
    $(".paginationPage, .paginationLimit, .nextPage, .prevPage").click(function () {
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#jw-pagination-results-29831").offset().top - 80             // element coordinates - (navbar + loginbar height)
      }, 0)
    })
    $('#reset-filters-and-categories').click(() => {
      $([document.documentElement, document.body]).animate({
        scrollTop: 0
      }, 0)
    })
    })
    // END OF JQUERY EVENTS HANDLING

    let pages = [],
      topLimiterTop = (parseInt(pageNumParam) - 1),
      topLimiterDown = (parseInt(pageNumParam) + 1),
      lowerLimiter = (parseInt(pageNumParam - 3))

    for (let i = 0; i <= this.state.currentPagesAmount; i++) {
      // first        last                                    +/- 2 pages
      if ((i == 0) || (i == this.state.currentPagesAmount) || ((i >= topLimiterTop) && (i <= topLimiterDown)) || ((i <= topLimiterTop) && (i >= lowerLimiter))) {
        let skip = i * this.state.limit,
        url = `/${this.props.dbName}/${this.state.queryString}/page=${i + 1}`
        if (i == 0) {
          var additional = ' (first)'
        }
        else if (i == this.state.currentPagesAmount) {
          var additional = ' (last)'
        }
        else {
          additional = ''
        }
        pages.push(
          <Link key={generateRandomKey(10)} to={url}>
            <button id={`paginationPageButton${i + 1}`} className="paginationPage btn btn-light" onClick={() => { this.fetchData(skip, this.state.limit, `/${this.state.queryString}`) }}>
              {/*FOR TESTING ONLY*/}
              {/*
                {`PAGE:${i + 1}${additional}, skip:${skip}, limit: ${this.state.limit}, query: ${this.state.queryString}`}
              */}
              {/*END OF FOR TESTING ONLY*/}
              {i + 1}
            </button>
          </Link>
        )
      }
    }
    this.setState({ paginationPages: pages })
  }

  generateSkipChangeButtons() {
    let limits = [5, 10, 25, 50]
    limits = limits.map((x, index) => { return <button key={`limit${x}`} className="paginationLimit btn btn-light" id={`paginationLimit${index}`} onClick={() => this.changeLimit(x)}>{x}</button> })
    return limits
  }

  changeLimit(limit) {
    this.props.match.params.page = 1
    //console.log('======== changeLimit ========')
    cookies.set('paginationLimit', limit, { path: '/' });
    let currentPagesAmount;
    if (this.state.queryString == '') {
      currentPagesAmount = Math.round(this.state.ResultsAmount / limit)
      if (currentPagesAmount == 1) { currentPagesAmount = 0 }
      this.setState({ limit: limit, currentPagesAmount: currentPagesAmount, skip: 0 }, () => {
        this.generatePagination()
        this.handleCategoryChange({})
      })
    }
    else {
      currentPagesAmount = Math.ceil(this.state.ResultsAmount / limit) - 1
      this.setState({ limit: limit, currentPagesAmount: currentPagesAmount, skip: 0 }, () => {
        this.generatePagination()
        this.handleCategoryChange({})
      })
    }
  }

  reset() {
    //console.log('======== reset ========')
    // reset everything except sorting
    let sorting = this.state.query.order
    this.setState({ query: { order: sorting }, queryString: jsonToParams({ order: sorting }), skip: 0, limit: 5, resetFilters: (this.state.resetFilters + 1) }, () => {
      this.fetchData(this.state.skip, this.state.limit)
      this.setResultsAmount(true)
      this.generatePagination()
      history.push(`/${this.props.dbName}/order=rating:1/page=1`)
    })
  }

  render() {
    return (
      <div className="container">
        <MetaTags>
          <title>{firstLetterToUppercase(this.props.dbName)} | FilmHub</title>
          <meta name="description" content="Some description. Ready to become dynamic." />
          <meta name="keywords" content="Some, random, keywords, ready, to, become, dynamic"></meta>
          <meta property="og:title" content="MyApp" />
          <meta property="og:image" content="path/to/image.jpg" />
        </MetaTags>
        {/*FILTERS*/}
        <Filters handleCategoryChange={this.handleCategoryChange}
          urlParams={this.props.match.params.query}
          filtersDbName={this.props.filtersDbName}
          filters_Id={this.props.filters_Id}
          resetFilters={this.state.resetFilters}
        />
        {/*RESET FILTERS*/}
        <div id="reset-filters-and-categories" className="text-primary p-1" onClick={() => this.reset()}><i className="fas fa-eraser"></i> RESET FILTRÓW</div>
        {/* END OF FILTERS*/}
        {/*CURRENT STATE - FOR TESTING ONLY*/}
        {/*
        <div style={{ fontSize: '10px', backgroundColor: '#4860c2', color: 'white' }}>
          query: {JSON.stringify(this.state.query)} <br />
          searchString: {this.state.searchString} <br />
          searchStringFromURLParam: {this.state.searchStringFromUrlParam} <br />
          queryString: {JSON.stringify(this.state.queryString)} <br />
          Current pages amount: {this.state.currentPagesAmount + 1}<br />
          Current limit: {this.state.limit}<br />
          Current skip: {this.state.skip}
        </div>
        */}
        <VerticalSpacer />
        {/*PAGINATION RESULTS*/}
        <div className="section-block p-3">
          <div id="jw-pagination-results-29831">
            <div className="d-block align-items-center">
              <span className="d-inline-block results-title"><h2>Wyniki wyszukiwania</h2></span>
              {this.state.ResultsAmount ?
              <span className="d-inline-block resultsAmountDescription ml-1 text-muted">({this.state.ResultsAmount == 0 ? 'Nie znaleziono wyników' : `Znaleziono wyników: ${this.state.ResultsAmount}`})</span> : 
              null
            }   
            </div>
            <hr />
            {this.state.data}
          </div>
          {/*CHOOSE PAGE NUMBER*/}
          <div className="d-flex justify-content-center align-items-center">
            {/*PREVIOUS PAGE*/}
            {this.state.skip > 0 ? // display only if not on first page
              <Link key={generateRandomKey(10)} to={`/${this.props.dbName}/${this.state.queryString}/page=${this.props.match.params.page - 1}`}>
                <button id={`paginationPageButtonPrevious`}
                  className="prevPage btn btn-light"
                  onClick={() => {
                    this.fetchData(this.state.skip - this.state.limit, this.state.limit, `/${this.state.queryString}`)
                  }}>
                  Previous page
                </button>
              </Link>
              : null
            }
            {/*PAGES*/}
            <span className="ml-1">{this.state.paginationPages}</span>
            {/*NEXT PAGE*/}
            {this.state.skip + parseInt(this.state.limit) !== (this.state.currentPagesAmount + 1) * parseInt(this.state.limit) ? // display only if not on last page
              <Link key={generateRandomKey(10)} to={`/${this.props.dbName}/${this.state.queryString}/page=${parseInt(this.props.match.params.page) + 1}`}>
                <button id={`paginationPageButtonNext`}
                  className="nextPage btn btn-light"
                  onClick={() => { this.fetchData((parseInt(this.state.skip) + parseInt(this.state.limit)), this.state.limit) }}>
                  Next page
                </button>
              </Link>
              : null
            }
          </div>
        </div>
        {/*RESULTS AMOUNT PER PAGE*/}
        <div className="resultsAmountController d-flex justify-content-center align-items-center bg-light p-3 m-0">
          <span>Ilość wyników na stronie:</span>
          <span className="ml-1">{this.generateSkipChangeButtons()}</span>
        </div>
      </div>
    )
  }
}