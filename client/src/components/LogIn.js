import React, { Component } from 'react';
import axios from 'axios';
import '../styles/form.css';
import logo from '../assets/logo2.png'; // with import

export default class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      user: false,
    }
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    axios.get('/auth/user')
      .then(res => {this.setState({user: res.data})
      console.log(res.data,res.data.username)
      if (res.data.username) {
        window.location = "/chat"
      }
    });
    console.log(this.state.user)
    
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    axios.post('/auth/log-in', {email: this.state.email, password: this.state.password})
      .then(res => {
        console.log(res.data)
        if (res.status == 200) {
          window.location = "/chat"
        }
      });

    this.setState({
      username: ''
    })
  }

  render() {
    return (
      <div id="form-container">
        <form class="form" onSubmit={this.onSubmit}>
          <img src={logo} id="logo" ></img>
          <div className="form-group"> 
            <label class="label-email">
              <span class="required">Email</span>
              <input  
                required
                className="text"
                value={this.state.email}
                onChange={this.onChangeEmail}
                name="email" 
                placeholder="Email" 
                tabindex="1" 
                autocomplete="off"
              />
            </label>
            <label class="label-email">
              <span class="required">Password</span>
              <input  
                required
                className="text"
                value={this.state.password}
                onChange={this.onChangePassword}
                placeholder="Password" 
                tabindex="1" 
                autocomplete="off"
              />
            </label>
          </div>
          <div className="form-group">
            <input type="submit" value="Log in" className="" />
          </div>
          <div class="email">
            <a href="./sign-up">Don't have an account? Sign up!</a>
          </div>
          
        </form>
      </div>
    )
  }
}