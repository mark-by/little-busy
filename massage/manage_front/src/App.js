import React from 'react';
import {Route, Switch} from "react-router-dom";
import Schedule from "./component/Schedule/Schedule";
import AutoSelect from "./component/Common/AutoSelect/AutoSelect";
import {apiAutoCompleteClient} from "./backend/api";

function App() {
    const [data, setData] = React.useState({});

    React.useEffect(() => {
    }, [data])
  return (
      <>
          <Switch>
              <Route path="/manage" component={Schedule}/>
          </Switch>
      </>
  );
}

export default App;
