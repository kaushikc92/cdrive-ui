import React from 'react';
import './App.css';

class App extends React.Component {
  render() {
    return(
      <div className="cdrive-container" >
        <div className="left-panel">
          <nav className="navbar navbar-expand navbar-light">
            <a href="#home" className="navbar-brand">Columbus</a>
          </nav>
          <div className="side-bar">
            <button type="button" className="btn btn-primary">
              Upload File
            </button>
            <ul className="side-bar-list">
              <li className="side-bar-list-item">My Files</li>
              <li className="side-bar-list-item">Shared With Me</li>
              <li className="side-bar-list-item">Services</li>
            </ul>
          </div>
        </div>
        <div className="right-panel">
          <nav className="navbar navbar-expand navbar-light">
            <a href="#home" className="navbar-brand">CDrive</a>
            <div className="justify-content-end navbar-collapse collapse">
              <span className="navbar-text">
                Signed in as: <a href="#login">Kaushik Chandrasekhar</a>
              </span>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default App;
