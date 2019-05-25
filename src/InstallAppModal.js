import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class InstallAppModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dockerLink: ""
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(e) {
    this.setState({dockerLink: e.target.value});
  }
  render() {
    return(
      <Modal show={this.props.show} onHide={this.props.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Install Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{paddingBottom: '10px'}}>{this.props.selectedFile}</div>
            <div className="form-group ">
              <input type="text"  className="form-control" name="docker-link" value={this.state.dockerLink} 
                placeholder="Application Image Url" required onChange={this.onChange}/>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={e => this.props.installApp(e, this.state.dockerLink)}>
            Install
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default InstallAppModal;
