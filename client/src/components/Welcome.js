import React, { Component } from 'react';
import axios from 'axios';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false,

    }
    
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
  render() {
    return (
    <div>
      <h1>WC</h1>
      <a href="/log-in">
        <button>Log in</button>
      </a>

      <a href="/sign-up">
        <button>Sign up</button>
      </a>
    </div>
    )
  }
}