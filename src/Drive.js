import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropzone from 'react-dropzone';
import { FaFile } from 'react-icons/fa';
import { FaFolder } from 'react-icons/fa';
import { cdriveApiUrl } from './GlobalVariables';
import ShareModal from './ShareModal';
import './FileTable.css';
import './Drive.css';

class Drive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: 'Home/' + this.props.username,
      driveObjects: [],
    };
    this.getDriveObjects = this.getDriveObjects.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.directUpload = this.directUpload.bind(this);
    this.chunkedUpload = this.chunkedUpload.bind(this);
    this.breadcrumbClick = this.breadcrumbClick.bind(this);
  }
  componentDidMount() {
    this.getDriveObjects();
  }
  getDriveObjects() {
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'GET',
      url: `${cdriveApiUrl}list/?path=${this.state.path}`,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        this.setState({driveObjects: response.data});
      },
    );
  }
  handleUpload(acceptedFiles) {
    var file = acceptedFiles[0];
    if (file.size < (15 * 1024 * 1024)) {
      this.directUpload(file);
    } else {
      this.chunkedUpload(file);
    }
  }
  directUpload(file) {
    const data = new FormData();
    var path = this.state.path;
    data.append('path', path);
    data.append('file', file);
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
      },
    );
  }
  chunkedUpload(file) {
    var data = new FormData();
    var path = this.state.path;
    data.append('path', path);
    data.append('file_name', file.name);
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    var request = axios({
      method: 'POST',
      url: `${cdriveApiUrl}initiate-chunked-upload/`,
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        var uploadId = response.data.uploadId;
        var chunkSize = 10 * 1024 * 1024;
        var offset = 0;
        var partNumber = 0;
        var chunkReaderBlock = null;
        var mpu = [];

        var readEventHandler = function(evt) {
          if (evt.target.error == null) {
            offset += evt.target.result.length;
            partNumber += 1;

            data = new FormData();
            data.append('partNumber', partNumber);
            data.append('path', path);
            data.append('file_name', file.name);
            data.append('uploadId', uploadId);
            data.append('chunk', evt.target.result);

            axios({
              method: 'POST',
              url: `${cdriveApiUrl}upload-chunk/`,
              data: data,
              headers: {'Authorization': auth_header}
            }).then(
              resp2 => {
                mpu.push(resp2.data.ETag);
                if (offset >= file.size) {
                  data = new FormData();
                  data.append('path', path);
                  data.append('file_name', file.name);
                  data.append('uploadId', uploadId);
                  data.append('partInfo', mpu);
                  data.append('size', file.size);

                  axios({
                    method: 'POST',
                    url: `${cdriveApiUrl}complete-chunked-upload/`,
                    data: data,
                    headers: {'Authorization': auth_header}
                  });
                  return;
                } else {
                  chunkReaderBlock(offset, chunkSize, file);
                }
              },
            );
          } else {
            console.log("Read error: " + evt.target.error);
            return;
          }
        }

        chunkReaderBlock = function(_offset, length, _file) {
          var r = new FileReader();
          var blob = _file.slice(_offset, length + _offset);
          r.onload = readEventHandler;
          r.readAsText(blob);
        }

        chunkReaderBlock(offset, chunkSize, file);
      },
    );
  }
  breadcrumbClick(index) {
    var tokens = this.state.path.split("/");
    var newPath = tokens.slice(0,index+1).join("/");
    this.setState({path: newPath});
    this.getDriveObjects();
  }
  render() {
    var tokens = this.state.path.split("/");
    let items;

    items = tokens.map((token, i) => {
      if(i === tokens.length - 1){
        return (<li className="breadcrumb-item active" aria-current="page"><button className="btn" disabled>{token}</button></li>);
      } else {
        return (<li className="breadcrumb-item"><button onClick={() => this.breadcrumbClick(i)} className="btn btn-link">{token}</button></li>);
      }
    });

    let table;
    if(this.state.driveObjects.length !== 0) {
      let rows;
      rows = this.state.driveObjects.map((dobj, i) => {
        let size, name;
        if (dobj.type === "Folder") {
          name = 
            <td>
              <div className="file-table-text">
                <FaFolder style={{marginRight: 6 }} size={25} color="#92cefe" />
                {dobj.name}
              </div>
            </td> ;
          size = <td><div className="file-table-text"></div></td> ;
        } else {
          name = 
            <td>
              <div className="file-table-text">
                <FaFile style={{marginRight: 6 }} size={25} color="#9c9c9c" />
                {dobj.name}
              </div>
            </td> ;
          size = <td><div className="file-table-text">{dobj.size}</div></td> ;
        }
        return (
          <tr key={i}>
            {name}
            {size}
            <td><div className="file-table-text">{dobj.owner}</div></td>
          </tr>
        );
      });
      table = (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      );
    }

    return(
      <Dropzone onDrop={acceptedFiles => this.handleUpload(acceptedFiles)} noClick noKeyboard>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()} className="drive-container" >
            <input {...getInputProps()} />
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent">
                {items}
              </ol>
            </nav>
            {table}
          </div>
        )}
      </Dropzone>
    );
  }
}

export default Drive;
