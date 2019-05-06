import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

export class Done extends React.PureComponent {
  render() {
    return (
    	<div>Done</div>
    )
  }
}

export default compose()(Done);