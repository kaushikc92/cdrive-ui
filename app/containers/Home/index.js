/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Welcome from './Welcome'
import UploadCSV from './UploadCSV'
import CSVViewer from './CSVViewer'

/* eslint-disable react/prefer-stateless-function */
export class Home extends React.PureComponent {

  render() {
    return (
      <div className='home-container tall'>
        <div className="row tall">
          <div className="col-sm-5 tall">
            <UploadCSV />
          </div>
          <div className="col-sm-7">
            <CSVViewer />
          </div>
        </div>
      </div>
    )
  }
}

export default compose()(Home);
