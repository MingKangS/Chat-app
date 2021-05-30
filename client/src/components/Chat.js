import React, { Component } from 'react';
import axios from 'axios';
import Conversation from './ChatComponents/Conversation';
import LoadingChat from './ChatComponents/LoadingChat';
import CreateChatroom from './ChatComponents/CreateChatroom';
import Chatrooms from './ChatComponents/Chatrooms';
import '../styles/chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false,
      chatrooms: [],
      openedChatroom: "",
      loadingChat: true,
      createChatroomVisible: false,
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.openChatroom = this.openChatroom.bind(this);
    this.onCreateChatroom = this.onCreateChatroom.bind(this);
  }

  componentDidMount() {
    axios.get('/auth/user')
      .then(res => {
        this.setState({user: res.data.username});
        if (!res.data.username) {
          window.location = "/log-in";
        }
      });

    axios.get('/chat/chatrooms')
      .then(res => {
        this.setState({chatrooms: res.data, openedChatroom: Object.keys(res.data)[0], loadingChat: false});
        //this.createModal()
      });
  }

  openChatroom(room_name) {
    this.setState({openedChatroom: room_name});
  }

  onCreateChatroom(newChatroom) {
    var { chatrooms } = this.state;
    this.setState({chatrooms: chatrooms.concat([newChatroom])});
    this.toggleCreateChatroomVisibility();
  }

  async updateChat(message) {
    const newMessages = this.state.chatrooms[this.state.openedChatroom].concat([message]);
    const { openedChatroom } = this.state;
    const chatrooms = {...this.state.chatrooms};
    chatrooms[openedChatroom] = newMessages;
    await this.setState({chatrooms});
    
  }

  render() {
    // const chatroomDivs = Object.keys(this.state.chatrooms).map((room_name,index) => (
		// 	<div className="chatroomDiv" key={index} onClick={() => this.openChatroom(room_name)}>
    //     <h2 className="chatroomDivName">{room_name}</h2>
    //   </div>
    // ))
    return (
      <>
        {
          this.state.loadingChat && (
            <LoadingChat/>
          )
        }
        {
          !this.state.loadingChat && (
            <div id="main-container">
              <div id="side-container">
                <CreateChatroom onCreateChatroom={() => this.onCreateChatroom}/>
                <Chatrooms chatrooms={this.state.chatrooms} openChatroom={(room_name) => this.openChatroom(room_name)}/>
              </div>
              <Conversation chatroom={this.state.openedChatroom} username={this.state.user} messages={this.state.chatrooms[this.state.openedChatroom]} updateChat={async (message) => await this.updateChat(message)}/>
            </div>
          )
        }
      </>
    )
  }
}