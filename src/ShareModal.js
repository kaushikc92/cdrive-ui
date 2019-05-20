import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class ShareModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: ""
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(e) {
    this.setState({email: e.target.value});
  }
  render() {
    return(
      <Modal show={this.props.show} onHide={this.props.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share with others</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{paddingBottom: '10px'}}>{this.props.selectedFile}</div>
            <div className="form-group ">
              <input type="email"  className="form-control" name="email" value={this.state.email} 
                placeholder="Email" title="Email" required onChange={this.onChange}/>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={e => this.props.shareFile(e, this.state.email)}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ShareModal;
