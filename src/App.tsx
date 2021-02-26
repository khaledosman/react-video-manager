import React, { StrictMode, memo, lazy, Suspense } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const Home = lazy(() => import(/* webpackChunkName: "Home", webpackPrefetch: true */ './views/home'));
const About = lazy(() => import(/* webpackChunkName: "About", webpackPrefetch: true */ './views/about'));
const FAQ = lazy(() => import(/* webpackChunkName: "FAQ", webpackPrefetch: true */ './views/faq'));
const VideoForm = lazy(() => import(/* webpackChunkName: "VideoForm", webpackPrefetch: true */ './views/video-form'));

const App: React.FC = () => {
  const linkStyles = {
    margin: '0 10px',
    color: '#ffffff',
  };

  return (
    <StrictMode>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Link style={linkStyles} to="/">
              Home
            </Link>
            <Link style={linkStyles} to="/about">
              About Us
            </Link>
            <Link style={linkStyles} to="/faq">
              FAQ
            </Link>
            <Link style={linkStyles} to="/videoForm/new">
              Add video
            </Link>
          </Toolbar>
        </AppBar>
        <Suspense fallback={<h3>Loading...</h3>}>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/about" component={About}></Route>
            <Route path="/faq" component={FAQ}></Route>
            <Route path="/videoForm/edit/:videoId" component={VideoForm}></Route>
            <Route path="/videoForm/new" component={VideoForm}></Route>
          </Switch>
        </Suspense>
      </Router>
    </StrictMode>
  );
};

export default memo(App);
