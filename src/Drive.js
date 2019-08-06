import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropzone from 'react-dropzone';
import { cdriveApiUrl } from './GlobalVariables';
import ShareModal from './ShareModal';
import './FileTable.css';
import './Drive.css';

class Drive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: 'Home/' + this.props.username,
    }
    this.handleUpload = this.handleUpload.bind(this);
  }
  handleUpload(acceptedFiles) {
    var file = acceptedFiles[0];

    const data = new FormData();
    var path = this.state.path + '/' + file.name;
    data.append('path', path);
    const cookies = new Cookies();
    var auth_header = 'Bearer ' + cookies.get('columbus_token');
    const request = axios({
      method: 'POST',
      url: `${cdriveApiUrl}initiate-chunked-upload/`,
      data: data,
      headers: {'Authorization': auth_header}
    });
    request.then(
      response => {
        var uploadId = response.data.uploadId;
        var fileSize = file.size;
        var chunkSize = 10 * 1024 * 1024;
        var offset = 0;
        var partNumber = 0;
        var chunkReaderBlock = null;
        var mpu = [];

        var readEventHandler = function(evt) {
          if (evt.target.error == null) {
            offset += evt.target.result.length;
            partNumber += 1;

            const data2 = new FormData();
            data2.append('partNumber', partNumber);
            data2.append('path', path);
            data2.append('uploadId', uploadId);
            data2.append('chunk', evt.target.result);

            const req2 = axios({
              method: 'POST',
              url: `${cdriveApiUrl}upload-chunk/`,
              data: data2,
              headers: {'Authorization': auth_header}
            });
            req2.then(
              resp2 => {
                mpu.push(resp2.data.ETag);
                if (offset >= fileSize) {
                  console.log("Done reading file");
                  const data3 = new FormData();
                  data3.append('path', path);
                  data3.append('uploadId', uploadId);
                  data3.append('partInfo', mpu);
                  data3.append('size', file.size);

                  const req3 = axios({
                    method: 'POST',
                    url: `${cdriveApiUrl}complete-chunked-upload/`,
                    data: data3,
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
  render() {
    return(
      <Dropzone onDrop={acceptedFiles => this.handleUpload(acceptedFiles)} noClick>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()} className="drive-container" >
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>
    );
  }
}

export default Drive;
