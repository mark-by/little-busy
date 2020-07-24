import React from 'react';
import {Route, Switch} from "react-router-dom";
import Schedule from "./component/Schedule/Schedule";

function App() {
  return (
      <>
          <Switch>
              <Route path="/client-schedule/:token" component={Schedule}/>
          </Switch>
      </>
  );
}

export default App;
