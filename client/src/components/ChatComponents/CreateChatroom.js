import React, { Component } from 'react';
import axios from 'axios';
import LocalHospitalSharpIcon from '@material-ui/icons/LocalHospitalSharp';
import '../../styles/createChatroom.css';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

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
    this.removeUser = this.removeUser.bind(this);
  }

  componentDidMount() {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
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
        console.log(res.data);
        this.props.onCreateChatroom(res.data);
        document.getElementById("myModal").style.display = "none";
      }).catch(err => {
        console.log(err);
      });
  }

  addUser() {
    var {users} = this.state;
    users.push("");
    this.setState({users: users});
  }

  removeUser() {
    var {users} = this.state;
    if (users.length == 1) {
      return
    }
    users.pop();
    this.setState({users: users});
  }

  toggleCreateChatroomVisibility() {
    this.setState({users: [""], room_name: ""});
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  render() {
    const userInputs = this.state.users.map((user,index) => (
      <input  
        type="text"
        required
        className="input participant-input"
        value={user}
        onChange={(e) => this.onChangeUser(e,index)}
      />
    ))
    return (
      <>
        <button id="createChatroomToggleVisibilityButton" onClick={() => this.toggleCreateChatroomVisibility()}>
          <div id="plus">
            
          </div>
        </button> 
        
        <div id="myModal" className="modal">
          <div class="modal-content">
            <span className="close">&times;</span>
            <form id="createChatroomForm" onSubmit={(e) => this.createChatroom(e)}>
              <div className="form-group"> 
                <label class="required">Chatroom name </label>
                <input 
                  className="input" 
                  type="text"
                  required
                  value={this.state.room_name}
                  onChange={this.onChangeRoomName}
                />
              </div>
              <div className="form-group">
                <label class="required">Participants:</label>
                { userInputs }
                <AddCircleOutlineIcon onClick={() => this.addUser()} className="form-icon"/>
                <RemoveCircleOutlineIcon onClick={() => this.removeUser()} className="form-icon"/>
                
              </div>
              <div className="form-group">
                <input id="createChatroomButton" type="submit" value="Create Chatroom" className="btn btn-primary" />
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }
}