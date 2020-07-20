import React from 'react';
import Header from "./component/Header/Header";
import {Route, Switch} from "react-router-dom";
import About from "./component/About/About";
import Certificates from "./component/Certificates/Certificates";
import Feedback from "./component/Feedback/Feedback";
import Schedule from "./component/Schedule/Schedule";

function App() {
  return (
      <>
          <Header/>
          <Switch>
              <Route exact path="/" component={About}/>
              <Route path="/certificate" component={Certificates}/>
              <Route path="/schedule" component={Schedule}/>
              <Route path="/feedback" component={Feedback}/>
          </Switch>
      </>
  );
}

export default App;
