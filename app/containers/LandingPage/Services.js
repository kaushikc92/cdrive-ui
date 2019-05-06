import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Cookies from 'js-cookie';
import _ from 'underscore'
const services = {
  valueNormalizer: {
    DisplayName: "Value Normalizer",
    url: `http://ec2-54-163-167-78.compute-1.amazonaws.com:4200/${Cookies.get("cdrive_token")}`,
    description: 'Cloud microservice for normalizing values of an attribute'
  },
  htmlbrowser: {
    DisplayName: "HTML browser",
    url: `${window.location.origin}/htmlbrowser/`,
    description: 'Cloud microservice to view CSV file as HTML table'
  },
}

export class Services extends React.PureComponent {
  render() {
  	let links = _.map(services, (service, key) => {
  		return (
  			<a className="service-item" target="_blank" href={service.url} key={key}>
  				<div className="modal-item row" data-radium="true">
  					<div className="item-body" data-radium="true">
  						<div className="item-text" data-radium="true">
  							<div className="item-title">{service.DisplayName}</div>
  							<div>{service.description}</div>
  						</div>
  					</div>
  				</div>
  			</a>
  		)
  	})
    return (
    	<div className="services-container">
    		{links}
    	</div>
    )
  }
}

export default compose()(Services);
