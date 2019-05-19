import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { cdriveUrl } from './GlobalVariables';
import './Drive.css';

class Drive extends React.Component {
  render() {
    let rows;
    rows = this.props.files.map((fileItem, i) => (
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
