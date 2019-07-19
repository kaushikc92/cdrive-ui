import React from 'react';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './FileTable.css';

class Applications extends React.Component {
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
            <Dropdown.Item onClick={() => this.props.deleteApp(app.app_name)}>
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
