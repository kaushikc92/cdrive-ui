import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { cdriveApiUrl, applicationsUrl } from './GlobalVariables';
import './FileTable.css';

class AppItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpening: false,
      openAppPollId: 0,
    }
    this.openApp = this.openApp.bind(this);
    this.openAppPoll = this.openAppPoll.bind(this);
  }
  openApp(event) {
    event.preventDefault();
    this.setState({
      isOpening:true,
    });

    const data = new FormData();
    data.append('app_name', this.props.appName);
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'POST',
      url: `${cdriveApiUrl}start-application/`,
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({
          openAppPollId: setInterval(() => this.openAppPoll(), 1000)
        });
      }
    );
  }
  openAppPoll() {
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'GET',
      url: `${cdriveApiUrl}app-status/?app_name=${this.props.appName}/`,
      headers: {'Authorization': auth_header}
    });
    request.then(
        response => {
          if (response.data.app_status === "Running") {
            clearInterval(this.state.openAppPollId);
            this.setState({
              isOpening: false
            });
            window.location.href = `${applicationsUrl}${this.props.username}/${this.props.appName}/`
          }
        },
        err => {
        }
    );

  }
  render() {
    let appItem;
    if (this.state.isOpening) {
      appItem =
        <div>
          <Button variant="link" onClick={this.openApp} >{this.props.appName}</Button>
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="sr-only"></span>
          </div>
        </div>
    } else {
      appItem = 
        <div>
          <Button variant="link" onClick={this.openApp} >{this.props.appName}</Button>
        </div>
    }
    return appItem;
 }
}

class Applications extends React.Component {
  constructor(props) {
    super(props);
    this.deleteApp = this.deleteApp.bind(this);
  }
  deleteApp(appName) {
    const data = new FormData();
    data.append('app_name', appName);
    const cookies = new Cookies();
    let auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'POST',
      url: `${cdriveApiUrl}delete-application/`,
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.props.getApplications();
      },
      err => {
      }
    );
  }
  render() {
    if(this.props.applications.length === 0) {
      return(null);
    }
    let rows;
    rows = this.props.applications.map((app, i) => (
      <tr key={i}>
        <td><AppItem appName={app.app_name} appUrl={app.app_url} username={this.props.username}/></td>
        <td>
          <DropdownButton variant="transparent" 
            title="" alignRight >
            <Dropdown.Item onClick={() => this.deleteApp(app.app_name)}>
              Delete
            </Dropdown.Item>
          </DropdownButton>
        </td>
      </tr>
    ));
    return(
      <div className="applications-container" >
        <Table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Applications;
