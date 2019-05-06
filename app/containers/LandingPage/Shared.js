import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fileTemplate from '../../assets/filetemplate.png'
import _ from 'underscore'

export class Shared extends React.PureComponent {

  componentWillMount() {
    const { getSharedFiles } = this.props
    getSharedFiles()
  }
  
  render() {
  	const { sharedFiles, downloadSharedFile } = this.props
  	const icons = _.map(sharedFiles, (file, i) => {
  		return (
  			<div className="file-container" key={i}>
	  			<div className="file-cell tall">
	  				<div className="file-template">
	  					<img
                alt=""
                src={fileTemplate}
              />
	  				</div>
	  				<div className="file-name">
              <div className="row">
                <div className="col-sm-9" style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>
                  {file.file_name}
                </div>
                <div className="col-sm-3">
                  <span onClick={() => downloadSharedFile(file.file_name, file.file_owner)} style={{width: '50%', display: 'inline-block'}}><FontAwesomeIcon icon="download" /></span>
                </div>
              </div>
	  				</div>
	  			</div>
	  		</div>
  		)
  	})
    return (
    	<div>
	      {
	        sharedFiles.length > 0 ? (
	          <div className="file-grid">
	            {icons}
	          </div>
	        ) : (
	          <h3 style={{paddingTop: '20px'}}>No file has been shared with you.</h3>
	        )
	      }
      </div>
    )
  }
}

export default compose()(Shared);