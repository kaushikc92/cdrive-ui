import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { authenticationUrl, cdriveApiUrl, cdriveUrl } from './GlobalVariables';
import Drive from './Drive';
import Shared from './Shared';
import Applications from './Applications';
import InstallAppModal from './InstallAppModal';
import './App.css';

const tabs = {
  drive: {
    DisplayName: "My Files",
    Component: Drive,
  },
  shared: {
    DisplayName: "Shared with me",
    Component: Shared,
  },
  applications: {
    DisplayName: "Applications",
    Component: Applications,
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      fullname: '',
      isUploading: false,
      activeTab: 'drive',
      files: [],
      applications: [],
      showInstallAppDialog: false
    };
    this.fileInput = React.createRef();
    this.onUploadClick = this.onUploadClick.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.getApplications = this.getApplications.bind(this);
    this.handleInstallAppClick = this.handleInstallAppClick.bind(this);
    this.installApp = this.installApp.bind(this);
    this.toggleInstallAppDialog = this.toggleInstallAppDialog.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }
  authenticateUser() {
    const cookies = new Cookies();
    var columbus_token = cookies.get('columbus_token');
    if (columbus_token !== undefined) {
      this.fetchUserDetails();
      this.getFiles();
      return(null);
    }
    var url_string = window.location.href;
    var url = new URL(url_string);
    var code = url.searchParams.get("code");
    if (code == null) {
      const request = axios({
        method: 'GET',
        url: `${cdriveApiUrl}client-id/`
      });
      request.then(
        response => {
          var client_id = response.data.client_id;
          //var uri = `http://` + window.location.host + window.location.pathname;
          //window.location.href = `${authUrl}o/authorize/?response_type=code&client_id=${client_id}&redirect_uri=${uri}&state=1234xyz`;
          var redirect_uri = `${cdriveUrl}`;
          const link = document.createElement('a');
          link.href = `${authenticationUrl}o/authorize/?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=1234xyz`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
      );
    } else {
      const request = axios({
        method: 'POST',
        url: `${cdriveApiUrl}authentication-token/`,
        data: {
          code: code,
          redirect_uri: `${cdriveUrl}`
        }
      });
      request.then(
        response => {
          cookies.set('columbus_token', response.data.access_token);
          this.fetchUserDetails();
          this.getFiles();
        },
        err => {
        }
      );
    }
  }
  fetchUserDetails() {
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'GET',
      url: `${cdriveApiUrl}user-details/`,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({
          username: response.data.username,
          fullname: response.data.firstname + ' ' + response.data.lastname
        });
      },
      err => {
        const cookies = new Cookies();
        cookies.remove('columbus_token'); 
      }
    );
  }
  getFiles() {
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'GET',
      url: `${cdriveApiUrl}list/`,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({files: response.data});
      },
      err => {
      }
    );
  }
  onUploadClick() {
    this.fileInput.current.click();
  }
  handleUploadFile(event) {
    event.preventDefault();
    const data = new FormData();
    data.append('file', this.fileInput.current.files[0]);
    this.setState({isUploading: true});
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'POST',
      url: `${cdriveApiUrl}upload/`,
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({isUploading: false});
        this.getFiles();
      }
    );
    this.fileInput.current.value = "";
  }
  getApplications() {
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'GET',
      url: `${cdriveApiUrl}applications-list/`,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({applications: response.data});
      },
      err => {
      }
    );
  }
  handleInstallAppClick(event) {
    this.toggleInstallAppDialog();
  }
  toggleInstallAppDialog() {
    this.setState({ showInstallAppDialog: !this.state.showInstallAppDialog });
  }
  installApp(event, dockerUrl) {
    event.preventDefault();
    this.setState({
      showInstallAppDialog: false
    });
    const data = new FormData();
    data.append('app_docker_link', dockerUrl);
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'POST',
      url: `${cdriveApiUrl}install-application/`,
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.getApplications();
      }
    );
  }
  handleTabClick(event) {
    if(event.target.getAttribute('tab-id') === 'applications') {
      this.getApplications();
    }
    this.setState({activeTab: event.target.getAttribute('tab-id')});
  }
  deleteFile(fileName) {
    const cookies = new Cookies();
    let auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'DELETE',
      url: `${cdriveApiUrl}delete/?file_name=${fileName}`,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.getFiles();
      },
      err => {
      }
    );
  }
  handleLogoutClick(event) {
    const cookies = new Cookies();
    let auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'POST',
      url: `${cdriveApiUrl}logout/`,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        cookies.remove('columbus_token');
      },
      err => {
      }
    );
  }
  render() {
    if (this.state.username === '') {
      this.authenticateUser();
      return (null);
    } else {
      var logoutUrl = `${authenticationUrl}accounts/logout/`;
      let tab = tabs[this.state.activeTab];

      let addButton;
      if (this.state.activeTab === "applications") {
        addButton = 
          <button type="button" className="btn btn-primary" onClick={this.handleInstallAppClick} >
            Install Application
          </button> ;
      } else {
        addButton = 
          <form className="form-upload" method="post">
            <input type="file" className="file-upload-input" ref={this.fileInput}
              onChange={this.handleUploadFile}/>
            <button type="button" className="btn btn-primary" onClick={this.onUploadClick} >
              Upload File
            </button>
          </form> ;
      }
      return(
        <div className="cdrive-container" >
          <div className="left-panel">
            <nav className="navbar navbar-expand navbar-light">
              <span className="navbar-brand">CDrive</span>
            </nav>
            <div className="side-bar">
              {addButton}
              <ul className="side-bar-list">
                <li className={this.state.activeTab === "drive" ? "active-side-bar-list-item": "side-bar-list-item"} 
                  tab-id="drive" onClick={this.handleTabClick}>My Files</li>
                <li className={this.state.activeTab === "shared" ? "active-side-bar-list-item": "side-bar-list-item"} 
                  tab-id="shared" onClick={this.handleTabClick}>Shared With Me</li>
                <li className={this.state.activeTab === "applications" ? "active-side-bar-list-item": "side-bar-list-item"} 
                  tab-id="applications" onClick={this.handleTabClick}>Applications</li>
              </ul>
            </div>
          </div>
          <div className="right-panel">
            <nav className="navbar navbar-expand navbar-light">
              <span className="navbar-brand">{tab.DisplayName}</span>
              <div className="justify-content-end navbar-collapse collapse">
                <DropdownButton id="dropdown-basic-button" variant="transparent" 
                  title={this.state.fullname} alignRight >
                  <Dropdown.Item href={logoutUrl} onClick={this.handleLogoutClick}>Logout</Dropdown.Item>
                </DropdownButton>
              </div>
            </nav>
            <tab.Component files={this.state.files} deleteFile={this.deleteFile} applications={this.state.applications} /> 
          </div>
          <InstallAppModal show={this.state.showInstallAppDialog} toggleModal={this.toggleInstallAppDialog} installApp={this.installApp} >
          </InstallAppModal>
        </div>
      );
    }
  }
}

export default App;
