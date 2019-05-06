import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import UploadFileIcon from '../../assets/uploadfile.png'
const baseURl = "http://localhost:8000/"
import _ from 'underscore'


export class UploadCSV extends React.PureComponent {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  // componentDidMount() {
  //   if (this.props.username && this.props.username.trim().length > 0) {
  //     this.props.onSubmitForm();
  //   }
  // }
  constructor(props) {
    super(props);

    this.state = {
      fileName: null,
      python: false,
      rLanguage: false,
      postgres: false,
      query: ""
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.openFileHandler = this.openFileHandler.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this)
    this.submitQuery = this.submitQuery.bind(this)
    this.onChangeTextarea = this.onChangeTextarea.bind(this)
  }

  onChangeTextarea(e) {
    this.setState({query: e.target.value});
  }

  handleInputChange(e) {
    const target = event.target;
    const name = target.name;
    this.setState({python: false, rLanguage: false, postgres: false})
    this.setState({
      [name]: true
    });
  }

  submitQuery(e) {
    e.preventDefault();
  }

  handleUploadImage(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);

    fetch(baseURl + 'upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
      });
    });
  }

  openFileHandler() {
    this.uploadInput.click();
  }

  onChange(e) {
    let file = this.uploadInput.files[0]
    let fileName = file.name
    this.setState({fileName: fileName})
  }

  render() {
    const { fileName, python, rLanguage, postgres, query } = this.state
    return (
      <div class="tall">
        <div className="csv-form-body" >
          <div className="align-middle-container tall wide">
            <div className="align-middle-content">
              <div className="tall">
                <div className="csv-form-container tall">
                  <div className="csv-form tall">
                    <div class="card-heading">
                      <strong>Upload CSV File</strong>
                    </div>
                    <form className="csv-form-uploader tall" method="post" onSubmit={this.handleUploadImage}>
                      <input type="file" accept=".csv" ref={(ref) => { this.uploadInput = ref; }} name="csv" className="sr-only" onChange={(e) => this.onChange(e)}/>
                      <button role="button" type="button" className=""  style={{display: 'contents'}}>
                        <div className="dashboard-upload-modal-btn-img">
                          <img alt="upload new resume" src={UploadFileIcon}  onClick={this.openFileHandler}/>
                        </div>
                        <div className="dashboard-upload-modal-btn-text" style={{fontSize: '14px', paddingTop: '10px'}}>{fileName ? fileName : 'Click to select a file'}</div>
                      </button>
                      <div style={{paddingTop: '20px'}}>
                        <button role="button" type="button" class="btn btn-primary btn-lg" disabled={fileName ? false : true} onClick={this.handleUploadImage}>
                          <span>
                            <span class="icon-upload">Upload CSV</span>
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="csv-form-body query-container" style={{marginTop: '10px'}}>
          <div className="align-middle-container tall wide">
            <div className="align-middle-content">
              <div className="tall">
                <div className="csv-form tall" style={{textAlign: 'left'}}>
                  <div class="card-heading">
                    <strong>Write Your Query</strong>
                  </div>
                  <form onSubmit={this.submitQuery}>
                    <label style={{cursor: 'pointer'}}>
                      <input
                        name="python"
                        type="radio"
                        checked={this.state.python}
                        onChange={this.handleInputChange} />
                      &nbsp;&nbsp;&nbsp;Python
                    </label>
                    <br />
                    <label style={{cursor: 'pointer'}}>
                      <input
                        name="rLanguage"
                        type="radio"
                        checked={this.state.rLanguage}
                        onChange={this.handleInputChange} />
                      &nbsp;&nbsp;&nbsp;R Language
                    </label>
                    <br/>
                    <label style={{cursor: 'pointer'}}>
                      <input
                        name="postgres"
                        type="radio"
                        checked={this.state.postgres}
                        onChange={this.handleInputChange} />
                      &nbsp;&nbsp;&nbsp;Postgres
                    </label>
                    <br/>
                    <textarea placeholder="write query here" name="textarea" value={this.state.query} onChange={this.onChangeTextarea}>
                    </textarea>
                    <div style={{marginTop: '10px', textAlign: 'center'}}>
                      <button className="btn btn-primary btn-lg" disabled={!_.isEmpty(query) && (postgres || python || rLanguage) ? false : true}>Execute query</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default compose()(UploadCSV);