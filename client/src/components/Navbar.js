import React, { useEffect, useState, useRef } from 'react';
import '../styles/Navbar.css';
import LoginBar from './LoginBar';
import Search from './Search';
import HideWhenClickedOutside from '../services/HideWhenClickedOutsite';
import NavbarItems from './NavbarItems';

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);
const navContainerStyle = { position: 'fixed', top: '0', width: '100%', zIndex: '9999' };

function Navbar(props) {
    const myRef = useRef(null);
    const executeScroll = () => scrollToRef(myRef);
    const [socketInfo, setSocketInfo] = useState(null);

    useEffect(() => {
        setSocketInfo(props.socketInfo);
    }, [props.socketInfo])

    //NAVBAR HIDING IF CLICKED OUTSIDE
    useEffect(() => {
        HideWhenClickedOutside('#navbarTogglerDemo02');
    }, [])

    return (
        <div ref={myRef} style={navContainerStyle}>
            <LoginBar userID={props.userID} socketinfo={socketInfo} fetchUserName={props.fetchUserName}></LoginBar>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ fontSize: '#40px' }}>
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <strong><span id="logo-text">FilmHub </span><i className="fas fa-film"></i></strong>
                    </a>
                    <div className="collapse navbar-collapse col-sm-8" id="navbarTogglerDemo02">
                        <ul className="navbar-nav w-100 justify-content-between">
                            <NavbarItems executeScroll={executeScroll} />
                        </ul>
                    </div>
                    <Search id="navbar-search" className="form-inline navbar-search" />
                    <button className="navbar-toggler shadow-none" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar