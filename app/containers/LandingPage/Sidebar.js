import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import _ from 'underscore'
import { Nav } from 'react-bootstrap'
import Cookies from 'js-cookie';

export class Sidebar extends React.PureComponent {
	constructor(props) {
    super(props);

    this.state = {
      fileName: null,
    };
    this.openFileHandler = this.openFileHandler.bind(this);
    this.handleUploadCSVFile = this.handleUploadCSVFile.bind(this);
  }

  openFileHandler() {
    this.uploadInput.click();
  }


  handleUploadCSVFile(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    const { uploadCsv } = this.props
    uploadCsv(data)
    this.uploadInput.value = ""
  }

  render() {
  	const { changeModule, tabs, activeModule } = this.props
  	const { fileName } = this.state
    var url = "http://localhost:4200/" + Cookies.get("cdrive_token")
  	let links = _.map(tabs, (tab, key) => {
      if(key != 'services') {
    		return (
    			<Nav.Link onClick={() => changeModule(key)} key={key} className={activeModule == key ? 'active-link' : ''}>
            {tab.DisplayName}
          </Nav.Link>
    		)
      }
  	})

    return (
    	<div className="left-sidebar tall">
    		<form className="csv-form-uploader" method="post">
    			<input type="file" accept=".csv" ref={(ref) => { this.uploadInput = ref; }} name="csv" className="sr-only" onChange={(e) => this.handleUploadCSVFile(e)}/>
	    		<button role="button" type="button" className="btn btn-upload" onClick={this.openFileHandler}>
	          <span>
	            <span className="icon-upload">Upload CSV</span>
	          </span>
	        </button>
	      </form>
	      <Nav className="flex-column left-sidebar-links">
	      	{links}
	      </Nav>
        <div style={{marginTop: '50px', borderTop: '1px solid #d6d9dc'}}>
  	      <Nav className="flex-column left-sidebar-links">
  	      	<Nav.Link onClick={() => changeModule('services')} className={activeModule == 'services' ? 'active-link' : ''}>
              Services
            </Nav.Link>
  	      </Nav>
        </div>

    	</div>
    )
  }
}

export default compose()(Sidebar);
