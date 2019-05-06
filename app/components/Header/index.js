import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';
import './Header.scss'
import { connect } from 'react-redux';
import Logo from '../../assets/uwlogo.png'
import PythonLogo from '../../assets/python.png'
import RLogo from '../../assets/R.png'
import PostgresLogo from '../../assets/postgres.png'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
//import { logout } from "../../containers/LoginPage/actions"

/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {

  render() {
    //const { app, logout } = this.props
    const { app } = this.props
    const { userDetails } = app
    return (
      <Navbar collapseOnSelect expand="lg">
        <Navbar.Brand href="/home">
          {/*<img
            alt=""
            src={Logo}
            width="26"
            height="30"
            className="d-inline-block align-top"
          />*/}
          {' Columbus '}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Navbar.Text>
            {
              window.location.pathname != '/login' ? <span><span>{userDetails.firstname} {userDetails.lastname}</span>'s CDrive</span> : ""
            }
          </Navbar.Text>
          <Nav className="mr-auto">
          </Nav>
          <Nav>
              {/*  <Nav.Link href="#" onClick={e => logout()}>Logout</Nav.Link> */ }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
          
    )
  }
}

const mapStateToProps = state => ({
  app: state.get('app')
})

const mapDispatchToProps = dispatch => ({
    //logout: () => dispatch(logout()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

