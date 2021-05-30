import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      user: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();
    
    const {email, username, password} = this.state
    console.log(email,"ttt")
    const user = {email: this.state.email, username: this.state.username, password: this.state.password}
    console.log(user)
    axios.post('/auth/sign-up', user)
      .then(res => console.log(res.data));

    this.setState({
      username: ''
    })
  }


  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  /*componentDidMount() {
    axios.get('http://localhost:5000/exercises/')
      .then(response => {
        this.setState({ exercises: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteExercise(id) {
    axios.delete('http://localhost:5000/exercises/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    })
  }

  exerciseList() {
    return this.state.exercises.map(currentexercise => {
      return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id}/>;
    })
  }*/

  render() {
    return (
      <div id="form-container">
        <form class="form" onSubmit={this.onSubmit}>
          <figure aria-hidden="true">
            <div class="person-body"></div>
            <div class="neck skin"></div>
            <div class="head skin">
              <div class="eyes"></div>
              <div class="mouth"></div>
            </div>
            <div class="hair"></div>
            <div class="ears"></div>
            <div class="shirt-1"></div>
            <div class="shirt-2"></div>
          </figure>
          <div className="form-group"> 
          <label class="label-email">
              <span class="required">Username</span>
              <input  
                type="text"
                required
                className="text"
                value={this.state.username}
                onChange={this.onChangeUsername}
                name="username" 
                placeholder="Username" 
                tabindex="1" 
                autocomplete="off"
              />
            </label>
            <label class="label-email">
              <span class="required">Email</span>
              <input  
                type="email"
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
            <input type="submit" value="Log in" className="btn btn-primary" />
          </div>
          <div class="email">
            <a href="./log-in">Already have an account? Log in!</a>
          </div>
          
        </form>
      </div>
    )
  }
}