import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { cdriveUrl } from './GlobalVariables';
import './Drive.css';

class Drive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }
  getFiles() {
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'GET',
      url: `${cdriveUrl}list/`,
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
  componentDidMount() {
    this.getFiles();
  }
  render() {
    let rows;
    rows = this.state.files.map((fileItem, i) => (
      <tr key={i}>
        <td><div className="file-table-text">{fileItem.file_name}</div></td>
        <td><div className="file-table-text">{fileItem.file_size}</div></td>
        <td><div className="file-table-text">{fileItem.file_owner}</div></td>
        <td>
          <DropdownButton variant="transparent" 
            title="" alignRight >
            <Dropdown.Item href="#" >Share</Dropdown.Item>
            <Dropdown.Item href="#" >Download</Dropdown.Item>
            <Dropdown.Item href="#" >Delete</Dropdown.Item>
          </DropdownButton>
        </td>
      </tr>
    ));

    return(
      <div className="my-files-container right-panel-item">
        <Table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Owner</th>
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

export default Drive;
