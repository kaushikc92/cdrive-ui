import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap'

export class Shared extends React.PureComponent {
	constructor() {
		super()
		this.onChange = this.onChange.bind(this)
		this.state = {
			email: ""
		}
	}

	onChange(e) {
		this.setState({email: e.target.value})
	}

  render() {
  	const { isOpen, toggleModal, selectedFiles, shareFile } = this.props
    return (
    	<Modal show={isOpen} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share with others</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        	<div style={{paddingBottom: '10px'}}>{selectedFiles[0]}</div>
        	<form className="" method="post" onSubmit={e => shareFile(e)}>
        		<div className="form-group ">
              <input type="email"  className="form-control" name="email" value={this.state.email} placeholder="Email" title="Email" required onChange={this.onChange}/>
            </div>
        	</form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={e => shareFile(e, this.state.email)}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default compose()(Shared);