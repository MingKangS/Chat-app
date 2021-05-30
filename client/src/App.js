import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import SignUp from "./components/SignUp";
import Chat from "./components/Chat";
import Welcome from "./components/Welcome";
import LogIn from "./components/LogIn";

function App() {
  return (
    <Router>
      <div className="container">
      <Route path="/" exact component={Welcome} />
      <Route path="/log-in" component={LogIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/chat" component={Chat} />
      </div>
    </Router>
  );
}

export default App;
