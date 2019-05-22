import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { columbusUrl } from './GlobalVariables';
import ShareModal from './ShareModal';
import './FileTable.css';

class Drive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selectedFile: '',
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.shareFile = this.shareFile.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }
  handleShareClick(filename) {
    this.setState({selectedFile: filename});
    this.toggleModal();
  }
  shareFile(e, email) {
    e.preventDefault();
    this.setState({
      show: false,
    });
    const data = new FormData();
    data.append('file_name', this.state.selectedFile);
    data.append('share_with', email);
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    axios({
      method: 'POST',
      url: `${columbusUrl}api/v1/cdrive/share-file/`,
      data: data,
      headers: {'Authorization': auth_header}
    });
  }
  toggleModal() {
    this.setState({ show: !this.state.show });
  }
  downloadFile(fileName) {
    const cookies = new Cookies();
    let auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'GET',
      url: `${columbusUrl}api/v1/cdrive/download/?file_name=${fileName}`,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        const link = document.createElement('a');
        link.href = response.data.download_url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      err => {
      }
    );
  }
  render() {
    if(this.props.files.length === 0) {
      return(null);
    }
    let rows;
    rows = this.props.files.map((fileItem, i) => (
      <tr key={i}>
        <td><div className="file-table-text">{fileItem.file_name}</div></td>
        <td><div className="file-table-text">{fileItem.file_size}</div></td>
        <td><div className="file-table-text">{fileItem.file_owner}</div></td>
        <td>
          <DropdownButton variant="transparent" 
            title="" alignRight >
            <Dropdown.Item onClick={() => this.handleShareClick(fileItem.file_name)}>
              Share
            </Dropdown.Item>
            <Dropdown.Item onClick={() => this.downloadFile(fileItem.file_name)}>
              Download
            </Dropdown.Item>
            <Dropdown.Item onClick={() => this.props.deleteFile(fileItem.file_name)}>
              Delete
            </Dropdown.Item>
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
        <ShareModal show={this.state.show} toggleModal={this.toggleModal} selectedFile={this.state.selectedFile}
        shareFile={this.shareFile} >
        </ShareModal>
      </div>
    );
  }
}

export default Drive;
