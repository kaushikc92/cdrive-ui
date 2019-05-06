import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

export class CSVViewer extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  // componentDidMount() {
  //   if (this.props.username && this.props.username.trim().length > 0) {
  //     this.props.onSubmitForm();
  //   }
  // }

  render() {
    return (
    	<div className="align-middle-container tall wide">
        <div className="align-middle-content">
          <div className="tall">
            <div className="csv-viewer tall">
              CSV Viewer
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default compose()(CSVViewer);