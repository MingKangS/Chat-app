import React, { Component } from 'react';
import axios from 'axios';
import LocalHospitalSharpIcon from '@material-ui/icons/LocalHospitalSharp';
import '../../styles/createChatroom.css';

export default class CreateChatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [""],
      room_name: "",
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onChangeRoomName = this.onChangeRoomName.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.createChatroom = this.createChatroom.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount() {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    console.log(modal, span)
    // When the user clicks on <span> (x), close the modal

    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  onChangeRoomName = (e) => {
    this.setState({
      room_name: e.target.value
    })
  }

  onChangeUser(e,index) {
    var {users} = this.state;
    users[index] = e.target.value;
    this.setState({
      users: users,
    })
  }

  createChatroom(e) {
    e.preventDefault();
    axios.post('/chat/create-chatroom', {room_name: this.state.room_name, participants: this.state.users})
      .then(res => {
        this.props.onCreateChatroom(res.data);
      });

    this.setState({
      users: [],
      room_name: ""
    })
  }

  addUser() {
    var {users} = this.state;
    users.push("");
    this.setState({users: users});
  }

  toggleCreateChatroomVisibility() {
    this.setState({users: [""]});
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  render() {
    const userInputs = this.state.users.map((user,index) => (
      <input  type="text"
        required
        className="form-control"
        value={user}
        onChange={(e) => this.onChangeUser(e,index)}
      />
    ))
    return (
      <>
        <button id="createChatroomToggleButton" onClick={() => this.toggleCreateChatroomVisibility()}>
          <LocalHospitalSharpIcon fontSize="60px" id="plusIcon"/>
        </button> 
        <div id="myModal" className="modal">
          <div class="modal-content">
            <span className="close">&times;</span>
            <form id="createChatroomForm" onSubmit={(e) => this.createChatroom(e)}>
              <div className="form-group"> 
                <label>Chatroom name </label>
                <input  type="text"
                  required
                  className="form-control"
                  value={this.state.room_name}
                  onChange={this.onChangeRoomName}
                />
                <label>Participants: </label>
                { userInputs }
                <button  onClick={() => this.addUser()}>Add particiant</button> 
              </div>
              <div className="form-group">
                <input type="submit" value="Create Chatroom" className="btn btn-primary" />
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }
}