import React from 'react';
import LogIn from './LogIn.jsx';
import SignUp from './SignUp.jsx';
import PinDrop from './PinDrop.jsx';
import * as Auth from './../../client/models/auth.js';


class Nav extends React.Component  {
  constructor() {
    super();
    this.state = {
      userLoggedIn: false,
      logInVisible: false,
      signUpVisible: false,
      pinDropVisible: false,
      sessionCheck: this.sessionCheck
    }
  }

  sessionCheck() {
    //When this function is triggered, the user will then have access to pin dropping.
    this.setState({userLoggedIn: true});
  }

  clickListener1() {
    this.setState({logInVisible: !this.state.logInVisible});
    if (this.state.signUpVisible) {
      this.setState({signUpVisible: false});
    }
  }

  clickListener2() {
    this.setState({signUpVisible: !this.state.signUpVisible});
    if (this.state.logInVisible) {
      this.setState({logInVisible: false});
    }
  }

  clickListener3() {
    this.setState({pinDropVisible: !this.state.pinDropVisible});
  }

  clickListener4() {
    Auth.userLogout();
    this.setState({userLoggedIn: false})
  }

  render() {
    return (
      <div>
        <div >
          <nav >
            <ul>
              <li>
                <a href="#" onClick={() => this.clickListener1()}>Log In</a>
              </li>
              <li>
                <a href="#" onClick={() => this.clickListener2()}>Sign Up</a>
              </li>
              {this.state.userLoggedIn ?
              <li>
                <a href="#" onClick={() => this.clickListener3()}>Drop Pin</a>
              </li> : null}
              <li>
                <a href="#" onClick={() => this.clickListener4()}>Log Out</a>
              </li>
            </ul>
          </nav>
        </div>
        {this.state.logInVisible ? <LogIn sessionCheck={this.state.sessionCheck.bind(this)}/> : null}
        {this.state.signUpVisible ? <SignUp sessionCheck={this.state.sessionCheck.bind(this)}/> : null}
        {this.state.pinDropVisible ? <PinDrop /> : null}
      </div>
    );
  };
};

export default Nav
