import React from 'react';
import '../styles/Pagination.css';
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
import generateSearchTIles from '../services/generateSearchTIles';
import Spinner from './Spinner';
const cookies = new Cookies();
const cookiesLimit = cookies.get('paginationLimit');

//  REUSABLE PAGINATION - use in a component, pass the following data via props:
//  props.dbName - database name
//  props.query - query for searching database

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);  // 
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
      resetFilters: 0,
      isLoading: false
    };
    this.searchResultsTopRef = React.createRef();
  }

  //ON FILTERS CHANGE
  handleCategoryChange(queryPart) {
    // query part comes from child components and updates state
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
    this.setState({ isLoading: true });
    try {
      var response = await fetch(`/api/dbquery/${this.props.dbName}/${skip}/${limit}${this.state.queryString ? '/' + this.state.queryString : ""}`);
      let data = await response.json();
      data = generateSearchTIles(data, this.props.path);  // map to HTML
      this.setState({ data: data, skip: skip, isLoading: false }, () => {
        this.generatePagination();
      })
      this.searchResultsTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
    catch (error) {
      alert('Something gone wrong!');
    }
  }

  async setResultsAmount() {
    let query = ParamsToJson(this.state.queryString);
    delete query['order'];
    query = jsonToParams(query);
    const response = await fetch(`/api/pagesamount/${this.props.dbName}/${query}`);
    let pagesAmount = await response.json();
    this.setState({ ResultsAmount: (pagesAmount), currentPagesAmount: (Math.ceil(pagesAmount / this.state.limit) - 1) }, () => { this.generatePagination() });
  }

  generatePagination() {
    let pageNumParam = this.props.match.params.page;
    let pages = [];
    let topLimiterTop = (parseInt(pageNumParam) - 1);
    let topLimiterDown = (parseInt(pageNumParam) + 1);
    let lowerLimiter = (parseInt(pageNumParam - 3));

    for (let i = 0; i <= this.state.currentPagesAmount; i++) {
      // first          last                                    +/- 2 pages
      if ((i === 0) || (i === this.state.currentPagesAmount) || ((i >= topLimiterTop) && (i <= topLimiterDown)) || ((i <= topLimiterTop) && (i >= lowerLimiter))) {
        let skip = i * this.state.limit,
          url = `/${this.props.dbName}/${this.state.queryString}/page=${i + 1}`
        pages.push(
          <Link key={`paginationPageButton${i + 1}-link`} to={url}>
            <button id={`paginationPageButton${i + 1}`} className={`paginationPage btn ${i + 1 === Number(pageNumParam) ? "btn-primary" : "btn-light"}`} onClick={() => { this.fetchData(skip, this.state.limit, `/${this.state.queryString}`) }}>
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
    limits = limits
      .map((limit, index) => {
        return <button
          key={`limit${limit}`}
          className={`paginationLimit btn ${this.state.limit == limit ? 'btn-primary' : 'btn-btn-light'}`}
          id={`paginationLimit${index}`}
          onClick={() => this.changeLimit(limit)}>{limit}</button>
      })
    return limits
  }

  changeLimit(limit) {
    this.props.match.params.page = 1
    cookies.set('paginationLimit', limit, { path: '/' });
    let currentPagesAmount;
    if (this.state.queryString === '') {
      currentPagesAmount = Math.round(this.state.ResultsAmount / limit)
      if (currentPagesAmount === 1) { currentPagesAmount = 0 }
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
    // reset everything except sorting
    let sorting = this.state.query.order
    this.setState({ query: { order: sorting }, queryString: jsonToParams({ order: sorting }), skip: 0, resetFilters: (this.state.resetFilters + 1) }, () => {
      this.fetchData(this.state.skip, this.state.limit)
      this.setResultsAmount(true)
      this.generatePagination()
      history.push(`/${this.props.dbName}/order=rating:1/page=1`)
    })
  }

  render() {
    return (
      <>
        <MetaTags>
          <title>{firstLetterToUppercase(this.props.dbName)} | FilmHub</title>
          <meta name="description" content="Some description. Ready to become dynamic." />
          <meta name="keywords" content="Some, random, keywords, ready, to, become, dynamic"></meta>
          <meta property="og:title" content="MyApp" />
          <meta property="og:image" content="path/to/image.jpg" />
        </MetaTags>

        <div className="container">
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
            {!this.state.isLoading ?
              <div id="jw-pagination-results-29831">
                <div ref={this.searchResultsTopRef} className="d-block align-items-center">
                  <span className="d-inline-block results-title"><h2 className="display-6">Wyniki wyszukiwania</h2></span>
                  {this.state.ResultsAmount ?
                    <span className="d-inline-block resultsAmountDescription ml-1 text-muted">({this.state.ResultsAmount === 0 && this.state.ResultsAmount ? 'Nie znaleziono wyników' : `Znaleziono wyników: ${this.state.ResultsAmount}`})</span> :
                    null
                  }
                </div>
                <hr />
                {this.state.data}
                {/*CHOOSE PAGE NUMBER*/}
                <div className="d-flex justify-content-center align-items-center">
                  {/*PREVIOUS PAGE*/}
                  {this.state.skip > 0 ? // display only if not on first page
                    <Link key="previousPageLink" to={`/${this.props.dbName}/${this.state.queryString}/page=${this.props.match.params.page - 1}`}>
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
                  <span>{this.state.paginationPages}</span>
                  {/*NEXT PAGE*/}
                  {this.state.skip + parseInt(this.state.limit) !== (this.state.currentPagesAmount + 1) * parseInt(this.state.limit) ? // display only if not on last page
                    <Link key="nextPageLink" to={`/${this.props.dbName}/${this.state.queryString}/page=${parseInt(this.props.match.params.page) + 1}`}>
                      <button id={`paginationPageButtonNext`}
                        className="nextPage btn btn-light"
                        onClick={() => { this.fetchData((parseInt(this.state.skip) + parseInt(this.state.limit)), this.state.limit) }}>
                        Next page
                      </button>
                    </Link>
                    : null
                  }
                </div>
                {/*RESULTS AMOUNT PER PAGE*/}
                <div className="resultsAmountController d-flex justify-content-center align-items-center bg-light p-3 m-0 mt-2">
                  <span>Ilość wyników na stronie:</span>
                  <span className="ml-1">{this.generateSkipChangeButtons()}</span>
                </div>
              </div>

              : <Spinner />
            }
          </div>
        </div>
      </>
    )
  }
}