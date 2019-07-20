import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { cdriveApiUrl } from './GlobalVariables';
import './FileTable.css';

class Applications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentApp: '',
    }
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
  renderAppName(appName, appUrl) {
    return(

    );
  }
  render() {
    if(this.props.applications.length === 0) {
      return(null);
    }
    let rows;
    rows = this.props.applications.map((app, i) => (
      <tr key={i}>
        <td><a className="file-table-text" href={app.app_url}>{app.app_name}</a></td>
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
