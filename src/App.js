import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { authUrl, cdriveUrl } from './GlobalVariables';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      fullname: ''
    }
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
        });
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
      return(
        <div className="cdrive-container" >
          <div className="left-panel">
            <nav className="navbar navbar-expand navbar-light">
              <a href="#home" className="navbar-brand">Columbus</a>
            </nav>
            <div className="side-bar">
              <button type="button" className="btn btn-primary">
                Upload File
              </button>
              <ul className="side-bar-list">
                <li className="side-bar-list-item">My Files</li>
                <li className="side-bar-list-item">Shared With Me</li>
                <li className="side-bar-list-item">Services</li>
              </ul>
            </div>
          </div>
          <div className="right-panel">
            <nav className="navbar navbar-expand navbar-light">
              <a href="#home" className="navbar-brand">CDrive</a>
              <div className="justify-content-end navbar-collapse collapse">
                <span className="navbar-text">
                  Signed in as: <a href="#login">{this.state.fullname}</a>
                </span>
              </div>
            </nav>
          </div>
        </div>
      );
    }
  }
}

export default App;
