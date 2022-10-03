import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/DynamicSpacer.css';
import Navbar from './components/Navbar';
import News from './components/News';
import Footer from './components/Footer';
import Pagination from './components/Pagination';
import Contact from './components/Contact';
import Position from './components/Position';
import axios from 'axios';
import {
  Router,
  Switch,
  Route
} from "react-router-dom";
import history from './history';
import MetaTags from 'react-meta-tags';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import UserConfirmation from './components/UserConfirmation';
import MessagesPreviewBig from './components/MessagesPreviewBig';
import Messenger from './components/Messenger';
import New from './components/New';
import { LoginContext } from './components/LoginContext';
import { SocketContext } from './components/SocketContext';
import socketIOClient from "socket.io-client";
import GenerateRandomKey from './services/GenerateRandomKey';
import NavbarVerticalSpacer from './components/NavbarVerticalSpacer';
import TestComp from './components/test-only-components/TestComp';
import TestComp2 from './components/test-only-components/TestComp2';
import TestComp3 from './components/test-only-components/TestComp3';
import Login from './components/Login';

const endPoint = 'localhost:3000';
const socket = socketIOClient(endPoint);

function App() {
  // Get username and user ID
  const [userName, setUserName] = useState(null);
  const [userID, setUserID] = useState(null);


  useEffect(() => {
    const fetchUserName = async () => {
      const result = await axios('/api/loggedUserUsername');
      
      setUserName(result.data.username);
      setUserID(result.data.userID);
    }

    fetchUserName();
  }, [])

  return (
    <div className="App root-div">
      <MetaTags>
        <title>Główna | FilmHub</title>
        <meta name="description" content="Some description. Ready to become dynamic." />
        <meta name="keywords" content="Some, random, keywords, ready, to, become, dynamic"></meta>
        <meta property="og:title" content="MyApp" />
        <meta property="og:image" content="path/to/image.jpg" />
      </MetaTags>
      <LoginContext.Provider value={userName}>
        <SocketContext.Provider value={socket}>
          <Router history={history}>
            <Navbar userID={userID} ></Navbar>
            <NavbarVerticalSpacer />
            <Switch>
              <Route name="login" path="/login"><Login/></Route>
              <Route name="home" exact path="/">
                <News url="/api/dbquery/news" />
              </Route>
              <Route key="filmy" name="filmy" path="/filmy/:query?/page=:page?" render={(props) => (
                <Pagination {...props} dbName="filmy" filters_Id="616e75558fdb4466b5b12710" path="film" />
              )}>
              </Route>
              <Route key="seriale" name="seriale" path="/seriale/:query?/page=:page?" render={(props) => (
                <Pagination {...props} dbName="seriale" filters_Id="616e75558fdb4466b5b12710" path="serial" />
              )}>
              </Route>
              <Route key="premiery" name="premiery" path="/premiery/:query?/page=:page?" render={(props) => (
                <Pagination {...props} dbName="premiery" filters_Id="616ea4271e98ed37c074c28a" path="premiera" />
              )}>
              </Route>
              <Route key="aktorzy" name="aktorzy" path="/aktorzy/:query?/page=:page?" render={(props) => (
                <Pagination {...props} dbName="aktorzy" filters_Id="616ea1ed1e98ed37c074c289" path="aktor" />
              )}>
              </Route>
              <Route name="new" path="/new/:id" render={(props) => (<New key={GenerateRandomKey(10)} path="new" {...props}></New>)}></Route>
              <Route name="film" path="/film/:id" render={(props) => (<Position key={GenerateRandomKey(10)} dbName="filmy" path="film" {...props}></Position>)}></Route>
              <Route name="serial" path="/serial/:id" render={(props) => (<Position key={GenerateRandomKey(10)} dbName="seriale" path="serial" {...props}></Position>)}></Route>
              <Route name="premiera" path="/premiera/:id" render={(props) => (<Position key={GenerateRandomKey(10)} dbName="premiery" path="premiera" {...props}></Position>)}></Route>
              <Route name="aktor" path="/aktor/:id" render={(props) => (<Position key={GenerateRandomKey(10)} dbName="aktorzy" path="aktor" {...props}></Position>)}></Route>
              <Route name="contact" path="/contact"><Contact /></Route>
              <Route key="register" name="register" path="/register"><Register /></Route>
              <Route key="user-profile" name="user-profile" path="/users/:username/:view?" render={(props) => (<UserProfile {...props} />)} />
              <Route key="user-confirmation" name="user-confirmation" path="/user-confirmation/:username/:token" render={(props) => (<UserConfirmation {...props} />)} />
              <Route key="messagespreviewbig" name="messagespreviewbig" path="/messagespreviewbig" render={(props) => (<MessagesPreviewBig {...props} />)} />
              <Route name="messenger" path="/messenger/:user1/:user2" render={(props) => <Messenger {...props} />} />
              <Route name="test" path="/test">
                  <TestComp/>
              </Route>
              <Route name="test2" path="/test2">
                  <TestComp2/>
              </Route>
              <Route name="test3" path="/test3">
                  <TestComp3/>
              </Route>

            </Switch>
          </Router>
        </SocketContext.Provider>
      </LoginContext.Provider>
      <div className="dynamic-spacer"></div>
      <Footer></Footer>
    </div>
  )
}

export default App;