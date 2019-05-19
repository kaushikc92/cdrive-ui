import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { authUrl, cdriveUrl } from './GlobalVariables';
import Drive from './Drive';
import Shared from './Shared';
import Applications from './Applications';
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
      //firstname: '',
      isUploading: false,
      activeTab: 'drive'
    };
    this.fileInput = React.createRef();
    this.onUploadClick = this.onUploadClick.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }
  authenticateUser() {
    const cookies = new Cookies();
    var columbus_token = cookies.get('columbus_token');
    if (columbus_token !== undefined) {
      this.fetchUserDetails();
      return(null);
    }
    var url_string = window.location.href;
    var url = new URL(url_string);
    var code = url.searchParams.get("code");
    if (code == null) {
      const request = axios({
        method: 'GET',
        url: `${cdriveUrl}client-id/`
      });
      request.then(
        response => {
          var client_id = response.data.client_id;
          var uri = `http://` + window.location.host + window.location.pathname;
          window.location.href = `${authUrl}o/authorize/?response_type=code&client_id=${client_id}&redirect_uri=${uri}&state=1234xyz`;
        },
      );
    } else {
      const request = axios({
        method: 'POST',
        url: `${cdriveUrl}authentication-token/`,
        data: {
          code: code,
          redirect_uri: `http://` + window.location.host + window.location.pathname
        }
      });
      request.then(
        response => {
          cookies.set('columbus_token', response.data.access_token);
          this.fetchUserDetails();
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
      url: `${cdriveUrl}user-details/`,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({
          username: response.data.username,
          fullname: response.data.firstname + ' ' + response.data.lastname
          //firstname: response.data.firstname
        });
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
      url: `${cdriveUrl}upload/`,
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({isUploading: false});
      }
    );
    this.fileInput.current.value = "";
  }
  handleTabClick(event) {
    console.log(event.target.getAttribute('tab-id'));
    this.setState({activeTab: event.target.getAttribute('tab-id')});
  }
  render() {
    if (this.state.username === '') {
      this.authenticateUser();
      return (null);
    } else {
      var logoutUrl = `${authUrl}accounts/logout/`;
      let tab = tabs[this.state.activeTab];
      return(
        <div className="cdrive-container" >
          <div className="left-panel">
            <nav className="navbar navbar-expand navbar-light">
              <span className="navbar-brand">CDrive</span>
            </nav>
            <div className="side-bar">
              <form className="form-upload" method="post">
                <input type="file" className="file-upload-input" ref={this.fileInput}
                  onChange={this.handleUploadFile}/>
                <button type="button" className="btn btn-primary" onClick={this.onUploadClick} >
                  Upload File
                </button>
              </form>
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
                  <Dropdown.Item href={logoutUrl} >Logout</Dropdown.Item>
                </DropdownButton>
              </div>
            </nav>
            <tab.Component /> 
          </div>
        </div>
      );
    }
  }
}

export default App;
