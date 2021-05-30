import React, { Component } from 'react';
import '../../styles/chatrooms.css';
import axios from 'axios';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatrooms: [],
    }
    //this.componentDidMount = this.componentDidMount.bind(this);
  }
    
  
  render() {
    const chatroomDivs = Object.keys(this.props.chatrooms).map((room_name,index) => (
			<div className="chatroomDiv" key={index} onClick={() => this.props.openChatroom(room_name)}>
        <h2 className="chatroomDivName">{room_name}</h2>
      </div>
    ))
    // const chatroomDivs = this.state.chatrooms.map((roomId,index) => (
		// 	<div key={index}>
		// 		<h3>
		// 			{roomId}
		// 		</h3>
		// 	</div>
    // ))
    return (
    <div id="chatroomDivsContainer">
      {chatroomDivs}
    </div>
    )
  }
}