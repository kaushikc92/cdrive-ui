import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import './App.css';

class App extends React.Component {
  render() {
    return(
      <div className="cdrive-container" >
        <div className="left-panel">
          <Navbar>
            <Navbar.Brand href="#home">Columbus</Navbar.Brand>
          </Navbar>
          <div className="side-bar">
            <Button variant="primary">
              Upload File
            </Button>
            <ul className="side-bar-list">
              <li className="side-bar-list-item">My Files</li>
              <li className="side-bar-list-item">Shared With Me</li>
              <li className="side-bar-list-item">Services</li>
            </ul>
          </div>
        </div>
        <div className="right-panel">
          <Navbar>
            <Navbar.Brand href="#home">CDrive</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Signed in as: <a href="#login">Kaushik Chandrasekhar</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
    );
  }
}

export default App;
