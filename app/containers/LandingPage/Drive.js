import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'underscore'
import fileTemplate from '../../assets/filetemplate.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ShareModal from './ShareModal'

export class Drive extends React.PureComponent {
  
  constructor() {
    super()
    this.handleShareClick = this.handleShareClick.bind(this)
    this.shareFile = this.shareFile.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.state = {
      isOpen: false
    }
  }

  toggleModal() {
    this.setState({isOpen: !this.state.isOpen})
  }

  shareFile(e, email) {
    e.preventDefault();
    this.setState({isOpen: false});
    const { selectedFiles, shareFileWithOthers } = this.props;
    const data = new FormData();
    data.append('file_name', selectedFiles[0]);
    data.append('share_with', email);
    shareFileWithOthers(data);
  }

  handleShareClick (filename) {
    const { selectFile } = this.props;
    selectFile(filename);
    this.toggleModal();
  }

  render() {
  	const { files, deleteFile, downloadFile, selectedFiles } = this.props
  	const icons = _.map(files, (file, i) => {
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
                <div className="col-sm-6" style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>
                  {file.file_name}
                </div>
                <div className="col-sm-6">
                  <span onClick={() => this.handleShareClick(file.file_name)} style={{width: '34%', display: 'inline-block'}}><FontAwesomeIcon icon="user-plus" /></span>
                  <span onClick={() => deleteFile(file.file_name)} style={{width: '33%', display: 'inline-block'}}><FontAwesomeIcon icon="trash" /></span>
                  <span onClick={() => downloadFile(file.file_name)} style={{width: '33%', display: 'inline-block'}}><FontAwesomeIcon icon="download" /></span>
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
        files.length > 0 ? (
          <div>
            <div className="file-grid">
              {icons}
            </div>
            <ShareModal isOpen={this.state.isOpen} toggleModal={this.toggleModal} selectedFiles={selectedFiles} shareFile={this.shareFile}/>
          </div>
        ) : (
          <h3 style={{paddingTop: '20px'}}>No files uploaded yet.</h3>
        )
      }
      </div>
    )
  }
}

export default compose()(Drive);
