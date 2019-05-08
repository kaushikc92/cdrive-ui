import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Redirect, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Home from 'containers/Home/Loadable';
import LandingPage from 'containers/LandingPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus} from '@fortawesome/free-solid-svg-icons';

import GlobalStyle from '../../global-styles';
import "../../App.scss";
import { authenticateUser, userDetails } from './actions';

export class App extends React.PureComponent {
    componentDidMount() {
        const { userDetails } = this.props;
        userDetails();
    }
    render() {
        const { authenticateUser } = this.props;
        if (authenticateUser()) {
            library.add(faTrash)
            library.add(faDownload)
            library.add(faUserPlus)
            const { app } = this.props
            const { fetching } = app
            return (
              <div className="tall">
                <Helmet
                  titleTemplate="%s"
                  defaultTitle="Project Name"
                >
                </Helmet>
                <div className="header-container">
                  <Header />
                </div>
                <div className="body-container">
                  <Switch>
                    <Route exact path="" component={LandingPage} />
                    { /* <Redirect from="" to="/home" /> */ }
                  </Switch>
                </div>
                <GlobalStyle />
              </div>
            );
        
        } else {
            return (null);
        }
    }
}

const mapStateToProps = state => ({
  app: state.get('app')
})

const mapDispatchToProps = dispatch => ({
    userDetails: () => dispatch(userDetails()),
    authenticateUser: () => dispatch(authenticateUser()),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))

