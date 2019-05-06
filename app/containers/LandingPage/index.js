
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Drive from './Drive'
import Shared from './Shared'
import Sidebar from './Sidebar'
import Services from './Services'
import { changeModule, uploadCsv, getFiles, deleteFile, downloadFile,
    getServices, selectFile, shareFileWithOthers, getSharedFiles, 
    downloadSharedFile, authenticateUser } from './actions'

const tabs = {
  drive: {
    DisplayName: "My CDrive",
    Component: Drive,
  },
  shared: {
    DisplayName: "Shared with me",
    Component: Shared,
  },
  services: {
    DisplayName: "Services",
    Component: Services,
  }
}

/* eslint-disable react/prefer-stateless-function */
export class LandingPage extends React.PureComponent {

  componentDidMount() {
    /*  
    const { getFiles, getServices, getSharedFiles } = this.props
    getFiles()
    getSharedFiles()
    getServices()
    */
  }

  render() {
    const { authenticateUser, getFiles } = this.props;
    if (authenticateUser()) {
        return <h1>Welcome back!</h1>;
    } else {
        return (null);
    }
    /*  
    const { landingPage, changeModule, uploadCsv, deleteFile, downloadFile, selectFile, shareFileWithOthers, getSharedFiles, downloadSharedFile } = this.props
    let tab = tabs[landingPage.module]
    return (
      <div className="home-container tall">
        <div className="row tall">
          <div className="col-sm-2 tall" style={{padding: '0px', maxWidth: '14%'}}>
            <Sidebar changeModule={changeModule} tabs={tabs} uploadCsv={uploadCsv} activeModule={landingPage.module}/>
          </div>
          <div className="col-sm-10 tall" style={{maxWidth: '86%', flex: '0 0 85.333333%'}}>
            <tab.Component downloadSharedFile={downloadSharedFile} getSharedFiles={getSharedFiles} shareFileWithOthers={shareFileWithOthers} selectFile={selectFile} files={landingPage.files} sharedFiles={landingPage.sharedFiles} deleteFile={deleteFile} downloadFile={downloadFile} services={landingPage.services} selectedFiles={landingPage.selectedFiles}/>
          </div>
        </div>
      </div>
    )
    */
  }
}

const mapStateToProps = state => ({
  landingPage: state.get('landingPage')
})

const mapDispatchToProps = dispatch => ({
  changeModule: name => dispatch(changeModule(name)),
  uploadCsv: data => dispatch(uploadCsv(data)),
  getFiles: () => dispatch(getFiles()),
  deleteFile: fileName => dispatch(deleteFile(fileName)),
  downloadFile: fileName => dispatch(downloadFile(fileName)),
  getServices: () => dispatch(getServices()),
  selectFile: (filename) => dispatch(selectFile(filename)),
  shareFileWithOthers: (data) => dispatch(shareFileWithOthers(data)),
  getSharedFiles: () => dispatch(getSharedFiles()),
  downloadSharedFile: (file_name, file_owner) => dispatch(downloadSharedFile(file_name, file_owner)),
  authenticateUser: () => dispatch(authenticateUser()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage)
